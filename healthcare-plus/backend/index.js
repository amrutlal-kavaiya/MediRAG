const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');
const pdf2img = require('pdf-img-convert');

const app = express();
const port = process.env.PORT || 3001;
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_ENDPOINT,
  apiKey: process.env["GITHUB_TOKEN"]
});

async function convertPdfToImage(pdfPath) {
  const outputImages = await pdf2img.convert(pdfPath);
  const imagePath = `uploads/${Date.now()}.png`;
  fs.writeFileSync(imagePath, outputImages[0]);
  return imagePath;
}

function getImageDataUrl(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString('base64');
  const imageFormat = path.extname(imagePath).slice(1);
  return `data:image/${imageFormat};base64,${imageBase64}`;
}

async function analyzeImageWithAI(imagePath) {
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert radiologist analyzing X-ray images. Provide a detailed diagnosis, confidence level, additional findings, and recommended actions." },
      { role: "user", content: [
        { type: "text", text: "Analyze this X-ray image and provide a detailed diagnosis."},
        { type: "image_url", image_url: {
          url: getImageDataUrl(imagePath),
          details: "high"
        }}
      ]}
    ],
    model: process.env.OPENAI_MODEL_NAME || "gpt-4-vision-preview"
  });
  
  return response.choices[0].message.content;
}

function parseAIResponse(aiResponse) {
  const lines = aiResponse.split('\n');
  return {
    primaryDiagnosis: lines.find(line => line.toLowerCase().includes('diagnosis'))?.split(':')[1]?.trim() || 'Unspecified',
    confidenceLevel: parseInt(lines.find(line => line.toLowerCase().includes('confidence'))?.match(/\d+/)?.[0] || '0'),
    additionalFindings: lines.find(line => line.toLowerCase().includes('additional findings'))?.split(':')[1]?.split(',').map(s => s.trim()) || [],
    recommendedActions: lines.find(line => line.toLowerCase().includes('recommended actions'))?.split(':')[1]?.trim() || 'Consult with a specialist for further evaluation.'
  };
}

app.get('/api/test', async (req, res) => {
  try {
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is the capital of France?" }
      ],
      model: modelName,
      temperature: 1.0,
      max_tokens: 1000,
      top_p: 1.0
    });

    const aiResponse = response.choices[0].message.content;

    res.json({ 
      message: 'Backend is working!',
      aiResponse: aiResponse
    });
  } catch (error) {
    console.error('Error in test route:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

app.post('/api/xray-diagnosis', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req, res) => {
  try {
    let imagePath = req.files['image'] ? req.files['image'][0].path : null;
    const filePath = req.files['file'] ? req.files['file'][0].path : null;
    
    if (!imagePath && !filePath) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    if (filePath && path.extname(filePath).toLowerCase() === '.pdf') {
      imagePath = await convertPdfToImage(filePath);
    }
    
    if (!imagePath) {
      return res.status(400).json({ error: 'No valid image or PDF file provided' });
    }
    
    const aiAnalysis = await analyzeImageWithAI(imagePath);
    const diagnosisResult = parseAIResponse(aiAnalysis);
    
    res.json({
      ...diagnosisResult,
      aiAnalysis // Include the full AI analysis for detailed display
    });
  } catch (error) {
    console.error('Error performing diagnosis:', error);
    res.status(500).json({ error: 'An error occurred while processing the diagnosis' });
  }
});

app.get('/api/HealthPlans', async (req, res) => {
  try {
    // Extracting parameters from query
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });
    const { age, weight, height, activityLevel, dietaryRestrictions, sleepIssues } = req.query;

    console.log("Received query parameters:", { age, weight, height, activityLevel, dietaryRestrictions, sleepIssues });

    // Sample data in case query parameters are missing
    const sampleData = {
      age: age || 30,
      weight: weight || 70,
      height: height || 170,
      activityLevel: activityLevel || "moderate",
      dietaryRestrictions: dietaryRestrictions || "none",
      sleepIssues: sleepIssues || "insomnia"
    };

    console.log("Using data for health plan generation:", sampleData);

    const prompt = `Generate a personalized health plan for a ${sampleData.age}-year-old individual weighing ${sampleData.weight} kg and ${sampleData.height} cm tall. Their activity level is ${sampleData.activityLevel}, and they have the following dietary restrictions: ${sampleData.dietaryRestrictions}. They also report the following sleep issues: ${sampleData.sleepIssues}. Provide a diet plan and sleep routine in JSON format. Do not use markdown formatting or code blocks. Only return the JSON object.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant specialized in creating personalized health plans." },
        { role: "user", content: prompt }
      ],
      model: modelName,
      temperature: 1.0,
      max_tokens: 1000,
      top_p: 1.0
    });

    console.log("Raw API response:", JSON.stringify(response, null, 2));

    if (!response.choices || response.choices.length === 0 || !response.choices[0].message) {
      throw new Error('Unexpected API response structure');
    }

    let cleanedContent = response.choices[0].message.content.trim();
    cleanedContent = cleanedContent.replace(/```json\s?|\s?```/g, '');

    console.log("Cleaned content:", cleanedContent);

    try {
      const healthPlan = JSON.parse(cleanedContent);
      console.log("Generated health plan:", healthPlan);
      
      res.json({
        message: 'Health plan generated successfully!',
        healthPlan: healthPlan
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw content:', cleanedContent);
      res.status(500).json({ error: 'An error occurred while parsing the health plan' });
    }
  } catch (error) {
    console.error('Error generating health plan:', error);
    res.status(500).json({ error: 'An error occurred while generating the health plan' });
  }
});



// app.post('/api/HealthPlans', async (req, res) => {
//   try {
//     const { age, weight, height, activityLevel, dietaryRestrictions, sleepIssues } = req.body;
//     const client = new OpenAI({ baseURL: endpoint, apiKey: token });

//     const prompt = `Generate a personalized health plan for a ${age}-year-old individual weighing ${weight} kg and ${height} cm tall. Their activity level is ${activityLevel}, and they have the following dietary restrictions: ${dietaryRestrictions}. They also report the following sleep issues: ${sleepIssues}. Provide a diet plan and sleep routine in the following JSON format:
//     {
//       "dietPlan": [
//         "Breakfast: ...",
//         "Lunch: ...",
//         "Dinner: ...",
//         "Snacks: ..."
//       ],
//       "sleepRoutine": [
//         "Bedtime routine: ...",
//         "Recommended sleep duration: ...",
//         "Sleep environment tips: ...",
//         "Morning routine: ..."
//       ]
//     }`;

//     const response = await client.chat.completions.create({
//       messages: [
//         { role: "system", content: "You are a helpful assistant specialized in creating personalized health plans." },
//         { role: "user", content: prompt }
//       ],
//       model: modelName,
//       temperature: 1.0,
//       max_tokens: 1000,
//       top_p: 1.0
//     });

//     const healthPlan = JSON.parse(response.choices[0].message.content);
    
//     res.json({
//       message: 'Health plan generated successfully!',
//       healthPlan: healthPlan
//     });
//   } catch (error) {
//     console.error('Error generating health plan:', error);
//     res.status(500).json({ error: 'An error occurred while generating the health plan' });
//   }
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
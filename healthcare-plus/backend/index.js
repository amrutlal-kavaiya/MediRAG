// File: index.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');
const pdf2img = require('pdf-img-convert');

const app = express();
const port = process.env.PORT || 3001;

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
  apiKey: process.env.OPENAI_API_KEY
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

app.post('/api/HealthPlans', async (req, res) => {
  try {
    const { age, weight, height, activityLevel, dietaryRestrictions, sleepIssues } = req.body;

    const prompt = `Generate a personalized health plan for a ${age}-year-old individual weighing ${weight} kg and ${height} cm tall. Their activity level is ${activityLevel}, and they have the following dietary restrictions: ${dietaryRestrictions}. They also report the following sleep issues: ${sleepIssues}. Provide a diet plan and sleep routine in the following JSON format:
    {
      "dietPlan": [
        "Breakfast: ...",
        "Lunch: ...",
        "Dinner: ...",
        "Snacks: ..."
      ],
      "sleepRoutine": [
        "Bedtime routine: ...",
        "Recommended sleep duration: ...",
        "Sleep environment tips: ...",
        "Morning routine: ..."
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const healthPlan = JSON.parse(completion.choices[0].message.content);
    res.json(healthPlan);
  } catch (error) {
    console.error('Error generating health plan:', error);
    res.status(500).json({ error: 'An error occurred while generating the health plan' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
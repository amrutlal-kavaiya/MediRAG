import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, Loader } from 'lucide-react';

interface DiagnosisResult {
  primaryDiagnosis: string;
  confidenceLevel: number;
  additionalFindings: string[];
  recommendedActions: string;
  aiAnalysis: string;
}

const Alert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <span className="block sm:inline">{children}</span>
  </div>
);

const ImageAnalysisPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (file) formData.append('file', file);

    try {
      const response = await fetch('https://bookish-computing-machine-7vp9jp6g4q94hpgg9-3001.app.github.dev/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data: DiagnosisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Image and PDF Analysis</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Upload an Image or PDF for Analysis</h2>
          
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-500 transition duration-300 mb-6">
            <Upload className="w-12 h-12 text-blue-500 mb-2" />
            <p className="text-blue-700 font-semibold mb-2">Upload Image or PDF</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300 cursor-pointer"
            >
              Select File
            </label>
            {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className={`w-full py-3 rounded-full text-white font-semibold ${
              !file || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
            } transition duration-300`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Analyzing...
              </span>
            ) : 'Analyze File'}
          </button>
        </div>

        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4 inline mr-2" />
            {error}
          </Alert>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Analysis Results</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-blue-600">Primary Diagnosis:</h3>
                <p className="text-gray-800">{result.primaryDiagnosis}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-600">Confidence Level:</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${result.confidenceLevel}%`}}></div>
                </div>
                <p className="text-gray-800">{result.confidenceLevel}% confidence</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-600">Additional Findings:</h3>
                <ul className="list-disc list-inside text-gray-800">
                  {result.additionalFindings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-600">Recommended Actions:</h3>
                <p className="text-gray-800">{result.recommendedActions}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-600">Detailed AI Analysis:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {result.aiAnalysis}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalysisPage;
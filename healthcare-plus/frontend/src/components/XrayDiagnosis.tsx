import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface DiagnosisResult {
  primaryDiagnosis: string;
  confidenceLevel: number;
  additionalFindings: string[];
  recommendedActions: string;
}

const Alert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <span className="block sm:inline">{children}</span>
  </div>
);

const XrayDiagnosisPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImage(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFile(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (image) formData.append('image', image);
    if (file) formData.append('file', file);

    try {
      const response = await fetch('/api/xray-diagnosis', {
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
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-red-800 mb-8 text-center">X-ray and Document Diagnosis</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">Upload Files for Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-red-300 rounded-lg p-6 hover:border-red-500 transition duration-300">
              <Upload className="w-12 h-12 text-red-500 mb-2" />
              <p className="text-red-700 font-semibold mb-2">Upload X-ray Image</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300 cursor-pointer"
              >
                Select Image
              </label>
              {image && <p className="mt-2 text-sm text-gray-600">{image.name}</p>}
            </div>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-red-300 rounded-lg p-6 hover:border-red-500 transition duration-300">
              <FileText className="w-12 h-12 text-red-500 mb-2" />
              <p className="text-red-700 font-semibold mb-2">Upload Medical Document</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300 cursor-pointer"
              >
                Select File
              </label>
              {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={(!image && !file) || loading}
            className={`w-full py-3 rounded-full text-white font-semibold ${
              (!image && !file) || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
            } transition duration-300`}
          >
            {loading ? 'Processing...' : 'Analyze Files'}
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
            <h2 className="text-2xl font-semibold text-red-700 mb-4">Diagnosis Results</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-red-600">Primary Diagnosis:</h3>
                <p className="text-gray-800">{result.primaryDiagnosis}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-600">Confidence Level:</h3>
                <p className="text-gray-800">{result.confidenceLevel}%</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-600">Additional Findings:</h3>
                <ul className="list-disc list-inside text-gray-800">
                  {result.additionalFindings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-600">Recommended Actions:</h3>
                <p className="text-gray-800">{result.recommendedActions}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XrayDiagnosisPage;
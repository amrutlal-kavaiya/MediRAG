import React, { useState } from 'react';
import { Utensils, Moon, AlertCircle } from 'lucide-react';

interface HealthPlanData {
  dietPlan: string[];
  sleepRoutine: string[];
}

interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

const questions: Question[] = [
  { id: 'age', text: 'What is your age?', type: 'number' },
  { id: 'weight', text: 'What is your weight in kg?', type: 'number' },
  { id: 'height', text: 'What is your height in cm?', type: 'number' },
  { id: 'activityLevel', text: 'What is your activity level?', type: 'select', options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extra Active'] },
  { id: 'dietaryRestrictions', text: 'Do you have any dietary restrictions?', type: 'text' },
  { id: 'sleepIssues', text: 'Do you have any sleep-related issues?', type: 'text' },
];

const HealthPlans: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [healthPlan, setHealthPlan] = useState<HealthPlanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (id: string, value: string) => {
    setAnswers((prev: Record<string, string>) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setHealthPlan(null);

    try {
      const response = await fetch('/api/HealthPlans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data: HealthPlanData = await response.json();
      setHealthPlan(data);
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">Personalized Health Plans</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Health Questionnaire</h2>
          
          {questions.map((q) => (
            <div key={q.id} className="mb-4">
              <label htmlFor={q.id} className="block text-sm font-medium text-gray-700">
                {q.text}
              </label>
              {q.type === 'select' ? (
                <select
                  id={q.id}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Select an option</option>
                  {q.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={q.type}
                  id={q.id}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              )}
            </div>
          ))}
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-full text-white font-semibold ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
            } transition duration-300 mt-6`}
          >
            {loading ? 'Processing...' : 'Generate Health Plan'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <AlertCircle className="h-4 w-4 inline mr-2" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {healthPlan && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Your Personalized Health Plan</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-green-600 mb-3 flex items-center">
                <Utensils className="mr-2" /> Recommended Diet Plan
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {healthPlan.dietPlan.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-3 flex items-center">
                <Moon className="mr-2" /> Recommended Sleep Routine
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {healthPlan.sleepRoutine.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthPlans;
import React, { useState } from 'react';
import { Utensils, Moon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HealthPlanData {
  diet_plan: {
    caloric_intake: number;
    macronutrients: {
      carbohydrates: string;
      proteins: string;
      fats: string;
    };
    meal_plan: {
      [key: string]: {
        time: string;
        items: string[];
      };
    };
  };
  sleep_routine: {
    bedtime: string;
    wake_time: string;
    pre_sleep_activities: string[];
  };
}

const HealthPlans: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    dietaryRestrictions: '',
    sleepIssues: ''
  });
  const [healthPlan, setHealthPlan] = useState<HealthPlanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHealthPlan(null);

    try {
      const response = await fetch('https://bookish-computing-machine-7vp9jp6g4q94hpgg9-3001.app.github.dev/api/HealthPlans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      console.log('Received data:', data);
      setHealthPlan(data.healthPlan);
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header and other components ... */}

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Personalized Health Plans</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Health Questionnaire</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="1"
                max="120"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="1"
                max="500"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="1"
                max="300"
              />
            </div>
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select an option</option>
                <option value="sedentary">Sedentary</option>
                <option value="lightly active">Lightly Active</option>
                <option value="moderately active">Moderately Active</option>
                <option value="very active">Very Active</option>
                <option value="extra active">Extra Active</option>
              </select>
            </div>
            <div>
              <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
              <input
                type="text"
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., vegetarian, gluten-free, nut allergy"
              />
            </div>
            <div>
              <label htmlFor="sleepIssues" className="block text-sm font-medium text-gray-700">Sleep Issues</label>
              <textarea
                id="sleepIssues"
                name="sleepIssues"
                value={formData.sleepIssues}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Describe any sleep issues you're experiencing"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full text-white font-semibold ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
              } transition duration-300`}
            >
              {loading ? 'Generating...' : 'Generate Health Plan'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <AlertCircle className="h-4 w-4 inline mr-2" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {healthPlan && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Your Personalized Health Plan</h2>
            
            {healthPlan.diet_plan && healthPlan.diet_plan.macronutrients && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-3 flex items-center">
                  <Utensils className="mr-2" /> Diet Plan
                </h3>
                <p>Caloric Intake: {healthPlan.diet_plan.caloric_intake} calories</p>
                <h4 className="text-lg font-semibold mt-2">Macronutrients:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Carbohydrates: {healthPlan.diet_plan.macronutrients.carbohydrates}</li>
                  <li>Proteins: {healthPlan.diet_plan.macronutrients.proteins}</li>
                  <li>Fats: {healthPlan.diet_plan.macronutrients.fats}</li>
                </ul>
                <h4 className="text-lg font-semibold mt-2">Meal Plan:</h4>
                {Object.entries(healthPlan.diet_plan.meal_plan).map(([meal, details]) => (
                  <div key={meal} className="mt-2">
                    <h5 className="font-semibold capitalize">{meal} ({details.time}):</h5>
                    <ul className="list-disc list-inside text-gray-700">
                      {details.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            
            {healthPlan.sleep_routine && (
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3 flex items-center">
                  <Moon className="mr-2" /> Sleep Routine
                </h3>
                <p>Bedtime: {healthPlan.sleep_routine.bedtime}</p>
                <p>Wake Time: {healthPlan.sleep_routine.wake_time}</p>
                <h4 className="text-lg font-semibold mt-2">Pre-sleep Activities:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {healthPlan.sleep_routine.pre_sleep_activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer ... */}
    </div>
  );
};

export default HealthPlans;
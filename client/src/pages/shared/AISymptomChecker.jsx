import React, { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';

const AISymptomChecker = () => {
  const [formData, setFormData] = useState({ symptoms: '', age: '', gender: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const { data } = await api.post('/api/ai/symptom-check', formData);
      setResult(data);
      if (data.note) {
        toast.info(data.note);
      }
    } catch (error) {
      toast.error('AI analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI Symptom Checker</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
              <textarea
                className="input"
                rows="5"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="Describe your symptoms in detail..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  className="input"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  className="input"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50">
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </form>
        </div>

        {result && (
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            
            {result.note && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">{result.note}</p>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Possible Conditions:</h3>
              <div className="flex flex-wrap gap-2">
                {result.possible_conditions.map((condition, idx) => (
                  <span key={idx} className="badge bg-medical-100 text-medical-800">{condition}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Severity:</h3>
              <span className={`badge ${getSeverityColor(result.severity)}`}>
                {result.severity?.toUpperCase()}
              </span>
            </div>

            <div>
              <h3 className="font-medium mb-2">Recommendations:</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Confidence:</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-medical-600 h-2.5 rounded-full" 
                  style={{ width: `${(result.confidence || 0) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{Math.round((result.confidence || 0) * 100)}%</p>
            </div>

            {result.should_see_doctor && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800 font-medium">Recommendation: Please consult a doctor</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISymptomChecker;

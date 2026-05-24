import React, { useState } from 'react';
import api from '../../api/axios';
import { Search, AlertCircle, CheckCircle, Activity, Thermometer, Brain, Wind, Plus, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const AISymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const addSymptom = () => {
    if (input.trim() && !symptoms.includes(input.trim())) {
      setSymptoms(prev => [...prev, input.trim()]);
      setInput('');
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/ai/analyze-symptoms', { symptoms });
      setResult(data.data);
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSymptoms([]);
    setResult(null);
    setInput('');
  };

  const commonSymptoms = ['Fever', 'Headache', 'Cough', 'Fatigue', 'Nausea', 'Body Ache', 'Sore Throat', 'Dizziness'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Symptom Checker</h1>
            <p className="text-violet-200 mt-1">Get preliminary insights about your symptoms</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            <span className="text-xs text-violet-200">Powered by AI</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-400">This tool provides preliminary insights only and is not a substitute for professional medical advice. Please consult a healthcare provider.</p>
      </div>

      {!result ? (
        <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 md:p-8">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-violet-400 to-violet-500 rounded-t-2xl"></div>
          <div className="space-y-5 mt-2">
            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Describe your symptoms</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a symptom..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSymptom()}
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
                />
                <button onClick={addSymptom} className="px-5 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/25 transition-all duration-200 inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Add
                </button>
              </div>
            </div>

            {/* Common Symptoms */}
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Quick Add</p>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map(s => (
                  <button
                    key={s}
                    onClick={() => { if (!symptoms.includes(s)) setSymptoms(prev => [...prev, s]); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      symptoms.includes(s)
                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 border-violet-200 dark:border-violet-800'
                        : 'bg-gray-50 dark:bg-dark-700/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-dark-700 hover:border-violet-200 dark:hover:border-violet-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Symptoms */}
            {symptoms.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Your Symptoms ({symptoms.length})</p>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                      {s}
                      <button onClick={() => removeSymptom(s)} className="hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={analyzeSymptoms}
              disabled={loading || symptoms.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Analyzing...</>
              ) : (
                <><Search className="w-5 h-5" /> Analyze Symptoms</>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results */
        <div className="space-y-6 animate-fadeIn">
          <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 md:p-8">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-violet-400 to-violet-500 rounded-t-2xl"></div>
            <div className="flex items-center gap-3 mb-6 mt-1">
              <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                <Activity className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
            </div>

            {result.possibleConditions?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Possible Conditions
                </h3>
                <div className="space-y-3">
                  {result.possibleConditions.map((condition, idx) => {
                    const colors = ['from-red-500/10 to-red-500/5 border-red-200', 'from-amber-500/10 to-amber-500/5 border-amber-200', 'from-yellow-500/10 to-yellow-500/5 border-yellow-200'];
                    const textColors = ['text-red-700', 'text-amber-700', 'text-yellow-700'];
                    const icons = [Thermometer, Activity, Wind];
                    const Icon = icons[idx] || AlertCircle;
                    return (
                      <div key={idx} className={`p-4 rounded-xl bg-gradient-to-br ${colors[idx] || colors[0]} border ${textColors[idx] || textColors[0]}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4" />
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{condition.name || condition}</h4>
                        </div>
                        {condition.description && <p className="text-sm mt-1 dark:text-gray-300">{condition.description}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {result.recommendations?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Recommendations
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.severity && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Severity Level</h3>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${
                  result.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800' :
                  result.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                }`}>
                  <AlertCircle className="w-4 h-4" />
                  <span className="capitalize">{result.severity}</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400">This is an AI-generated analysis. Please consult a healthcare professional for proper diagnosis.</p>
            </div>

            <button onClick={reset} className="w-full mt-4 px-6 py-3 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-200 inline-flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISymptomChecker;

import React, { useState } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, Send, FileText, User, Pill, Activity, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WritePrescription = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientId: '',
    diagnosis: '',
    notes: '',
    medications: [{ name: '', dosage: '', duration: '', notes: '' }],
  });
  const [submitting, setSubmitting] = useState(false);

  const addMedication = () => {
    setForm(prev => ({ ...prev, medications: [...prev.medications, { name: '', dosage: '', duration: '', notes: '' }] }));
  };

  const removeMedication = (index) => {
    if (form.medications.length === 1) return;
    setForm(prev => ({ ...prev, medications: prev.medications.filter((_, i) => i !== index) }));
  };

  const updateMedication = (index, field, value) => {
    setForm(prev => {
      const medications = [...prev.medications];
      medications[index] = { ...medications[index], [field]: value };
      return { ...prev, medications };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.medications[0].name) {
      toast.error('Please fill in patient ID and at least one medication');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/prescriptions', form);
      toast.success('Prescription created successfully!');
      navigate('/doctor/prescriptions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-medical-600 to-medical-800 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Write Prescription</h1>
            <p className="text-medical-200 mt-1">Issue a new prescription for a patient</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 md:p-8">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500 rounded-t-2xl"></div>

        <div className="space-y-6 mt-2">
          {/* Patient ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-medical-500" />
              Patient ID
            </label>
            <input
              type="text"
              placeholder="Enter patient ID"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-medical-500" />
              Diagnosis
            </label>
            <textarea
              placeholder="Enter diagnosis"
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200 resize-none"
            />
          </div>

          {/* Medications Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Pill className="w-4 h-4 text-medical-500" />
                Medications
              </label>
              <button type="button" onClick={addMedication} className="text-sm text-medical-600 dark:text-medical-400 hover:text-medical-700 dark:hover:text-medical-300 font-medium flex items-center gap-1.5 transition-colors">
                <Plus className="w-4 h-4" /> Add Medication
              </button>
            </div>
            <div className="space-y-3">
              {form.medications.map((med, idx) => (
                <div key={idx} className="p-4 bg-gray-50/50 dark:bg-dark-700/20 rounded-xl border border-gray-100 dark:border-dark-700 hover:border-medical-100 dark:hover:border-medical-900/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Medication #{idx + 1}</span>
                    <button type="button" onClick={() => removeMedication(idx)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Medication name"
                      value={med.name}
                      onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                      className="px-4 py-2.5 bg-white dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={med.dosage}
                      onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                      className="px-4 py-2.5 bg-white dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 7 days)"
                      value={med.duration}
                      onChange={(e) => updateMedication(idx, 'duration', e.target.value)}
                      className="px-4 py-2.5 bg-white dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={med.notes}
                      onChange={(e) => updateMedication(idx, 'notes', e.target.value)}
                      className="px-4 py-2.5 bg-white dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-medical-500" />
              Additional Notes
            </label>
            <textarea
              placeholder="Any additional notes or instructions"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl font-medium hover:from-medical-600 hover:to-medical-700 shadow-lg shadow-medical-500/25 hover:shadow-xl hover:shadow-medical-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Create Prescription
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePrescription;

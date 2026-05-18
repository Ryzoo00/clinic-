import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WritePrescription = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    appointmentId: '',
    patientId: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    advice: '',
    followUpDate: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/api/appointments/doctor/my?status=completed');
      setAppointments(data.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    }
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const removeMedication = (index) => {
    const meds = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: meds });
  };

  const updateMedication = (index, field, value) => {
    const meds = [...formData.medications];
    meds[index][field] = value;
    setFormData({ ...formData, medications: meds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/prescriptions', formData);
      toast.success('Prescription created successfully');
      navigate('/doctor/prescriptions');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSelect = (aptId) => {
    const apt = appointments.find(a => a._id === aptId);
    setFormData({ 
      ...formData, 
      appointmentId: aptId,
      patientId: apt?.patientId?._id || ''
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Write Prescription</h1>
      
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Completed Appointment</label>
          <select 
            className="input" 
            value={formData.appointmentId}
            onChange={(e) => handleAppointmentSelect(e.target.value)}
            required
          >
            <option value="">Select appointment</option>
            {appointments.map(apt => (
              <option key={apt._id} value={apt._id}>
                Patient #{apt.patientId?._id?.slice(-4)} - {new Date(apt.date).toLocaleDateString()} {apt.time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
          <input
            type="text"
            className="input"
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medications</label>
          {formData.medications.map((med, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Name"
                className="input"
                value={med.name}
                onChange={(e) => updateMedication(index, 'name', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Dosage"
                className="input"
                value={med.dosage}
                onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Frequency"
                className="input"
                value={med.frequency}
                onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Duration"
                  className="input flex-1"
                  value={med.duration}
                  onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                  required
                />
                {formData.medications.length > 1 && (
                  <button type="button" onClick={() => removeMedication(index)} className="btn btn-danger px-3">×</button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addMedication} className="btn btn-outline">
            + Add Medication
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Advice</label>
          <textarea
            className="input"
            rows="3"
            value={formData.advice}
            onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
          <input
            type="date"
            className="input"
            value={formData.followUpDate}
            onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Prescription'}
          </button>
          <button type="button" onClick={() => navigate('/doctor/prescriptions')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePrescription;

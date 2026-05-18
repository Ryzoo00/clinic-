import React, { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterPatient = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', age: '', 
    gender: '', bloodGroup: '', address: '', medicalHistory: '',
    emergencyContact: { name: '', phone: '', relationship: '' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/patients', formData);
      toast.success('Patient registered successfully');
      navigate('/receptionist/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Register New Patient</h1>
      
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input type="text" className="input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" className="input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Default: patient123" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input type="tel" className="input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input type="number" className="input" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select className="input" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} required>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <select className="input" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
              <option value="">Select</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input type="text" className="input" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
          <textarea className="input" rows="3" value={formData.medicalHistory} onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})} />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Name" className="input" value={formData.emergencyContact.name} onChange={(e) => setFormData({...formData, emergencyContact: {...formData.emergencyContact, name: e.target.value}})} />
            <input type="tel" placeholder="Phone" className="input" value={formData.emergencyContact.phone} onChange={(e) => setFormData({...formData, emergencyContact: {...formData.emergencyContact, phone: e.target.value}})} />
            <input type="text" placeholder="Relationship" className="input" value={formData.emergencyContact.relationship} onChange={(e) => setFormData({...formData, emergencyContact: {...formData.emergencyContact, relationship: e.target.value}})} />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50">{loading ? 'Registering...' : 'Register Patient'}</button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPatient;

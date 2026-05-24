import React, { useState } from 'react';
import api from '../../api/axios';
import { UserPlus, Mail, Lock, Phone, Calendar, Users, MapPin, Heart, ArrowLeft, User, Stethoscope, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    medicalHistory: '',
    allergies: '',
    emergencyContact: '',
    emergencyPhone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email, and password are required');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/auth/register', { ...form, role: 'patient' });
      toast.success('Patient registered successfully!');
      navigate('/receptionist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Register Patient</h1>
            <p className="text-medical-200 mt-1">Create a new patient account</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 md:p-8 mb-6">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-t-2xl"></div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6 mt-1">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20"><User className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><User className="w-4 h-4 text-medical-500" /> Full Name *</label>
              <input type="text" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Mail className="w-4 h-4 text-medical-500" /> Email *</label>
              <input type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Lock className="w-4 h-4 text-medical-500" /> Password *</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Phone className="w-4 h-4 text-medical-500" /> Phone</label>
              <input type="tel" placeholder="+1 (555) 123-4567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-medical-500" /> Date of Birth</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Users className="w-4 h-4 text-medical-500" /> Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all appearance-none">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Heart className="w-4 h-4 text-medical-500" /> Blood Group</label>
              <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all appearance-none">
                <option value="">Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-medical-500" /> Address</label>
              <input type="text" placeholder="123 Main St, City" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 md:p-8 mb-6">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-t-2xl"></div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6 mt-1">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20"><Heart className="w-4 h-4 text-amber-600 dark:text-amber-400" /></div>
            Medical History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-500" /> Medical History</label>
              <textarea rows={2} placeholder="Any existing conditions, surgeries, etc." value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-500" /> Allergies</label>
              <input type="text" placeholder="List any allergies" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 md:p-8 mb-6">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-red-500 rounded-t-2xl"></div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6 mt-1">
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20"><Phone className="w-4 h-4 text-red-600 dark:text-red-400" /></div>
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><User className="w-4 h-4 text-red-500" /> Contact Name</label>
              <input type="text" placeholder="Emergency contact name" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Phone className="w-4 h-4 text-red-500" /> Emergency Phone</label>
              <input type="tel" placeholder="Emergency phone number" value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl font-medium hover:from-medical-600 hover:to-medical-700 shadow-lg shadow-medical-500/25 hover:shadow-xl hover:shadow-medical-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Registering...</>
          ) : (
            <><UserPlus className="w-5 h-5" /> Register Patient</>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterPatient;

import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Calendar, User, Clock, Stethoscope, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/api/analytics/users?role=doctor');
      setDoctors(data.data?.filter(u => u.role === 'doctor') || []);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId || !form.date) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/appointments', {
        ...form,
        patientId: form.patientId,
        doctorId: form.doctorId,
        date: form.date,
        time: form.time || '09:00',
      });
      setSuccess(true);
      toast.success('Appointment booked successfully!');
      setTimeout(() => navigate('/receptionist'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fadeIn">
        <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-12 text-center max-w-md">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-t-2xl"></div>
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Appointment Booked!</h2>
          <p className="text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-medical-600 to-medical-800 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Book Appointment</h1>
            <p className="text-medical-200 mt-1">Schedule a new patient appointment</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 md:p-8">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500 rounded-t-2xl"></div>
        <div className="space-y-5 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-medical-500" /> Patient ID
            </label>
            <input type="text" placeholder="Enter patient ID" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-medical-500" /> Doctor
            </label>
            <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200 appearance-none">
              <option value="">{loading ? 'Loading doctors...' : 'Select a doctor'}</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>Dr. {doc.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-medical-500" /> Date
              </label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-medical-500" /> Time
              </label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200" />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl font-medium hover:from-medical-600 hover:to-medical-700 shadow-lg shadow-medical-500/25 hover:shadow-xl hover:shadow-medical-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {submitting ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Booking...</>
            ) : (
              <><Send className="w-5 h-5" /> Book Appointment</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;

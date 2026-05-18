import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { User, Calendar, Clock, FileText, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const usersRes = await api.get('/api/analytics/users');
      const doctorsList = usersRes.data.data?.filter(u => u.role === 'doctor') || [];
      setDoctors(doctorsList);
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ ...formData, doctorId: doctor._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.date || !formData.time || !formData.reason) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/api/appointments', {
        patientId: selectedDoctor._id, // This should be from patient selection, but keeping it simple
        ...formData
      });
      toast.success('Appointment booked successfully!');
      navigate('/receptionist/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/receptionist/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment 📅</h1>
          <p className="text-gray-600 mt-1">Select a doctor and schedule appointment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-medical-600" />
            Select Doctor
          </h2>
          
          {doctors.length === 0 ? (
            <div className="card text-center py-8">
              <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No doctors available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedDoctor?._id === doctor._id
                      ? 'border-2 border-medical-500 bg-medical-50'
                      : 'border-2 border-gray-200 hover:border-medical-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {doctor.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Dr. {doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          {selectedDoctor ? (
            <form onSubmit={handleSubmit} className="card space-y-6">
              {/* Selected Doctor Info */}
              <div className="bg-gradient-to-r from-medical-50 to-white p-4 rounded-xl border-2 border-medical-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedDoctor.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Dr. {selectedDoctor.name}</h3>
                    <p className="text-gray-600">{selectedDoctor.email}</p>
                    {selectedDoctor.phone && (
                      <p className="text-sm text-gray-500 mt-1">📞 {selectedDoctor.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-medical-600" />
                  Appointment Date *
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={today}
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-medical-600" />
                  Appointment Time *
                </label>
                <select
                  className="input"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                >
                  <option value="">Select time...</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-medical-600" />
                  Reason for Visit *
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Fever, Check-up, Consultation"
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/receptionist/dashboard')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="card text-center py-16">
              <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Select a doctor to continue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;

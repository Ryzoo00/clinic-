import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/api/appointments/doctor/my');
      setAppointments(data.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Appointments</h1>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-3 font-medium text-gray-600">Patient</th>
                <th className="pb-3 font-medium text-gray-600">Date</th>
                <th className="pb-3 font-medium text-gray-600">Time</th>
                <th className="pb-3 font-medium text-gray-600">Reason</th>
                <th className="pb-3 font-medium text-gray-600">Status</th>
                <th className="pb-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt._id} className="border-b last:border-0">
                  <td className="py-3">Patient #{apt.patientId?._id?.slice(-4)}</td>
                  <td className="py-3">{new Date(apt.date).toLocaleDateString()}</td>
                  <td className="py-3">{apt.time}</td>
                  <td className="py-3">{apt.reason}</td>
                  <td className="py-3">
                    <span className={`badge ${
                      apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                      apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 space-x-2">
                    {apt.status === 'pending' && (
                      <button onClick={() => updateStatus(apt._id, 'confirmed')} className="px-4 py-2 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl text-sm font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg">
                        Confirm
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button onClick={() => updateStatus(apt._id, 'completed')} className="px-4 py-2 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl text-sm font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg">
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;

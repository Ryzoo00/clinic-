import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Calendar, UserCheck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/api/analytics/dashboard');
      setStats(data.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const statCards = [
    { icon: Users, label: 'Total Patients', value: stats?.totalPatients || 0, color: 'bg-blue-500' },
    { icon: UserCheck, label: 'Total Doctors', value: stats?.totalDoctors || 0, color: 'bg-green-500' },
    { icon: Calendar, label: "Today's Appointments", value: stats?.todayAppointments || 0, color: 'bg-purple-500' },
    { icon: Clock, label: 'Pending', value: stats?.appointmentsByStatus?.find(s => s._id === 'pending')?.count || 0, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-3 font-medium text-gray-600">Patient</th>
                <th className="pb-3 font-medium text-gray-600">Doctor</th>
                <th className="pb-3 font-medium text-gray-600">Date</th>
                <th className="pb-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {stats?.recentAppointments?.map((apt) => (
                <tr key={apt._id} className="border-b last:border-0">
                  <td className="py-3">Patient #{apt.patientId?._id?.slice(-4)}</td>
                  <td className="py-3">Dr. {apt.doctorId?.name}</td>
                  <td className="py-3">{new Date(apt.date).toLocaleDateString()}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

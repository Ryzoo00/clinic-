import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Calendar, UserCheck, Clock, TrendingUp } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-medical-500/20 border-t-medical-500 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-transparent border-r-medical-400/30 rounded-full animate-spin absolute inset-0" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Patients', value: stats?.totalPatients || 0, color: 'from-blue-500 to-blue-600', accent: 'bg-blue-500/10 text-blue-600', bgGlow: 'bg-blue-500/5' },
    { icon: UserCheck, label: 'Total Doctors', value: stats?.totalDoctors || 0, color: 'from-emerald-500 to-emerald-600', accent: 'bg-emerald-500/10 text-emerald-600', bgGlow: 'bg-emerald-500/5' },
    { icon: Calendar, label: "Today's Appointments", value: stats?.todayAppointments || 0, color: 'from-violet-500 to-violet-600', accent: 'bg-violet-500/10 text-violet-600', bgGlow: 'bg-violet-500/5' },
    { icon: Clock, label: 'Pending', value: stats?.appointmentsByStatus?.find(s => s._id === 'pending')?.count || 0, color: 'from-amber-500 to-amber-600', accent: 'bg-amber-500/10 text-amber-600', bgGlow: 'bg-amber-500/5' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor your clinic's performance at a glance</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium text-green-700 dark:text-green-400">All systems operational</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect */}
              <div className={`absolute -top-12 -right-12 w-24 h-24 ${stat.bgGlow} rounded-full blur-xl transition-all duration-500 group-hover:scale-150`}></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 tabular-nums">{stat.value}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Live</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments Table */}
      {stats?.recentAppointments?.length > 0 ? (
        <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 overflow-hidden">
          {/* Header accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500"></div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-medical-50 dark:bg-medical-900/20">
                  <Calendar className="w-5 h-5 text-medical-600 dark:text-medical-400" />
                </div>
                Recent Appointments
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{stats.recentAppointments.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-dark-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                  {stats.recentAppointments.slice(0, 6).map((apt) => (
                    <tr key={apt._id} className="group/row hover:bg-medical-50/30 dark:hover:bg-dark-700/30 transition-all duration-200 cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-medical-500/20 group-hover/row:scale-110 transition-transform duration-200">
                            {apt.patientId?.name?.charAt(0) || apt.patientId?._id?.slice(-2) || 'P'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{apt.patientId?.name || `Patient #${apt.patientId?._id?.slice(-4)}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Dr. {apt.doctorId?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                          apt.status === 'confirmed' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800' :
                          apt.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800' :
                          'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            apt.status === 'completed' ? 'bg-emerald-500' :
                            apt.status === 'confirmed' ? 'bg-blue-500' :
                            apt.status === 'pending' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}></span>
                          {apt.status?.charAt(0).toUpperCase() + apt.status?.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-12 text-center">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500"></div>
          <div className="w-20 h-20 bg-gradient-to-br from-medical-50 to-medical-100 dark:from-medical-900/20 dark:to-medical-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-medical-400 dark:text-medical-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Recent Appointments</h3>
          <p className="text-gray-400 dark:text-gray-500 max-w-md mx-auto">Appointments will appear here once patients start booking. Check back soon for updates.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

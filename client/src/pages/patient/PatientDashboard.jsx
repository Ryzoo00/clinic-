import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, FileText, TrendingUp, Heart, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
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
      toast.error('Failed to load dashboard');
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
    { icon: Calendar, label: 'Total Appointments', value: stats?.todayAppointments || 0, color: 'from-blue-500 to-blue-600', bgGlow: 'bg-blue-500/5' },
    { icon: Clock, label: 'Upcoming', value: stats?.appointmentsByStatus?.find(s => s._id === 'confirmed')?.count || 0, color: 'from-emerald-500 to-emerald-600', bgGlow: 'bg-emerald-500/5' },
    { icon: FileText, label: 'Prescriptions', value: stats?.appointmentsByStatus?.find(s => s._id === 'completed')?.count || 0, color: 'from-violet-500 to-violet-600', bgGlow: 'bg-violet-500/5' },
    { icon: TrendingUp, label: 'Checkups', value: (stats?.appointmentsByStatus?.find(s => s._id === 'completed')?.count || 0) + (stats?.appointmentsByStatus?.find(s => s._id === 'pending')?.count || 0), color: 'from-amber-500 to-amber-600', bgGlow: 'bg-amber-500/5' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Header */}
      <div className="relative bg-gradient-to-br from-medical-600 via-medical-700 to-medical-900 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/[0.03] rounded-full translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-medical-400/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back</h1>
            <p className="text-medical-200 mt-1">Here's your health summary for today</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-medical-300" />
            <span className="text-sm text-medical-200">Your health, our priority</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className={`absolute -top-12 -right-12 w-24 h-24 ${stat.bgGlow} rounded-full blur-xl transition-all duration-500 group-hover:scale-150`}></div>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 tabular-nums">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500"></div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-medical-50 dark:bg-medical-900/20">
              <Calendar className="w-5 h-5 text-medical-600 dark:text-medical-400" />
            </div>
            Recent Appointments
          </h2>
          {stats?.recentAppointments?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentAppointments.slice(0, 4).map((apt) => (
                <div key={apt._id} className="group/card flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-dark-700/30 hover:bg-medical-50/50 dark:hover:bg-dark-700/50 border border-transparent hover:border-medical-100 dark:hover:border-medical-900/50 transition-all duration-200 cursor-pointer">
                  <div className="flex flex-col items-center min-w-[56px]">
                    <span className="text-lg font-bold text-medical-600 dark:text-medical-400">{new Date(apt.date).getDate()}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{new Date(apt.date).toLocaleString('en-US', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">Dr. {apt.doctorId?.name || 'Unknown Doctor'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                    apt.status === 'confirmed' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                    'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      apt.status === 'completed' ? 'bg-emerald-500' :
                      apt.status === 'confirmed' ? 'bg-blue-500' : 'bg-amber-500'
                    }`}></span>
                    {(apt.status || 'pending').charAt(0).toUpperCase() + (apt.status || 'pending').slice(1)}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

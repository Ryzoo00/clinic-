import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#075985'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl rounded-xl border border-gray-100 dark:border-dark-700 shadow-xl p-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [appointmentsRes, patientsRes] = await Promise.all([
        api.get('/api/analytics/appointments'),
        api.get('/api/analytics/patients')
      ]);
      setAnalytics({
        appointments: appointmentsRes.data.data,
        patients: patientsRes.data.data
      });
    } catch (error) {
      toast.error('Failed to load analytics');
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

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Clinic performance and patient insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Over Time */}
        <div className="group relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-t-2xl"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Appointments Over Time
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics?.appointments?.appointmentsOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="_id" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Patients by Gender */}
        <div className="group relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-violet-400 to-violet-500 rounded-t-2xl"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
              <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            Patients by Gender
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={analytics?.patients?.patientsByGender || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count, cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 30;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text x={x} y={y} fill="#9ca3af" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-sm">
                      {`${_id} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  );
                }}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="count"
                paddingAngle={4}
              >
                {(analytics?.patients?.patientsByGender || []).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {(analytics?.patients?.patientsByGender || []).map((entry, index) => (
              <div key={entry._id} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{entry._id}: {entry.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

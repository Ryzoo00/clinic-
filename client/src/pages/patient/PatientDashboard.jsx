import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  CalendarDays, 
  FileText, 
  Clock, 
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Stethoscope,
  Pill,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const [appointmentsRes, prescriptionsRes] = await Promise.all([
        axios.get('/api/appointments/my', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/prescriptions/my', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const appointments = appointmentsRes.data || [];
      const prescriptions = prescriptionsRes.data || [];

      const upcoming = appointments.filter(apt => apt.status === 'scheduled' || apt.status === 'pending');
      const completed = appointments.filter(apt => apt.status === 'completed');
      const activePrescriptions = prescriptions.filter(p => p.status === 'active');

      setDashboardData({
        totalAppointments: appointments.length,
        activePrescriptions: activePrescriptions.length,
        upcomingVisits: upcoming.length,
        medicalReports: completed.length,
        upcomingAppointments: upcoming.slice(0, 3),
        recentPrescriptions: prescriptions.slice(0, 3),
        appointments,
        prescriptions
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-24 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse h-64 bg-gray-200"></div>
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse h-64 bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 bg-red-50 border-2 border-red-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Error Loading Dashboard</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button onClick={fetchDashboardData} className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl mt-3">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Appointments',
      value: dashboardData?.totalAppointments || 0,
      icon: CalendarDays,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Prescriptions',
      value: dashboardData?.activePrescriptions || 0,
      icon: Pill,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Upcoming Visits',
      value: dashboardData?.upcomingVisits || 0,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Medical Reports',
      value: dashboardData?.medicalReports || 0,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const chartData = dashboardData?.appointments?.slice(-7).map(apt => ({
    date: new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visits: apt.status === 'completed' ? 1 : 0
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-600 mt-1">Here's your health overview</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Book Appointment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Updated today</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-medical-600" />
              Upcoming Appointments
            </h2>
            <button className="text-sm text-medical-600 hover:text-medical-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {dashboardData?.upcomingAppointments?.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No upcoming appointments</p>
              <button className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl mt-4">Book Now</button>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData?.upcomingAppointments?.map((apt) => (
                <div key={apt._id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-medical-50 to-white rounded-xl border border-medical-100 hover:shadow-md transition-all duration-200">
                  <div className="flex-shrink-0 w-16 h-16 bg-white rounded-xl border-2 border-medical-200 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-xs font-semibold text-medical-600 uppercase">
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {new Date(apt.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{apt.doctor?.name || 'Doctor'}</p>
                    <p className="text-sm text-gray-600 truncate">{apt.reason || 'Consultation'}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {apt.time || '10:00 AM'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        {apt.doctor?.specialization || 'General'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Health Summary Card */}
          <div className="bg-gradient-to-br from-medical-500 to-medical-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Health Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <span className="text-sm font-medium">Total Visits</span>
                <span className="text-lg font-bold">{dashboardData?.totalAppointments || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <span className="text-sm font-medium">Active Medicines</span>
                <span className="text-lg font-bold">{dashboardData?.activePrescriptions || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <span className="text-sm font-medium">Next Visit</span>
                <span className="text-lg font-bold">
                  {dashboardData?.upcomingAppointments?.[0] 
                    ? new Date(dashboardData.upcomingAppointments[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-medical-600" />
              Recent Prescriptions
            </h3>
            {dashboardData?.recentPrescriptions?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No prescriptions yet</p>
            ) : (
              <div className="space-y-3">
                {dashboardData?.recentPrescriptions?.map((rx) => (
                  <div key={rx._id} className="p-3 bg-gray-50 rounded-lg hover:bg-medical-50 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-gray-900 truncate flex-1">
                        Dr. {rx.doctor?.name || 'Doctor'}
                      </p>
                      <StatusBadge status={rx.status || 'active'} />
                    </div>
                    <p className="text-xs text-gray-600">
                      {new Date(rx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {rx.diagnosis && (
                      <p className="text-xs text-medical-600 mt-1 font-medium">{rx.diagnosis}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-medical-600" />
          Visit History
        </h2>
        {chartData.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No visit history available</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVisits)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-medical-600" />
          Recent Activity
        </h2>
        {dashboardData?.appointments?.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No activity yet</p>
        ) : (
          <div className="space-y-4">
            {dashboardData?.appointments?.slice(0, 5).map((apt, index) => (
              <div key={apt._id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-600' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {apt.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                     apt.status === 'cancelled' ? <XCircle className="w-5 h-5" /> :
                     <Clock className="w-5 h-5" />}
                  </div>
                  {index < 4 && <div className="w-0.5 h-full bg-gray-200 mt-2"></div>}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-semibold text-gray-900">
                    {apt.status === 'completed' ? 'Completed appointment' : 
                     apt.status === 'cancelled' ? 'Cancelled appointment' :
                     'Scheduled appointment'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(apt.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  {apt.notes && (
                    <p className="text-xs text-gray-500 mt-1 italic">"{apt.notes}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scheduled' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactive' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default PatientDashboard;

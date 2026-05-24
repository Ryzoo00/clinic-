import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Calendar,
  Clock,
  DollarSign,
  RefreshCw,
  Zap
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RealTimeWidget = ({ title, value, change, icon: Icon, color, prefix, suffix, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1">
          {TrendIcon && <TrendIcon className={`w-4 h-4 ${trendColor}`} />}
          {change !== undefined && (
            <span className={`text-xs font-medium ${trendColor}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900">{prefix}{value?.toLocaleString()}{suffix}</span>
        <Zap className="w-4 h-4 text-yellow-400 animate-pulse ml-auto" />
      </div>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
      <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min((value || 0) / 100 * 100, 100)}%` }}></div>
      </div>
    </div>
  );
};

const RealTimeWidgets = ({ userId, userRole }) => {
  const socketRef = useRef(null);
  const [timestamp, setTimestamp] = useState(new Date());
  const [connected, setConnected] = useState(false);
  const [liveStats, setLiveStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
    patientsChange: 0,
    appointmentsChange: 0,
    revenueChange: 0,
    pendingChange: 0
  });

  const userToken = localStorage.getItem('token');

  // Fetch initial stats
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${SOCKET_URL}/api/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLiveStats(prev => ({
          ...prev,
          totalPatients: data.data.totalPatients || 0,
          todayAppointments: data.data.todayAppointments || 0,
          pendingAppointments: data.data.appointmentsByStatus?.find(s => s._id === 'pending')?.count || 0,
          totalRevenue: data.data.totalPatients * 50 || 0,
          patientsChange: prev.totalPatients ? Math.round(((data.data.totalPatients - prev.totalPatients) / prev.totalPatients) * 100) : 0,
          appointmentsChange: prev.todayAppointments ? Math.round(((data.data.todayAppointments - prev.todayAppointments) / prev.todayAppointments) * 100) : 0
        }));
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Re-fetch every 30 seconds as fallback
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Socket.io connection
  useEffect(() => {
    if (!userToken) return;

    const socket = io(SOCKET_URL, {
      auth: { token: userToken },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      if (userId) {
        socket.emit('join', userId);
      }
    });

    socket.on('dashboard:refreshed', (data) => {
      setTimestamp(new Date(data.timestamp));
      fetchStats();
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, userToken, fetchStats]);

  // Simulate real-time updates (for demo)
  useEffect(() => {
    const simulate = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        todayAppointments: prev.todayAppointments + (Math.random() > 0.9 ? 1 : 0),
        totalRevenue: prev.totalRevenue + (Math.random() > 0.85 ? 50 : 0),
        totalPatients: prev.totalPatients + (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 15000);
    return () => clearInterval(simulate);
  }, []);

  const widgets = [
    {
      title: 'Total Patients',
      value: liveStats.totalPatients,
      change: liveStats.patientsChange,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: liveStats.patientsChange >= 0 ? 'up' : 'down'
    },
    {
      title: "Today's Appointments",
      value: liveStats.todayAppointments,
      change: liveStats.appointmentsChange,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      trend: liveStats.appointmentsChange >= 0 ? 'up' : 'down'
    },
    {
      title: 'Pending',
      value: liveStats.pendingAppointments,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      trend: 'neutral'
    },
    {
      title: 'Total Revenue',
      value: liveStats.totalRevenue,
      icon: DollarSign,
      prefix: '$',
      color: 'from-purple-500 to-purple-600',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Live Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/30' : 'bg-red-500 shadow-lg shadow-red-500/30'}`}></div>
          <span className="text-xs font-medium text-gray-500">
            {connected ? 'Live' : 'Connecting...'}
          </span>
          <RefreshCw
            className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-medical-600 transition-colors"
            onClick={fetchStats}
          />
        </div>
        <span className="text-xs text-gray-400">
          Updated {timestamp.toLocaleTimeString()}
        </span>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((widget, index) => (
          <RealTimeWidget key={index} {...widget} />
        ))}
      </div>
    </div>
  );
};

export default RealTimeWidgets;

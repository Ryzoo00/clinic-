import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, FileText, Activity } from 'lucide-react';
import QRTicket from '../../components/UI/QRTicket';
import toast from 'react-hot-toast';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/api/appointments/my');
      setAppointments(data.data || data);
    } catch (error) {
      toast.error('Failed to load appointments');
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">My Appointments</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{appointments.length} total appointments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total', value: appointments.length, icon: Calendar, color: 'from-blue-500 to-blue-600' },
          { label: 'Upcoming', value: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length, icon: Clock, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: Activity, color: 'from-violet-500 to-violet-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className={`absolute -top-8 -right-8 w-16 h-16 rounded-full blur-xl opacity-50 ${stat.color === 'from-blue-500 to-blue-600' ? 'bg-blue-500/10' : stat.color === 'from-emerald-500 to-emerald-600' ? 'bg-emerald-500/10' : 'bg-violet-500/10'} group-hover:scale-150 transition-transform`}></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointments List */}
      <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500"></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No appointments yet</p>
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt._id} className="group/row hover:bg-medical-50/30 dark:hover:bg-dark-700/30 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md group-hover/row:scale-110 transition-transform duration-200">
                          {apt.doctorId?.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">Dr. {apt.doctorId?.name || 'Unknown'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <Clock className="w-4 h-4 text-gray-400 ml-1" />
                        <span>{new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                        apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                        apt.status === 'confirmed' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                        apt.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                        'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          apt.status === 'completed' ? 'bg-emerald-500' :
                          apt.status === 'confirmed' ? 'bg-blue-500' :
                          apt.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                        }`}></span>
                        {(apt.status || 'pending').charAt(0).toUpperCase() + (apt.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="px-4 py-2 bg-medical-50 text-medical-700 dark:bg-medical-900/20 dark:text-medical-400 rounded-xl text-xs font-medium border border-medical-200 dark:border-medical-800 hover:bg-medical-100 dark:hover:bg-medical-900/30 transition-all duration-200 inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Ticket Modal */}
      {selectedAppointment && (
        <QRTicket appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
      )}
    </div>
  );
};

export default MyAppointments;

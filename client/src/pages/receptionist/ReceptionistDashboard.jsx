import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { UserPlus, Calendar, Clock, Users, Search, ChevronRight, Phone, Mail, MapPin, Eye, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ patients: [], appointments: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAllPatients, setShowAllPatients] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  // Refresh data when component becomes visible (when user returns to dashboard)
  useEffect(() => {
    const handleFocus = () => {
      fetchStats();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchStats = async () => {
    try {
      const [patientsRes, apptsRes] = await Promise.all([
        api.get('/api/patients'),
        api.get('/api/appointments')
      ]);
      setStats({ 
        patients: patientsRes.data.data || [],
        appointments: apptsRes.data.data || []
      });
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin w-12 h-12 border-4 border-medical-500 border-t-transparent rounded-full mx-auto"></div>
      <p className="text-gray-600 mt-4">Loading dashboard...</p>
    </div>
  );

  const todayAppts = stats.appointments.filter(apt => 
    new Date(apt.date).toDateString() === new Date().toDateString()
  );

  const pendingAppts = stats.appointments.filter(a => a.status === 'pending');

  // Filter patients by search
  const filteredPatients = stats.patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(searchLower) ||
      patient.userId?.email?.toLowerCase().includes(searchLower) ||
      patient.userId?.phone?.includes(searchTerm) ||
      patient.phone?.includes(searchTerm) ||
      patient.address?.toLowerCase().includes(searchLower) ||
      patient.gender?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receptionist Dashboard 👋</h1>
          <p className="text-gray-600 mt-1">Manage patients and appointments</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Register Patient
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.patients.length}</p>
            </div>
          </div>
        </div>
        <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-3xl font-bold text-gray-900">{todayAppts.length}</p>
            </div>
          </div>
        </div>
        <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{pendingAppts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Patient Overview Section */}
      <div className="card bg-gradient-to-r from-medical-500 to-medical-600 text-white cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" onClick={() => setShowAllPatients(!showAllPatients)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">All Patients</h2>
              <p className="text-medical-100 mt-1">Click to {showAllPatients ? 'hide' : 'view'} all registered patients</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-5xl font-bold">{stats.patients.length}</p>
              <p className="text-sm text-medical-100">Total Patients</p>
            </div>
            <ChevronRight className={`w-8 h-8 transition-transform duration-300 ${showAllPatients ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      {/* Today's Appointments Section */}
      {todayAppts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-medical-600" />
            Today's Appointments ({todayAppts.length})
          </h2>
          <div className="space-y-4">
            {todayAppts.map((apt) => (
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
                  <p className="font-semibold text-gray-900 truncate">
                    {apt.patientId?.name || apt.patientId?.userId?.name || 'Patient'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{apt.reason || 'Consultation'}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Dr. {apt.doctorId?.name || 'Doctor'}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <StatusBadge status={apt.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Patients List Section */}
      {showAllPatients && (
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-medical-600" />
              Registered Patients ({stats.patients.length})
            </h2>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-medical-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">
                {searchTerm ? 'No patients found matching your search' : 'No patients registered yet'}
              </p>
              {!searchTerm && (
                <button className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto mt-4">
                  <UserPlus className="w-5 h-5" />
                  Register First Patient
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  onClick={() => setSelectedPatient(patient)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-medical-500 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                      {patient.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-medical-600 transition-colors">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {patient.age} years • {patient.gender?.charAt(0).toUpperCase() + patient.gender?.slice(1)}
                      </p>
                      {patient.bloodGroup && (
                        <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                          Blood: {patient.bloodGroup}
                        </span>
                      )}
                    </div>
                    <Eye className="w-5 h-5 text-gray-400 group-hover:text-medical-600 transition-colors" />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    {patient.userId?.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-medical-600" />
                        <span className="truncate">{patient.userId.phone}</span>
                      </div>
                    )}
                    {patient.userId?.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-medical-600" />
                        <span className="truncate">{patient.userId.email}</span>
                      </div>
                    )}
                    {patient.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-medical-600" />
                        <span className="truncate">{patient.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPatient(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-medical-500 to-medical-600 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-medical-600 font-bold text-3xl shadow-lg">
                  {selectedPatient.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                  <p className="text-medical-100 mt-1">Patient ID: #{selectedPatient._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-medical-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Age</p>
                    <p className="font-semibold text-gray-900">{selectedPatient.age} years</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Gender</p>
                    <p className="font-semibold text-gray-900 capitalize">{selectedPatient.gender}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                    <p className="font-semibold text-red-600">{selectedPatient.bloodGroup || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="font-semibold text-gray-900">{selectedPatient.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {selectedPatient.userId && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-medical-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {selectedPatient.userId.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-medical-600" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-900">{selectedPatient.userId.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedPatient.userId.email && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-medical-600" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">{selectedPatient.userId.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Medical History */}
              {selectedPatient.medicalHistory && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-medical-600" />
                    Medical History
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedPatient.medicalHistory}</p>
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              {selectedPatient.emergencyContact && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-medical-600" />
                    Emergency Contact
                  </h3>
                  <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">{selectedPatient.emergencyContact.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedPatient.emergencyContact.phone || 'N/A'}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{selectedPatient.emergencyContact.relationship || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setSelectedPatient(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  navigate(`/receptionist/book-appointment?patientId=${selectedPatient._id}`);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;

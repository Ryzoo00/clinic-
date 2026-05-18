import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Users, Search, Phone, Mail, MapPin, ArrowLeft, UserPlus, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AllPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/api/patients');
      setPatients(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // Filter patients by search
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower) ||
      patient.userId?.email?.toLowerCase().includes(searchLower) ||
      patient.userId?.phone?.includes(searchTerm) ||
      patient.phone?.includes(searchTerm) ||
      patient.address?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-medical-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Patients 👥</h1>
            <p className="text-gray-600 mt-1">{patients.length} registered patients</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/receptionist/register-patient')}
          className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Register New Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, phone, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">
            {searchTerm ? 'No patients found matching your search' : 'No patients registered yet'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/receptionist/register-patient')}
              className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto mt-4"
            >
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
              className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-medical-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
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
                    <Users className="w-5 h-5 text-medical-600" />
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
                    <Mail className="w-5 h-5 text-medical-600" />
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
                  navigate('/receptionist/book-appointment');
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

export default AllPatients;

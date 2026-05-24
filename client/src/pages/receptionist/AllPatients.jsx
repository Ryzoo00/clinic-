import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, User, Mail, Phone, Search, Shield, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/api/patients');
      setPatients(data.data || data);
    } catch (error) {
      toast.error('Failed to load patients');
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

  const filtered = patients.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">All Patients</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{patients.length} registered patients</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-xl border border-gray-100/50 dark:border-dark-700/50 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No patients found</p>
          </div>
        ) : (
          filtered.map((patient, idx) => (
            <div
              key={patient._id}
              onClick={() => setSelectedPatient(patient)}
              className="group relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-200 shrink-0">
                  {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{patient.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  {patient.phone && (
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedPatient(null)}>
          <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500"></div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                  {selectedPatient.name?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPatient.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Patient ID: {selectedPatient._id?.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-700/50">
                  <Mail className="w-5 h-5 text-medical-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.email}</p>
                  </div>
                </div>
                {selectedPatient.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-700/50">
                    <Phone className="w-5 h-5 text-medical-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.phone}</p>
                    </div>
                  </div>
                )}
                {selectedPatient.bloodGroup && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-700/50">
                    <Shield className="w-5 h-5 text-medical-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.bloodGroup}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-700 flex justify-end">
              <button onClick={() => setSelectedPatient(null)} className="px-5 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPatients;

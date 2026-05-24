import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FileText, Plus, Download, Calendar, User, Pill, ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get('/api/prescriptions');
      setPrescriptions(data.data || data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Prescriptions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and issue patient prescriptions</p>
        </div>
        <Link
          to="/doctor/write-prescription"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl font-medium hover:from-medical-600 hover:to-medical-700 shadow-lg shadow-medical-500/25 hover:shadow-xl hover:shadow-medical-500/30 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          New Prescription
        </Link>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.length === 0 ? (
          <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-medical-50 to-medical-100 dark:from-medical-900/20 dark:to-medical-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-medical-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Prescriptions Yet</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-6">Start by creating your first prescription</p>
            <Link to="/doctor/write-prescription" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl font-medium hover:from-medical-600 hover:to-medical-700 shadow-lg shadow-medical-500/25 transition-all duration-200">
              <Plus className="w-5 h-5" />
              Create Prescription
            </Link>
          </div>
        ) : (
          prescriptions.map((prescription, idx) => (
            <div key={prescription._id} className="group relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-6 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-medical-500 to-medical-600 rounded-xl flex items-center justify-center shadow-md">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{prescription.patientId?.name || 'Unknown Patient'}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(prescription.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Pill className="w-4 h-4" />{prescription.medications?.length || 0} medications</span>
                    </div>
                    {prescription.diagnosis && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-1">{prescription.diagnosis}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-dark-700/50 text-gray-500 dark:text-gray-400 hover:bg-medical-50 hover:text-medical-600 dark:hover:bg-medical-900/20 dark:hover:text-medical-400 transition-all duration-200 border border-gray-100 dark:border-dark-700">
                    <Download className="w-4 h-4" />
                  </button>
                  <ArrowUpRight className="w-5 h-5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Prescriptions;

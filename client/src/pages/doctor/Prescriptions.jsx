import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get('/api/prescriptions/doctor/my');
      setPrescriptions(data.data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Prescriptions</h1>
        <a href="/doctor/write-prescription" className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
          Write New Prescription
        </a>
      </div>
      
      <div className="grid gap-4">
        {prescriptions.map((presc) => (
          <div key={presc._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Patient #{presc.patientId?._id?.slice(-4)}</h3>
                <p className="text-sm text-gray-600">{presc.diagnosis}</p>
              </div>
              <span className="text-sm text-gray-500">{new Date(presc.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="space-y-2">
              {presc.medications.map((med, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">{med.name}</p>
                  <p className="text-sm text-gray-600">{med.dosage} - {med.frequency} - {med.duration}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorPrescriptions;

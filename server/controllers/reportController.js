import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';

// @desc    Generate prescription PDF report
// @route   GET /api/reports/prescription/:id
// @access  Private
export const getPrescriptionReport = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone')
      .populate('appointmentId', 'date time reason');

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    // Try to get patient name from User model
    let patientName = 'Patient';
    const patient = await Patient.findById(prescription.patientId)
      .populate('userId', 'name email');
    if (patient?.userId?.name) {
      patientName = patient.userId.name;
    }

    const reportData = {
      id: prescription._id,
      patientName,
      patientAge: prescription.patientId?.age || 'N/A',
      patientGender: prescription.patientId?.gender || 'N/A',
      patientBloodGroup: prescription.patientId?.bloodGroup || 'N/A',
      doctorName: `Dr. ${prescription.doctorId?.name || 'Doctor'}`,
      doctorEmail: prescription.doctorId?.email || '',
      diagnosis: prescription.diagnosis,
      medications: prescription.medications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration
      })),
      advice: prescription.advice || '',
      followUpDate: prescription.followUpDate || null,
      appointmentDate: prescription.appointmentId?.date,
      appointmentReason: prescription.appointmentId?.reason || '',
      createdAt: prescription.createdAt
    };

    res.json({
      success: true,
      data: reportData
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

// @desc    Get all reports for a patient
// @route   GET /api/reports/my
// @access  Private (Patient)
export const getMyReports = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const prescriptions = await Prescription.find({ patientId: patient._id })
      .populate('doctorId', 'name email')
      .populate('appointmentId', 'date time')
      .sort({ createdAt: -1 });

    const reports = prescriptions.map(presc => ({
      id: presc._id,
      doctorName: `Dr. ${presc.doctorId?.name || 'Doctor'}`,
      diagnosis: presc.diagnosis,
      medicationCount: presc.medications.length,
      date: presc.createdAt,
      appointmentDate: presc.appointmentId?.date,
      type: 'prescription'
    }));

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

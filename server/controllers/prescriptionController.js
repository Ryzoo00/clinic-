import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
export const createPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, diagnosis, medications, advice, followUpDate } = req.body;

    // Validate required fields
    if (!appointmentId || !patientId || !diagnosis || !medications || medications.length === 0) {
      return res.status(400).json({ 
        error: 'Please provide all required fields including at least one medication' 
      });
    }

    // Validate medications array
    for (const med of medications) {
      if (!med.name || !med.dosage || !med.frequency || !med.duration) {
        return res.status(400).json({ 
          error: 'Each medication must have name, dosage, frequency, and duration' 
        });
      }
    }

    // Create prescription
    const prescription = await Prescription.create({
      appointmentId,
      patientId,
      doctorId: req.user._id,
      diagnosis,
      medications,
      advice: advice || '',
      followUpDate: followUpDate || null
    });

    // Populate details
    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone')
      .populate('appointmentId', 'date time reason');

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: populatedPrescription
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get doctor's prescriptions
// @route   GET /api/prescriptions/doctor/my
// @access  Private (Doctor)
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.user._id })
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone')
      .populate('appointmentId', 'date time reason')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get patient's prescriptions (auto-find by userId)
// @route   GET /api/prescriptions/my
// @access  Private
export const getMyPrescriptions = async (req, res) => {
  try {
    // Find patient record for this user
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      return res.status(404).json({ 
        error: 'Patient profile not found' 
      });
    }

    const prescriptions = await Prescription.find({ patientId: patient._id })
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone')
      .populate('appointmentId', 'date time reason')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get patient's prescriptions by patientId
// @route   GET /api/prescriptions/my/:patientId
// @access  Private
export const getMyPrescriptionsByPatientId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId })
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone')
      .populate('appointmentId', 'date time reason')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
export const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone')
      .populate('appointmentId', 'date time reason');

    if (!prescription) {
      return res.status(404).json({ 
        error: 'Prescription not found' 
      });
    }

    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

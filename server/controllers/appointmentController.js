import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private (Receptionist, Patient)
export const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason, notes } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !date || !time || !reason) {
      return res.status(400).json({ 
        error: 'Please provide all required fields' 
      });
    }

    // Check if date is in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({ 
        error: 'Appointment date cannot be in the past' 
      });
    }

    // Check for scheduling conflicts
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: appointmentDate,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        error: 'Doctor already has an appointment at this time' 
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date: appointmentDate,
      time,
      reason,
      notes: notes || ''
    });

    // Populate details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: populatedAppointment
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (Admin, Receptionist)
export const getAllAppointments = async (req, res) => {
  try {
    const { status, date, doctorId } = req.query;
    
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    // Filter by doctor
    if (doctorId) {
      query.doctorId = doctorId;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/appointments/doctor/my
// @access  Private (Doctor)
export const getDoctorAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    
    let query = { doctorId: req.user._id };

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/my
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    // Find patient record for this user
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      return res.status(404).json({ 
        error: 'Patient profile not found' 
      });
    }

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone')
      .sort({ date: -1, time: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ 
        error: 'Appointment not found' 
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor, Receptionist)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status' 
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ 
        error: 'Appointment not found' 
      });
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone');

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Receptionist, Patient, Doctor)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ 
        error: 'Appointment not found' 
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ 
        error: 'Appointment is already cancelled' 
      });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ 
        error: 'Cannot cancel a completed appointment' 
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

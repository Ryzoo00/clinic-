import QRCode from 'qrcode';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';

// @desc    Generate QR code for appointment ticket
// @route   GET /api/qr/appointment/:id
// @access  Private
export const generateAppointmentQR = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Build ticket data
    const ticketData = JSON.stringify({
      id: appointment._id,
      patient: appointment.patientId?._id,
      doctor: appointment.doctorId?.name,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      reason: appointment.reason
    });

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(ticketData, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
      color: {
        dark: '#0ea5e9',
        light: '#ffffff'
      }
    });

    // Generate ticket info
    const ticketInfo = {
      appointmentId: appointment._id,
      patientName: appointment.patientId?.name || 'Patient',
      doctorName: `Dr. ${appointment.doctorId?.name || 'Doctor'}`,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      reason: appointment.reason,
      qrCode: qrDataUrl
    };

    // Try to populate patient name
    const patient = await Patient.findById(appointment.patientId)
      .populate('userId', 'name');
    if (patient?.userId?.name) {
      ticketInfo.patientName = patient.userId.name;
    }

    res.json({
      success: true,
      data: ticketInfo
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

// @desc    Generate QR code as downloadable image
// @route   GET /api/qr/appointment/:id/download
// @access  Private
export const downloadAppointmentQR = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'age gender bloodGroup')
      .populate('doctorId', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const ticketData = JSON.stringify({
      id: appointment._id,
      doctor: appointment.doctorId?.name,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status
    });

    // Generate QR as buffer
    const qrBuffer = await QRCode.toBuffer(ticketData, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 500,
      color: {
        dark: '#0ea5e9',
        light: '#ffffff'
      }
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=appointment-${appointment._id}-ticket.png`);
    res.send(qrBuffer);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

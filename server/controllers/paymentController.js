import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
export const createPayment = async (req, res) => {
  try {
    const { appointmentId, amount, method, cardDetails, upiDetails, description } = req.body;

    // Validate required fields
    if (!appointmentId || !amount || !method) {
      return res.status(400).json({
        error: 'Please provide appointmentId, amount, and method'
      });
    }

    // Find appointment to get patient
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Get patient ID from appointment or current user
    let patientId = appointment.patientId;

    // If user is a patient, find their patient profile
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) {
        patientId = patient._id;
      }
    }

    // Create payment
    const payment = await Payment.create({
      appointmentId,
      patientId,
      amount,
      method,
      cardDetails: method === 'credit_card' || method === 'debit_card' ? {
        lastFour: cardDetails?.lastFour || '0000',
        cardholderName: cardDetails?.cardholderName || '',
        expiryDate: cardDetails?.expiryDate || ''
      } : undefined,
      upiDetails: method === 'upi' ? {
        upiId: upiDetails?.upiId || '',
        transactionRef: upiDetails?.transactionRef || ''
      } : undefined,
      description: description || 'Appointment fee',
      status: 'completed' // Auto-complete for demo
    });

    // Update appointment status if needed
    if (appointment.status === 'pending') {
      appointment.status = 'confirmed';
      await appointment.save();
    }

    const populatedPayment = await Payment.findById(payment._id)
      .populate('appointmentId', 'date time reason')
      .populate('patientId', 'age gender');

    res.status(201).json({
      success: true,
      message: 'Payment completed successfully',
      data: populatedPayment
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin, Receptionist)
export const getAllPayments = async (req, res) => {
  try {
    const { status, method } = req.query;

    let query = {};
    if (status) query.status = status;
    if (method) query.method = method;

    const payments = await Payment.find(query)
      .populate('appointmentId', 'date time reason')
      .populate('patientId', 'age gender')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

// @desc    Get patient's payments
// @route   GET /api/payments/my
// @access  Private (Patient)
export const getMyPayments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const payments = await Payment.find({ patientId: patient._id })
      .populate('appointmentId', 'date time reason')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('appointmentId', 'date time reason')
      .populate('patientId', 'age gender');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

// @desc    Refund payment
// @route   PUT /api/payments/:id/refund
// @access  Private (Admin)
export const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ error: 'Payment cannot be refunded' });
    }

    payment.status = 'refunded';
    await payment.save();

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};

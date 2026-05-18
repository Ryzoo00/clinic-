import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getDoctorAppointments,
  getMyAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create appointment - Receptionist & Patient
router.post('/', allowRoles('receptionist', 'patient'), createAppointment);

// Get all appointments - Admin & Receptionist
router.get('/', allowRoles('admin', 'receptionist'), getAllAppointments);

// Get doctor's appointments - Doctor only
router.get('/doctor/my', allowRoles('doctor'), getDoctorAppointments);

// Get patient's own appointments
router.get('/my', getMyAppointments);

// Get single appointment
router.get('/:id', getAppointment);

// Update appointment status - Doctor & Receptionist
router.put('/:id/status', allowRoles('doctor', 'receptionist'), updateAppointmentStatus);

// Cancel appointment - Receptionist, Patient, Doctor
router.put('/:id/cancel', allowRoles('receptionist', 'patient', 'doctor'), cancelAppointment);

export default router;

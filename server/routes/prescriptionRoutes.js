import express from 'express';
import {
  createPrescription,
  getDoctorPrescriptions,
  getMyPrescriptions,
  getMyPrescriptionsByPatientId,
  getPrescription
} from '../controllers/prescriptionController.js';
import { protect } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create prescription - Doctor only
router.post('/', allowRoles('doctor'), createPrescription);

// Get doctor's prescriptions - Doctor only
router.get('/doctor/my', allowRoles('doctor'), getDoctorPrescriptions);

// Get patient's prescriptions - Any authenticated user
router.get('/my', getMyPrescriptions);

// Get patient's prescriptions by patientId - Any authenticated user
router.get('/my/:patientId', getMyPrescriptionsByPatientId);

// Get single prescription - Any authenticated user
router.get('/:id', getPrescription);

export default router;

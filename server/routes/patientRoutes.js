import express from 'express';
import {
  createPatient,
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
  uploadAvatar
} from '../controllers/patientController.js';
import { protect } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';
import { uploadMemory } from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create patient - Receptionist & Admin only
router.post('/', allowRoles('receptionist', 'admin'), createPatient);

// Get all patients - Admin, Doctor, Receptionist
router.get('/', allowRoles('admin', 'doctor', 'receptionist'), getAllPatients);

// Get single patient - Any authenticated user
router.get('/:id', getPatient);

// Update patient - Receptionist, Admin, Doctor
router.put('/:id', allowRoles('receptionist', 'admin', 'doctor'), updatePatient);

// Delete patient - Admin only
router.delete('/:id', allowRoles('admin'), deletePatient);

// Upload avatar - Receptionist & Admin
router.post('/:id/avatar', allowRoles('receptionist', 'admin'), uploadMemory.single('avatar'), uploadAvatar);

export default router;

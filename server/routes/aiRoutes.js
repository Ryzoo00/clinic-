import express from 'express';
import { checkSymptoms, getDiagnosisHistory } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// AI symptom check - Doctor & Patient
router.post('/symptom-check', allowRoles('doctor', 'patient'), checkSymptoms);

// Get diagnosis history
router.get('/history', getDiagnosisHistory);

export default router;

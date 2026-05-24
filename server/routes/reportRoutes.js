import express from 'express';
import { getPrescriptionReport, getMyReports } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get patient's reports
router.get('/my', getMyReports);

// Get specific prescription report
router.get('/prescription/:id', getPrescriptionReport);

export default router;

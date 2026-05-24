import express from 'express';
import { generateAppointmentQR, downloadAppointmentQR } from '../controllers/qrController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Generate QR code for appointment ticket
router.get('/appointment/:id', generateAppointmentQR);

// Download QR code as image
router.get('/appointment/:id/download', downloadAppointmentQR);

export default router;

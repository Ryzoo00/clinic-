import express from 'express';
import {
  createPayment,
  getAllPayments,
  getMyPayments,
  getPayment,
  refundPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create payment
router.post('/', createPayment);

// Get my payments - Patient
router.get('/my', getMyPayments);

// Get all payments - Admin & Receptionist
router.get('/', allowRoles('admin', 'receptionist'), getAllPayments);

// Get single payment
router.get('/:id', getPayment);

// Refund payment - Admin only
router.put('/:id/refund', allowRoles('admin'), refundPayment);

export default router;

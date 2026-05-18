import express from 'express';
import {
  getDashboardStats,
  getAppointmentsAnalytics,
  getPatientAnalytics,
  getAllUsers,
  updateUserStatus
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(allowRoles('admin'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// Appointments analytics
router.get('/appointments', getAppointmentsAnalytics);

// Patient analytics
router.get('/patients', getPatientAnalytics);

// Get all users
router.get('/users', getAllUsers);

// Update user status
router.put('/users/:id/status', updateUserStatus);

export default router;

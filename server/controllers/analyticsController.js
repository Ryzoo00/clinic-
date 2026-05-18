import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalReceptionists = await User.countDocuments({ role: 'receptionist' });
    
    // Today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    // Appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent appointments (last 10)
    const recentAppointments = await Appointment.find()
      .populate('patientId', 'age gender')
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalReceptionists,
        todayAppointments,
        appointmentsByStatus,
        recentAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get appointments analytics
// @route   GET /api/analytics/appointments
// @access  Private (Admin)
export const getAppointmentsAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Appointments over time (group by date)
    const appointmentsOverTime = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Appointments by doctor
    const appointmentsByDoctor = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$doctorId',
          count: { $sum: 1 }
        }
      },
      { $limit: 10 }
    ]);

    // Populate doctor names
    const populatedByDoctor = await User.find({
      _id: { $in: appointmentsByDoctor.map(a => a._id) }
    }, 'name');

    const appointmentsByDoctorWithNames = appointmentsByDoctor.map(apt => {
      const doctor = populatedByDoctor.find(d => d._id.toString() === apt._id.toString());
      return {
        doctor: doctor ? doctor.name : 'Unknown',
        count: apt.count
      };
    });

    res.json({
      success: true,
      data: {
        appointmentsOverTime,
        appointmentsByDoctor: appointmentsByDoctorWithNames
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get patient analytics
// @route   GET /api/analytics/patients
// @access  Private (Admin)
export const getPatientAnalytics = async (req, res) => {
  try {
    // Patients by gender
    const patientsByGender = await Patient.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    // Patients by blood group
    const patientsByBloodGroup = await Patient.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent patients (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newPatientsLast30Days = await Patient.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        patientsByGender,
        patientsByBloodGroup,
        newPatientsLast30Days
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get all users (for admin management)
// @route   GET /api/analytics/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;

    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Update user status (activate/deactivate)
// @route   PUT /api/analytics/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

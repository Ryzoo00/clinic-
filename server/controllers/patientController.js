import User from '../models/User.js';
import Patient from '../models/Patient.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private (Receptionist, Admin)
export const createPatient = async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, bloodGroup, address, medicalHistory, emergencyContact } = req.body;

    // Validate required fields
    if (!name || !email || !age || !gender) {
      return res.status(400).json({ 
        error: 'Please provide name, email, age, and gender' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Create user with patient role
    const user = await User.create({
      name,
      email,
      password: password || 'patient123', // Default password if not provided
      role: 'patient',
      phone
    });

    // Create patient profile
    const patient = await Patient.create({
      userId: user._id,
      age,
      gender,
      bloodGroup,
      address,
      medicalHistory,
      emergencyContact
    });

    // Populate user details
    const patientWithUser = await Patient.findById(patient._id).populate('userId', 'name email phone avatar');

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: patientWithUser
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin, Doctor, Receptionist)
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('userId', 'name email phone avatar isActive')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('userId', 'name email phone avatar isActive');

    if (!patient) {
      return res.status(404).json({ 
        error: 'Patient not found' 
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private (Receptionist, Admin, Doctor)
export const updatePatient = async (req, res) => {
  try {
    const { age, gender, bloodGroup, address, medicalHistory, emergencyContact, phone } = req.body;

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ 
        error: 'Patient not found' 
      });
    }

    // Update patient fields
    patient.age = age || patient.age;
    patient.gender = gender || patient.gender;
    patient.bloodGroup = bloodGroup || patient.bloodGroup;
    patient.address = address || patient.address;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;
    patient.emergencyContact = emergencyContact || patient.emergencyContact;

    await patient.save();

    // Update user phone if provided
    if (phone) {
      await User.findByIdAndUpdate(patient.userId, { phone });
    }

    const updatedPatient = await Patient.findById(patient._id)
      .populate('userId', 'name email phone avatar isActive');

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin)
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ 
        error: 'Patient not found' 
      });
    }

    // Delete user and patient (soft delete)
    await User.findByIdAndUpdate(patient.userId, { isActive: false });
    await Patient.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Upload patient avatar
// @route   POST /api/patients/:id/avatar
// @access  Private (Receptionist, Admin)
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'Please upload an image file' 
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'clinic/avatars' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ 
            error: 'Failed to upload avatar' 
          });
        }

        const patient = await Patient.findById(req.params.id);
        const user = await User.findByIdAndUpdate(
          patient.userId,
          { avatar: result.secure_url },
          { new: true }
        );

        res.json({
          success: true,
          message: 'Avatar uploaded successfully',
          data: user.avatar
        });
      }
    ).end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Patient from './models/Patient.js';
import connectDB from './config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log('🔍 Checking for admin user...');
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@clinic.com' });
    
    if (adminExists) {
      console.log('✅ Admin user already exists!');
      console.log('Email: admin@clinic.com');
      console.log('Password: admin123');
      process.exit(0);
    }
    
    // Create admin user
    console.log('📝 Creating admin user...');
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@clinic.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      isActive: true
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@clinic.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('🆔 User ID:', adminUser._id);
    
    // Create doctor user
    const doctorExists = await User.findOne({ email: 'doctor@clinic.com' });
    
    if (!doctorExists) {
      console.log('\n📝 Creating doctor user...');
      const doctorUser = await User.create({
        name: 'Dr. Ahmed Khan',
        email: 'doctor@clinic.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+923001234567',
        isActive: true
      });
      console.log('✅ Doctor user created!');
      console.log('📧 Email: doctor@clinic.com');
      console.log('🔑 Password: doctor123');
    }
    
    // Create receptionist user
    const receptionistExists = await User.findOne({ email: 'receptionist@clinic.com' });
    
    if (!receptionistExists) {
      console.log('\n📝 Creating receptionist user...');
      const receptionistUser = await User.create({
        name: 'Sarah Receptionist',
        email: 'receptionist@clinic.com',
        password: 'receptionist123',
        role: 'receptionist',
        phone: '+923009876543',
        isActive: true
      });
      console.log('✅ Receptionist user created!');
      console.log('📧 Email: receptionist@clinic.com');
      console.log('🔑 Password: receptionist123');
    }
    
    // Create patient user with Patient profile
    const patientExists = await User.findOne({ email: 'patient@test.com' });
    
    if (!patientExists) {
      console.log('\n📝 Creating patient user...');
      const patientUser = await User.create({
        name: 'Test Patient',
        email: 'patient@test.com',
        password: 'patient123',
        role: 'patient',
        phone: '+923001111111',
        isActive: true
      });
      
      // Create Patient profile
      await Patient.create({
        userId: patientUser._id,
        age: 25,
        gender: 'male',
        bloodGroup: 'B+',
        address: '123 Test Street',
        medicalHistory: '',
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '+923009999999',
          relationship: 'Family'
        }
      });
      
      console.log('✅ Patient user created!');
      console.log('📧 Email: patient@test.com');
      console.log('🔑 Password: patient123');
    }
    
    console.log('\n🎉 All default users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin: admin@clinic.com / admin123');
    console.log('Doctor: doctor@clinic.com / doctor123');
    console.log('Receptionist: receptionist@clinic.com / receptionist123');
    console.log('Patient: patient@test.com / patient123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();

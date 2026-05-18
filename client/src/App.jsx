import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/UI/ProtectedRoute'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Layout
import Layout from './components/Layout/Layout'
import PatientLayout from './components/Layout/PatientLayout'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import AdminAnalytics from './pages/admin/Analytics'

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/Appointments'
import DoctorPrescriptions from './pages/doctor/Prescriptions'
import WritePrescription from './pages/doctor/WritePrescription'
import AISymptomChecker from './pages/shared/AISymptomChecker'

// Receptionist Pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard'
import RegisterPatient from './pages/receptionist/RegisterPatient'
import BookAppointment from './pages/receptionist/BookAppointment'
import AllPatients from './pages/receptionist/AllPatients'
import { ManageAppointments } from './pages/placeholder'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import { PrescriptionHistory, MyAppointments, MedicalHistory, PatientProfile } from './pages/placeholder'

// Common Pages
import Chat from './pages/common/Chat'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/write-prescription"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <WritePrescription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/ai-checker"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AISymptomChecker />
              </ProtectedRoute>
            }
          />

          {/* Receptionist Routes */}
          <Route
            path="/receptionist/dashboard"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/all-patients"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AllPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/register-patient"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <RegisterPatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/appointments"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <ManageAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/chat"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route element={<PatientLayout />}>
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PrescriptionHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/ai-checker"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <AISymptomChecker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/chat"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Chat />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

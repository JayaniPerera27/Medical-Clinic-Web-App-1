import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './components/Login';
import Signup from './components/Signup';
import DoctorHome from './components/DoctorHome';
import ClinicalHome from './components/ClinicalHome';
import AdminHome from './components/AdminHome';
import PatientsPage from './components/PatientsPage'; // Import PatientsPage
import PatientViewPage from './components/PatientViewPage'; // Import PatientViewPage
import PatientEditPage from "./components/PatientEditPage";
import DoctorsPage from './components/DoctorsPage'; // Import DoctorsPage
import DoctorViewPage from './components/DoctorViewPage';
import DoctorEditPage from './components/DoctorEditPage';
import AppointmentsPage from './components/AppointmentsPage';
import Notifications from './components/NotificationsPage';
import Settings from './components/Settings';
import HomePage from './components/HomePage';
import AboutUs from './pages/AboutUs';
import Dashboard from './components/Dashboard';
import Services from './pages/Services';
import Prescriptions from './components/Prescriptions';
import NewPrescription from './components/NewPrescription';
import OldPrescriptions from './components/OldPrescriptions';
import Availability from './components/Availability';
import DoctorAppointments from './components/DoctorAppointments';
import ClinicalSettings from './components/ClinicalSettings';
import BillHistory from './components/BillHistory';
import Bill from './components/Bill';


const decodeToken = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decodedToken = decodeToken(token);
  if (!decodedToken) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp && decodedToken.exp > currentTime;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/doctor-home"
          element={
            <ProtectedRoute>
              <DoctorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-appointments"
          element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/availability"
          element={
            <ProtectedRoute>
              <Availability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <Prescriptions />
            </ProtectedRoute>
          }
        />
        <Route path="/new-prescription/:username" element={<NewPrescription />} />
        <Route path="/old-prescriptions/:username" element={<OldPrescriptions />} />

        {/* Clinical System Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ClinicalHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinical-home"
          element={
            <ProtectedRoute>
              <ClinicalHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinical-settings"
          element={
            <ProtectedRoute>
              <ClinicalSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bill"
          element={
            <ProtectedRoute>
              <Bill />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Bill />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/billing-history"
          element={
            <ProtectedRoute>
              <BillHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              {/* Replace with your actual Reports component when available */}
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Reports</h1>
                <p>Reports functionality coming soon.</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Patients Page Route */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/patients/:id" element={<PatientViewPage />} />

        <Route path="/patients/edit/:id" element={<PatientEditPage />} />

        {/* Doctors Page Route */}
        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <DoctorsPage />
            </ProtectedRoute>
          }
        />

<Route path="/doctors/:id" element={<DoctorViewPage />} />

        {/* Appointments Page Route */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          } 
        />

        {/* Notifications Page Route */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>404: Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
              <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
                Go to Home
              </a>
            </div>
          }
        />
      </Routes>
    </Router>

          {/* Toaster should be outside Router but inside the main fragment */}

          <Toaster 
          position="top-right"
          richColors
          expand={true}
          closeButton
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: '14px',
              maxWidth: '500px'
            }
          }}
        />
      </>
      
  );
}

export default App;
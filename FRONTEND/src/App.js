/*import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import DoctorHome from './components/DoctorHome';
import ClinicalHome from './components/ClinicalHome';
import AdminHome from './components/AdminHome';
import Appointments from './components/Appointments'; // Appointments component
import Settings from './components/Settings'; // Settings component
import Dashboard from './components/Dashboard'; // Separate Dashboard component for Doctor

// Helper function to decode JWT
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

// Simulate authentication and token validation
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decodedToken = decodeToken(token);
  if (!decodedToken) return false;

  // Check if token is expired
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return decodedToken.exp && decodedToken.exp > currentTime;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
        <Route
          path="/doctor-home"
          element={
            <ProtectedRoute>
              <DoctorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
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
  path="/doctor-home/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor-home/appointments"
  element={
    <ProtectedRoute>
      <Appointments />
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
  );
}

export default App;*/

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import DoctorHome from './components/DoctorHome';
import ClinicalHome from './components/ClinicalHome';
import AdminHome from './components/AdminHome';
import Appointments from './components/Appointments';
import Settings from './components/Settings';
import Prescriptions from './components/Prescriptions';
import Dashboard from './components/Dashboard';

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
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
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
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
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
  path="/prescriptions"
  element={
    <ProtectedRoute>
      <Prescriptions />
    </ProtectedRoute>
  }
/>



        {/* Additional Routes */}
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
  );
}

export default App;












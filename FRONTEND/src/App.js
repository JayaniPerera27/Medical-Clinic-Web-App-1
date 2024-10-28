

/*import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup'; // Import the Signup component
import DoctorHome from './components/DoctorHome'; // Updated to match the case
import ClinicalHome from './components/ClinicalHome';
import AdminHome from './components/AdminHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/doctor-home" element={<DoctorHome />} />
        <Route path="/clinical-home" element={<ClinicalHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;*/

/*import React from 'react'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import DoctorHome from './components/DoctorHome';
import ClinicalHome from './components/ClinicalHome';
import AdminHome from './components/AdminHome';
//import './styles/App.css'; // Import global styles if needed

// Simulate authentication check for demonstration purposes
const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Adjust based on actual auth implementation
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

        
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
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
//import './styles/App.css'; // Import global styles if needed

// Simulate authentication check for demonstration purposes
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // Log the token to check if it exists
  return !!token;
};

// Protected Route Component
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
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;









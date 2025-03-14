import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/Settings.css';

function Settings() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    specialization: '',
    yearsOfExperience: '',
<<<<<<< HEAD
    availableDays: [],
    availableTimes: {},
=======
    doctorFee: '',
    
>>>>>>> f7e57e764d6f620bc3b99a73dbf28cd960ccae6c
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:8070/api/doctors/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            specialization: data.specialization || '',
            yearsOfExperience: data.yearsOfExperience || '',
<<<<<<< HEAD
            availableDays: data.availableDays || [],
            availableTimes: data.availableTimes || {},
=======
            doctorFee: data.doctorFee || '',
            
>>>>>>> f7e57e764d6f620bc3b99a73dbf28cd960ccae6c
          });
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        setError('Failed to load profile');
        console.error(error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

<<<<<<< HEAD
  const handleDaysChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const updatedDays = checked
        ? [...prevState.availableDays, value]
        : prevState.availableDays.filter((day) => day !== value);
      return { ...prevState, availableDays: updatedDays };
    });
  };

  const handleTimesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      availableTimes: { ...prevState.availableTimes, [name]: value },
    }));
  };
=======
  
>>>>>>> f7e57e764d6f620bc3b99a73dbf28cd960ccae6c

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:8070/api/doctors/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setShowModal(true);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setError('Profile update failed');
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:8070/api/doctors/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        const data = await response.json();
        setPasswordMessage(data.message);
        setPasswordData({ oldPassword: '', newPassword: '' });
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('An error occurred while changing the password');
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="settings-page-container">
      <Sidebar />
      <div className="settings-content">
        <h2>Settings</h2>
        <p>Update your profile information below</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
<<<<<<< HEAD
            <label>Available Days</label>
            <div className="checkbox-group">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                (day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      name="availableDays"
                      value={day}
                      checked={formData.availableDays.includes(day)}
                      onChange={handleDaysChange}
                    />
                    {day}
                  </label>
                )
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Available Times</label>
            {formData.availableDays.map((day) => (
              <div key={day}>
                <label>{day}</label>
                <input
                  type="text"
                  name={day}
                  value={formData.availableTimes[day] || ''}
                  onChange={handleTimesChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>
            ))}
=======
            <label>Doctor Fee</label>
            <input
              type="number"
              name="doctorFee"
              value={formData.doctorFee}
              onChange={handleChange}
              required
            />
>>>>>>> f7e57e764d6f620bc3b99a73dbf28cd960ccae6c
          </div>
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </form>

        <hr />

        <h3>Change Password</h3>
        {passwordError && <p className="error-message">{passwordError}</p>}
        {passwordMessage && <p className="success-message">{passwordMessage}</p>}
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="save-button">
            Change Password
          </button>
        </form>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Profile updated successfully!</h3>
              <p>{message}</p>
              <button onClick={closeModal} className="close-modal-button">
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;




import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Profile.css';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <h2>Personal Information</h2>
          <div className="profile-info">
            <div className="info-item">
              <label>Name:</label>
              <span>{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="info-item">
              <label>Account Type:</label>
              <span className="account-type">{user?.userType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
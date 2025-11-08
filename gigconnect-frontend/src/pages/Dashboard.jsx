import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to GigConnect!</h1>
        <p>Ready to {user?.userType === 'freelancer' ? 'find your next gig' : 'get your projects done'}?</p>
      </div>

      <div className="dashboard-actions">
        {user?.userType === 'freelancer' ? (
          <div className="action-cards">
            <Link to="/gigs" className="action-card">
              <h3>Browse Gigs</h3>
              <p>Find local gigs that match your skills</p>
            </Link>
            <Link to="/profile" className="action-card">
              <h3>Update Profile</h3>
              <p>Enhance your profile to attract more clients</p>
            </Link>
          </div>
        ) : (
          <div className="action-cards">
            <Link to="/gigs/create" className="action-card">
              <h3>Post a Gig</h3>
              <p>Create a new job posting</p>
            </Link>
            <Link to="/gigs" className="action-card">
              <h3>Find Freelancers</h3>
              <p>Browse skilled freelancers in your area</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
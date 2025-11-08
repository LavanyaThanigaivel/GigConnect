import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GigDetails.css';

function GigDetails() {
  const navigate = useNavigate();

  return (
    <div className="gig-details">
      <div className="gig-details-header">
        <button onClick={() => navigate('/gigs')} className="back-btn">
          ← Back to Gigs
        </button>
        <h1>Gig Details</h1>
        <p>Gig details will appear here once backend is connected</p>
      </div>
    </div>
  );
}

export default GigDetails;
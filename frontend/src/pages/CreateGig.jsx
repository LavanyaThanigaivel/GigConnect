import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateGig.css';

function CreateGig() {
  const navigate = useNavigate();

  return (
    <div className="create-gig">
      <div className="create-gig-header">
        <h1>Post a New Gig</h1>
        <p>Find the perfect freelancer for your project</p>
      </div>
      <p>Gig creation form will appear here once backend is connected</p>
      <button onClick={() => navigate('/')} className="btn-primary">
        Back to Dashboard
      </button>
    </div>
  );
}

export default CreateGig;
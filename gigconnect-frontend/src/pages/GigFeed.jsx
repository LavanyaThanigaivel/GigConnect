import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GigFeed.css';

function GigFeed() {
  return (
    <div className="gig-feed">
      <div className="gig-feed-header">
        <h1>Find Local Gigs</h1>
        <p>Discover opportunities in your area</p>
      </div>
      
      <div className="no-gigs">
        <h3>No gigs available yet</h3>
        <p>Check back later or post a gig if you're a client</p>
        <Link to="/" className="btn-primary">Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default GigFeed;
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-hero">
      <div className="hero-card">
        <h1>Welcome to GigConnect</h1>
        <p className="muted">Post gigs, browse projects, and manage your freelancer profile.</p>
        <div className="hero-actions">
          <Link to="/freelancer-profile" className="btn">My Profile</Link>
          <Link to="/gigs/new" className="btn-ghost">Post a Gig</Link>
          <Link to="/gigs" className="btn-sm">Browse Gigs</Link>
        </div>
      </div>
    </div>
  );
}

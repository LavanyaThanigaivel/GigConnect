import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">GigConnect</Link>
      </div>
      <nav className="nav-links">
        <Link to="/freelancer-profile">Profile</Link>
        <Link to="/gigs">Gigs</Link>
        <Link to="/gigs/new" className="btn-sm">Post Gig</Link>
        <Link to="/client-profile">Client</Link>
      </nav>
    </header>
  );
}

import React from "react";
import "./ClientProfile.css";

export default function ClientProfile() {
  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img
            className="profile-avatar"
            src="https://via.placeholder.com/120"
            alt="Client"
          />
          <div className="profile-info">
            <h2 className="profile-name">John Smith</h2>
            <p className="profile-title">Startup Founder</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>About Client</h3>
          <p>
            Entrepreneur and startup founder looking for talented freelancers
            to collaborate on exciting projects. Focused on delivering quality
            and innovation.
          </p>
        </div>

        <div className="profile-section">
          <h3>Company / Projects</h3>
          <div className="portfolio">
            <div className="portfolio-card">Project Alpha</div>
            <div className="portfolio-card">Project Beta</div>
            <div className="portfolio-card">Project Gamma</div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Contact</h3>
          <p>Email: john.smith@example.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>
    </div>
  );
}

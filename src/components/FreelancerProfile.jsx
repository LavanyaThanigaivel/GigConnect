import React from "react";
import "./FreelancerProfile.css";

export default function FreelancerProfile() {
  return (
    <div className="profile-page">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <img
            className="profile-avatar"
            src="https://via.placeholder.com/120"
            alt="Profile"
          />
          <div className="profile-info">
            <h2 className="profile-name">Jane Doe</h2>
            <p className="profile-title">Full Stack Developer</p>
          </div>
        </div>

        {/* About */}
        <div className="profile-section">
          <h3>About Me</h3>
          <p>
            Experienced Full Stack Developer specializing in modern web
            applications. Passionate about building scalable, responsive, and
            user-friendly solutions.
          </p>
        </div>

        {/* Skills */}
        <div className="profile-section">
          <h3>Skills</h3>
          <div className="skills">
            <span>React</span>
            <span>Node.js</span>
            <span>MongoDB</span>
            <span>JavaScript</span>
            <span>HTML</span>
            <span>CSS</span>
          </div>
        </div>

        {/* Portfolio */}
        <div className="profile-section">
          <h3>Portfolio</h3>
          <div className="portfolio">
            <div className="portfolio-card">Project 1</div>
            <div className="portfolio-card">Project 2</div>
            <div className="portfolio-card">Project 3</div>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button className="hire-btn">Hire Me</button>
          <button className="message-btn">Message</button>
        </div>
      </div>
    </div>
  );
}

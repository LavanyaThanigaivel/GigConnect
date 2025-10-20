import React, { useState } from "react";

/*
  Clean, white card layout styled with plain CSS (styles.css).
  No external data or AgriConnect references — dummy data only.
*/

export default function FreelancerProfile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Lavanya Thanigaivel",
    title: "Full Stack Developer",
    location: "Chennai, India",
    skills: ["React", "Node.js", "MongoDB"],
    portfolio: [
      { title: "GigConnect (Frontend)", url: "#" },
      { title: "Portfolio Site", url: "#" },
    ],
    about:
      "Frontend-focused full-stack developer building performant and accessible web apps. Experienced with React, REST APIs, and realtime features.",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  }

  function handleSkillsChange(e) {
    setProfile((p) => ({ ...p, skills: e.target.value.split(",").map(s => s.trim()) }));
  }

  function saveProfile() {
    setEditing(false);
    // For frontend-only demo we keep data in state.
    // Later you can call API to persist.
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img
            className="avatar"
            src="https://i.pravatar.cc/150?img=47"
            alt="avatar"
          />
          <div className="profile-meta">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-title">{profile.title} • {profile.location}</p>
            <div className="profile-actions">
              <button className="btn" onClick={() => setEditing(!editing)}>
                {editing ? "Close" : "Edit Profile"}
              </button>
              <button className="btn-ghost">Contact</button>
            </div>
          </div>
        </div>

        {!editing ? (
          <>
            <section className="card-section">
              <h3>About</h3>
              <p className="muted">{profile.about}</p>
            </section>

            <section className="card-section">
              <h3>Skills</h3>
              <div className="chips">
                {profile.skills.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </section>

            <section className="card-section">
              <h3>Portfolio</h3>
              <ul className="portfolio-list">
                {profile.portfolio.map((p, i) => (
                  <li key={i}><a href={p.url}>{p.title}</a></li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <section className="card-section">
            <h3>Edit Profile</h3>
            <div className="form-grid">
              <label>
                Name
                <input name="name" value={profile.name} onChange={handleChange} />
              </label>
              <label>
                Title
                <input name="title" value={profile.title} onChange={handleChange} />
              </label>
              <label>
                Location
                <input name="location" value={profile.location} onChange={handleChange} />
              </label>
              <label>
                Skills (comma separated)
                <input name="skills" value={profile.skills.join(", ")} onChange={handleSkillsChange} />
              </label>
              <label className="full">
                About
                <textarea name="about" value={profile.about} onChange={handleChange}></textarea>
              </label>
            </div>

            <div className="form-actions">
              <button className="btn" onClick={saveProfile}>Save</button>
              <button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </section>
        )}
      </div>

      {/* Recent gigs / quick preview */}
      <aside className="sidebar">
        <div className="sidebar-card">
          <h4>Recent Gigs</h4>
          <div className="gig-mini">
            <strong>React Website</strong>
            <div className="muted">₹20,000 • 2 weeks</div>
          </div>
          <div className="gig-mini">
            <strong>API Integration</strong>
            <div className="muted">₹8,000 • 4 days</div>
          </div>
        </div>

        <div className="sidebar-card">
          <h4>Availability</h4>
          <p className="muted">Open for new projects • Part-time</p>
        </div>
      </aside>
    </div>
  );
}

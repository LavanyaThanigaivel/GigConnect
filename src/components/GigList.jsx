import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function GigList() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("gigs") || "[]");
    setGigs(list);
  }, []);

  return (
    <div className="page-wrap">
      <div className="card">
        <h2>Gigs</h2>
        {gigs.length === 0 ? (
          <div className="muted">No gigs yet. <Link to="/gigs/new">Post one</Link></div>
        ) : (
          <div className="gigs-grid">
            {gigs.map(g => (
              <div key={g.id} className="gig-card">
                <div className="gig-head">
                  <h3>{g.title}</h3>
                  <div className="muted">{g.category} • ₹{g.budget} • {g.timeline}</div>
                </div>
                <p className="muted small">{g.description.slice(0, 160)}{g.description.length > 160 ? "..." : ""}</p>
                <div className="card-actions">
                  <Link to="/gigs/new" className="btn-sm">Apply</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GigForm() {
  const navigate = useNavigate();
  const [gig, setGig] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    timeline: ""
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setGig(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!gig.title) e.title = "Title is required";
    if (!gig.description || gig.description.length < 15) e.description = "Write a longer description";
    if (!gig.category) e.category = "Category required";
    if (!gig.budget) e.budget = "Budget required";
    if (!gig.timeline) e.timeline = "Timeline required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(evt) {
    evt.preventDefault();
    if (!validate()) return;
    // For frontend demo, store gig in localStorage
    const list = JSON.parse(localStorage.getItem("gigs") || "[]");
    const newGig = { ...gig, id: Date.now().toString() };
    list.unshift(newGig);
    localStorage.setItem("gigs", JSON.stringify(list));
    navigate("/gigs");
  }

  return (
    <div className="page-wrap">
      <div className="card">
        <h2>Post a New Gig</h2>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Title
            <input name="title" value={gig.title} onChange={handleChange} />
            {errors.title && <small className="error">{errors.title}</small>}
          </label>

          <label className="full">
            Description
            <textarea name="description" value={gig.description} onChange={handleChange} />
            {errors.description && <small className="error">{errors.description}</small>}
          </label>

          <label>
            Category
            <select name="category" value={gig.category} onChange={handleChange}>
              <option value="">-- choose --</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile App</option>
              <option value="design">Design</option>
              <option value="data">Data Science</option>
            </select>
            {errors.category && <small className="error">{errors.category}</small>}
          </label>

          <label>
            Budget (INR)
            <input name="budget" value={gig.budget} onChange={handleChange} />
            {errors.budget && <small className="error">{errors.budget}</small>}
          </label>

          <label>
            Timeline
            <input name="timeline" value={gig.timeline} onChange={handleChange} />
            {errors.timeline && <small className="error">{errors.timeline}</small>}
          </label>

          <div className="form-actions full">
            <button className="btn" type="submit">Create Gig</button>
            <button className="btn-ghost" type="button" onClick={() => navigate("/gigs")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

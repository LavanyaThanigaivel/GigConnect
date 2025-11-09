import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { gigService } from '../services/gigService';
import '../styles/CreateGig.css';

function CreateGig() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    budget: '',
    location: '',
    duration: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (user.userType !== 'client') {
      setError('Only clients can create gigs');
      setLoading(false);
      return;
    }

    try {
      await gigService.createGig(formData);
      navigate('/gigs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-gig">
      <div className="create-gig-header">
        <h1>Post a New Gig</h1>
        <p>Find the perfect freelancer for your project</p>
      </div>

      <div className="create-gig-form">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Gig Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Website Developer Needed"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe the gig in detail..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="skillsRequired">Required Skills (comma separated) *</label>
            <input
              type="text"
              id="skillsRequired"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              required
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">Budget ($) *</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="1"
                placeholder="500"
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration *</label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              >
                <option value="">Select Duration</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3+ months">3+ months</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., New York, NY"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating Gig...' : 'Create Gig'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGig;
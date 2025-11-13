import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigService } from '../services/gigService';
import '../styles/GigFeed.css';

function GigFeed() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    skills: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async (filterParams = {}) => {
    try {
      const gigsData = await gigService.getGigs(filterParams);
      setGigs(gigsData);
    } catch (error) {
      console.error('Failed to fetch gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs(filters);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      skills: '',
      location: '',
      minPrice: '',
      maxPrice: '',
    });
    fetchGigs();
  };

  if (loading) {
    return <div className="loading">Loading gigs...</div>;
  }

  return (
    <div className="gig-feed">
      <div className="gig-feed-header">
        <h1>Find Local Gigs</h1>
        <p>Discover opportunities in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="filters-form">
          <div className="filter-row">
            <input
              type="text"
              name="search"
              placeholder="Search gigs..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
            <input
              type="text"
              name="skills"
              placeholder="Filter by skills..."
              value={filters.skills}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="text"
              name="location"
              placeholder="Filter by location..."
              value={filters.location}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-row">
            <input
              type="number"
              name="minPrice"
              placeholder="Min budget"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="price-input"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max budget"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="price-input"
            />
            <button type="submit" className="btn-primary">Search</button>
            <button type="button" onClick={clearFilters} className="btn-secondary">
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Gigs Grid */}
      <div className="gigs-grid">
        {gigs.length === 0 ? (
          <div className="no-gigs">
            <h3>No gigs found</h3>
            <p>Try adjusting your search filters or check back later</p>
            <Link to="/" className="btn-primary">Back to Dashboard</Link>
          </div>
        ) : (
          gigs
            .filter(gig => gig && gig._id) // ✅ FIX: Filter out null gigs
            .map(gig => (
              <div key={gig._id} className="gig-card">
                <div className="gig-card-header">
                  <h3>{gig.title}</h3>
                  <span className="budget">${gig.budget}</span>
                </div>
                <p className="gig-description">
                  {gig.description.length > 100 
                    ? `${gig.description.substring(0, 100)}...` 
                    : gig.description
                  }
                </p>
                <div className="gig-meta">
                  <span className="location">{gig.location}</span>
                  <span className="duration">{gig.duration}</span>
                </div>
                <div className="skills-list">
                  {gig.skillsRequired?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                  {gig.skillsRequired?.length > 3 && (
                    <span className="skill-tag">+{gig.skillsRequired.length - 3} more</span>
                  )}
                </div>
                <div className="gig-card-footer">
                  <span className="client">
                    {/* ✅ FIX: Added optional chaining for client properties */}
                    Posted by {gig.client?.firstName} {gig.client?.lastName}
                  </span>
                  <Link to={`/gigs/${gig._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default GigFeed;
import React, { useState } from 'react';
import '../../styles/SearchFilters.css';

const SearchFilters = ({ onFilter, type = 'gigs' }) => {
  const [filters, setFilters] = useState({
    category: '',
    skill: '',
    location: '',
    minBudget: '',
    maxBudget: '',
    minRate: '',
    maxRate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      category: '',
      skill: '',
      location: '',
      minBudget: '',
      maxBudget: '',
      minRate: '',
      maxRate: ''
    });
    onFilter({});
  };

  return (
    <div className="search-filters">
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="filter-row">
          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Enter location"
            />
          </div>

          {type === 'gigs' ? (
            <>
              <div className="filter-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={handleChange}
                  placeholder="e.g., Web Development"
                />
              </div>
              <div className="filter-group">
                <label>Skill</label>
                <input
                  type="text"
                  name="skill"
                  value={filters.skill}
                  onChange={handleChange}
                  placeholder="e.g., React"
                />
              </div>
            </>
          ) : (
            <div className="filter-group">
              <label>Skill</label>
              <input
                type="text"
                name="skill"
                value={filters.skill}
                onChange={handleChange}
                placeholder="e.g., React"
              />
            </div>
          )}
        </div>

        <div className="filter-row">
          {type === 'gigs' ? (
            <>
              <div className="filter-group">
                <label>Min Budget ($)</label>
                <input
                  type="number"
                  name="minBudget"
                  value={filters.minBudget}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="filter-group">
                <label>Max Budget ($)</label>
                <input
                  type="number"
                  name="maxBudget"
                  value={filters.maxBudget}
                  onChange={handleChange}
                  placeholder="1000"
                />
              </div>
            </>
          ) : (
            <>
              <div className="filter-group">
                <label>Min Rate ($/hr)</label>
                <input
                  type="number"
                  name="minRate"
                  value={filters.minRate}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="filter-group">
                <label>Max Rate ($/hr)</label>
                <input
                  type="number"
                  name="maxRate"
                  value={filters.maxRate}
                  onChange={handleChange}
                  placeholder="100"
                />
              </div>
            </>
          )}
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn-primary">Apply Filters</button>
          <button type="button" onClick={handleReset} className="btn-secondary">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
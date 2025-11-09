import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import '../styles/Profile.css';

function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    hourlyRate: '',
    skills: '',
    location: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await authService.getProfile();
      setProfile(profileData);
      setFormData({
        bio: profileData.bio || '',
        hourlyRate: profileData.hourlyRate || '',
        skills: profileData.skills?.join(', ') || '',
        location: profileData.location || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // In a real app, you would have an update profile endpoint
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };
      console.log('Profile updated:', updatedData);
      
      setEditing(false);
      fetchProfile(); // Refresh profile data
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      bio: profile.bio || '',
      hourlyRate: profile.hourlyRate || '',
      skills: profile.skills?.join(', ') || '',
      location: profile.location || ''
    });
    setEditing(false);
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error-message">Failed to load profile</div>;

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
            {!editing && (
              <button 
                onClick={() => setEditing(true)} 
                className="edit-btn"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="profile-info">
            <div className="info-item">
              <label>Name:</label>
              <span>{profile.firstName} {profile.lastName}</span>
            </div>
            
            <div className="info-item">
              <label>Email:</label>
              <span>{profile.email}</span>
            </div>
            
            <div className="info-item">
              <label>Account Type:</label>
              <span className={`account-type ${profile.userType}`}>
                {profile.userType}
              </span>
            </div>

            <div className="info-item">
              <label>Rating:</label>
              <span className="rating">
                {profile.rating > 0 ? `⭐ ${profile.rating}/5` : 'No ratings yet'}
              </span>
            </div>

            {profile.userType === 'freelancer' && (
              <>
                <div className="info-item">
                  <label>Hourly Rate:</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({
                        ...formData,
                        hourlyRate: e.target.value
                      })}
                      placeholder="Enter your hourly rate"
                      className="edit-input"
                    />
                  ) : (
                    <span>{profile.hourlyRate ? `$${profile.hourlyRate}/hr` : 'Not set'}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Skills:</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({
                        ...formData,
                        skills: e.target.value
                      })}
                      placeholder="e.g., React, Node.js, Design"
                      className="edit-input"
                    />
                  ) : (
                    <div className="skills-display">
                      {profile.skills?.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                      {(!profile.skills || profile.skills.length === 0) && 'No skills added'}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="info-item">
              <label>Location:</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: e.target.value
                  })}
                  placeholder="e.g., New York, NY"
                  className="edit-input"
                />
              ) : (
                <span>{profile.location}</span>
              )}
            </div>

            <div className="info-item bio-item">
              <label>Bio:</label>
              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({
                    ...formData,
                    bio: e.target.value
                  })}
                  placeholder="Tell us about yourself..."
                  className="edit-textarea"
                  rows="4"
                />
              ) : (
                <span>{profile.bio || 'No bio added yet'}</span>
              )}
            </div>
          </div>

          {editing && (
            <div className="edit-actions">
              <button onClick={handleSave} className="btn-primary">
                Save Changes
              </button>
              <button onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {profile.reviews && profile.reviews.length > 0 && (
          <div className="profile-card">
            <h2>Reviews ({profile.reviews.length})</h2>
            <div className="reviews-list">
              {profile.reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <span className="reviewer">
                      {review.user?.firstName || 'Anonymous'}
                    </span>
                    <span className="review-rating">
                      {'⭐'.repeat(review.rating)}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="profile-actions">
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
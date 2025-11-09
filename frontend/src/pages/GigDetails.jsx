import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { gigService } from '../services/gigService';
import '../styles/GigDetails.css';

function GigDetails() {
    const [gig, setGig] = useState(null);
    const [application, setApplication] = useState({
        proposal: '',
        bidAmount: '',
    });
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');

    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchGig();
    }, [id]);

    const fetchGig = async () => {
        try {
            const gigData = await gigService.getGig(id);
            setGig(gigData);
        } catch (err) {
            setError('Failed to load gig details');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setError('');
        setApplying(true);

        try {
            await gigService.applyToGig(id, application);
            alert('Application submitted successfully!');
            fetchGig(); // Refresh gig data
            setApplication({ proposal: '', bidAmount: '', });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply to gig');
        } finally {
            setApplying(false);
        }
    };

    const handleAcceptApplication = async (applicationId) => {
        if (window.confirm('Are you sure you want to accept this application?')) {
            try {
                await gigService.acceptApplication(id, applicationId);
                alert('Application accepted successfully!');
                fetchGig(); // Refresh gig data
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to accept application');
            }
        }
    };

    const handleRejectApplication = async (applicationId) => {
        if (window.confirm('Are you sure you want to reject this application?')) {
            try {
                await gigService.rejectApplication(id, applicationId);
                alert('Application rejected successfully!');
                fetchGig(); // Refresh gig data
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to reject application');
            }
        }
    };

    const hasApplied = gig?.applications?.some(
        app => app.freelancer._id === user?.id
    );

    if (loading) return <div className="loading">Loading gig details...</div>;
    if (!gig) return <div className="error-message">Gig not found</div>;

    return (
        <div className="gig-details">
            <div className="gig-details-header">
                <button onClick={() => navigate('/gigs')} className="back-btn">
                    ← Back to Gigs
                </button>

                <div className="gig-title-section">
                    <h1>{gig.title}</h1>
                    <div className="gig-meta">
                        <span className="budget">${gig.budget}</span>
                        <span className="location">{gig.location}</span>
                        <span className="duration">{gig.duration}</span>
                        <span className={`status ${gig.status}`}>{gig.status}</span>
                    </div>
                </div>
            </div>

            <div className="gig-content">
                <div className="gig-info">
                    <div className="info-card">
                        <h3>Description</h3>
                        <p>{gig.description}</p>
                    </div>

                    <div className="info-card">
                        <h3>Required Skills</h3>
                        <div className="skills-list">
                            {gig.skillsRequired.map((skill, index) => (
                                <span key={index} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>Client Information</h3>
                        <div className="client-info">
                            <p><strong>Name:</strong> {gig.client.firstName} {gig.client.lastName}</p>
                            <p><strong>Rating:</strong> {gig.client.rating || 'No ratings yet'}</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>Applications ({gig.applications?.length || 0})</h3>
                        {gig.applications?.map((app, index) => (
                            <div key={app._id} className="application-item">
                                <div className="application-header">
                                    <strong>{app.freelancer.firstName} {app.freelancer.lastName}</strong>
                                    <span className={`application-status ${app.status}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <p><strong>Bid:</strong> ${app.bidAmount}</p>
                                <p className="proposal">{app.proposal}</p>
                                <div className="application-meta">
                                    <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                    {user?.userType === 'client' && user?.id === gig.client._id && gig.status === 'open' && (
                                        <div className="application-actions">
                                            <button 
                                                onClick={() => handleAcceptApplication(app._id)}
                                                className="btn-primary btn-small"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => handleRejectApplication(app._id)}
                                                className="btn-secondary btn-small"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {user?.userType === 'freelancer' && gig.status === 'open' && (
                    <div className="apply-section">
                        <h3>Apply for this Gig</h3>
                        {hasApplied ? (
                            <div className="applied-message">
                                ✓ You have already applied to this gig
                            </div>
                        ) : (
                            <form onSubmit={handleApply} className="apply-form">
                                {error && <div className="error-message">{error}</div>}
                                
                                <div className="form-group">
                                    <label>Your Proposal *</label>
                                    <textarea
                                        value={application.proposal}
                                        onChange={(e) => setApplication({
                                            ...application,
                                            proposal: e.target.value
                                        })}
                                        required
                                        rows="4"
                                        placeholder="Describe why you're the best fit for this gig..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Your Bid Amount ($) *</label>
                                    <input
                                        type="number"
                                        value={application.bidAmount}
                                        onChange={(e) => setApplication({
                                            ...application,
                                            bidAmount: e.target.value
                                        })}
                                        required
                                        min="1"
                                        placeholder="Enter your bid"
                                    />
                                </div>
                                <button type="submit" disabled={applying} className="btn-primary">
                                    {applying ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GigDetails;
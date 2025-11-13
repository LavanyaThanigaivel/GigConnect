import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { gigService } from '../services/gigService';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalGigs: 0,
    activeGigs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    earnings: 0,
    unreadMessages: 0
  });

  const [recentGigs, setRecentGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Use real API calls with dashboardService
      const [statsData, recentGigsData] = await Promise.all([
        dashboardService.getStats(), // Real stats from backend
        dashboardService.getRecentGigs(3) // Real recent gigs
      ]);
      
      setStats(statsData);
      setRecentGigs(recentGigsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>{getGreeting()}, {user?.firstName}!</h1>
          <p>
            {user?.userType === 'freelancer'
              ? 'Ready to find your next great opportunity?'
              : 'Ready to get your projects done by talented freelancers?'
            }
          </p>
        </div>
        <div className="welcome-actions">
          {user?.userType === 'client' ? (
            <Link to="/gigs/create" className="btn-primary">
              Post a New Gig
            </Link>
          ) : (
            <Link to="/gigs" className="btn-primary">
              Browse Available Gigs
            </Link>
          )}
        </div>
      </div>

      {/* Stats Overview */}
<div className="stats-overview">
  <h2>Overview</h2>
  <div className="stats-grid">
    {user?.userType === 'freelancer' ? (
      <>
        {/* Freelancer Stats - 2x2 Grid */}
        <div className="stat-card">
          <div className="stat-icon applications">
            <span>📄</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalApplications}</h3>
            <p>Total Applications</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">+2 this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <span>⏳</span>
          </div>
          <div className="stat-info">
            <h3>{stats.pendingApplications}</h3>
            <p>Pending Reviews</p>
          </div>
          <div className="stat-trend">
            <span className="trend-neutral">Waiting</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon earnings">
            <span>💰</span>
          </div>
          <div className="stat-info">
            <h3>${stats.earnings}</h3>
            <p>Total Earnings</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">+15%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <span>✅</span>
          </div>
          <div className="stat-info">
            <h3>{stats.activeGigs}</h3>
            <p>Active Projects</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">In progress</span>
          </div>
        </div>
      </>
    ) : (
      <>
        {/* Client Stats - 2x2 Grid */}
        <div className="stat-card">
          <div className="stat-icon gigs">
            <span>💼</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalGigs}</h3>
            <p>Total Gigs Posted</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">+1 this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <span>🔥</span>
          </div>
          <div className="stat-info">
            <h3>{stats.activeGigs}</h3>
            <p>Active Gigs</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Looking good</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon applications">
            <span>📨</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalApplications}</h3>
            <p>Total Applications</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">+5 today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon hires">
            <span>🤝</span>
          </div>
          <div className="stat-info">
            <h3>{stats.successfulHires || 3}</h3>
            <p>Successful Hires</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Great matches</span>
          </div>
        </div>
      </>
    )}
  </div>
</div>

      {/* Quick Actions & Recent Activity */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {user?.userType === 'freelancer' ? (
              <>
                <Link to="/gigs" className="action-card">
                  <div className="action-icon">🔍</div>
                  <div className="action-content">
                    <h3>Find Gigs</h3>
                    <p>Browse available opportunities</p>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>

                <Link to="/profile" className="action-card">
                  <div className="action-icon">👤</div>
                  <div className="action-content">
                    <h3>Update Profile</h3>
                    <p>Enhance your visibility</p>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>

                <Link to="/messages" className="action-card">
                  <div className="action-icon">💬</div>
                  <div className="action-content">
                    <h3>Messages</h3>
                    <p>Connect with clients</p>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>

                <div className="action-card">
                  <div className="action-icon">⭐</div>
                  <div className="action-content">
                    <h3>Your Reviews</h3>
                    <p>Check your ratings</p>
                  </div>
                  <div className="action-arrow">→</div>
                </div>
              </>
            ) : (
              <>
                <Link to="/gigs/create" className="action-card">
                  <div className="action-icon">📝</div>
                  <div className="action-content">
                    <h3>Post a Gig</h3>
                    <p>Create new job postings</p>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>

                <Link to="/gigs" className="action-card">
                  <div className="action-icon">🔍</div>
                  <div className="action-content">
                    <h3>Find Freelancers</h3>
                    <p>Browse talented professionals</p>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>

                <Link to="/messages" className="action-card">
                  <div className="action-icon">💬</div>
                  <div className="action-content">
                    <h3>Messages</h3>
                    <p>Manage conversations</p>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>

                <div className="action-card">
                  <div className="action-icon">📊</div>
                  <div className="action-content">
                    <h3>Analytics</h3>
                    <p>View gig performance</p>
                  </div>
                  <div className="action-arrow">→</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Gigs */}
        <div className="recent-activity-section">
          <div className="section-header">
            <h2>Recent Opportunities</h2>
            <Link to="/gigs" className="view-all-link">View All →</Link>
          </div>
          <div className="activity-list">
            {recentGigs.length > 0 ? (
              recentGigs
                .filter(gig => gig && gig._id) // FIX: Filter out null/undefined gigs
                .map(gig => (
                  <div key={gig._id} className="activity-item">
                    <div className="activity-icon">
                      {gig.client_id === user?.id ? '📝' : '💼'}
                    </div>
                    <div className="activity-content">
                      <h4>{gig.title}</h4>
                      <p>
                        {gig.client_id === user?.id
                          ? `You posted a new gig - ${gig.applications?.length || 0} applications`
                          : `New gig posted by ${gig.client?.firstName} - $${gig.budget}`
                        }
                      </p>
                      <span className="activity-time">
                        {new Date(gig.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="activity-status">
                      <span className={`status-badge ${gig.status}`}>
                        {gig.status?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="no-activity">
                <p>No recent activity found</p>
                {user?.userType === 'client' ? (
                  <Link to="/gigs/create" className="btn-secondary">
                    Post Your First Gig
                  </Link>
                ) : (
                  <Link to="/gigs" className="btn-secondary">
                    Browse Available Gigs
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <h2>Your Performance</h2>
        <div className="performance-cards">
          <div className="performance-card">
            <div className="performance-metric">
              <span className="metric-value">{user?.rating || '0'}</span>
              <span className="metric-label">/5</span>
            </div>
            <div className="performance-info">
              <h3>Average Rating</h3>
              <p>Based on client feedback</p>
            </div>
            <div className="performance-stars">
              {'⭐'.repeat(Math.floor(user?.rating || 0))}
              {'☆'.repeat(5 - Math.floor(user?.rating || 0))}
            </div>
          </div>

          <div className="performance-card">
            <div className="performance-metric">
              <span className="metric-value">
                {user?.userType === 'freelancer' ? stats.totalApplications : stats.totalGigs}
              </span>
              <span className="metric-label">Total</span>
            </div>
            <div className="performance-info">
              <h3>
                {user?.userType === 'freelancer' ? 'Applications' : 'Gigs Posted'}
              </h3>
              <p>All-time activity</p>
            </div>
            <div className="performance-progress">
              <div
                className="progress-bar"
                style={{ width: '75%' }} 
              />
            </div>
          </div>

          <div className="performance-card">
            <div className="performance-metric">
              <span className="metric-value">98%</span>
              <span className="metric-label">Rate</span>
            </div>
            <div className="performance-info">
              <h3>Response Rate</h3>
              <p>Messages responded to</p>
            </div>
            <div className="performance-trend trend-up">
              +2% from last month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
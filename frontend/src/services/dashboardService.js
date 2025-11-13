import api from './api';

export const dashboardService = {
  /**
   * Get dashboard statistics for the current user
   * Returns role-specific stats (client/freelancer)
   */
  async getStats() {
    try {
      const response = await api.get('/users/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error(
        error.response?.data?.message ||
        'Failed to load dashboard statistics. Please try again.' 
      );
    }
  },

  /**
   * Get recent gigs for the dashboard
   * Shows latest opportunities or posted gigs
   */
  async getRecentGigs(limit = 3) {
    try {
      const response = await api.get(`/gigs?limit=${limit}`);
      // ✅ FIX: Filter out any null/undefined gigs and ensure they have _id
      return response.data.filter(gig => gig && gig._id);
    } catch (error) {
      console.error('Error fetching recent gigs:', error);
      // ✅ FIX: Return empty array instead of throwing to prevent app crash
      return [];
    }
  },

  /**
   * Get user's performance metrics
   * Includes rating, response rate, completion rate, etc.
   */
  async getPerformanceMetrics() {
    try {
      // This could be expanded with a dedicated performance endpoint
      // For now, we'll calculate from existing data
      const userResponse = await api.get('/auth/profile');
      const user = userResponse.data;
      const stats = await this.getStats();
      
      return {
        rating: user.rating || 0,
        totalProjects: user.userType === 'freelancer' ? stats.activeGigs : stats.totalGigs,
        responseRate: 98, // Mock data - could be calculated from message responses
        completionRate: 95 // Mock data - could be calculated from completed gigs
      };
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw new Error(
        error.response?.data?.message ||
        'Failed to load performance metrics. Please try again.'
      );
    }
  },

  /**
   * Get quick overview data for dashboard widgets
   * Combines multiple data points for efficient loading
   */
  async getDashboardOverview() {
    try {
      const [stats, recentGigs] = await Promise.all([
        this.getStats(),
        this.getRecentGigs(5)
      ]);
      
      return {
        stats,
        recentGigs,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw new Error(
        error.response?.data?.message ||
        'Failed to load dashboard overview. Please try again.'
      );
    }
  },

  /**
   * Get activity feed for the dashboard
   * Shows recent applications, messages, gig updates, etc.
   */
  async getActivityFeed(limit = 10) {
    try {
      // For now, we'll use recent gigs as activity
      // In a real app, you'd have a dedicated activity endpoint
      const recentGigs = await this.getRecentGigs(limit);
      
      // Transform gigs into activity items
      const activities = recentGigs.map(gig => ({
        id: gig._id,
        type: 'gig_posted',
        title: gig.title,
        description: `New gig posted by ${gig.client?.firstName}`,
        timestamp: gig.createdAt,
        metadata: {
          budget: gig.budget,
          location: gig.location,
          status: gig.status
        }
      }));

      return activities;
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      throw new Error(
        error.response?.data?.message ||
        'Failed to load activity feed. Please try again.'
      );
    }
  },

  /**
   * Get earnings summary for freelancers
   * Shows current month earnings, pending payments, etc.
   */
  async getEarningsSummary() {
    try {
      const stats = await this.getStats();
      return {
        totalEarnings: stats.earnings || 0,
        pendingEarnings: stats.earnings * 0.2, // Mock data - 20% pending
        thisMonth: stats.earnings * 0.3, // Mock data - 30% from current month
        lastMonth: stats.earnings * 0.7 // Mock data - 70% from previous month
      };
    } catch (error) {
      console.error('Error fetching earnings summary:', error);
      throw new Error(
        error.response?.data?.message ||
        'Failed to load earnings summary. Please try again.'
      );
    }
  },

  /**
   * Get notifications for the dashboard
   * Alerts, messages, application updates, etc.
   */
  async getNotifications() {
    try {
      // Mock notifications - in real app, fetch from notifications endpoint
      return [
        {
          id: 1,
          type: 'message',
          title: 'New Message',
          description: 'You have a new message from John Client',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
          read: false,
          action: '/messages'
        },
        {
          id: 2,
          type: 'application',
          title: 'Application Update',
          description: 'Your application for "Website Development" was viewed',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: true,
          action: '/gigs'
        },
        {
          id: 3,
          type: 'system',
          title: 'Welcome to GigConnect!',
          description: 'Complete your profile to get more opportunities',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: true,
          action: '/profile'
        }
      ];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error(
        error.response?.data?.message ||
        'Failed to load notifications. Please try again.'
      );
    }
  }
};

export default dashboardService;
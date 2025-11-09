import api from './api';

export const gigService = {
  /**
   * Get all gigs with optional filters
   */
  async getGigs(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.skills) params.append('skills', filters.skills);
      if (filters.location) params.append('location', filters.location);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/gigs?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gigs:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to load gigs. Please try again.'
      );
    }
  },

  /**
   * Get single gig by ID
   */
  async getGig(id) {
    try {
      const response = await api.get(`/gigs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gig:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to load gig details. Please try again.'
      );
    }
  },

  /**
   * Create new gig
   */
  async createGig(gigData) {
    try {
      const response = await api.post('/gigs', gigData);
      return response.data;
    } catch (error) {
      console.error('Error creating gig:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to create gig. Please try again.'
      );
    }
  },

  /**
   * Apply to a gig
   */
  async applyToGig(gigId, applicationData) {
    try {
      const response = await api.post(`/gigs/${gigId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Error applying to gig:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to submit application. Please try again.'
      );
    }
  },

  /**
   * Get user's applied gigs (for freelancers)
   */
  async getAppliedGigs() {
    try {
      const allGigs = await this.getGigs();
      // Filter gigs where user has applied
      // This would be more efficient with a dedicated endpoint
      return allGigs.filter(gig => 
        gig.applications?.some(app => app.freelancer._id === 'current-user-id')
      );
    } catch (error) {
      console.error('Error fetching applied gigs:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to load applied gigs. Please try again.'
      );
    }
  },

  /**
   * Get user's posted gigs (for clients)
   */
  async getMyGigs() {
    try {
      const allGigs = await this.getGigs();
      // Filter gigs posted by current user
      // This would be more efficient with a dedicated endpoint
      return allGigs.filter(gig => gig.client._id === 'current-user-id');
    } catch (error) {
      console.error('Error fetching my gigs:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to load your gigs. Please try again.'
      );
    }
  }
};

export default gigService;
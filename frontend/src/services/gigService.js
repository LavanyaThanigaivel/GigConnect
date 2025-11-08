import api from './api';

export const gigService = {
  async getGigs(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.skills) params.append('skills', filters.skills);
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    
    const response = await api.get(`/gigs?${params}`);
    return response.data;
  },

  async getGig(id) {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  async createGig(gigData) {
    const response = await api.post('/gigs', gigData);
    return response.data;
  },

  async applyToGig(gigId, applicationData) {
    const response = await api.post(`/gigs/${gigId}/apply`, applicationData);
    return response.data;
  }
};
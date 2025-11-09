import api from './api';

export const userService = {
  getProfile: (id) => {
    return api.get(`/users/profile/${id}`).then(res => res.data);
  },

  updateProfile: (profileData) => {
    return api.put('/users/profile', profileData).then(res => res.data);
  },

  searchFreelancers: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    return api.get(`/users/freelancers?${params}`).then(res => res.data);
  }
};
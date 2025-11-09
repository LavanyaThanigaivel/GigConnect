import api from './api';

export const messageService = {
  // Get all contacts for messaging
  async getContacts() {
    try {
      const response = await api.get('/users/contacts/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to load contacts. Please try again.'
      );
    }
  },

  // Search contacts
  async searchContacts(query) {
    try {
      const response = await api.get(`/users/contacts/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to search contacts. Please try again.'
      );
    }
  },

  // Get or create conversation with a user
  async getOrCreateConversation(userId) {
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to start conversation. Please try again.'
      );
    }
  },

  // Existing methods...
  async getConversations() {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  async getMessages(conversationId) {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  },

  async sendMessage(messageData) {
    const response = await api.post('/messages', messageData);
    return response.data;
  }
};

export default messageService;
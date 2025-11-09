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

    // Create new conversation with a user
    async createConversation(userId) {
        try {
            const response = await api.post(`/messages/conversation/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw new Error(
                error.response?.data?.message ||
                'Failed to start conversation. Please try again.'
            );
        }
    },

    // Get existing conversation by ID
    async getConversation(conversationId) {
        try {
            const response = await api.get(`/messages/conversation/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting conversation:', error);
            throw new Error(
                error.response?.data?.message ||
                'Failed to load conversation. Please try again.'
            );
        }
    },

    // Get all conversations between two users
    async getUserConversations(userId) {
        try {
            const response = await api.get(`/messages/user/${userId}/conversations`);
            return response.data;
        } catch (error) {
            console.error('Error getting user conversations:', error);
            throw new Error(
                error.response?.data?.message ||
                'Failed to load conversation history. Please try again.'
            );
        }
    },

    // Get user's conversations
    async getConversations() {
        try {
            const response = await api.get('/messages/conversations');
            return response.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw new Error(
                error.response?.data?.message ||
                'Failed to load conversations. Please try again.'
            );
        }
    },

    // Get messages for a conversation
    async getMessages(conversationId) {
        try {
            const response = await api.get(`/messages/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw new Error(
                error.response?.data?.message ||
                'Failed to load messages. Please try again.'
            );
        }
    },

    // Send message
    async sendMessage(messageData) {
        try {
            const response = await api.post('/messages', messageData);
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error(
                error.response?.data?.message ||
                'Failed to send message. Please try again.'
            );
        }
    },

    // Mark messages as read
    async markAsRead(conversationId) {
        try {
            const response = await api.put(`/messages/${conversationId}/read`);
            return response.data;
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw new Error(
                error.response?.data?.message ||
                'Failed to mark messages as read. Please try again.'
            );
        }
    }
};

export default messageService;
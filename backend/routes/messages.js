import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Mock messages data (in production, use a database)
let messages = [];

// Get messages for a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversationMessages = messages.filter(
      msg => msg.conversationId === conversationId
    );
    res.json(conversationMessages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { conversationId, receiverId, content } = req.body;
    
    const newMessage = {
      id: Date.now().toString(),
      conversationId,
      senderId: req.userId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    messages.push(newMessage);
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
});

export default router;
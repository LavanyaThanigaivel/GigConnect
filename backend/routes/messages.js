import express from 'express';
import auth from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's conversations
router.get('/conversations', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.userId
        })
        .populate('participants', 'firstName lastName userType email')
        .sort({ lastMessageAt: -1 });

        // Format response to include participant info
        const formattedConversations = conversations.map(conv => {
            const otherParticipant = conv.participants.find(
                participant => !participant._id.equals(req.userId)
            );

            return {
                id: conv._id,
                participant: {
                    _id: otherParticipant._id,
                    name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
                    type: otherParticipant.userType,
                    email: otherParticipant.email
                },
                lastMessage: conv.lastMessage,
                timestamp: conv.lastMessageAt,
                unreadCount: 0
            };
        });

        res.json(formattedConversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ message: 'Server error fetching conversations' });
    }
});

// Create new conversation with another user - FIXED ROUTE
router.post('/conversation/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Creating conversation between:', req.userId, 'and:', userId);

        // Check if user exists
        const otherUser = await User.findById(userId);
        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Always create a new conversation
        const conversation = new Conversation({
            participants: [req.userId, userId],
            lastMessage: 'Conversation started',
            lastMessageAt: new Date()
        });
        
        await conversation.save();
        await conversation.populate('participants', 'firstName lastName userType email');

        const otherParticipant = conversation.participants.find(
            participant => !participant._id.equals(req.userId)
        );

        console.log('Conversation created successfully:', conversation._id);
        
        res.status(201).json({
            id: conversation._id,
            participant: {
                _id: otherParticipant._id,
                name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
                type: otherParticipant.userType
            }
        });
    } catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ message: 'Server error creating conversation: ' + error.message });
    }
});

// Get existing conversation by ID
router.get('/conversation/:conversationId', auth, async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId)
            .populate('participants', 'firstName lastName userType email');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Verify user is part of this conversation
        if (!conversation.participants.some(p => p._id.equals(req.userId))) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const otherParticipant = conversation.participants.find(
            participant => !participant._id.equals(req.userId)
        );

        res.json({
            id: conversation._id,
            participant: {
                _id: otherParticipant._id,
                name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
                type: otherParticipant.userType
            }
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ message: 'Server error fetching conversation' });
    }
});

// Get messages for a conversation
router.get('/:conversationId', auth, async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Verify user is part of this conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.includes(req.userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const messages = await Message.find({ conversationId })
            .populate('senderId', 'firstName lastName')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
});

// Send message
router.post('/', auth, async (req, res) => {
    try {
        const { conversationId, receiverId, content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        let conversation;

        if (conversationId) {
            // Existing conversation
            conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }

            if (!conversation.participants.includes(req.userId)) {
                return res.status(403).json({ message: 'Access denied' });
            }
        } else if (receiverId) {
            // Create new conversation for new messages
            const receiver = await User.findById(receiverId);
            if (!receiver) {
                return res.status(404).json({ message: 'Receiver not found' });
            }

            conversation = new Conversation({
                participants: [req.userId, receiverId],
                lastMessage: content,
                lastMessageAt: new Date()
            });
            await conversation.save();
        } else {
            return res.status(400).json({ message: 'Either conversationId or receiverId is required' });
        }

        // Update conversation last message
        conversation.lastMessage = content;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Create message
        const message = new Message({
            conversationId: conversation._id,
            senderId: req.userId,
            receiverId: receiverId || conversation.getOtherParticipant(req.userId)._id,
            content: content.trim()
        });

        await message.save();
        await message.populate('senderId', 'firstName lastName');

        res.status(201).json(message);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error sending message' });
    }
});

// Get all conversations between two users
router.get('/user/:userId/conversations', auth, async (req, res) => {
    try {
        const { userId } = req.params;

        const conversations = await Conversation.find({
            participants: { $all: [req.userId, userId] }
        })
        .populate('participants', 'firstName lastName userType email')
        .sort({ lastMessageAt: -1 });

        res.json(conversations);
    } catch (error) {
        console.error('Get user conversations error:', error);
        res.status(500).json({ message: 'Server error fetching user conversations' });
    }
});

// Mark messages as read
router.put('/:conversationId/read', auth, async (req, res) => {
    try {
        const { conversationId } = req.params;

        await Message.updateMany(
            {
                conversationId,
                receiverId: req.userId,
                read: false
            },
            {
                $set: { read: true }
            }
        );

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error('Mark messages read error:', error);
        res.status(500).json({ message: 'Server error marking messages as read' });
    }
});

export default router;
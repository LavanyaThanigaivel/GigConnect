import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth.js';
import gigRoutes from './routes/gigs.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        message: 'GigConnect API is running!',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        uptime: process.uptime()
    });
});

// MongoDB Connection with better error handling
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✓ Local MongoDB connected successfully');
        console.log('✓ Database: ${mongoose.connection.db.databaseName}');
    } catch (error) {
        console.error('✗ MongoDB connection failed:', error.message);
        console.log('✗ Make sure MongoDB is running on localhost:27017');
        console.log('✗ Run: net start MongoDB (as Administrator)');
        process.exit(1);
    }
};

// Socket.io for real-time messaging
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their personal room for notifications
    socket.on('join_user', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on('send_message', async (data) => {
        try {
            // Save message to database
            const Message = (await import('./models/Message.js')).default;
            const Conversation = (await import('./models/Conversation.js')).default;

            let conversation = await Conversation.findById(data.conversationId);

            if (!conversation) {
                // Create new conversation if it doesn't exist
                conversation = new Conversation({
                    participants: [data.senderId, data.receiverId],
                    lastMessage: data.content,
                    lastMessageAt: new Date()
                });
                await conversation.save();
                data.conversationId = conversation._id;
            } else {
                // Update conversation last message
                conversation.lastMessage = data.content;
                conversation.lastMessageAt = new Date();
                await conversation.save();
            }

            const message = new Message({
                conversationId: data.conversationId,
                senderId: data.senderId,
                receiverId: data.receiverId,
                content: data.content
            });
            await message.save();
            await message.populate('senderId', 'firstName lastName');

            // Add the saved message data to the emission
            const messageData = {
                ...data,
                _id: message._id,
                createdAt: message.createdAt,
                senderId: {
                    _id: message.senderId._id,
                    firstName: message.senderId.firstName,
                    lastName: message.senderId.lastName
                }
            };

            // Emit to all users in the conversation
            io.to(data.conversationId).emit('receive_message', messageData);

            // Notify the receiver if they're not in the conversation
            socket.to(`user_${data.receiverId}`).emit('new_message_notification', {
                conversationId: data.conversationId,
                message: data.content,
                sender: message.senderId
            });
        } catch (error) {
            console.error('Socket message error:', error);
            socket.emit('message_error', { error: 'Failed to send message' });
        }
    });

    socket.on('typing_start', (data) => {
        socket.to(data.conversationId).emit('user_typing', {
            userId: data.userId,
            typing: true
        });
    });

    socket.on('typing_stop', (data) => {
        socket.to(data.conversationId).emit('user_typing', {
            userId: data.userId,
            typing: false
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Database connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Start server
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Frontend: ${process.env.FRONTEND_URL}`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        console.log(`Test API: http://localhost:${PORT}/api/test`);
    });
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        mongoose.connection.close();
        process.exit(0);
    });
});

startServer();
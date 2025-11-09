import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// ONLY THIS INDEX - NO UNIQUE INDEX
// This index is for better performance when sorting by last message
ConversationSchema.index({ lastMessageAt: -1 });

// Method to get the other participant in the conversation
ConversationSchema.methods.getOtherParticipant = function(userId) {
    return this.participants.find(participant => !participant._id.equals(userId));
};

export default mongoose.model('Conversation', ConversationSchema);
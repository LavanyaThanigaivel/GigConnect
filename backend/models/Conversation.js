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

// Create compound index for unique conversations between users
ConversationSchema.index({ participants: 1 }, { unique: true });

// Index for sorting by last message
ConversationSchema.index({ lastMessageAt: -1 });

ConversationSchema.methods.getOtherParticipant = function(userId) {
  return this.participants.find(participant => !participant._id.equals(userId));
};

export default mongoose.model('Conversation', ConversationSchema);
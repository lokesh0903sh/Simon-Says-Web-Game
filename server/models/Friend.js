const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending'
  },
  requestMessage: {
    type: String,
    maxlength: 200,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate friend requests
friendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Static method to find friends of a user
friendSchema.statics.getFriends = async function(userId) {
  return await this.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' }
    ]
  }).populate('requester recipient', 'username userId profile.firstName profile.lastName profile.avatar');
};

// Static method to find pending friend requests
friendSchema.statics.getPendingRequests = async function(userId) {
  return await this.find({
    recipient: userId,
    status: 'pending'
  }).populate('requester', 'username userId profile.firstName profile.lastName profile.avatar');
};

// Static method to find sent friend requests
friendSchema.statics.getSentRequests = async function(userId) {
  return await this.find({
    requester: userId,
    status: 'pending'
  }).populate('recipient', 'username userId profile.firstName profile.lastName profile.avatar');
};

// Instance method to check if users are friends
friendSchema.statics.areFriends = async function(userId1, userId2) {
  const friendship = await this.findOne({
    $or: [
      { requester: userId1, recipient: userId2, status: 'accepted' },
      { requester: userId2, recipient: userId1, status: 'accepted' }
    ]
  });
  return !!friendship;
};

module.exports = mongoose.model('Friend', friendSchema);

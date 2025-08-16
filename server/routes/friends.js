const express = require('express');
const User = require('../models/User');
const Friend = require('../models/Friend');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user's friends
router.get('/list', auth, async (req, res) => {
  try {
    const friends = await Friend.getFriends(req.userId);
    
    // Format the response to include friend data
    const friendList = friends.map(friendship => {
      const friend = friendship.requester._id.toString() === req.userId 
        ? friendship.recipient 
        : friendship.requester;
      
      return {
        _id: friend._id,
        userId: friend.userId,
        username: friend.username,
        profile: friend.profile,
        friendshipId: friendship._id,
        since: friendship.createdAt
      };
    });

    res.json({ 
      success: true, 
      friends: friendList 
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch friends' 
    });
  }
});

// Get pending friend requests (received)
router.get('/requests/pending', auth, async (req, res) => {
  try {
    const requests = await Friend.getPendingRequests(req.userId);
    
    res.json({ 
      success: true, 
      requests: requests.map(req => ({
        _id: req._id,
        requester: {
          _id: req.requester._id,
          userId: req.requester.userId,
          username: req.requester.username,
          profile: req.requester.profile
        },
        requestMessage: req.requestMessage,
        createdAt: req.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending requests' 
    });
  }
});

// Get sent friend requests
router.get('/requests/sent', auth, async (req, res) => {
  try {
    const requests = await Friend.getSentRequests(req.userId);
    
    res.json({ 
      success: true, 
      requests: requests.map(req => ({
        _id: req._id,
        recipient: {
          _id: req.recipient._id,
          userId: req.recipient.userId,
          username: req.recipient.username,
          profile: req.recipient.profile
        },
        requestMessage: req.requestMessage,
        status: req.status,
        createdAt: req.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch sent requests' 
    });
  }
});

// Send friend request by user ID
router.post('/request', auth, async (req, res) => {
  try {
    const { userId, message = '' } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Find the user by userId
    const recipient = await User.findOne({ userId });
    if (!recipient) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user is trying to add themselves
    if (recipient._id.toString() === req.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot send a friend request to yourself' 
      });
    }

    // Check if friendship already exists
    const existingFriendship = await Friend.findOne({
      $or: [
        { requester: req.userId, recipient: recipient._id },
        { requester: recipient._id, recipient: req.userId }
      ]
    });

    if (existingFriendship) {
      let message = 'Friend request already exists';
      if (existingFriendship.status === 'accepted') {
        message = 'You are already friends with this user';
      } else if (existingFriendship.status === 'blocked') {
        message = 'Unable to send friend request';
      } else if (existingFriendship.status === 'declined') {
        message = 'Friend request was previously declined';
      }
      
      return res.status(400).json({ 
        success: false, 
        message 
      });
    }

    // Create friend request
    const friendRequest = new Friend({
      requester: req.userId,
      recipient: recipient._id,
      requestMessage: message.trim()
    });

    await friendRequest.save();

    // Populate the request with user data
    await friendRequest.populate('recipient', 'username userId profile.firstName profile.lastName profile.avatar');

    res.json({ 
      success: true, 
      message: `Friend request sent to ${recipient.username}`,
      request: {
        _id: friendRequest._id,
        recipient: {
          _id: friendRequest.recipient._id,
          userId: friendRequest.recipient.userId,
          username: friendRequest.recipient.username,
          profile: friendRequest.recipient.profile
        },
        requestMessage: friendRequest.requestMessage,
        status: friendRequest.status,
        createdAt: friendRequest.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send friend request' 
    });
  }
});

// Accept friend request
router.post('/accept/:requestId', auth, async (req, res) => {
  try {
    const friendRequest = await Friend.findById(req.params.requestId);
    
    if (!friendRequest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Friend request not found' 
      });
    }

    // Check if the current user is the recipient
    if (friendRequest.recipient.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only accept requests sent to you' 
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Friend request is no longer pending' 
      });
    }

    // Accept the request
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Populate with user data
    await friendRequest.populate('requester', 'username userId profile.firstName profile.lastName profile.avatar');

    res.json({ 
      success: true, 
      message: 'Friend request accepted',
      friendship: {
        _id: friendRequest._id,
        friend: {
          _id: friendRequest.requester._id,
          userId: friendRequest.requester.userId,
          username: friendRequest.requester.username,
          profile: friendRequest.requester.profile
        },
        since: friendRequest.updatedAt
      }
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to accept friend request' 
    });
  }
});

// Decline friend request
router.post('/decline/:requestId', auth, async (req, res) => {
  try {
    const friendRequest = await Friend.findById(req.params.requestId);
    
    if (!friendRequest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Friend request not found' 
      });
    }

    // Check if the current user is the recipient
    if (friendRequest.recipient.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only decline requests sent to you' 
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Friend request is no longer pending' 
      });
    }

    // Decline the request
    friendRequest.status = 'declined';
    await friendRequest.save();

    res.json({ 
      success: true, 
      message: 'Friend request declined' 
    });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to decline friend request' 
    });
  }
});

// Remove friend
router.delete('/remove/:friendshipId', auth, async (req, res) => {
  try {
    const friendship = await Friend.findById(req.params.friendshipId);
    
    if (!friendship) {
      return res.status(404).json({ 
        success: false, 
        message: 'Friendship not found' 
      });
    }

    // Check if the current user is part of this friendship
    if (friendship.requester.toString() !== req.userId && 
        friendship.recipient.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only remove your own friendships' 
      });
    }

    await Friend.findByIdAndDelete(req.params.friendshipId);

    res.json({ 
      success: true, 
      message: 'Friend removed successfully' 
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove friend' 
    });
  }
});

// Generate friend invitation link
router.get('/invite-link', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('userId username');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const inviteLink = `${baseUrl}/add-friend/${user.userId}`;

    res.json({ 
      success: true, 
      inviteLink,
      userId: user.userId,
      username: user.username
    });
  } catch (error) {
    console.error('Error generating invite link:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate invite link' 
    });
  }
});

// Get user by userId (for friend invitations)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId })
      .select('_id username userId profile.firstName profile.lastName profile.avatar');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if already friends
    const areFriends = await Friend.areFriends(req.userId, user._id);
    
    // Check if there's a pending request
    const pendingRequest = await Friend.findOne({
      $or: [
        { requester: req.userId, recipient: user._id, status: 'pending' },
        { requester: user._id, recipient: req.userId, status: 'pending' }
      ]
    });

    res.json({ 
      success: true, 
      user: {
        _id: user._id,
        username: user.username,
        userId: user.userId,
        profile: user.profile
      },
      relationship: {
        areFriends,
        pendingRequest: !!pendingRequest,
        requestSentByMe: pendingRequest && pendingRequest.requester.toString() === req.userId,
        requestSentToMe: pendingRequest && pendingRequest.recipient.toString() === req.userId,
        requestId: pendingRequest ? pendingRequest._id : null
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user information' 
    });
  }
});

module.exports = router;

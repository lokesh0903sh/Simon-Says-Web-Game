const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({
      user: {
        _id: user._id,
        id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        profile: user.profile,
        gameStats: user.gameStats,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      phoneNumber,
      dateOfBirth,
      avatar
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (gender !== undefined) user.profile.gender = gender;
    if (phoneNumber !== undefined) user.profile.phoneNumber = phoneNumber;
    if (dateOfBirth !== undefined) user.profile.dateOfBirth = dateOfBirth;
    if (avatar !== undefined) user.profile.avatar = avatar;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        profile: user.profile,
        gameStats: user.gameStats,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add friend
router.post('/friends/add', auth, async (req, res) => {
  try {
    const { friendUsername } = req.body;
    
    const user = await User.findById(req.userId);
    const friend = await User.findOne({ username: friendUsername });

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (friend._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' });
    }

    // Check if already friends
    const existingFriend = user.friends.find(f => f.user.toString() === friend._id.toString());
    if (existingFriend) {
      return res.status(400).json({ message: 'Already friends or request pending' });
    }

    // Add to user's friends
    user.friends.push({
      user: friend._id,
      status: 'pending'
    });

    // Add to friend's friends
    friend.friends.push({
      user: user._id,
      status: 'pending'
    });

    await user.save();
    await friend.save();

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept friend request
router.put('/friends/accept/:friendId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const friend = await User.findById(req.params.friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update friend status for both users
    const userFriend = user.friends.find(f => f.user.toString() === friend._id.toString());
    const friendUser = friend.friends.find(f => f.user.toString() === user._id.toString());

    if (userFriend) userFriend.status = 'accepted';
    if (friendUser) friendUser.status = 'accepted';

    await user.save();
    await friend.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends list
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('friends.user', 'username profile.firstName profile.lastName gameStats.highestScore');
    
    res.json(user.friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

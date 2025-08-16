const express = require('express');
const mongoose = require('mongoose');
const GameSession = require('../models/GameSession');
const User = require('../models/User');
const Friend = require('../models/Friend');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const { period = 'all', page = 1, limit = 50 } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'daily':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          }
        };
        break;
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        dateFilter = { createdAt: { $gte: weekStart } };
        break;
      case 'monthly':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        };
        break;
    }

    const pipeline = [
      {
        $match: {
          gameMode: 'registered',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$user',
          highestScore: { $max: '$score' },
          totalGames: { $sum: 1 },
          averageScore: { $avg: '$score' },
          totalAccuracy: { $avg: '$accuracy' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $project: {
          username: '$userInfo.username',
          firstName: '$userInfo.profile.firstName',
          lastName: '$userInfo.profile.lastName',
          avatar: '$userInfo.profile.avatar',
          highestScore: 1,
          totalGames: 1,
          averageScore: { $round: ['$averageScore', 1] },
          averageAccuracy: { $round: ['$totalAccuracy', 1] }
        }
      },
      {
        $sort: { highestScore: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: parseInt(limit)
      }
    ];

    const leaderboard = await GameSession.aggregate(pipeline);
    
    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: (page - 1) * limit + index + 1
    }));

    res.json({
      leaderboard: rankedLeaderboard,
      period,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    ;
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user rank in global leaderboard
router.get('/rank', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const higherScoreCount = await User.countDocuments({
      'gameStats.highestScore': { $gt: user.gameStats.highestScore }
    });
    
    res.json({
      rank: higherScoreCount + 1,
      highestScore: user.gameStats.highestScore,
      totalUsers: await User.countDocuments()
    });
  } catch (error) {
    ;
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends leaderboard
router.get('/friends', auth, async (req, res) => {
  try {
    const { period = 'all', page = 1, limit = 50 } = req.query;
    const userId = req.userId;

    // Get user's friends
    const friendsList = await Friend.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    }).populate('requester recipient', 'userId username');

    // Extract friend user IDs (including the current user)
    const friendUserIds = [userId];
    friendsList.forEach(friendship => {
      if (friendship.requester._id.toString() === userId) {
        friendUserIds.push(friendship.recipient._id.toString());
      } else {
        friendUserIds.push(friendship.requester._id.toString());
      }
    });

    // Build date filter
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'today':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          }
        };
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        dateFilter = { createdAt: { $gte: weekStart } };
        break;
      case 'month':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        };
        break;
      case 'all':
      default:
        break;
    }

    // Build aggregation pipeline for friends leaderboard
    const pipeline = [
      {
        $match: {
          user: { $in: friendUserIds.map(id => typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id) },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$user',
          highestScore: { $max: '$score' },
          totalGames: { $sum: 1 },
          totalScore: { $sum: '$score' },
          averageScore: { $avg: '$score' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          highestScore: 1,
          totalGames: 1,
          totalScore: 1,
          averageScore: { $round: ['$averageScore', 1] },
          username: '$user.username',
          userId: '$user.userId'
        }
      },
      {
        $sort: { highestScore: -1, totalScore: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: parseInt(limit)
      }
    ];

    const leaderboard = await GameSession.aggregate(pipeline);
    
    // Add rank and current user indicator
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: (page - 1) * limit + index + 1,
      isCurrentUser: entry._id.toString() === userId
    }));

    res.json({
      leaderboard: rankedLeaderboard,
      period,
      page: parseInt(page),
      limit: parseInt(limit),
      totalFriends: friendUserIds.length
    });

  } catch (error) {
    ;
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

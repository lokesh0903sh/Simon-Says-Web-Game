const express = require('express');
const GameSession = require('../models/GameSession');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Save game session
router.post('/session', optionalAuth, async (req, res) => {
  try {
    ;
    ;
    ;
    ;
    
    const {
      sessionId,
      gameMode,
      guestName,
      score,
      level,
      sequence,
      gameStartTime,
      gameEndTime,
      correctMoves,
      totalMoves
    } = req.body;

    // Check for duplicate session if sessionId is provided
    if (sessionId) {
      const existingSession = await GameSession.findOne({ sessionId });
      if (existingSession) {
        ;
        return res.status(409).json({ 
          success: false,
          message: 'Game session already saved',
          sessionId 
        });
      }
    }

    // Validate gameMode
    if (!gameMode || (gameMode !== 'registered' && gameMode !== 'guest')) {
      return res.status(400).json({ 
        message: 'Invalid gameMode. Must be "registered" or "guest"' 
      });
    }

    // For registered users, ensure we have a user ID
    if (gameMode === 'registered' && !req.userId) {
      return res.status(400).json({ 
        message: 'User authentication required for registered mode' 
      });
    }

    // For guest users, ensure we have a guest name
    if (gameMode === 'guest' && !guestName) {
      return res.status(400).json({ 
        message: 'Guest name required for guest mode' 
      });
    }

    const gameDuration = new Date(gameEndTime) - new Date(gameStartTime);
    const accuracy = totalMoves > 0 ? Math.round((correctMoves / totalMoves) * 100) : 0;

    const gameSession = new GameSession({
      sessionId,
      user: gameMode === 'registered' ? req.userId : undefined,
      gameMode,
      guestName: gameMode === 'guest' ? guestName : undefined,
      score,
      level,
      sequence,
      gameStartTime,
      gameEndTime,
      gameDuration,
      correctMoves,
      totalMoves,
      accuracy
    });

    await gameSession.save();
    ;

    // Update user stats if registered user
    let updatedUser = null;
    if (gameMode === 'registered' && req.userId) {
      ;
      const user = await User.findById(req.userId);
      if (user) {
        ;
        
        user.gameStats.totalGamesPlayed += 1;
        user.gameStats.totalScore += score;
        
        if (score > user.gameStats.highestScore) {
          user.gameStats.highestScore = score;
          ;
        }
        
        user.updateAverageScore();
        await user.save();
        updatedUser = user;
        
        ;
      } else {
        ;
      }
    }

    ;

    res.status(201).json({
      message: 'Game session saved successfully',
      gameSession,
      user: updatedUser ? {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        gameStats: updatedUser.gameStats
      } : null
    });
  } catch (error) {
    ;
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's game history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const gameSessions = await GameSession.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GameSession.countDocuments({ user: req.userId });

    res.json({
      gameSessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    ;
    res.status(500).json({ message: 'Server error' });
  }
});

// Get game statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('gameStats');
    
    // Get additional stats from game sessions
    const sessions = await GameSession.find({ user: req.userId });
    
    const stats = {
      ...user.gameStats.toObject(),
      totalPlayTime: sessions.reduce((total, session) => total + session.gameDuration, 0),
      averageAccuracy: sessions.length > 0 
        ? Math.round(sessions.reduce((total, session) => total + session.accuracy, 0) / sessions.length)
        : 0,
      recentGames: sessions.slice(0, 5).map(session => ({
        score: session.score,
        level: session.level,
        accuracy: session.accuracy,
        date: session.createdAt
      }))
    };

    res.json(stats);
  } catch (error) {
    ;
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

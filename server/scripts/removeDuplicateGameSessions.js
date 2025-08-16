const mongoose = require('mongoose');
const GameSession = require('../models/GameSession');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/simon-says-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function removeDuplicateGameSessions() {
  try {
    ;
    
    // Find all game sessions and group by potential duplicate criteria
    const pipeline = [
      {
        $group: {
          _id: {
            user: '$user',
            gameMode: '$gameMode',
            guestName: '$guestName',
            score: '$score',
            level: '$level',
            gameStartTime: '$gameStartTime'
          },
          sessions: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ];
    
    const duplicateGroups = await GameSession.aggregate(pipeline);
    ;
    
    let totalRemoved = 0;
    let totalFixed = 0;
    
    for (const group of duplicateGroups) {
      const sessions = group.sessions;
      ;
      ;
      ;
      
      // Keep the first session, remove the rest
      const sessionToKeep = sessions[0];
      const sessionsToRemove = sessions.slice(1);
      
      ;
      ;
      
      // Remove duplicate sessions
      for (const session of sessionsToRemove) {
        await GameSession.findByIdAndDelete(session._id);
        ;
        totalRemoved++;
      }
      
      // Fix user stats if this was a registered user
      if (group._id.gameMode === 'registered' && group._id.user) {
        const user = await User.findById(group._id.user);
        if (user) {
          ;
          
          // Recalculate user stats from remaining sessions
          const userSessions = await GameSession.find({ 
            user: group._id.user, 
            gameMode: 'registered' 
          });
          
          let totalGames = userSessions.length;
          let totalScore = userSessions.reduce((sum, session) => sum + session.score, 0);
          let highestScore = Math.max(...userSessions.map(session => session.score));
          let averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
          
          user.gameStats = {
            totalGamesPlayed: totalGames,
            totalScore,
            highestScore,
            averageScore
          };
          
          await user.save();
          ;
          totalFixed++;
        }
      }
    }
    
    ;
    ;
    ;
    
  } catch (error) {
    ;
  } finally {
    mongoose.disconnect();
  }
}

// Run the cleanup
removeDuplicateGameSessions();

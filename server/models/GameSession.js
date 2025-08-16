const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    unique: true, // Ensure no duplicate sessions
    sparse: true // Allow null values for existing records
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.gameMode !== 'guest';
    }
  },
  gameMode: {
    type: String,
    enum: ['registered', 'guest'],
    required: true
  },
  guestName: {
    type: String,
    required: function() {
      return this.gameMode === 'guest';
    }
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  level: {
    type: Number,
    required: true,
    min: 1
  },
  sequence: [{
    type: String,
    enum: ['red', 'yellow', 'green', 'purple']
  }],
  gameStartTime: {
    type: Date,
    required: true
  },
  gameEndTime: {
    type: Date,
    required: true
  },
  gameDuration: {
    type: Number, // in milliseconds
    required: true
  },
  correctMoves: {
    type: Number,
    default: 0
  },
  totalMoves: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate accuracy before saving
gameSessionSchema.pre('save', function(next) {
  if (this.totalMoves > 0) {
    this.accuracy = Math.round((this.correctMoves / this.totalMoves) * 100);
  }
  next();
});

module.exports = mongoose.model('GameSession', gameSessionSchema);

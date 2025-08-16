const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const leaderboardRoutes = require('./routes/leaderboard');
const friendRoutes = require('./routes/friends');

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://simon-says-game-client.vercel.app',
      'https://simon-says-game.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Simon Says Game API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Database connection
main().then(() => {
  console.log("Connected to MongoDB database");
}).catch((err) => {
  console.log("Database connection error:", err);
});

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/simon-says-game');
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/friends', friendRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Simon Says Game API Server',
    status: 'online',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      user: '/api/user',
      game: '/api/game',
      leaderboard: '/api/leaderboard',
      friends: '/api/friends'
    }
  });
});

// 404 Error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🎮' : err.stack
  });
});

const PORT = process.env.PORT || 5000;

// Start the server for local development
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the Express app for Vercel
module.exports = app;

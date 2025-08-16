# Simon Says Game - Modern MERN Stack Application

A modern, feature-rich implementation of the classic Simon Says memory game built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🎮 Features

### Game Features
- **Classic Simon Says Gameplay**: Follow and repeat increasingly complex sequences
- **Multiple Difficulty Levels**: Easy, Normal, and Hard modes with different timing
- **Guest and Registered Play**: Play without account or sign up for full features
- **Sound Effects**: Audio feedback for button presses (toggleable)
- **Real-time Game Statistics**: Track accuracy, level progression, and scores

### User Management
- **User Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Update personal information, avatar, and preferences
- **Game Statistics**: Comprehensive tracking of game performance
- **Password Security**: Bcrypt hashing for secure password storage

### Social Features
- **Global Leaderboards**: Compete with players worldwide
- **Friends System**: Add friends and view their scores
- **Time-based Rankings**: Daily, weekly, monthly, and all-time leaderboards
- **Score Sharing**: Share achievements with friends

### Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Modern dark interface with gradient effects
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Interactive Background**: Animated gradient background with floating elements
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Technology Stack

### Frontend
- **React 19**: Latest React with hooks and modern features
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Advanced animations and transitions
- **React Router Dom**: Client-side routing
- **React Hook Form**: Form handling and validation
- **React Hot Toast**: Elegant notifications
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API calls

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **CORS**: Cross-Origin Resource Sharing
- **Validator**: Input validation utilities

## 📁 Project Structure

```
simon-says-game/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── game/      # Game-specific components
│   │   │   └── ui/        # General UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── utils/         # Helper functions and API calls
│   │   └── styles/        # CSS and styling files
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # Express route handlers
│   ├── middleware/       # Custom middleware
│   └── package.json      # Backend dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simon-says-game
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**

   **Backend (.env in server folder):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/simon-says-game
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

   **Frontend (.env in client folder):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   - Local MongoDB: `mongod`
   - Or use MongoDB Atlas and update the connection string

6. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 🎮 How to Play

1. **Choose Game Mode**: Play as a guest with a custom name or sign up/login for full features
2. **Watch the Sequence**: Observe the pattern of colored buttons that light up
3. **Repeat the Pattern**: Click the buttons in the same order as shown
4. **Level Up**: Each successful round adds one more button to the sequence
5. **Challenge Yourself**: Try different difficulty levels and compete on leaderboards

## 🏆 Game Features Explained

### Difficulty Levels
- **Easy**: 800ms sequence delay, 3s to respond, 400ms flash duration
- **Normal**: 600ms sequence delay, 2s to respond, 300ms flash duration  
- **Hard**: 400ms sequence delay, 1.5s to respond, 200ms flash duration

### Scoring System
- Base score equals the level reached
- Additional points for quick responses
- Accuracy percentage tracking
- High score and average score statistics

### Leaderboards
- **Global**: Compete with all players worldwide
- **Friends**: Compare scores with your friends
- **Time Periods**: Daily, weekly, monthly, and all-time rankings

## 🔧 Development

### Available Scripts

**Frontend (client folder):**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend (server folder):**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

#### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/friends/add` - Add friend
- `GET /api/user/friends` - Get friends list

#### Game
- `POST /api/game/session` - Save game session
- `GET /api/game/history` - Get game history
- `GET /api/game/stats` - Get game statistics

#### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/friends` - Friends leaderboard
- `GET /api/leaderboard/rank` - User rank

## 🎨 Design System

### Colors
- **Game Red**: #d95980
- **Game Yellow**: #f99b45
- **Game Green**: #63aac0
- **Game Purple**: #819ff9
- **Dark Background**: #0a0a0a
- **Dark Card**: #1a1a1a
- **Dark Border**: #333333

### Typography
- **Font Family**: Orbitron (futuristic, game-like font)
- **Font Weights**: 400, 500, 600, 700, 800, 900

### Animations
- Framer Motion for smooth transitions
- Custom CSS animations for game elements
- Gradient backgrounds with animated movement
- Floating elements and particle effects

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with larger game board
- **Tablet**: Touch-optimized interface with medium-sized elements
- **Mobile**: Compact layout with thumb-friendly button placement

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Protected routes and middleware
- Secure session management

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

### Backend Deployment (Heroku/Railway)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy the server folder
4. Update CORS settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Avatar upload currently shows placeholder (implement file upload service)
- Sound effects use Web Audio API (may not work in all browsers)
- Real-time notifications not implemented (consider WebSocket integration)

## 🔮 Future Enhancements

- [ ] Multiplayer mode with real-time competition
- [ ] Custom themes and color schemes
- [ ] Achievement system with badges
- [ ] Social media integration for sharing
- [ ] Progressive Web App (PWA) features
- [ ] Voice commands for accessibility
- [ ] Game replay functionality
- [ ] Tournament mode with brackets

## 📞 Support

For support, email support@simonsaysgame.com or create an issue in the GitHub repository.

## 🌟 Acknowledgments

- Original Simon game concept
- React and Node.js communities
- Tailwind CSS for excellent styling utilities
- Framer Motion for beautiful animations
- All beta testers and contributors

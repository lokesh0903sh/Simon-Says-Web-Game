# Quick Start Instructions

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally or MongoDB Atlas)

## Setup Steps

1. **Install all dependencies:**
   ```bash
   # From root directory
   npm run install-all
   ```

2. **Start MongoDB:**
   - Local: `mongod`
   - Or configure MongoDB Atlas in server/.env

3. **Start the application:**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Manual Setup (Alternative)

If the above doesn't work:

1. **Backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Frontend (in new terminal):**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Environment Files

Make sure these files exist:

**server/.env:**
```
MONGODB_URI=mongodb://localhost:27017/simon-says-game
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

**client/.env:**
```
VITE_API_URL=http://localhost:5000/api
```

## Ports
- Frontend: 5173
- Backend: 5000
- MongoDB: 27017

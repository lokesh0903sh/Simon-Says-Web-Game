import axios from 'axios';

// Environment-based API URL configuration
const getAPIBaseURL = () => {
  // Check if we have a custom environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Production detection
  if (import.meta.env.PROD) {
    return 'https://simon-says-game-server.vercel.app/api';
  }
  
  // Development fallback
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getAPIBaseURL();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to get auth token from zustand persist storage
const getAuthToken = () => {
  try {
    // First try direct token key
    let token = localStorage.getItem('token');
    
    if (!token) {
      // Try from zustand persist storage
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token;
      }
    }
    
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed:', error.response.data);
      // Optionally redirect to login or clear auth state
    }
    return Promise.reject(error);
  }
);

export const friendsAPI = {
  // Get user's friends list
  getFriends: async () => {
    const response = await api.get('/friends/list');
    return response.data;
  },

  // Get pending friend requests (received)
  getPendingRequests: async () => {
    const response = await api.get('/friends/requests/pending');
    return response.data;
  },

  // Get sent friend requests
  getSentRequests: async () => {
    const response = await api.get('/friends/requests/sent');
    return response.data;
  },

  // Send friend request by userId
  sendFriendRequest: async (userId) => {
    const response = await api.post('/friends/request', { userId });
    return response.data;
  },

  // Accept friend request
  acceptFriendRequest: async (requestId) => {
    const response = await api.post(`/friends/accept/${requestId}`);
    return response.data;
  },

  // Decline friend request
  declineFriendRequest: async (requestId) => {
    const response = await api.post(`/friends/decline/${requestId}`);
    return response.data;
  },

  // Remove friend
  removeFriend: async (friendshipId) => {
    const response = await api.delete(`/friends/${friendshipId}`);
    return response.data;
  },

  // Get user by userId (for invitation links)
  getUserByUserId: async (userId) => {
    const response = await api.get(`/friends/user/${userId}`);
    return response.data;
  },

  // Generate invitation link
  generateInvitationLink: async () => {
    const response = await api.get('/friends/invite-link');
    return response.data;
  },

  // Get friends leaderboard
  getFriendsLeaderboard: async (period = 'all', page = 1, limit = 50) => {
    const response = await api.get('/leaderboard/friends', {
      params: { period, page, limit }
    });
    return response.data;
  }
};

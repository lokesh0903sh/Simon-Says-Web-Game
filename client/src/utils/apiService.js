import api from './api';

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  addFriend: async (friendUsername) => {
    const response = await api.post('/user/friends/add', { friendUsername });
    return response.data;
  },

  acceptFriend: async (friendId) => {
    const response = await api.put(`/user/friends/accept/${friendId}`);
    return response.data;
  },

  getFriends: async () => {
    const response = await api.get('/user/friends');
    return response.data;
  }
};

export const gameAPI = {
  saveGameSession: async (gameData) => {
    const response = await api.post('/game/session', gameData);
    return response.data;
  },

  getGameHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/game/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  getGameStats: async () => {
    const response = await api.get('/game/stats');
    return response.data;
  }
};

export const leaderboardAPI = {
  getGlobalLeaderboard: async (period = 'all', page = 1, limit = 50) => {
    const response = await api.get(`/leaderboard/global?period=${period}&page=${page}&limit=${limit}`);
    return response.data;
  },

  getFriendsLeaderboard: async (period = 'all') => {
    const response = await api.get(`/leaderboard/friends?period=${period}`);
    return response.data;
  },

  getUserRank: async () => {
    const response = await api.get('/leaderboard/rank');
    return response.data;
  }
};

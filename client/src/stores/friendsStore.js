import { create } from 'zustand';
import { friendsAPI } from '../services/friendsAPI';

const useFriendsStore = create((set, get) => ({
  // State
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  friendsLeaderboard: [],
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch friends list
  fetchFriends: async () => {
    set({ loading: true, error: null });
    try {
      const friends = await friendsAPI.getFriends();
      set({ friends, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch friends', loading: false });
    }
  },

  // Fetch pending requests
  fetchPendingRequests: async () => {
    set({ loading: true, error: null });
    try {
      const pendingRequests = await friendsAPI.getPendingRequests();
      set({ pendingRequests, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch pending requests', loading: false });
    }
  },

  // Fetch sent requests
  fetchSentRequests: async () => {
    set({ loading: true, error: null });
    try {
      const sentRequests = await friendsAPI.getSentRequests();
      set({ sentRequests, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch sent requests', loading: false });
    }
  },

  // Send friend request
  sendFriendRequest: async (userId) => {
    set({ loading: true, error: null });
    try {
      await friendsAPI.sendFriendRequest(userId);
      // Refresh sent requests
      const sentRequests = await friendsAPI.getSentRequests();
      set({ sentRequests, loading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send friend request';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId) => {
    set({ loading: true, error: null });
    try {
      await friendsAPI.acceptFriendRequest(requestId);
      // Refresh both friends and pending requests
      const [friends, pendingRequests] = await Promise.all([
        friendsAPI.getFriends(),
        friendsAPI.getPendingRequests()
      ]);
      set({ friends, pendingRequests, loading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to accept friend request';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Decline friend request
  declineFriendRequest: async (requestId) => {
    set({ loading: true, error: null });
    try {
      await friendsAPI.declineFriendRequest(requestId);
      // Refresh pending requests
      const pendingRequests = await friendsAPI.getPendingRequests();
      set({ pendingRequests, loading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to decline friend request';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Remove friend
  removeFriend: async (friendshipId) => {
    set({ loading: true, error: null });
    try {
      await friendsAPI.removeFriend(friendshipId);
      // Refresh friends list
      const friends = await friendsAPI.getFriends();
      set({ friends, loading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove friend';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Generate invitation link
  generateInvitationLink: async () => {
    set({ loading: true, error: null });
    try {
      const result = await friendsAPI.generateInvitationLink();
      set({ loading: false });
      return { success: true, ...result };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate invitation link';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch friends leaderboard
  fetchFriendsLeaderboard: async (period = 'all', page = 1, limit = 50) => {
    set({ loading: true, error: null });
    try {
      const result = await friendsAPI.getFriendsLeaderboard(period, page, limit);
      set({ friendsLeaderboard: result.leaderboard, loading: false });
      return result;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch friends leaderboard', loading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    friends: [],
    pendingRequests: [],
    sentRequests: [],
    friendsLeaderboard: [],
    loading: false,
    error: null
  })
}));

export default useFriendsStore;

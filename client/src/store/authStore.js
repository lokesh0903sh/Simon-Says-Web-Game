import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        // Clear any previous user's game data
        const currentUser = get().user;
        if (currentUser && currentUser._id !== user._id) {
          // Different user, clear game-related localStorage and game state
          localStorage.removeItem('game-state');
          localStorage.removeItem('leaderboard-cache');
          
          // Clear game store data
          import('../store/gameStore').then(({ default: useGameStore }) => {
            useGameStore.getState().clearAllGameData();
          });
        }
        
        // Save token to localStorage for API compatibility
        localStorage.setItem('token', token);
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      },

      clearAuth: () => {
        // Clear all user data including game state
        localStorage.removeItem('game-state');
        localStorage.removeItem('leaderboard-cache');
        localStorage.removeItem('token'); // Remove the token from localStorage
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },

      updateGameStats: (stats) => {
        set((state) => ({
          user: {
            ...state.user,
            gameStats: {
              ...state.user.gameStats,
              ...stats
            }
          }
        }));
      },

      refreshUser: async () => {
        const state = get();
        if (!state.isAuthenticated || !state.token) return;
        
        try {
          const { userAPI } = await import('../utils/apiService');
          const userData = await userAPI.getProfile();
          set((currentState) => ({
            user: { ...currentState.user, ...userData.user }
          }));
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // When rehydrating from storage, also set token in localStorage for API compatibility
        if (state?.token) {
          localStorage.setItem('token', state.token);
        }
      }
    }
  )
);

export default useAuthStore;

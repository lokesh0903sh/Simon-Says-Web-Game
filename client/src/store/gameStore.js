import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Game state
  gameSeq: [],
  userSeq: [],
  level: 0,
  score: 0,
  started: false,
  gameOver: false,
  gameMode: 'guest', // 'guest' or 'registered'
  guestName: '',
  currentSequenceIndex: 0,
  isShowingSequence: false,
  needsToShowSequence: false, // New flag to control sequence display
  gameStartTime: null,
  gameEndTime: null,
  
  // Game statistics
  correctMoves: 0,
  totalMoves: 0,
  
  // Game settings
  difficulty: 'normal', // 'easy', 'normal', 'hard'
  soundEnabled: true,
  
  // Actions
  setGameMode: (mode, name = '') => {
    set({ gameMode: mode, guestName: name });
  },
  
  startGame: () => {
    set({ 
      started: true, 
      gameOver: false, 
      gameStartTime: new Date(),
      level: 0,
      score: 0,
      gameSeq: [],
      userSeq: [],
      correctMoves: 0,
      totalMoves: 0,
      needsToShowSequence: true, // Flag to show first sequence
      isShowingSequence: false
    });
  },
  
  levelUp: () => {
    const { gameSeq, level } = get();
    const colors = ['red', 'yellow', 'green', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Calculate score: base points + level bonus + sequence length bonus
    const basePoints = 100;
    const levelBonus = level * 50; // Increases with each level
    const sequenceBonus = gameSeq.length * 25; // Bonus for longer sequences
    const newScore = basePoints + levelBonus + sequenceBonus;
    
    set({
      gameSeq: [...gameSeq, randomColor],
      userSeq: [], // Clear user sequence for new level
      level: level + 1,
      score: newScore,
      currentSequenceIndex: 0,
      needsToShowSequence: true, // Mark that sequence needs to be shown
      isShowingSequence: false
    });
  },
  
  addUserInput: (color) => {
    const { userSeq, totalMoves } = get();
    set({ 
      userSeq: [...userSeq, color],
      totalMoves: totalMoves + 1
    });
  },
  
  checkAnswer: () => {
    const { gameSeq, userSeq, correctMoves } = get();
    const currentIndex = userSeq.length - 1; // Current button pressed (0-based)
    
    // Check if the current input matches the sequence at this position
    if (gameSeq[currentIndex] === userSeq[currentIndex]) {
      set({ correctMoves: correctMoves + 1 });
      
      // Check if user has completed the entire sequence
      if (userSeq.length === gameSeq.length) {
        // Sequence complete! Level up after a delay
        set({ isShowingSequence: true }); // Prevent further input during transition
        setTimeout(() => {
          const state = get();
          if (state.started && !state.gameOver) {
            state.levelUp();
          }
        }, 1500); // Slightly longer delay to show success
      }
      return true;
    } else {
      // Wrong input - game over (like original)
      set({ 
        gameOver: true, 
        started: false,
        gameEndTime: new Date()
      });
      return false;
    }
  },
  
  resetGame: () => {
    set({
      gameSeq: [],
      userSeq: [],
      level: 0,
      score: 0,
      started: false,
      gameOver: false,
      currentSequenceIndex: 0,
      isShowingSequence: false,
      needsToShowSequence: false,
      gameStartTime: null,
      gameEndTime: null,
      correctMoves: 0,
      totalMoves: 0
    });
  },
  
  setShowingSequence: (showing) => {
    set({ isShowingSequence: showing });
  },

  clearNeedsToShowSequence: () => {
    set({ needsToShowSequence: false });
  },
  
  setDifficulty: (difficulty) => {
    set({ difficulty });
  },
  
  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },

  // Reset all game data (for new user login)
  clearAllGameData: () => {
    set({
      gameSeq: [],
      userSeq: [],
      level: 0,
      score: 0,
      started: false,
      gameOver: false,
      gameMode: 'guest',
      guestName: '',
      currentSequenceIndex: 0,
      isShowingSequence: false,
      needsToShowSequence: false,
      gameStartTime: null,
      gameEndTime: null,
      correctMoves: 0,
      totalMoves: 0,
      difficulty: 'normal',
      soundEnabled: true
    });
  }
}));

export default useGameStore;

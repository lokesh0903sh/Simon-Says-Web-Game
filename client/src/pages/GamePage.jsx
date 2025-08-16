import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  HomeIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

import useGameStore from '../store/gameStore';
import useAuthStore from '../store/authStore';
import { gameAPI } from '../utils/apiService';
import { getDifficultySettings, formatScore } from '../utils/helpers';
import GameModeModal from '../components/game/GameModeModal';
import GameOverModal from '../components/game/GameOverModal';

const GamePage = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const {
    gameSeq,
    userSeq,
    level,
    score,
    started,
    gameOver,
    gameMode,
    guestName,
    isShowingSequence,
    needsToShowSequence,
    gameStartTime,
    correctMoves,
    totalMoves,
    difficulty,
    soundEnabled,
    startGame,
    levelUp,
    addUserInput,
    checkAnswer,
    resetGame,
    setShowingSequence,
    clearNeedsToShowSequence,
    setGameMode,
    toggleSound
  } = useGameStore();

  const [showModeModal, setShowModeModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [flashingButton, setFlashingButton] = useState(null);
  const [canInteract, setCanInteract] = useState(false);

  // Ref to prevent duplicate game saves
  const gameSessionSaved = useRef(false);
  const gameSessionId = useRef(null);

  const colors = ['red', 'yellow', 'green', 'purple'];
  const { sequenceDelay, flashDuration } = getDifficultySettings(difficulty);

  // Initialize and reset game state when component mounts
  useEffect(() => {
    // Clear any previous game state when entering GamePage
    resetGame();
    setShowGameOverModal(false);
    setShowModeModal(false);
    gameSessionSaved.current = false; // Reset save flag
    gameSessionId.current = null; // Reset session ID
    
    // Small delay to ensure state is reset, then show mode selection
    const timer = setTimeout(() => {
      if (!started && !gameOver && gameSeq.length === 0) {
        setShowModeModal(true);
      }
    }, 100);
    
    // Cleanup function to reset state when leaving the page
    return () => {
      clearTimeout(timer);
      // Reset all modal states when leaving GamePage
      setShowGameOverModal(false);
      setShowModeModal(false);
      resetGame();
    };
  }, []); // Only run on mount

  // Handle navigation to GamePage (e.g., from dashboard "Play Game" button)
  useEffect(() => {
    // If user navigates to GamePage from another route, ensure fresh start
    ;
    ;
    ;
    
    resetGame();
    setShowGameOverModal(false);
    setShowModeModal(false);
    gameSessionSaved.current = false;
    
    // Small delay then show mode selection if not already started
    setTimeout(() => {
      if (!started && !gameOver && gameSeq.length === 0) {
        ;
        setShowModeModal(true);
      }
    }, 100);
  }, [location.pathname]); // Run when pathname changes

  // Initialize game mode selection (separate effect)
  useEffect(() => {
    if (!started && !gameOver && gameSeq.length === 0 && !showGameOverModal) {
      setShowModeModal(true);
    }
  }, [started, gameOver, gameSeq.length, showGameOverModal]);

  // Add keyboard controls like original game
  useEffect(() => {
    const handleKeyPress = (event) => {
      // If game is over and any key is pressed, restart game
      if (gameOver) {
        setShowGameOverModal(false);
        resetGame();
        setShowModeModal(true);
      }
      
      // If game hasn't started, start it with any key
      if (!started && !showModeModal && gameSeq.length === 0) {
        setShowModeModal(true);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [gameOver, started, showModeModal, gameSeq.length]);

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      setShowGameOverModal(true);
      
      // Show game over notification only once
      if (!gameSessionSaved.current) {
        toast.error(`Game Over! You reached level ${level} with ${formatScore(score)} points!`, {
          duration: 4000,
          icon: '💥'
        });
        saveGameSession();
      }
    }
  }, [gameOver]);

  // Show sequence when it's needed (controlled by needsToShowSequence flag)
  useEffect(() => {
    if (started && needsToShowSequence && gameSeq.length > 0 && !isShowingSequence) {
      showSequence();
    }
  }, [needsToShowSequence, started, gameSeq.length, isShowingSequence]);

  const showSequence = useCallback(async () => {
    if (isShowingSequence) return; // Prevent multiple sequences
    
    // Clear the flag immediately to prevent multiple calls
    clearNeedsToShowSequence();
    
    setShowingSequence(true);
    setCanInteract(false);
    setFlashingButton(null); // Clear any previous flashing
    
    // Show "Watch" message
    toast(`Watch the sequence - Level ${level}`, {
      duration: 1000,
      icon: '👀'
    });
    
    // Delay before starting sequence
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    for (let i = 0; i < gameSeq.length; i++) {
      // Flash the button
      setFlashingButton(gameSeq[i]);
      if (soundEnabled) {
        playButtonSound(gameSeq[i]);
      }
      
      // Duration of the flash
      await new Promise(resolve => setTimeout(resolve, flashDuration));
      setFlashingButton(null);
      
      // Pause between flashes (except after the last one)
      if (i < gameSeq.length - 1) {
        await new Promise(resolve => setTimeout(resolve, sequenceDelay));
      }
    }
    
    // Pause after sequence before allowing user interaction
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Show "Your turn" message
    toast(`Your turn! Repeat the ${gameSeq.length} color${gameSeq.length > 1 ? 's' : ''}`, {
      duration: 2000,
      icon: '🎮'
    });
    
    setShowingSequence(false);
    setCanInteract(true);
  }, [gameSeq, sequenceDelay, flashDuration, soundEnabled, isShowingSequence, level, clearNeedsToShowSequence]);

  const playButtonSound = (color) => {
    // Simple audio feedback using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    const frequencies = {
      red: 220,    // A3
      yellow: 277, // C#4
      green: 330,  // E4
      purple: 415  // G#4
    };
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencies[color];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleButtonClick = (color) => {
    // Strict interaction checks
    if (!canInteract || isShowingSequence || isPaused || flashingButton !== null) {
      return;
    }
    
    // Prevent multiple rapid clicks
    setCanInteract(false);
    
    setFlashingButton(color);
    if (soundEnabled) {
      playButtonSound(color);
    }
    
    // Flash duration
    setTimeout(() => {
      setFlashingButton(null);
      
      // Re-enable interaction after flash
      setTimeout(() => {
        setCanInteract(true);
      }, 100);
    }, flashDuration);
    
    addUserInput(color);
    
    // Check if the sequence will be complete after this input
    const willCompleteSequence = userSeq.length + 1 === gameSeq.length;
    
    const isCorrect = checkAnswer();
    
    if (!isCorrect) {
      // Game Over - useEffect will handle saving and notifications
      ;
    } else if (willCompleteSequence) {
      // User completed the sequence correctly - Level complete!
      toast.success(`Level ${level} Complete! Great memory! 🧠`, {
        duration: 2000,
        icon: '🎉'
      });
    }
  };

  const handleStartGame = (mode, name = '') => {
    // Clear any modals and reset all game state
    setShowGameOverModal(false);
    setShowModeModal(false);
    resetGame();
    gameSessionSaved.current = false; // Reset save flag
    gameSessionId.current = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; // Generate unique session ID
    
    ;
    
    // Set game mode and start
    setGameMode(mode, name);
    
    // Initialize the game properly
    startGame();
    
    // Start first level after a brief delay
    setTimeout(() => {
      levelUp();
    }, 500);
  };

  const handleRestartGame = () => {
    // Clear all modals and state
    setShowGameOverModal(false);
    setShowModeModal(false);
    resetGame();
    gameSessionSaved.current = false; // Reset save flag
    gameSessionId.current = null; // Reset session ID
    
    ;
    
    // Small delay then show mode selection
    setTimeout(() => {
      setShowModeModal(true);
    }, 100);
  };

  const saveGameSession = async () => {
    // Prevent duplicate saves
    if (gameSessionSaved.current) {
      ;
      return;
    }
    
    gameSessionSaved.current = true;
    
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    
    // Determine correct game mode based on authentication
    let actualGameMode = gameMode;
    if (isAuthenticated && user) {
      actualGameMode = 'registered';
      ;
    } else if (!actualGameMode || actualGameMode === null) {
      actualGameMode = 'guest';
      ;
    }
    
    ;
    
    if (actualGameMode === 'guest' && !guestName) {
      ;
      return;
    }
    
    try {
      const gameData = {
        sessionId: gameSessionId.current, // Add unique session identifier
        gameMode: actualGameMode,
        guestName: actualGameMode === 'guest' ? guestName : undefined,
        score,
        level,
        sequence: gameSeq,
        gameStartTime,
        gameEndTime: new Date(),
        correctMoves,
        totalMoves
      };
      
      ;
      
      const response = await gameAPI.saveGameSession(gameData);
      ;
      
      // Handle duplicate session response
      if (response.success === false && response.message === 'Game session already saved') {
        ;
        return;
      }
      
      // Update user stats in auth store if user data is returned
      if (response.user && isAuthenticated) {
        ;
        const { updateUser } = useAuthStore.getState();
        updateUser(response.user);
        toast.success(`Game saved! New high score: ${response.user.gameStats.highestScore}`);
      } else if (gameMode === 'guest') {
        toast.success('Game session saved!');
      }
    } catch (error) {
      ;
      toast.error('Failed to save game session');
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6 sm:mb-8"
        >
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="btn-game btn-secondary text-sm sm:text-base">
            <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            Home
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleSound}
              className="btn-game btn-secondary p-2 sm:p-3"
            >
              {soundEnabled ? (
                <SpeakerWaveIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <SpeakerXMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            
            {started && (
              <button
                onClick={togglePause}
                className="btn-game btn-secondary p-2 sm:p-3"
              >
                {isPaused ? (
                  <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Game Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6 sm:mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Simon Says</h1>
          
          {started ? (
            <>
              <div className="grid grid-cols-3 md:grid-cols-3 gap-3 sm:gap-6 mb-4">
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-game-purple">{level}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Level</p>
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-game-green">{formatScore(score)}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Score</p>
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-game-yellow">
                    {totalMoves > 0 ? Math.round((correctMoves / totalMoves) * 100) : 0}%
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">Accuracy</p>
                </div>
              </div>
              
              {/* Sequence Progress */}
              {canInteract && !isShowingSequence && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">
                    Progress: {userSeq.length} / {gameSeq.length}
                  </p>
                  <div className="flex justify-center space-x-2">
                    {gameSeq.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index < userSeq.length 
                            ? 'bg-game-green' 
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <p className="text-xl text-gray-400 mb-4">
                {isShowingSequence ? 'Watch the sequence...' : 
                 canInteract ? 'Repeat the sequence!' :
                 'Get ready to play!'}
              </p>
              {gameMode && (
                <p className="text-sm text-gray-500">
                  Playing as: {gameMode === 'guest' ? guestName : user?.username}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8 px-4"
        >
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 md:p-8 bg-dark-card border border-dark-border rounded-2xl sm:rounded-3xl">
              {colors.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => handleButtonClick(color)}
                  disabled={!canInteract || isShowingSequence || isPaused}
                  className={`
                    game-button game-button-${color} 
                    ${flashingButton === color ? 'flash' : ''}
                    ${!canInteract || isShowingSequence || isPaused ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  whileHover={{ scale: canInteract && !isShowingSequence ? 1.05 : 1 }}
                  whileTap={{ scale: canInteract && !isShowingSequence ? 0.95 : 1 }}
                />
              ))}
            </div>
            
            {/* Pause Overlay */}
            <AnimatePresence>
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-3xl"
                >
                  <div className="text-center">
                    <PauseIcon className="h-16 w-16 text-white mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white">Game Paused</p>
                    <button
                      onClick={togglePause}
                      className="btn-game btn-primary mt-4"
                    >
                      Resume
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Game Instructions */}
        {!started && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="w-8 h-8 bg-game-purple rounded-full flex items-center justify-center text-white font-bold mb-2">1</div>
                <p className="text-gray-400">Watch the sequence of colored buttons</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-game-green rounded-full flex items-center justify-center text-white font-bold mb-2">2</div>
                <p className="text-gray-400">Repeat the sequence by clicking the buttons</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-game-yellow rounded-full flex items-center justify-center text-white font-bold mb-2">3</div>
                <p className="text-gray-400">Each level adds one more button to the sequence</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Modals */}
        <GameModeModal
          isOpen={showModeModal}
          onClose={() => setShowModeModal(false)}
          onStartGame={handleStartGame}
        />
        
        <GameOverModal
          isOpen={showGameOverModal}
          onClose={() => setShowGameOverModal(false)}
          score={score}
          level={level}
          accuracy={totalMoves > 0 ? Math.round((correctMoves / totalMoves) * 100) : 0}
          sequenceLength={gameSeq.length}
          onPlayAgain={handleRestartGame}
        />
      </div>
    </div>
  );
};

export default GamePage;

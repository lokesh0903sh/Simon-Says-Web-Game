import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  UserPlusIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';

const GameModeModal = ({ isOpen, onClose, onStartGame }) => {
  const [guestName, setGuestName] = useState('');
  const [selectedMode, setSelectedMode] = useState(null);
  const { isAuthenticated, user } = useAuthStore();

  const handleStartGame = () => {
    if (selectedMode === 'guest' && (!guestName || guestName.trim().length < 2)) {
      return;
    }
    onStartGame(selectedMode, guestName.trim());
    setGuestName('');
    setSelectedMode(null);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    if (mode === 'registered') {
      handleStartGame();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal-content max-w-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Choose Game Mode</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModeSelect('registered')}
                  className="w-full p-6 bg-dark-card border-2 border-game-purple rounded-xl hover:bg-opacity-80 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-game-purple rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        Play as {user?.username}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Your progress will be saved and scores will count towards leaderboards
                      </p>
                    </div>
                  </div>
                </motion.button>
              ) : (
                <>
                  <div className="p-4 bg-dark-border rounded-xl text-center">
                    <p className="text-gray-400 mb-4">
                      <UserIcon className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                      Sign in to save your progress and compete on leaderboards
                    </p>
                    <div className="space-x-4">
                      <a href="/login" className="btn-game btn-primary">
                        Login
                      </a>
                      <a href="/register" className="btn-game btn-secondary">
                        Register
                      </a>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="w-full p-6 bg-dark-card border-2 border-gray-600 rounded-xl hover:border-game-green transition-all"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-game-green rounded-full flex items-center justify-center">
                        <UserPlusIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1">
                          Play as Guest
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Quick play without saving progress
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="input-field"
                        maxLength={20}
                      />
                      <button
                        onClick={() => handleModeSelect('guest')}
                        disabled={!guestName || guestName.trim().length < 2}
                        className="w-full btn-game btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Start Game
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-dark-border rounded-xl">
              <h4 className="text-sm font-semibold text-white mb-2">Game Rules:</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Watch the sequence of colors carefully</li>
                <li>• Repeat the sequence by clicking the buttons</li>
                <li>• Each level adds one more color to the sequence</li>
                <li>• One wrong move ends the game!</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameModeModal;

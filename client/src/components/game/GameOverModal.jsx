import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  TrophyIcon, 
  ArrowPathIcon, 
  HomeIcon,
  ShareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { formatScore, getRankSuffix } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';

const GameOverModal = ({ isOpen, onClose, score, level, accuracy, onPlayAgain, sequenceLength = 0 }) => {
  const { isAuthenticated, user } = useAuthStore();
  const isNewHighScore = isAuthenticated && user?.gameStats?.highestScore < score;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Simon Says Game',
        text: `I just scored ${formatScore(score)} points and reached level ${level} in Simon Says! Can you beat my score?`,
        url: window.location.origin
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(
        `I just scored ${formatScore(score)} points and reached level ${level} in Simon Says! Can you beat my score? ${window.location.origin}`
      );
      toast.success('Score copied to clipboard!');
    }
  };

  const getPerformanceMessage = () => {
    if (level === 1) return "Just getting started! Try again!";
    if (level <= 3) return "Not bad for a beginner!";
    if (level <= 5) return "Good job! You're getting the hang of it!";
    if (level <= 8) return "Impressive! Your memory is sharp!";
    if (level <= 12) return "Excellent performance!";
    if (level <= 16) return "Outstanding! You're a memory master!";
    return "Legendary performance! You're unstoppable!";
  };

  const getScoreColor = () => {
    if (level <= 3) return "text-gray-400";
    if (level <= 5) return "text-game-yellow";
    if (level <= 8) return "text-game-green";
    if (level <= 12) return "text-game-purple";
    return "text-game-red";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal-content w-full max-w-sm sm:max-w-md lg:max-w-lg mx-4 sm:mx-0 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              {isNewHighScore ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-3 sm:mb-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-game-yellow to-game-red rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <TrophyIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-game-yellow mb-2">
                    New High Score!
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400">Congratulations! You beat your personal best!</p>
                </motion.div>
              ) : (
                <div className="mb-3 sm:mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-game-red to-game-purple rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <ChartBarIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Game Over</h2>
                  <p className="text-sm sm:text-base text-gray-400">{getPerformanceMessage()}</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
              <div className="text-center p-2 sm:p-3 lg:p-4 bg-dark-border rounded-lg sm:rounded-xl">
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${getScoreColor()}`}>
                  {formatScore(score)}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">Final Score</p>
              </div>
              
              <div className="text-center p-2 sm:p-3 lg:p-4 bg-dark-border rounded-lg sm:rounded-xl">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-game-purple">{level}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Level Reached</p>
              </div>
              
              <div className="text-center p-2 sm:p-3 lg:p-4 bg-dark-border rounded-lg sm:rounded-xl">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-game-green">{sequenceLength}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Sequence Length</p>
              </div>
            </div>
            
            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
              <div className="text-center p-2 sm:p-3 bg-dark-border rounded-lg sm:rounded-xl">
                <p className="text-lg sm:text-xl font-bold text-game-yellow">{accuracy}%</p>
                <p className="text-gray-400 text-xs">Accuracy</p>
              </div>
              
              <div className="text-center p-2 sm:p-3 bg-dark-border rounded-lg sm:rounded-xl">
                <p className="text-lg sm:text-xl font-bold text-game-red">
                  {isAuthenticated ? formatScore(user?.gameStats?.highestScore || 0) : 'N/A'}
                </p>
                <p className="text-gray-400 text-xs">Your Best</p>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-dark-border rounded-lg sm:rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-xs sm:text-sm">Performance Level</span>
                <span className={`text-xs sm:text-sm font-semibold ${getScoreColor()}`}>
                  {level <= 3 ? 'Beginner' :
                   level <= 5 ? 'Novice' :
                   level <= 8 ? 'Skilled' :
                   level <= 12 ? 'Expert' :
                   level <= 16 ? 'Master' : 'Legendary'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-game-purple to-game-green h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((level / 20) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={onPlayAgain}
                className="w-full btn-game btn-primary text-sm sm:text-base py-2 sm:py-3"
              >
                <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Play Again
              </button>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={handleShare}
                  className="btn-game btn-secondary text-xs sm:text-sm py-2 sm:py-3 flex items-center justify-center"
                >
                  <ShareIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                  <span className="sm:hidden">Share</span>
                </button>
                
                <Link
                  to="/leaderboard"
                  className="btn-game btn-secondary text-xs sm:text-sm py-2 sm:py-3 flex items-center justify-center"
                >
                  <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Leaderboard</span>
                  <span className="sm:hidden">Board</span>
                </Link>
              </div>
              
              <Link
                to={isAuthenticated ? "/dashboard" : "/"}
                className="w-full btn-game btn-secondary text-sm sm:text-base py-2 sm:py-3 flex items-center justify-center"
              >
                <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Back to Home
              </Link>
            </div>

            {/* Personal Best Comparison */}
            {isAuthenticated && user?.gameStats?.highestScore > 0 && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-dark-border rounded-lg sm:rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs sm:text-sm">Personal Best:</span>
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {formatScore(user.gameStats.highestScore)}
                  </span>
                </div>
                {!isNewHighScore && score < user.gameStats.highestScore && (
                  <div className="mt-2">
                    <span className="text-gray-500 text-xs">
                      You need {formatScore(user.gameStats.highestScore - score)} more points to beat your record!
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Motivational Message */}
            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                {level < 5 ? "Practice makes perfect! Keep playing to improve your memory." :
                 level < 10 ? "You're doing great! Challenge your friends to beat your score." :
                 "Amazing skills! You're among the top players!"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOverModal;

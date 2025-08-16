import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  PlayIcon, 
  TrophyIcon, 
  UserPlusIcon, 
  UserIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="relative z-20 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <SparklesIcon className="h-6 w-6 sm:h-8 sm:w-8 text-game-purple" />
            <h1 className="text-lg sm:text-2xl font-bold text-white">Simon Says</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-2 sm:space-x-4"
          >
            <Link
              to="/login"
              className="btn-game btn-secondary"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Login
            </Link>
            <Link
              to="/register"
              className="btn-game btn-primary"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Register
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-game-purple via-game-green to-game-yellow bg-clip-text text-transparent">
                Simon Says
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-300">
                Memory Challenge
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Test your memory skills in this modern twist on the classic Simon Says game. 
              Follow the sequence, beat your high score, and compete with players worldwide!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <Link
              to="/game"
              className="group relative p-8 bg-dark-card border border-dark-border rounded-2xl hover:shadow-game transition-all duration-300 transform hover:scale-105"
            >
              <PlayIcon className="h-12 w-12 text-game-purple mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Play as Guest</h3>
              <p className="text-gray-400">Jump right into the game without creating an account</p>
            </Link>

            <Link
              to="/register"
              className="group relative p-8 bg-dark-card border border-dark-border rounded-2xl hover:shadow-game transition-all duration-300 transform hover:scale-105"
            >
              <UserPlusIcon className="h-12 w-12 text-game-green mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Create Account</h3>
              <p className="text-gray-400">Save your progress and compete on leaderboards</p>
            </Link>

            <Link
              to="/leaderboard"
              className="group relative p-8 bg-dark-card border border-dark-border rounded-2xl hover:shadow-game transition-all duration-300 transform hover:scale-105"
            >
              <TrophyIcon className="h-12 w-12 text-game-yellow mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">Leaderboard</h3>
              <p className="text-gray-400">See how you stack up against other players</p>
            </Link>
          </motion.div>

          {/* Game Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="inline-grid grid-cols-2 gap-4 p-8 bg-dark-card border border-dark-border rounded-3xl">
              <motion.div
                className="game-button game-button-red"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.div
                className="game-button game-button-yellow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.div
                className="game-button game-button-green"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.div
                className="game-button game-button-purple"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </div>
            
            <div className="absolute -inset-4 bg-gradient-to-r from-game-purple/20 to-game-green/20 rounded-3xl blur-xl -z-10"></div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 p-6 text-center text-gray-500">
        <p>&copy; 2024 Simon Says Game. Test your memory, challenge your mind.</p>
      </footer>
    </div>
  );
};

export default HomePage;

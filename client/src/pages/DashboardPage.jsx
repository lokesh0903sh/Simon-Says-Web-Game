import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlayIcon, 
  TrophyIcon, 
  UserIcon, 
  CogIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

import useAuthStore from '../store/authStore';
import { formatScore, formatDate } from '../utils/helpers';

const DashboardPage = () => {
  const { user, clearAuth, refreshUser } = useAuthStore();
  const navigate = useNavigate();

  // Debug logging to see what's in the user object
  console.log('Dashboard - Full user object:', user);
  console.log('Dashboard - user.userId:', user?.userId);
  console.log('Dashboard - user.createdAt:', user?.createdAt);

  // Refresh user data when dashboard loads
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const dashboardCards = [
    {
      title: 'Play Game',
      description: 'Start a new game session',
      icon: PlayIcon,
      link: '/game',
      color: 'from-game-purple to-game-green',
      action: 'Play Now'
    },
    {
      title: 'Leaderboard',
      description: 'View global rankings',
      icon: TrophyIcon,
      link: '/leaderboard',
      color: 'from-game-yellow to-game-red',
      action: 'View Rankings'
    },
    {
      title: 'Friends',
      description: 'Connect with friends',
      icon: UsersIcon,
      link: '/friends',
      color: 'from-purple-500 to-pink-600',
      action: 'View Friends'
    },
    {
      title: 'Settings',
      description: 'Game preferences',
      icon: CogIcon,    
      link: '/settings',
      color: 'from-game-red to-game-yellow',
      action: 'Configure'
    }
  ];

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8"
        >
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-sm sm:text-base text-gray-400">Ready for your next challenge?</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="btn-game btn-secondary text-sm sm:text-base"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            Logout
          </button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8"
        >
          <div className="card text-center">
            <ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-game-purple mx-auto mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl font-bold text-white">
              {formatScore(user?.gameStats?.highestScore || 0)}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">High Score</p>
          </div>
          
          <div className="card text-center">
            <PlayIcon className="h-6 w-6 sm:h-8 sm:w-8 text-game-green mx-auto mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl font-bold text-white">
              {user?.gameStats?.totalGamesPlayed || 0}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">Games Played</p>
          </div>
          
          <div className="card text-center">
            <TrophyIcon className="h-6 w-6 sm:h-8 sm:w-8 text-game-yellow mx-auto mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl font-bold text-white">
              {formatScore(user?.gameStats?.averageScore || 0)}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">Average Score</p>
          </div>
          
          <div className="card text-center">
            <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-game-red mx-auto mb-2 sm:mb-3" />
            <p className="text-lg sm:text-2xl font-bold text-white">
              {user?.gameStats?.totalScore || 0}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">Total Score</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={index}
                to={card.link}
                className="group relative overflow-hidden card hover:shadow-game transition-all duration-300 transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative z-10">
                  <IconComponent className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2 text-center">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 text-center mb-4">
                    {card.description}
                  </p>
                  <div className={`w-full btn-game bg-gradient-to-r ${card.color} text-center`}>
                    {card.action}
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* Recent Activity / Continue Game */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Quick Play */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <PlayIcon className="h-6 w-6 mr-2 text-game-purple" />
              Quick Play
            </h2>
            <p className="text-gray-400 mb-6">
              Jump right into a new game and test your memory skills!
            </p>
            <div className="space-y-3">
              <Link
                to="/game"
                className="w-full btn-game btn-primary block text-center"
              >
                Start New Game
              </Link>
              <Link
                to="/game?continue=true"
                className="w-full btn-game btn-secondary block text-center"
              >
                <ArrowPathIcon className="h-5 w-5 inline mr-2" />
                Continue Last Session
              </Link>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <UserIcon className="h-6 w-6 mr-2 text-game-green" />
              Profile Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Username:</span>
                <span className="text-white">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User ID:</span>
                <span className="text-white font-mono">{user?.userId || 'Not assigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Member since:</span>
                <span className="text-white">
                  {formatDate(user?.createdAt)}
                </span>
              </div>
            </div>
            <Link
              to="/profile"
              className="w-full btn-game btn-secondary mt-4 block text-center"
            >
              Edit Profile
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;

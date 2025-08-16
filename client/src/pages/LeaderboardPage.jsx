import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrophyIcon, 
  HomeIcon, 
  UsersIcon,
  UserIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChevronDownIcon,
  UserGroupIcon,
  ArrowPathIcon,
  ExternalLinkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

import { leaderboardAPI } from '../utils/apiService';
import { formatScore, getRankSuffix } from '../utils/helpers';
import useAuthStore from '../store/authStore';

const LeaderboardPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('global');
  const [activePeriod, setActivePeriod] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRank, setUserRank] = useState(null);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const periods = [
    { key: 'all', label: 'All Time', icon: '🏆' },
    { key: 'monthly', label: 'This Month', icon: '📅' },
    { key: 'weekly', label: 'This Week', icon: '📊' },
    { key: 'daily', label: 'Today', icon: '⭐' }
  ];

  const tabs = [
    { key: 'global', label: 'Global', icon: GlobeAltIcon },
    ...(isAuthenticated ? [{ key: 'friends', label: 'Friends', icon: UserGroupIcon }] : [])
  ];

  useEffect(() => {
    // Clear cache and fetch fresh data when user changes
    setLeaderboardData([]);
    setUserRank(null);
    
    fetchLeaderboardData(false); // Initial load
    if (isAuthenticated && activeTab === 'global') {
      fetchUserRank();
    }

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchLeaderboardData(true); // Refresh
      if (isAuthenticated && activeTab === 'global') {
        fetchUserRank();
      }
    }, 30000); // 30 seconds

    // Cleanup interval on unmount or dependency change
    return () => clearInterval(intervalId);
  }, [activeTab, activePeriod, isAuthenticated, user?._id]); // Added user._id dependency

  const fetchLeaderboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      let data;
      if (activeTab === 'global') {
        data = await leaderboardAPI.getGlobalLeaderboard(activePeriod);
      } else {
        data = await leaderboardAPI.getFriendsLeaderboard(activePeriod);
      }
      setLeaderboardData(data.leaderboard || []);
      
      if (isRefresh) {
        toast.success('Leaderboard updated!', { duration: 2000 });
      }
    } catch (error) {
      toast.error('Failed to load leaderboard');
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const rankData = await leaderboardAPI.getUserRank();
      setUserRank(rankData);
    } catch (error) {
      console.error('Error fetching user rank:', error);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-gray-400';
    }
  };

  const getScoreColor = (rank) => {
    if (rank <= 3) return 'text-game-yellow';
    if (rank <= 10) return 'text-game-green';
    return 'text-white';
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0"
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <TrophyIcon className="h-6 w-6 sm:h-8 sm:w-8 text-game-yellow" />
            <h1 className="text-2xl sm:text-4xl font-bold text-white">Leaderboard</h1>
            {refreshing && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-game-purple border-t-transparent rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">Updating...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => fetchLeaderboardData(true)}
              disabled={refreshing}
              className="btn-game btn-secondary p-2 text-xs sm:text-sm"
              title="Refresh Leaderboard"
            >
              <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="btn-game btn-secondary">
              <HomeIcon className="h-5 w-5 mr-2" />
              Home
            </Link>
          </div>
        </motion.div>

        {/* User Rank Card (if authenticated) */}
        {isAuthenticated && userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-4 sm:mb-6 bg-gradient-to-r from-game-purple/10 to-game-green/10 border-game-purple"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Your Ranking
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-0">
                <p className="text-xl sm:text-2xl font-bold text-game-purple">
                  {getRankIcon(userRank.rank)}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {userRank.rank}{getRankSuffix(userRank.rank)} place
                </p>
              </div>
              <div className="text-center p-3 sm:p-0">
                <p className="text-xl sm:text-2xl font-bold text-game-green">
                  {formatScore(userRank?.highestScore || 0)}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">High Score</p>
              </div>
              <div className="text-center p-3 sm:p-0">
                <p className="text-xl sm:text-2xl font-bold text-game-yellow">
                  {userRank.totalUsers}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">Total Players</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0"
        >
          {/* Tabs */}
          <div className="flex space-x-1 sm:space-x-2 p-1 bg-dark-card rounded-lg border border-dark-border w-full sm:w-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center space-x-1 sm:space-x-2 flex-1 sm:flex-none justify-center ${
                    activeTab === tab.key
                      ? 'bg-game-purple text-white shadow-game'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Period Selector */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="btn-game btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto text-xs sm:text-sm"
            >
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="truncate">{periods.find(p => p.key === activePeriod)?.label}</span>
              <ChevronDownIcon className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showPeriodDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-full sm:w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl z-10"
                >
                  {periods.map((period) => (
                    <button
                      key={period.key}
                      onClick={() => {
                        setActivePeriod(period.key);
                        setShowPeriodDropdown(false);
                      }}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-dark-border transition-colors flex items-center space-x-2 sm:space-x-3 text-sm ${
                        activePeriod === period.key ? 'text-game-purple' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-base sm:text-lg">{period.icon}</span>
                      <span>{period.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-game-purple mx-auto mb-4"></div>
              <p className="text-gray-400">Loading leaderboard...</p>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-12">
              <TrophyIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Data Available</h3>
              <p className="text-gray-500">
                {activeTab === 'friends' 
                  ? "Add friends to see their scores here!" 
                  : "Be the first to set a high score!"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {leaderboardData.map((entry, index) => (
                <motion.div
                  key={entry._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`leaderboard-entry p-3 sm:p-4 rounded-xl border ${
                    entry.isCurrentUser 
                      ? 'border-game-purple bg-game-purple/10' 
                      : 'border-dark-border bg-dark-border/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      {/* Rank */}
                      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-base ${
                        entry.rank <= 3 
                          ? 'bg-gradient-to-br from-game-yellow to-game-red text-white' 
                          : 'bg-dark-card text-gray-400'
                      }`}>
                        {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                      </div>

                      {/* User Info */}
                      <div className="min-w-0 flex-1">
                        {!entry.isCurrentUser ? (
                          <Link 
                            to={`/user/${entry._id}`}
                            className={`font-semibold text-sm sm:text-base truncate hover:text-game-blue transition-colors flex items-center gap-1 ${entry.isCurrentUser ? 'text-game-purple' : 'text-white'}`}
                          >
                            {entry.firstName || entry.lastName 
                              ? `${entry.firstName || ''} ${entry.lastName || ''}`.trim()
                              : entry.username
                            }
                            <ExternalLinkIcon className="w-3 h-3 opacity-60" />
                          </Link>
                        ) : (
                          <h3 className={`font-semibold text-sm sm:text-base truncate ${entry.isCurrentUser ? 'text-game-purple' : 'text-white'}`}>
                            {entry.firstName || entry.lastName 
                              ? `${entry.firstName || ''} ${entry.lastName || ''}`.trim()
                              : entry.username
                            }
                            {entry.isCurrentUser && (
                              <span className="text-xs ml-2 bg-game-purple text-white px-2 py-1 rounded-full hidden sm:inline">
                                You
                              </span>
                            )}
                          </h3>
                        )}
                        <p className="text-xs sm:text-sm text-gray-400 truncate">@{entry.username}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right space-y-1 flex-shrink-0">
                      <p className={`text-base sm:text-lg font-bold ${getScoreColor(entry.rank)}`}>
                        {formatScore(entry?.highestScore || 0)}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:space-x-4 text-xs text-gray-400">
                        <span>{entry?.totalGames || 0} games</span>
                        <span className="hidden sm:inline">{entry?.averageAccuracy || 0}% avg</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mt-4 sm:mt-6 text-center bg-gradient-to-r from-game-purple/20 to-game-green/20 border-game-purple"
          >
            <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 text-game-purple mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Join the Competition!</h3>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Create an account to save your scores and compete with players worldwide.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
              <Link to="/register" className="btn-game btn-primary">
                Sign Up
              </Link>
              <Link to="/login" className="btn-game btn-secondary">
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;

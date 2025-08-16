import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import useFriendsStore from '../../store/friendsStore';
import useAuthStore from '../../store/authStore';

const FriendsLeaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const { user } = useAuthStore();
  const { friendsLeaderboard, loading, fetchFriendsLeaderboard } = useFriendsStore();

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];

  useEffect(() => {
    if (user) {
      fetchFriendsLeaderboard(selectedPeriod);
    }
  }, [selectedPeriod, user, fetchFriendsLeaderboard]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-500';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Friends Leaderboard</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm sm:text-base w-full sm:w-auto"
        >
          {periods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      {/* Leaderboard */}
      {!Array.isArray(friendsLeaderboard) || friendsLeaderboard.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No scores yet</h3>
          <p className="text-gray-500">
            You and your friends haven't played any games in this period.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {friendsLeaderboard.map((entry, index) => (
            <div
              key={entry._id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg transition-colors space-y-3 sm:space-y-0 ${
                entry.isCurrentUser
                  ? 'bg-blue-600 bg-opacity-20 border border-blue-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {/* Rank and User Info */}
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getRankColor(entry.rank)} rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0`}>
                  {entry.username.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <h3 className={`font-semibold text-sm sm:text-base truncate ${entry.isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                      {entry.username}
                    </h3>
                    {entry.isCurrentUser && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">ID: {entry.userId}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between sm:justify-end sm:space-x-4 lg:space-x-6 text-xs sm:text-sm w-full sm:w-auto">
                <div className="text-center">
                  <div className={`font-bold text-base sm:text-lg ${entry.isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                    {entry.highestScore || 0}
                  </div>
                  <div className="text-gray-400 text-xs">Best</div>
                </div>
                
                <div className="text-center">
                  <div className={`font-bold text-sm sm:text-base ${entry.isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                    {entry.totalGames || 0}
                  </div>
                  <div className="text-gray-400 text-xs">Games</div>
                </div>
                
                <div className="text-center">
                  <div className={`font-bold text-sm sm:text-base ${entry.isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                    {entry.averageScore || 0}
                  </div>
                  <div className="text-gray-400 text-xs">Avg</div>
                </div>

                <div className="text-lg sm:text-2xl font-bold text-gray-500">
                  #{entry.rank}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-700 rounded-lg p-4">
        <p className="text-gray-300 text-sm">
          This leaderboard shows scores from you and your friends only. 
          Add more friends to make the competition more exciting!
        </p>
      </div>
    </div>
  );
};

export default FriendsLeaderboard;

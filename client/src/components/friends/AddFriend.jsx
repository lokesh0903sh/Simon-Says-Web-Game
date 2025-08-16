import React, { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import useFriendsStore from '../../store/friendsStore';
import api from '../../utils/api';

const AddFriend = () => {
  const [userId, setUserId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const { loading, sendFriendRequest } = useFriendsStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setSearchError('Please enter a User ID');
      return;
    }

    setSearching(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const response = await api.get(`/friends/user/${userId}`);
      
      if (response.data) {
        setSearchResult(response.data.user);
      } else {
        setSearchError('User not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error.response?.data?.message || 'Failed to search for user');
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult) return;

    const result = await sendFriendRequest(searchResult.userId);
    if (result.success) {
      setSearchResult(null);
      setUserId('');
      // Optional: Show success message
      alert('Friend request sent successfully!');
    } else {
      setSearchError(result.error || 'Failed to send friend request');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-4">Add Friend</h2>
        <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
          Enter a friend's User ID to send them a friend request.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-300 mb-2">
            User ID
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter 8-character User ID (e.g., ABC12345)"
              className="flex-1 bg-gray-700 text-white px-3 sm:px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              maxLength={8}
            />
            <button
              type="submit"
              disabled={searching || loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
            >
              {searching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Error Display */}
      {searchError && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
          {searchError}
        </div>
      )}

      {/* Search Result */}
      {searchResult && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">User Found</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {searchResult.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">{searchResult.username}</h4>
                <p className="text-gray-400">ID: {searchResult.userId}</p>
                {searchResult.gameStats && (
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-400">
                      Best Score: {searchResult.gameStats.highestScore}
                    </span>
                    <span className="text-sm text-gray-400">
                      Total Games: {searchResult.gameStats.totalGames}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              Send Request
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-3">How to find User IDs</h3>
        <ul className="text-gray-300 space-y-2 text-sm">
          <li>• Each user has a unique 8-character User ID (like ABC12345)</li>
          <li>• You can find your User ID in your profile or settings</li>
          <li>• Ask your friends to share their User ID with you</li>
          <li>• User IDs are case-sensitive</li>
        </ul>
      </div>
    </div>
  );
};

export default AddFriend;

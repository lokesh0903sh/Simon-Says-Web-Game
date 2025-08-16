import React from 'react';
import { Link } from 'react-router-dom';
import { UserX, MessageCircle, Trophy, Users, ExternalLink } from 'lucide-react';
import useFriendsStore from '../../store/friendsStore';

const FriendsList = () => {
  const { friends, loading, removeFriend } = useFriendsStore();

  const handleRemoveFriend = async (friendshipId, friendName) => {
    if (window.confirm(`Are you sure you want to remove ${friendName} from your friends?`)) {
      await removeFriend(friendshipId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle case where friends is not an array or is empty
  if (!Array.isArray(friends) || friends.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No friends yet</h3>
          <p>Start building your friend network by adding friends!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
        Your Friends ({Array.isArray(friends) ? friends.length : 0})
      </h2>
      
      <div className="grid gap-3 sm:gap-4">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="bg-gray-700 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-600 transition-colors space-y-3 sm:space-y-0"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                {friend.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/user/${friend._id}`}
                  className="text-white font-semibold text-sm sm:text-base truncate hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  {friend.username}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </Link>
                <p className="text-gray-400 text-xs sm:text-sm truncate">ID: {friend.userId}</p>
                {friend.gameStats && (
                  <div className="flex items-center gap-3 sm:gap-4 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Best: {friend.gameStats.highestScore}
                    </span>
                    <span className="text-xs text-gray-400">
                      Games: {friend.gameStats.totalGames}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 sm:space-x-2">
              <Link
                to={`/user/${friend._id}`}
                className="p-2 text-gray-400 hover:text-green-400 rounded-lg hover:bg-gray-600 transition-colors"
                title="View Profile"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <button
                className="p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-gray-600 transition-colors"
                title="Send Message (Coming Soon)"
                disabled
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => handleRemoveFriend(friend._id, friend.username)}
                className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-600 transition-colors"
                title="Remove Friend"
              >
                <UserX className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;

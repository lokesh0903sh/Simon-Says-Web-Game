import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import useFriendsStore from '../../store/friendsStore';

const PendingRequests = () => {
  const {
    pendingRequests,
    loading,
    acceptFriendRequest,
    declineFriendRequest
  } = useFriendsStore();

  const handleAccept = async (requestId, username) => {
    const result = await acceptFriendRequest(requestId);
    if (result.success) {
      // Optional: Show success toast
      console.log(`Accepted friend request from ${username}`);
    }
  };

  const handleDecline = async (requestId, username) => {
    if (window.confirm(`Are you sure you want to decline the friend request from ${username}?`)) {
      const result = await declineFriendRequest(requestId);
      if (result.success) {
        console.log(`Declined friend request from ${username}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No pending requests</h3>
          <p>You don't have any pending friend requests right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
        Pending Friend Requests ({Array.isArray(pendingRequests) ? pendingRequests.length : 0})
      </h2>
      
      <div className="grid gap-3 sm:gap-4">
        {pendingRequests.map((request) => (
          <div
            key={request._id}
            className="bg-gray-700 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-600 transition-colors space-y-3 sm:space-y-0"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                {request.requester.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-base truncate">{request.requester.username}</h3>
                <p className="text-gray-400 text-xs sm:text-sm truncate">ID: {request.requester.userId}</p>
                <p className="text-gray-400 text-xs">
                  Sent {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 sm:space-x-2">
              <button
                onClick={() => handleAccept(request._id, request.requester.username)}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                disabled={loading}
              >
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Accept</span>
                <span className="sm:hidden">✓</span>
              </button>
              <button
                onClick={() => handleDecline(request._id, request.requester.username)}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                disabled={loading}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Decline</span>
                <span className="sm:hidden">✗</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;

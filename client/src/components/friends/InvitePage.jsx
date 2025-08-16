import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserPlus, User, ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useFriendsStore from '../../store/friendsStore';
import { friendsAPI } from '../../services/friendsAPI';

const InvitePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sendFriendRequest, loading } = useFriendsStore();

  const [inviter, setInviter] = useState(null);
  const [loadingInviter, setLoadingInviter] = useState(true);
  const [error, setError] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchInviter = async () => {
      try {
        setLoadingInviter(true);
        const userData = await friendsAPI.getUserByUserId(userId);
        setInviter(userData.user);
      } catch (error) {
        setError(error.response?.data?.message || 'User not found');
      } finally {
        setLoadingInviter(false);
      }
    };

    if (userId) {
      fetchInviter();
    }
  }, [userId]);

  const handleSendFriendRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!inviter) return;

    const result = await sendFriendRequest(inviter.userId);
    if (result.success) {
      setRequestSent(true);
    } else {
      setError(result.error || 'Failed to send friend request');
    }
  };

  const handleGoToFriends = () => {
    navigate('/friends');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (loadingInviter) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="text-red-400 mb-4">
              <User className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Invalid Invitation</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (requestSent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="text-green-400 mb-4">
              <UserPlus className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Request Sent!</h1>
            <p className="text-gray-400 mb-6">
              Your friend request has been sent to {inviter?.username}. 
              They'll be notified and can accept or decline your request.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleGoToFriends}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Go to Friends
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg p-4 sm:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Invitation Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Friend Invitation</h1>
            <p className="text-gray-400 text-sm sm:text-base">You've been invited to connect!</p>
          </div>

          {/* Inviter Info */}
          {inviter && (
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {inviter.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{inviter.username}</h3>
                  <p className="text-gray-400">ID: {inviter.userId}</p>
                </div>
              </div>

              {inviter.gameStats && (
                <div className="border-t border-gray-600 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-white font-bold text-lg">
                        {inviter.gameStats.highestScore}
                      </div>
                      <div className="text-gray-400 text-sm">Best Score</div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">
                        {inviter.gameStats.totalGames}
                      </div>
                      <div className="text-gray-400 text-sm">Games Played</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {user ? (
              <>
                <button
                  onClick={handleSendFriendRequest}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus className="w-5 h-5" />
                  Send Friend Request
                </button>
                <button
                  onClick={handleGoToFriends}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View My Friends
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-center mb-4">
                  You need to be logged in to send friend requests
                </p>
                <button
                  onClick={handleGoToLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Login to Add Friend
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitePage;

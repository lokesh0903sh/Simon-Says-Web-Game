import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Clock, Share2, Trophy } from 'lucide-react';
import useFriendsStore from '../../store/friendsStore';
import useAuthStore from '../../store/authStore';
import FriendsList from './FriendsList';
import PendingRequests from './PendingRequests';
import AddFriend from './AddFriend';
import FriendsLeaderboard from './FriendsLeaderboard';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [showShareModal, setShowShareModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const { user } = useAuthStore();
  const {
    friends,
    pendingRequests,
    loading,
    error,
    fetchFriends,
    fetchPendingRequests,
    fetchSentRequests,
    generateInvitationLink,
    clearError
  } = useFriendsStore();

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchPendingRequests();
      fetchSentRequests();
    }
  }, [user]);

  const handleGenerateInviteLink = async () => {
    const result = await generateInvitationLink();
    if (result.success) {
      const fullLink = `${window.location.origin}/invite/${result.userId}`;
      setInviteLink(fullLink);
      setShowShareModal(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users, count: Array.isArray(friends) ? friends.length : 0 },
    { id: 'requests', label: 'Requests', icon: Clock, count: Array.isArray(pendingRequests) ? pendingRequests.length : 0 },
    { id: 'add', label: 'Add Friend', icon: UserPlus },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to view friends</h2>
          <p className="text-gray-400">You need to be logged in to access the friends feature.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-4 px-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Friends</h1>
          </div>
          <button
            onClick={handleGenerateInviteLink}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto text-sm sm:text-base"
            disabled={loading}
          >
            <Share2 className="w-4 h-4" />
            <span className="sm:inline">Share Invite Link</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-3 sm:px-4 py-3 rounded-lg mb-4 sm:mb-6 flex justify-between items-start">
            <span className="text-sm sm:text-base">{error}</span>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-100 ml-2 sm:ml-4 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 mb-4 sm:mb-6 bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-md font-medium transition-colors text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] leading-none">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-6 min-h-[400px]">
          {activeTab === 'friends' && <FriendsList />}
          {activeTab === 'requests' && <PendingRequests />}
          {activeTab === 'add' && <AddFriend />}
          {activeTab === 'leaderboard' && <FriendsLeaderboard />}
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Share Invitation Link</h3>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                Share this link with your friends so they can add you!
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    copySuccess
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  UserIcon, 
  HomeIcon,
  ArrowLeftIcon,
  TrophyIcon,
  CalendarIcon,
  UserPlusIcon,
  UserMinusIcon,
  ClockIcon,
  ChartBarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

import { userAPI, friendsAPI } from '../utils/apiService';
import useAuthStore from '../store/authStore';
import useFriendsStore from '../store/friendsStore';
import { formatScore, formatDate } from '../utils/helpers';

const UserProfileViewPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { 
    friends, 
    pendingRequests, 
    sentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend 
  } = useFriendsStore();

  const [profileUser, setProfileUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (userId && userId !== currentUser?._id) {
      fetchUserProfile();
    } else if (userId === currentUser?._id) {
      // Redirect to own profile page
      navigate('/profile');
    }
  }, [userId, currentUser?._id, navigate]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      console.log('Fetching profile for userId:', userId); // Debug log
      const [profileResponse, statsResponse] = await Promise.all([
        userAPI.getUserProfile(userId),
        userAPI.getUserStats(userId)
      ]);
      
      console.log('Profile response:', profileResponse); // Debug log
      console.log('Stats response:', statsResponse); // Debug log
      
      setProfileUser(profileResponse.user);
      setUserStats(statsResponse.stats);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
      navigate('/friends');
    } finally {
      setLoading(false);
    }
  };

  const getFriendshipStatus = () => {
    if (!profileUser || !currentUser) return 'none';
    
    const isFriend = friends.some(friend => friend._id === profileUser._id);
    const hasPendingRequest = pendingRequests.some(request => request.from._id === profileUser._id);
    const hasSentRequest = sentRequests.some(request => request.to._id === profileUser._id);
    
    if (isFriend) return 'friends';
    if (hasPendingRequest) return 'pending_received';
    if (hasSentRequest) return 'pending_sent';
    return 'none';
  };

  const handleFriendAction = async () => {
    if (!profileUser || actionLoading) return;
    
    setActionLoading(true);
    const status = getFriendshipStatus();
    
    try {
      switch (status) {
        case 'none':
          await sendFriendRequest(profileUser._id);
          toast.success('Friend request sent!');
          break;
        case 'pending_received':
          await acceptFriendRequest(profileUser._id);
          toast.success('Friend request accepted!');
          break;
        case 'friends':
          if (window.confirm('Are you sure you want to remove this friend?')) {
            await removeFriend(profileUser._id);
            toast.success('Friend removed');
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Friend action error:', error);
      toast.error('Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  const renderFriendButton = () => {
    const status = getFriendshipStatus();
    
    switch (status) {
      case 'friends':
        return (
          <button
            onClick={handleFriendAction}
            disabled={actionLoading}
            className="btn-game btn-danger flex items-center space-x-2"
          >
            <UserMinusIcon className="h-5 w-5" />
            <span>Remove Friend</span>
          </button>
        );
      case 'pending_received':
        return (
          <button
            onClick={handleFriendAction}
            disabled={actionLoading}
            className="btn-game btn-primary flex items-center space-x-2"
          >
            <UserPlusIcon className="h-5 w-5" />
            <span>Accept Request</span>
          </button>
        );
      case 'pending_sent':
        return (
          <button
            disabled={true}
            className="btn-game btn-secondary opacity-50 cursor-not-allowed flex items-center space-x-2"
          >
            <ClockIcon className="h-5 w-5" />
            <span>Request Sent</span>
          </button>
        );
      default:
        return (
          <button
            onClick={handleFriendAction}
            disabled={actionLoading}
            className="btn-game btn-primary flex items-center space-x-2"
          >
            <UserPlusIcon className="h-5 w-5" />
            <span>Add Friend</span>
          </button>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-game-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
          <Link to="/friends" className="btn-game btn-primary">
            Back to Friends
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-dark-card hover:bg-dark-border text-gray-300 hover:text-white transition-colors"
              title="Go Back"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <Link
              to="/dashboard"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-dark-card hover:bg-dark-border text-gray-300 hover:text-white transition-colors"
              title="Dashboard"
            >
              <HomeIcon className="w-5 h-5" />
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Profile</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-game-blue to-game-purple rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl sm:text-4xl">
                {profileUser.username?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {profileUser.profile?.firstName || profileUser.profile?.lastName 
                  ? `${profileUser.profile.firstName || ''} ${profileUser.profile.lastName || ''}`.trim()
                  : profileUser.username
                }
              </h2>
              <p className="text-gray-400 text-lg mb-2">@{profileUser.username}</p>
              {profileUser.createdAt && (
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-500">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-sm">Joined {formatDate(profileUser.createdAt)}</span>
                </div>
              )}
            </div>

            {/* Friend Action Button */}
            <div className="flex-shrink-0">
              {renderFriendButton()}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <TrophyIcon className="h-8 w-8 text-game-yellow mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-game-yellow mb-1">
              {formatScore(userStats?.highestScore || 0)}
            </p>
            <p className="text-gray-400 text-sm">Best Score</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <PlayIcon className="h-8 w-8 text-game-blue mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-game-blue mb-1">
              {userStats?.totalGames || 0}
            </p>
            <p className="text-gray-400 text-sm">Games Played</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card text-center"
          >
            <ChartBarIcon className="h-8 w-8 text-game-green mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-game-green mb-1">
              {formatScore(userStats?.averageScore || 0)}
            </p>
            <p className="text-gray-400 text-sm">Average Score</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card text-center"
          >
            <TrophyIcon className="h-8 w-8 text-game-purple mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-game-purple mb-1">
              {userStats?.rank ? `#${userStats.rank}` : 'N/A'}
            </p>
            <p className="text-gray-400 text-sm">Global Rank</p>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <UserIcon className="h-6 w-6 mr-2" />
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileUser.profile?.gender && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                <p className="text-white capitalize">
                  {profileUser.profile.gender.replace('-', ' ')}
                </p>
              </div>
            )}
            {profileUser.profile?.dateOfBirth && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                <p className="text-white">
                  {formatDate(profileUser.profile.dateOfBirth)}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6"
        >
          <Link to="/friends" className="btn-game btn-secondary">
            Back to Friends
          </Link>
          <Link to="/leaderboard" className="btn-game btn-primary">
            View Leaderboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfileViewPage;

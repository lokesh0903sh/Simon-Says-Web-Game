import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  UserIcon, 
  PencilIcon, 
  HomeIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

import { userAPI } from '../utils/apiService';
import useAuthStore from '../store/authStore';
import { formatScore, formatDate } from '../utils/helpers';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (user?.profile) {
      setValue('firstName', user.profile.firstName || '');
      setValue('lastName', user.profile.lastName || '');
      setValue('gender', user.profile.gender || 'prefer-not-to-say');
      setValue('phoneNumber', user.profile.phoneNumber || '');
      setValue('dateOfBirth', user.profile.dateOfBirth ? 
        new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '');
    }
  }, [user?._id, user, setValue]); // Added user._id dependency for user changes

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await userAPI.updateProfile(data);
      updateUser(response.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form values
    if (user?.profile) {
      setValue('firstName', user.profile.firstName || '');
      setValue('lastName', user.profile.lastName || '');
      setValue('gender', user.profile.gender || 'prefer-not-to-say');
      setValue('phoneNumber', user.profile.phoneNumber || '');
      setValue('dateOfBirth', user.profile.dateOfBirth ? 
        new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '');
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload this to a file storage service
      const reader = new FileReader();
      reader.onload = (e) => {
        // For demo purposes, we'll just show it locally
        // In production, upload to your storage service
        toast.info('Avatar upload feature coming soon!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <UserIcon className="h-8 w-8 text-game-green" />
            <h1 className="text-4xl font-bold text-white">Profile</h1>
          </div>
          
          <Link to="/dashboard" className="btn-game btn-secondary">
            <HomeIcon className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-game-purple to-game-green rounded-full flex items-center justify-center mx-auto">
                  {user?.profile?.avatar ? (
                    <img 
                      src={user.profile.avatar} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-16 w-16 text-white" />
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-2 right-2 w-10 h-10 bg-game-purple rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-80 transition-colors">
                    <CameraIcon className="h-5 w-5 text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Basic Info */}
              <h2 className="text-2xl font-bold text-white mb-2">
                {user?.profile?.firstName || user?.profile?.lastName 
                  ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
                  : user?.username
                }
              </h2>
              <p className="text-gray-400 mb-1">@{user?.username}</p>
              <p className="text-gray-500 mb-4 font-mono text-sm">ID: {user?.userId || 'Not assigned'}</p>
              
              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-game btn-primary"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Game Stats */}
            <div className="card mt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Game Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">High Score</span>
                  <span className="text-game-yellow font-bold">
                    {formatScore(user?.gameStats?.highestScore || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Games Played</span>
                  <span className="text-white font-semibold">
                    {user?.gameStats?.totalGamesPlayed || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Average Score</span>
                  <span className="text-game-green font-semibold">
                    {formatScore(user?.gameStats?.averageScore || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Score</span>
                  <span className="text-game-purple font-semibold">
                    {formatScore(user?.gameStats?.totalScore || 0)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Profile Information</h3>
                
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex space-x-2"
                    >
                      <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                        className="btn-game btn-primary"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <CheckIcon className="h-5 w-5 mr-2" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn-game btn-secondary"
                      >
                        <XMarkIcon className="h-5 w-5 mr-2" />
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Account Information */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={user?.username || ''}
                        disabled
                        className="input-field bg-dark-border opacity-50 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        User ID
                      </label>
                      <input
                        type="text"
                        value={user?.userId || 'Not assigned'}
                        disabled
                        className="input-field bg-dark-border opacity-50 cursor-not-allowed font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="input-field pl-10 bg-dark-border opacity-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        disabled={!isEditing}
                        className={`input-field ${!isEditing ? 'bg-dark-border opacity-50' : ''}`}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        disabled={!isEditing}
                        className={`input-field ${!isEditing ? 'bg-dark-border opacity-50' : ''}`}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gender
                    </label>
                    <select
                      {...register('gender')}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-dark-border opacity-50' : ''}`}
                    >
                      <option value="prefer-not-to-say">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="date"
                        {...register('dateOfBirth')}
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-dark-border opacity-50' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      {...register('phoneNumber')}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-dark-border opacity-50' : ''}`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={formatDate(user?.createdAt)}
                    disabled
                    className="input-field bg-dark-border opacity-50 cursor-not-allowed"
                  />
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  CogIcon,
  HomeIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  AdjustmentsHorizontalIcon,
  BellIcon,
  BellSlashIcon,
  EyeIcon,
  EyeSlashIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

import useGameStore from '../store/gameStore';
import useAuthStore from '../store/authStore';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const { difficulty, soundEnabled, setDifficulty, toggleSound } = useGameStore();
  
  const [localSettings, setLocalSettings] = useState({
    notifications: true,
    vibration: true,
    theme: 'dark',
    animations: true,
    autoSave: true
  });

  const difficulties = [
    {
      key: 'easy',
      label: 'Easy',
      description: 'Longer time to respond, slower sequence',
      color: 'from-game-green to-game-yellow'
    },
    {
      key: 'normal',
      label: 'Normal',
      description: 'Standard gameplay experience',
      color: 'from-game-purple to-game-green'
    },
    {
      key: 'hard',
      label: 'Hard',
      description: 'Quick responses required, faster sequence',
      color: 'from-game-red to-game-purple'
    }
  ];

  const handleSettingToggle = (setting) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast.success(`${setting.charAt(0).toUpperCase() + setting.slice(1)} ${localSettings[setting] ? 'disabled' : 'enabled'}`);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    toast.success(`Difficulty set to ${newDifficulty}`);
  };

  const handleSoundToggle = () => {
    toggleSound();
    toast.success(`Sound ${soundEnabled ? 'disabled' : 'enabled'}`);
  };

  const resetToDefaults = () => {
    setDifficulty('normal');
    setLocalSettings({
      notifications: true,
      vibration: true,
      theme: 'dark',
      animations: true,
      autoSave: true
    });
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0"
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <CogIcon className="h-6 w-6 sm:h-8 sm:w-8 text-game-purple" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Settings</h1>
          </div>
          
          <Link to="/dashboard" className="btn-game btn-secondary w-full sm:w-auto text-center">
            <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Dashboard
          </Link>
        </motion.div>

        <div className="space-y-4 sm:space-y-6">
          {/* Game Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-game-green" />
              Game Settings
            </h2>

            {/* Difficulty Setting */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">Difficulty Level</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {difficulties.map((diff) => (
                  <motion.button
                    key={diff.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDifficultyChange(diff.key)}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      difficulty === diff.key
                        ? 'border-game-purple bg-game-purple/10'
                        : 'border-dark-border hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r ${diff.color} mx-auto mb-2 sm:mb-3 flex items-center justify-center`}>
                      <span className="text-white font-bold text-base sm:text-lg">
                        {diff.key === 'easy' ? 'E' : diff.key === 'normal' ? 'N' : 'H'}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">{diff.label}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">{diff.description}</p>
                    {difficulty === diff.key && (
                      <div className="mt-2">
                        <span className="text-xs bg-game-purple text-white px-2 py-1 rounded-full">
                          Current
                        </span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Audio Settings */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">Audio</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-dark-border rounded-xl">
                  <div className="flex items-center space-x-3">
                    {soundEnabled ? (
                      <SpeakerWaveIcon className="h-5 w-5 sm:h-6 sm:w-6 text-game-green" />
                    ) : (
                      <SpeakerXMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                    )}
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">Sound Effects</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Play sounds when buttons are pressed</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSoundToggle}
                    className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                      soundEnabled ? 'bg-game-green' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                        soundEnabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* App Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <DevicePhoneMobileIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-game-yellow" />
              App Settings
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {/* Notifications */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-dark-border rounded-xl">
                <div className="flex items-center space-x-3">
                  {localSettings.notifications ? (
                    <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-game-blue" />
                  ) : (
                    <BellSlashIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                  )}
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">Push Notifications</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Get notified about new features and updates</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('notifications')}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    localSettings.notifications ? 'bg-game-green' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.notifications ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Vibration */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-dark-border rounded-xl">
                <div className="flex items-center space-x-3">
                  <DevicePhoneMobileIcon className="h-5 w-5 sm:h-6 sm:w-6 text-game-purple" />
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">Vibration</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Haptic feedback for button presses</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('vibration')}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    localSettings.vibration ? 'bg-game-green' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.vibration ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Animations */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-dark-border rounded-xl">
                <div className="flex items-center space-x-3">
                  {localSettings.animations ? (
                    <EyeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-game-green" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                  )}
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">Animations</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Enable visual animations and transitions</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('animations')}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    localSettings.animations ? 'bg-game-green' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.animations ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-dark-border rounded-xl">
                <div className="flex items-center space-x-3">
                  <CogIcon className="h-5 w-5 sm:h-6 sm:w-6 text-game-yellow" />
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">Auto Save</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Automatically save game progress</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('autoSave')}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    localSettings.autoSave ? 'bg-game-green' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.autoSave ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-6">Account Information</h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Username</label>
                  <p className="text-white font-semibold text-sm sm:text-base">{user?.username}</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Email</label>
                  <p className="text-white font-semibold text-sm sm:text-base">{user?.email}</p>
                </div>
              </div>
              
              <div className="pt-3 sm:pt-4">
                <Link
                  to="/profile"
                  className="btn-game btn-primary w-full sm:w-auto"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Reset Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card border-red-900/30"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">Reset Settings</h2>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              This will reset all your game and app settings to their default values. Your profile and game progress will not be affected.
            </p>
            <button
              onClick={resetToDefaults}
              className="btn-game btn-danger w-full sm:w-auto"
            >
              Reset to Defaults
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

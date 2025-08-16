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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <CogIcon className="h-8 w-8 text-game-purple" />
            <h1 className="text-4xl font-bold text-white">Settings</h1>
          </div>
          
          <Link to="/dashboard" className="btn-game btn-secondary">
            <HomeIcon className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
        </motion.div>

        <div className="space-y-6">
          {/* Game Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2 text-game-green" />
              Game Settings
            </h2>

            {/* Difficulty Setting */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4">Difficulty Level</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map((diff) => (
                  <motion.button
                    key={diff.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDifficultyChange(diff.key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      difficulty === diff.key
                        ? 'border-game-purple bg-game-purple/10'
                        : 'border-dark-border hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${diff.color} mx-auto mb-3 flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {diff.key === 'easy' ? 'E' : diff.key === 'normal' ? 'N' : 'H'}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{diff.label}</h4>
                    <p className="text-gray-400 text-sm">{diff.description}</p>
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
              <h3 className="text-lg font-medium text-white mb-4">Audio</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-border rounded-xl">
                  <div className="flex items-center space-x-3">
                    {soundEnabled ? (
                      <SpeakerWaveIcon className="h-6 w-6 text-game-green" />
                    ) : (
                      <SpeakerXMarkIcon className="h-6 w-6 text-gray-500" />
                    )}
                    <div>
                      <p className="text-white font-medium">Sound Effects</p>
                      <p className="text-gray-400 text-sm">Play sounds when buttons are pressed</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSoundToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      soundEnabled ? 'bg-game-green' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        soundEnabled ? 'translate-x-6' : 'translate-x-1'
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
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <DevicePhoneMobileIcon className="h-6 w-6 mr-2 text-game-yellow" />
              App Settings
            </h2>

            <div className="space-y-4">
              {/* Notifications */}
              <div className="flex items-center justify-between p-4 bg-dark-border rounded-xl">
                <div className="flex items-center space-x-3">
                  {localSettings.notifications ? (
                    <BellIcon className="h-6 w-6 text-game-blue" />
                  ) : (
                    <BellSlashIcon className="h-6 w-6 text-gray-500" />
                  )}
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-gray-400 text-sm">Get notified about new features and updates</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('notifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.notifications ? 'bg-game-green' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Vibration */}
              <div className="flex items-center justify-between p-4 bg-dark-border rounded-xl">
                <div className="flex items-center space-x-3">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-game-purple" />
                  <div>
                    <p className="text-white font-medium">Vibration</p>
                    <p className="text-gray-400 text-sm">Haptic feedback for button presses</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('vibration')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.vibration ? 'bg-game-green' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.vibration ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Animations */}
              <div className="flex items-center justify-between p-4 bg-dark-border rounded-xl">
                <div className="flex items-center space-x-3">
                  {localSettings.animations ? (
                    <EyeIcon className="h-6 w-6 text-game-green" />
                  ) : (
                    <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                  )}
                  <div>
                    <p className="text-white font-medium">Animations</p>
                    <p className="text-gray-400 text-sm">Enable visual animations and transitions</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('animations')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.animations ? 'bg-game-green' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.animations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between p-4 bg-dark-border rounded-xl">
                <div className="flex items-center space-x-3">
                  <CogIcon className="h-6 w-6 text-game-yellow" />
                  <div>
                    <p className="text-white font-medium">Auto Save</p>
                    <p className="text-gray-400 text-sm">Automatically save game progress</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('autoSave')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.autoSave ? 'bg-game-green' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.autoSave ? 'translate-x-6' : 'translate-x-1'
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
            <h2 className="text-2xl font-semibold text-white mb-6">Account Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                  <p className="text-white font-semibold">{user?.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <p className="text-white font-semibold">{user?.email}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Link
                  to="/profile"
                  className="btn-game btn-primary"
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
            <h2 className="text-2xl font-semibold text-white mb-4">Reset Settings</h2>
            <p className="text-gray-400 mb-6">
              This will reset all your game and app settings to their default values. Your profile and game progress will not be affected.
            </p>
            <button
              onClick={resetToDefaults}
              className="btn-game btn-danger"
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

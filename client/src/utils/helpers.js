export const getDifficultySettings = (difficulty) => {
  const settings = {
    easy: {
      sequenceDelay: 800,
      userInputTimeout: 3000,
      flashDuration: 400
    },
    normal: {
      sequenceDelay: 600,
      userInputTimeout: 2000,
      flashDuration: 300
    },
    hard: {
      sequenceDelay: 400,
      userInputTimeout: 1500,
      flashDuration: 200
    }
  };
  
  return settings[difficulty] || settings.normal;
};

export const calculateScore = (level, timeBonus = 0, difficultyMultiplier = 1) => {
  const baseScore = level;
  const bonus = Math.floor(timeBonus / 1000);
  return Math.floor((baseScore + bonus) * difficultyMultiplier);
};

export const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export const formatScore = (score) => {
  if (score === null || score === undefined || isNaN(score)) {
    return '0';
  }
  return Number(score).toLocaleString();
};

export const formatDate = (dateInput, options = {}) => {
  if (!dateInput) {
    return 'Unknown';
  }
  
  try {
    const date = new Date(dateInput);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

export const getColorEmoji = (color) => {
  const emojis = {
    red: '🔴',
    yellow: '🟡',
    green: '🟢',
    purple: '🟣'
  };
  return emojis[color] || '⚪';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

export const getRankSuffix = (rank) => {
  if (rank === 1) return 'st';
  if (rank === 2) return 'nd';
  if (rank === 3) return 'rd';
  return 'th';
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

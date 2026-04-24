const API_BASE_URL = 'http://localhost:5000/api';

export const mindTrackApi = {
  // Chat
  sendMessage: async (userId, message) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message }),
    });
    return response.json();
  },

  // Mood
  logMood: async (userId, mood, note = '') => {
    const response = await fetch(`${API_BASE_URL}/mood`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, mood, note }),
    });
    return response.json();
  },

  getMoodHistory: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/mood/${userId}`);
    return response.json();
  },

  getMoodAnalytics: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/mood/analytics/${userId}`);
    return response.json();
  },

  // Self Help
  getSelfHelp: async () => {
    const response = await fetch(`${API_BASE_URL}/self-help`);
    return response.json();
  },

  // Report
  getWeeklyReport: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/report/${userId}`);
    return response.json();
  }
};

/**
 * IROPS Control Hub Configuration
 * This file contains environment-specific settings
 */

const CONFIG = {
  // API Configuration
  API: {
    // Base URL for API endpoints
    // In development: point to local Django server
    // In production: point to your hosted backend API
    BASE_URL: 'http://127.0.0.1:8000/api',
    
    // API Endpoints
    ENDPOINTS: {
      AIRCRAFT: '/aircraft/',
      FLIGHTS: '/flights/',
      ACTIVE_FLIGHTS: '/flights/active/',
      TEAM_MEMBERS: '/team-members/',
      TEAM_MEMBERS_BY_TEAM: '/team-members/by_team/',
      ACKNOWLEDGMENTS: '/acknowledgments/',
      ACKNOWLEDGMENTS_BY_STATUS: '/acknowledgments/by_status/',
      SHUTTLES: '/shuttles/',
      ACTIONS: '/actions/',
      ACTIONS_BY_STATUS: '/actions/by_status/'
    },
    
    // Request timeout in milliseconds
    TIMEOUT: 5000
  },
  
  // Feature flags
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_REAL_TIME_UPDATES: false
  }
};

// Export configuration for use in other scripts
window.IROPS_CONFIG = CONFIG;

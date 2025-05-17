/**
 * IROPS Control Hub API Service
 * Provides functions to interact with the backend API
 */

const ApiService = {
  // Base URL for the backend API - update this when deploying
  API_BASE_URL: 'https://your-backend-domain.onrender.com', // replace with your actual hosted backend URL
  
  /**
   * Get the current authentication token
   * @returns {string|null} - The JWT auth token or null if not authenticated
   */
  getAuthToken: function() {
    return sessionStorage.getItem('irops_auth_token');
  },
  
  /**
   * Make a request to the API with authentication
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} options - Request options (method, body, etc.)
   * @returns {Promise} - Promise with the API response
   */
  request: async function(endpoint, options = {}) {
    // Use config API base URL if available, otherwise use the hardcoded one
    const { API } = window.IROPS_CONFIG || { API: { BASE_URL: this.API_BASE_URL, TIMEOUT: 30000 } };
    const url = (API.BASE_URL || this.API_BASE_URL) + endpoint;
    
    // Get authentication token
    const token = this.getAuthToken();
    
    // Default request options with authentication headers
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add Authorization header if we have a token
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      credentials: 'include', // Include cookies for CSRF if needed
      ...options
    };
    
    try {
      // Set a timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API.TIMEOUT || 30000);
      requestOptions.signal = controller.signal;
      
      // Make the request
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);
      
      // Check for authentication errors
      if (response.status === 401) {
        console.warn('Authentication failed or token expired');
        // Optionally redirect to login page
        if (window.location.pathname !== '/login.html') {
          window.location.href = 'login.html?error=session_expired';
          return null;
        }
      }
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      // Parse JSON response
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Authentication-related API calls
   */
  auth: {
    // Get JWT token using Google ID token
    loginWithGoogle: async (googleIdToken) => {
      return ApiService.request('/api/auth/google/', {
        method: 'POST',
        body: JSON.stringify({ id_token: googleIdToken })
      });
    },
    
    // Refresh the JWT token
    refreshToken: async (refreshToken) => {
      return ApiService.request('/api/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken })
      });
    },
    
    // Log out and invalidate tokens
    logout: async () => {
      const result = await ApiService.request('/api/auth/logout/', { method: 'POST' });
      // Clear auth data from sessionStorage
      sessionStorage.removeItem('irops_auth_token');
      sessionStorage.removeItem('irops_refresh_token');
      return result;
    },
    
    // Get current user profile
    getProfile: async () => {
      return ApiService.request('/api/auth/profile/');
    }
  },
  
  // Aircraft endpoints
  aircraft: {
    getAll: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.AIRCRAFT),
    getById: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.AIRCRAFT}${id}/`),
    create: (data) => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.AIRCRAFT, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.AIRCRAFT}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.AIRCRAFT}${id}/`, {
      method: 'DELETE'
    })
  },
  
  // Flight endpoints
  flights: {
    getAll: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.FLIGHTS),
    getActive: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.ACTIVE_FLIGHTS),
    getById: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.FLIGHTS}${id}/`),
    create: (data) => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.FLIGHTS, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.FLIGHTS}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.FLIGHTS}${id}/`, {
      method: 'DELETE'
    })
  },
  
  // Team members endpoints
  teamMembers: {
    getAll: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.TEAM_MEMBERS),
    getByTeam: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.TEAM_MEMBERS_BY_TEAM),
    getById: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.TEAM_MEMBERS}${id}/`),
    create: (data) => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.TEAM_MEMBERS, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.TEAM_MEMBERS}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.TEAM_MEMBERS}${id}/`, {
      method: 'DELETE'
    })
  },
  
  // Acknowledgments endpoints
  acknowledgments: {
    getAll: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.ACKNOWLEDGMENTS),
    getByStatus: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.ACKNOWLEDGMENTS_BY_STATUS),
    getById: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.ACKNOWLEDGMENTS}${id}/`),
    create: (data) => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.ACKNOWLEDGMENTS, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.ACKNOWLEDGMENTS}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.ACKNOWLEDGMENTS}${id}/`, {
      method: 'DELETE'
    })
  },
  
  // Shuttle information endpoints
  shuttles: {
    getAll: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.SHUTTLES),
    getById: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.SHUTTLES}${id}/`),
    create: (data) => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.SHUTTLES, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.SHUTTLES}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.SHUTTLES}${id}/`, {
      method: 'DELETE'
    })
  },
  
  // Team actions endpoints
  actions: {
    getAll: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.ACTIONS),
    getByStatus: () => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.ACTIONS_BY_STATUS),
    getById: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.ACTIONS}${id}/`),
    create: (data) => ApiService.request(window.IROPS_CONFIG.API.ENDPOINTS.ACTIONS, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.ACTIONS}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => ApiService.request(`${window.IROPS_CONFIG.API.ENDPOINTS.ACTIONS}${id}/`, {
      method: 'DELETE'
    })
  }
};

// Export the API service for use in other scripts
window.ApiService = ApiService;

/**
 * Main application controller for IROPS Command Centre
 */
(() => {
  // Global refresh interval (3 minutes)
  const REFRESH_INTERVAL = 180000;

  // Run initialization when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);
  
  /**
   * Initialize the application
   */
  function init() {
    // Check authentication first
    checkAuth();
    
    // Initialize utilities
    Utils.initLoading();
    
    // Initialize UI components
    TimeDisplay.init();
    Panels.init();
    Flights.init();
    Guests.init();
    Shuttle.init();
    Team.init();
    Jets.init();
    
    // Setup refresh button
    Utils.initRefreshButton(refreshData);
    
    // Setup admin button
    initAdminButton();
    
    // Load initial data
    loadData();
    
    // Setup auto-refresh
    setInterval(refreshData, REFRESH_INTERVAL);
  }
  
  /**
   * Load all data from backend through API
   */
  async function loadData() {
    Utils.showLoading();
    
    try {
      // Load data from the API
      const [
        aircraft,
        activeFlights,
        teamMembers,
        acknowledgments,
        shuttles,
        actions
      ] = await Promise.allSettled([
        ApiService.aircraft.getAll(),
        ApiService.flights.getActive(),
        ApiService.teamMembers.getByTeam(),
        ApiService.acknowledgments.getByStatus(),
        ApiService.shuttles.getAll(),
        ApiService.actions.getByStatus()
      ]);
      
      // Combine data for the dashboard
      const dashboardData = {
        aircraft: aircraft.status === 'fulfilled' ? aircraft.value : mockData.aircraft,
        flights: activeFlights.status === 'fulfilled' ? activeFlights.value : mockData.flights,
        teamMembers: teamMembers.status === 'fulfilled' ? teamMembers.value : mockData.teamMembers,
        acknowledgments: acknowledgments.status === 'fulfilled' ? acknowledgments.value : mockData.acknowledgments,
        shuttles: shuttles.status === 'fulfilled' ? shuttles.value : mockData.shuttles,
        actions: actions.status === 'fulfilled' ? actions.value : mockData.actions
      };
      
      // Update the dashboard with real or fallback data
      updateDashboard(dashboardData);
    } catch (error) {
      console.error('Failed to load data from API, falling back to mock data:', error);
      // Fall back to mock data if API fails
      updateDashboard(mockData);
    } finally {
      Utils.hideLoading();
    }
  }
  
  /**
   * Refresh data (triggered by refresh button or auto-refresh)
   */
  async function refreshData() {
    console.log('Refreshing dashboard data from API...');
    await loadData();
  }
  
  /**
   * Update all dashboard components with data
   * @param {Object} data - All dashboard data
   */
  function updateDashboard(data) {
    // Update flight view
    Flights.updateFlights(data.flightsData);
    
    // Update guest acknowledgments
    Guests.updateGuests(data.guestsData);
    
    // Update shuttle information
    Shuttle.updateShuttle(data.shuttleData);
    
    // Update team members and actions
    Team.updateTeamMembers(data.teamData);
    Team.updateTeamActions(data.actionsData);
    
    // Update aircraft assignments
    Jets.updateJets(data.jetsData);
    
    // Update status information and last updated
    Utils.updateStatusInfo(data.flightsData, data.guestsData);
    
    // Hide loading overlay
    Utils.hideLoading();
  }
  
  /**
   * Download the images from external sources
   */
  function loadImages() {
    // Get reference to the logo elements
    const aeroLogo = document.getElementById('aero-logo');
    const commandLogo = document.getElementById('command-logo');
    
    // Set image sources
    aeroLogo.src = 'assets/images/aerologo.png';
    commandLogo.src = 'assets/images/controlhub.png';
    
    // Log error if images don't load
    aeroLogo.onerror = () => console.error('Failed to load aero logo');
    commandLogo.onerror = () => console.error('Failed to load command logo');
  }
  
  /**
   * Initialize Admin Access button
   */
  function initAdminButton() {
    const adminButton = document.getElementById('admin-button');
    
    adminButton.addEventListener('click', () => {
      // For now, just show an alert. In the Django implementation, this would redirect to an admin login page
      alert('Admin Access requires authentication. This feature will be implemented with Django backend.');
      
      // Future implementation with Django:
      // window.location.href = '/admin/login/';
    });
  }
  
  /**
   * Check if user is authenticated, redirect to login if not
   */
  function checkAuth() {
    // In a real implementation with backend, this would check a session cookie or JWT token
    // For now, we'll do a simple check for a mock auth token in sessionStorage
    
    const isAuthenticated = sessionStorage.getItem('irops_auth_token');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && currentPage !== 'login.html') {
      console.log('User not authenticated, redirecting to login');
      window.location.href = 'login.html';
      return false;
    }
    
    return true;
  }
  
  // Initialize the application
  loadImages();
  init();
});

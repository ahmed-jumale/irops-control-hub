/**
 * TimeDisplay module for handling world clocks in the header
 */
const TimeDisplay = {
  /**
   * Initialize the time display
   */
  init() {
    this.updateCityTimes();
    
    // Update clocks every minute
    setInterval(() => this.updateCityTimes(), 60000);
  },
  
  /**
   * Update all city times
   */
  updateCityTimes() {
    const now = new Date();
    this.updateLATime(now);
    this.updateCaboTime(now);
    this.updateAspenTime(now);
    this.updateDallasTime(now);
    this.updateNYTime(now);
  },
  
  /**
   * Update Los Angeles time (Pacific Time)
   * @param {Date} now - Current date/time
   */
  updateLATime(now) {
    try {
      // Using Intl to format in Pacific time
      const laTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Los_Angeles'
      }).format(now);
      
      document.getElementById('la-time').textContent = laTime;
    } catch (e) {
      // Fallback if Intl API doesn't work
      const laOffset = -7; // Pacific Time offset
      const localOffset = -(now.getTimezoneOffset() / 60);
      const laTime = new Date(now.getTime() + (laOffset - localOffset) * 3600000);
      document.getElementById('la-time').textContent = Utils.formatTime(laTime);
    }
  },
  
  /**
   * Update Dallas time (Central Time)
   * @param {Date} now - Current date/time
   */
  updateDallasTime(now) {
    try {
      // Using Intl to format in Central time (for Dallas)
      const dallasTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Chicago'
      }).format(now);
      
      document.getElementById('dallas-time').textContent = dallasTime;
    } catch (e) {
      // Fallback if Intl API doesn't work
      const dallasOffset = -5; // Central Time offset
      const localOffset = -(now.getTimezoneOffset() / 60);
      const dallasTime = new Date(now.getTime() + (dallasOffset - localOffset) * 3600000);
      document.getElementById('dallas-time').textContent = Utils.formatTime(dallasTime);
    }
  },
  
  /**
   * Update New York time (Eastern Time)
   * @param {Date} now - Current date/time
   */
  updateNYTime(now) {
    try {
      // Using Intl to format in Eastern time (for New York)
      const nyTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      }).format(now);
      
      document.getElementById('ny-time').textContent = nyTime;
    } catch (e) {
      // Fallback if Intl API doesn't work
      const nyOffset = -4; // Eastern Time offset
      const localOffset = -(now.getTimezoneOffset() / 60);
      const nyTime = new Date(now.getTime() + (nyOffset - localOffset) * 3600000);
      document.getElementById('ny-time').textContent = Utils.formatTime(nyTime);
    }
  },
  
  /**
   * Update Cabo time (typically Mountain Time)
   * @param {Date} now - Current date/time
   */
  updateCaboTime(now) {
    try {
      // Using Intl to format in Mountain time (for Cabo)
      const caboTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Mazatlan'
      }).format(now);
      
      document.getElementById('cabo-time').textContent = caboTime;
    } catch (e) {
      // Fallback if Intl API doesn't work
      const caboOffset = -6; // Mountain Time offset
      const localOffset = -(now.getTimezoneOffset() / 60);
      const caboTime = new Date(now.getTime() + (caboOffset - localOffset) * 3600000);
      document.getElementById('cabo-time').textContent = Utils.formatTime(caboTime);
    }
  },
  
  /**
   * Update Aspen time (Mountain Time)
   * @param {Date} now - Current date/time
   */
  updateAspenTime(now) {
    try {
      // Using Intl to format in Mountain time (for Aspen)
      const aspenTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Denver'
      }).format(now);
      
      document.getElementById('aspen-time').textContent = aspenTime;
    } catch (e) {
      // Fallback if Intl API doesn't work
      const aspenOffset = -6; // Mountain Time offset
      const localOffset = -(now.getTimezoneOffset() / 60);
      const aspenTime = new Date(now.getTime() + (aspenOffset - localOffset) * 3600000);
      document.getElementById('aspen-time').textContent = Utils.formatTime(aspenTime);
    }
  }
};

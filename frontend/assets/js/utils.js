/**
 * Utility functions for the IROPS Command Centre
 */
const Utils = {
  /**
   * Initialize the loading overlay
   */
  initLoading() {
    this.loading = document.getElementById('loading-overlay');
  },

  /**
   * Show loading overlay
   */
  showLoading() {
    this.loading.style.display = 'flex';
  },

  /**
   * Hide loading overlay
   */
  hideLoading() {
    this.loading.style.display = 'none';
  },
  
  /**
   * Format date for display
   * @param {string} dateStr - Date string in YYYY-MM-DD format
   * @returns {string} - Formatted date string
   */
  formatDate(dateStr) {
    if (!dateStr) return '--';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '--';
      
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '--';
    }
  },

  /**
   * Format time for display
   * @param {Date} date - Date object
   * @returns {string} - Formatted time string
   */
  formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Update last updated text
   */
  updateLastUpdated() {
    const now = new Date();
    const formattedTime = this.formatTime(now);
    document.getElementById('last-updated').textContent = `Last updated: ${formattedTime}`;
  },
  
  /**
   * Initialize the refresh button
   * @param {Function} refreshCallback - Function to call when refresh button is clicked
   */
  initRefreshButton(refreshCallback) {
    const refreshButton = document.getElementById('refresh-button');
    refreshButton.addEventListener('click', refreshCallback);
  },
  
  /**
   * Update status information from the data
   * @param {Array} flightsData - Array of flights data
   * @param {Array} guestsData - Array of guests data
   */
  updateStatusInfo(flightsData, guestsData) {
    // Update active IROPS count
    document.getElementById('active-irops').textContent = flightsData.length;
      
    // Update flights count - we'll still update it but it's hidden with CSS
    document.getElementById('flights-count').textContent = flightsData.length + ' flights';
    
    // Calculate total passengers
    let totalPassengers = 0;
    flightsData.forEach(row => {
      totalPassengers += parseInt(row[6]) || 0; // Total Pax column
    });
    document.getElementById('total-passengers').textContent = totalPassengers;
    
    // Count pending acknowledgments
    let pendingAcks = 0;
    guestsData.forEach(row => {
      if (row[3] !== "✓") {
        pendingAcks++;
      }
    });
    document.getElementById('pending-acks').textContent = pendingAcks;
    
    // Update last updated time
    this.updateLastUpdated();
  },
  

  
  /**
   * Helper to create status tags
   * @param {string} status - Status text
   * @returns {string} - HTML for status tag
   */
  createStatusTag(status) {
    // Create status tag based on status value
    let statusClass = '';
    let statusText = status; // Original status text
    
    // Convert status to lowercase for comparison
    const statusLower = statusText.toLowerCase();
    
    if (statusLower.includes('cancellation')) {
      statusClass = 'cancellation';
    } else if (statusLower.includes('re-dispatch')) {
      statusClass = 're-dispatch';
    } else if (statusLower.includes('delay')) {
      statusClass = 'delay';
    } else if (statusLower.includes('diversion')) {
      statusClass = 'diversion';
    } else if (statusLower.includes('complete')) {
      statusClass = 'complete';
    } else if (statusLower.includes('pending')) {
      statusClass = 'pending';
    } else if (statusLower.includes('incomplete')) {
      statusClass = 'incomplete';
    }
    
    // Create status tag HTML
    return statusClass ? 
      `<span class="status-tag ${statusClass}">${statusText}</span>` : 
      statusText;
  },
  
  /**
   * Helper to create info tags
   * @param {string} value - Tag value
   * @param {string} type - Tag type (eta, delay, orig-dest)
   * @returns {string} - HTML for info tag
   */
  createInfoTag(value, type) {
    if (!value || value === 'N/A') return '';
    
    return `<span class="info-tag ${type}">${value}</span>`;
  }
};

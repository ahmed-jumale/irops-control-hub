/**
 * Flights module for handling flight data display
 */
const Flights = {
  /**
   * Initialize flights module
   */
  init() {
    this.flightsContent = document.getElementById('flights-content');
  },
  
  /**
   * Update flights data display
   * @param {Array} flightsData - Array of flight data
   */
  updateFlights(flightsData) {
    // Clear existing content
    this.flightsContent.innerHTML = '';
    
    // If we have flights, build a table; otherwise, show empty state
    if (flightsData && flightsData.length > 0) {
      this.renderFlightsTable(flightsData);
    } else {
      this.renderEmptyState();
    }
  },
  
  /**
   * Render flights table with data
   * @param {Array} flightsData - Array of flight data
   */
  renderFlightsTable(flightsData) {
    let tableHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>FLIGHT</th>
            <th>STATUS</th>
            <th>CURRENT ETD/ETA</th>
            <th>NEW ETD/ETA</th>
            <th>DELAY</th>
            <th>NEW ORIG/DEST</th>
            <th>PAX</th>
            <th>ADT</th>
            <th>CHD</th>
            <th>INF</th>
            <th>ABLK</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    flightsData.forEach(row => {
      // Create status tag
      const statusTag = Utils.createStatusTag(row[1]);
      
      // Create tags for columns that need them
      const etaTag = Utils.createInfoTag(row[3], 'eta');
      const delayTag = Utils.createInfoTag(row[4], 'delay');
      const origDestTag = Utils.createInfoTag(row[5], 'orig-dest');
      
      // Add row to table
      tableHTML += `
        <tr data-flight="${row[0]}">
          <td><strong>${row[0]}</strong></td>
          <td>${statusTag}</td>
          <td><b>${row[2]}</b></td>
          <td><b>${etaTag || '-'}</b></td>
          <td>${delayTag || '-'}</td>
          <td>${origDestTag || '-'}</td>
          <td><b>${row[6]}</b></td>
          <td>${row[7]}</td>
          <td>${row[8]}</td>
          <td>${row[9]}</td>
          <td>${row[10]}</td>
        </tr>
      `;
    });
    
    tableHTML += `
        </tbody>
      </table>
    `;
    
    this.flightsContent.innerHTML = tableHTML;
  },
  
  /**
   * Render empty state when no flights are available
   */
  renderEmptyState() {
    this.flightsContent.innerHTML = `
      <div class="no-data-message">No active IROPS flights for today</div>
    `;
  }
};

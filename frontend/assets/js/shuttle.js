/**
 * Shuttle module for handling shuttle information
 */
const Shuttle = {
  /**
   * Initialize shuttle module
   */
  init() {
    this.shuttleTable = document.getElementById('shuttle-table');
  },
  
  /**
   * Update shuttle data display
   * @param {Object} shuttleData - Object containing shuttle data and headers
   */
  updateShuttle(shuttleData) {
    if (!shuttleData || !shuttleData.headers || !shuttleData.data) {
      console.error("Invalid shuttle data received:", shuttleData);
      return;
    }
    
    // Update the table headers dynamically
    const headerRow = document.querySelector(".shuttle-table thead tr");
    headerRow.innerHTML = `
      <th></th>
      <th>${shuttleData.headers[0] || 'To Rifle'}</th>
      <th>${shuttleData.headers[1] || 'To Aspen'}</th>
    `;
    
    // Populate shuttle data into the table
    const rows = document.querySelectorAll(".shuttle-table tbody tr");
    if (shuttleData.data.length === 6 && rows.length === 6) {
      for (let i = 0; i < 6; i++) {
        const cells = rows[i].querySelectorAll("td");
        cells[1].textContent = shuttleData.data[i][0] || '-';
        cells[2].textContent = shuttleData.data[i][1] || '-';
      }
    }
  }
};

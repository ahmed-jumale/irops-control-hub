/**
 * Guests module for handling guest acknowledgment data
 */
const Guests = {
  /**
   * Initialize guests module
   */
  init() {
    this.guestsTable = document.getElementById('guests-table');
  },
  
  /**
   * Update guests data display
   * @param {Array} guestsData - Array of guest data
   */
  updateGuests(guestsData) {
    // Clear existing content
    this.guestsTable.innerHTML = '';
    
    // If we have guests, build rows; otherwise, show empty state
    if (guestsData && guestsData.length > 0) {
      this.renderGuestsTable(guestsData);
    } else {
      this.renderEmptyState();
    }
  },
  
  /**
   * Render guests table with data
   * @param {Array} guestsData - Array of guest data
   */
  renderGuestsTable(guestsData) {
    let guestsHTML = '';
    
    guestsData.forEach(row => {
      // Create acknowledgment button
      const ackButton = row[3] === "✓" ? 
        `<div class="ack-btn yes">✓</div>` : 
        `<div class="ack-btn no">!</div>`;
      
      guestsHTML += `
        <tr data-guest="${row[1]}">
          <td>${row[0]}</td>
          <td><b>${row[1]}</b></td>
          <td>${row[2]}</td>
          <td>${ackButton}</td>
        </tr>
      `;
    });
    
    this.guestsTable.innerHTML = guestsHTML;
  },
  
  /**
   * Render empty state when no guests are available
   */
  renderEmptyState() {
    this.guestsTable.innerHTML = `
      <tr>
        <td colspan="4" class="no-data-message">
          No guests requiring acknowledgment
        </td>
      </tr>
    `;
  }
};

/**
 * Jets module for handling aircraft assignments
 */
const Jets = {
  /**
   * Initialize jets module
   */
  init() {
    this.jetsGrid = document.getElementById('jets-grid');
    this.jetCards = this.jetsGrid.querySelectorAll('.jet-card');
  },
  
  /**
   * Update jets data display
   * @param {Array} jetsData - Array of jet data
   */
  updateJets(jetsData) {
    if (!jetsData || !jetsData.length) return;
    
    // Update each jet card with its assignments
    jetsData.forEach(aircraft => {
      // Find the corresponding jet card by tail number
      this.jetCards.forEach(card => {
        const tailNumber = card.getAttribute('data-tail');
        
        if (tailNumber === aircraft.reg) {
          // Find the flight assignment div for this card
          const assignmentDiv = card.querySelector('.flight-assignment');
          
          if (assignmentDiv) {
            // Clear existing content
            assignmentDiv.innerHTML = '';
            
            // Add flight assignments
            if (aircraft.assignments && aircraft.assignments.length > 0) {
              let allLines = [];
              
              // Create a flat list of all non-empty lines from all assignments
              aircraft.assignments.forEach(assignment => {
                if (assignment.line1) {
                  allLines.push(assignment.line1);
                }
                if (assignment.line2) {
                  allLines.push(assignment.line2);
                }
              });
              
              // Create and append line divs
              if (allLines.length > 0) {
                allLines.forEach(line => {
                  const lineDiv = document.createElement('div');
                  lineDiv.textContent = line;
                  assignmentDiv.appendChild(lineDiv);
                });
              }
            }
          }
        }
      });
    });
  }
};

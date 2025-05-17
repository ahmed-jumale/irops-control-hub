/**
 * Team module for handling team members and team actions
 */
const Team = {
  /**
   * Initialize team module
   */
  init() {
    this.teamMembers = document.getElementById('team-members');
    this.actionsTable = document.getElementById('actions-table');
  },
  
  /**
   * Update team members display
   * @param {Array} teamData - Array of team members data
   */
  updateTeamMembers(teamData) {
    // Clear existing content
    this.teamMembers.innerHTML = '';
    
    if (teamData && teamData.length > 0) {
      let teamHTML = '';
      
      teamData.forEach(row => {
        // row = [ Role (A), NameB (B), NameC (C), NameD (D) ]
        const role = row[0] || '';
        // Combine non-empty names from columns B, C, D
        const names = [row[1], row[2], row[3]].filter(Boolean).join(', ');
        
        if (role) {
          teamHTML += `
            <div class="team-item" data-role="${role}">
              <div class="team-role">${role}</div>
              <div class="team-members">${names || 'Unassigned'}</div>
            </div>
          `;
        }
      });
      
      if (teamHTML) {
        this.teamMembers.innerHTML = teamHTML;
      } else {
        this.renderEmptyTeamState();
      }
    } else {
      this.renderEmptyTeamState();
    }
  },
  
  /**
   * Render empty state when no team members are available
   */
  renderEmptyTeamState() {
    this.teamMembers.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-user-slash"></i>
        <div class="empty-message">No team members assigned</div>
      </div>
    `;
  },
  
  /**
   * Update team actions display
   * @param {Array} actionsData - Array of team actions data
   */
  updateTeamActions(actionsData) {
    // Clear existing content (but keep the header)
    this.actionsTable.innerHTML = '';
    
    if (actionsData && actionsData.length > 0) {
      actionsData.forEach(row => {
        const statusTag = Utils.createStatusTag(row[2]);
        
        const actionRow = document.createElement('tr');
        actionRow.setAttribute('data-action', row[0].replace(/\s+/g, '-').toLowerCase());
        
        actionRow.innerHTML = `
          <td><b>${row[0]}</b></td>
          <td>${row[1]}</td>
          <td>${statusTag}</td>
        `;
        
        this.actionsTable.appendChild(actionRow);
      });
    } else {
      this.renderEmptyActionsState();
    }
  },
  
  /**
   * Render empty state when no team actions are available
   */
  renderEmptyActionsState() {
    this.actionsTable.innerHTML = `
      <tr>
        <td colspan="3" class="no-data-message">No team actions</td>
      </tr>
    `;
  }
};

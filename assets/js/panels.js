/**
 * Panels module for handling collapsible panels
 */
const Panels = {
  /**
   * Initialize all panel functionality
   */
  init() {
    // Make sure panels show their content on page load based on collapsed class
    this.initPanels();
    this.bindEvents();
  },
  
  /**
   * Initialize panels to ensure content is shown properly
   */
  initPanels() {
    const panels = document.querySelectorAll('.panel');
    
    panels.forEach(panel => {
      const content = panel.querySelector('.panel-body');
      
      // Make sure panels without collapsed class show their content
      if (!panel.classList.contains('collapsed') && content) {
        content.style.display = 'block';
      }
    });
  },
  
  /**
   * Bind event listeners to panel headers
   */
  bindEvents() {
    // Find all panel headers and attach click listeners
    const panelHeaders = document.querySelectorAll('.panel-header');
    
    panelHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const panelId = header.getAttribute('data-panel');
        if (panelId) {
          this.togglePanel(panelId);
        }
      });
    });
  },
  
  /**
   * Toggle panel visibility
   * @param {string} panelId - ID of the panel to toggle
   */
  togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    const toggle = panel.querySelector('.panel-toggle');
    
    panel.classList.toggle('collapsed');
    
    if (panel.classList.contains('collapsed')) {
      toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
    } else {
      toggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
    }
  }
};

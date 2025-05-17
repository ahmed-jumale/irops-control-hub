/**
 * Login Handler for IROPS Command Centre
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the login page
  initLogin();
});

/**
 * Initialize login page functionality
 */
function initLogin() {
  // Add event listener for bypass login button (development only)
  const bypassBtn = document.getElementById('bypass-login');
  if (bypassBtn) {
    bypassBtn.addEventListener('click', function() {
      redirectToDashboard();
    });
  }
  
  // Set up Google OAuth response handler
  window.handleGoogleCredentialResponse = function(response) {
    // In a real implementation, you would:
    // 1. Send the ID token to your backend
    // 2. Verify the token's authenticity
    // 3. Check if the email domain is aero.com
    // 4. Store authentication state
    // 5. Redirect to dashboard

    console.log("Google Sign-In successful, redirecting to dashboard...");
    redirectToDashboard();
  };
}

/**
 * Set auth token and redirect to main dashboard
 */
function redirectToDashboard() {
  // In a real implementation, this would store a JWT token received from backend
  // For now, set a mock token in sessionStorage
  sessionStorage.setItem('irops_auth_token', 'mock_token_' + Date.now());
  
  // Add a small delay for visual feedback
  setTimeout(function() {
    window.location.href = 'index.html';
  }, 500);
}

/**
 * Google Sign-in callback (This would be called by Google's OAuth)
 */
function handleCredentialResponse(response) {
  // This is registered globally for the Google sign-in
  if (window.handleGoogleCredentialResponse) {
    window.handleGoogleCredentialResponse(response);
  } else {
    console.error("Google Sign-In handler not initialized");
  }
}

/**
 * Login Handler for IROPS Command Centre
 */
document.addEventListener('DOMContentLoaded', function() {
  // Clear any previous session data for a fresh start
  sessionStorage.clear();
  
  // Check if we need to show error message from URL params
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('error')) {
    showLoginStatus('Error: ' + urlParams.get('error'), true);
  } else {
    showLoginStatus('Please sign in with your @aero.com account');
  }
  
  // Initialize Google Sign-In
  initGoogleSignIn();
  
  // Set up development bypass button
  setupBypassButton();
});

/**
 * Initialize Google Sign-In
 */
function initGoogleSignIn() {
  const googleBtn = document.getElementById('google-signin-btn');
  if (!googleBtn) return;
  
  // Add click handler to the Sign in with Google button
  googleBtn.addEventListener('click', function() {
    showLoginStatus('Starting Google authentication...');
    
    // Load Google API if not already loaded
    if (!window.google || !window.google.accounts) {
      showLoginStatus('Loading Google Sign-In...');
      
      // Create script element to load Google API
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = function() {
        showLoginStatus('Google Sign-In loaded, initiating login...');
        performGoogleSignIn();
      };
      script.onerror = function() {
        showLoginStatus('Failed to load Google Sign-In. Please try again later.', true);
      };
      document.head.appendChild(script);
    } else {
      performGoogleSignIn();
    }
  });
}

/**
 * Perform the Google Sign-In process
 */
function performGoogleSignIn() {
  showLoginStatus('Signing in with Google...');
  
  try {
    // Initialize Google API client with our client ID
    google.accounts.id.initialize({
      client_id: '39037736517-8le0a99shjhlpt0o55q4vm3rn98kbsf1.apps.googleusercontent.com',
      callback: handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true
    });
    
    // Prompt for Google Sign-In
    google.accounts.id.prompt(notification => {
      if (notification.isNotDisplayed()) {
        showLoginStatus('Google Sign-In was blocked. Please check your browser settings.', true);
      } else if (notification.isSkippedMoment()) {
        showLoginStatus('Sign-In was skipped', false);
      } else if (notification.isDismissedMoment()) {
        showLoginStatus('Sign-In was dismissed', false);
      }
    });
  } catch (error) {
    console.error('Google Sign-In error:', error);
    showLoginStatus('Failed to initialize Google Sign-In: ' + error.message, true);
  }
}

/**
 * Handle the response from Google Sign-In
 */
function handleGoogleSignIn(response) {
  showLoginStatus('Processing authentication...');
  
  try {
    if (!response || !response.credential) {
      throw new Error('Invalid authentication response');
    }
    
    // Get and decode the JWT token
    const idToken = response.credential;
    const tokenParts = idToken.split('.');
    
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Parse the JWT payload
    const payload = JSON.parse(atob(tokenParts[1]));
    console.log('Authentication payload:', payload);
    
    // Check for aero.com email
    if (!payload.email || !payload.email.endsWith('@aero.com')) {
      throw new Error('Only @aero.com email addresses are authorized');
    }
    
    // Success! Store authentication info
    showLoginStatus(`Welcome, ${payload.email}! Redirecting to dashboard...`);
    
    // Store in session storage
    sessionStorage.setItem('irops_auth_token', idToken);
    sessionStorage.setItem('irops_user_email', payload.email);
    sessionStorage.setItem('irops_user_name', payload.name || '');
    sessionStorage.setItem('irops_user_picture', payload.picture || '');
    
    // Redirect to dashboard
    setTimeout(() => goToDashboard(), 1000);
    
  } catch (error) {
    console.error('Authentication error:', error);
    showLoginStatus(error.message || 'Authentication failed', true);
  }
}

// This function is called from handleGoogleSignIn() - we don't need any redundant functions

/**
 * Set up the development bypass login button
 */
function setupBypassButton() {
  const bypassBtn = document.getElementById('bypass-login');
  if (bypassBtn) {
    bypassBtn.addEventListener('click', function() {
      showLoginStatus('Bypassing authentication (development only)...');
      
      // Create test credentials
      sessionStorage.setItem('irops_auth_token', 'dev_bypass_token');
      sessionStorage.setItem('irops_user_email', 'dev@aero.com');
      sessionStorage.setItem('irops_user_name', 'Developer');
      
      // Go to dashboard
      setTimeout(() => goToDashboard(), 500);
    });
  }
}

/**
 * Display a status message in the login form
 */
function showLoginStatus(message, isError = false) {
  const statusElement = document.getElementById('login-status');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.color = isError ? '#e74c3c' : '#666';
    
    if (isError) {
      statusElement.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
      statusElement.style.padding = '8px';
      statusElement.style.borderRadius = '4px';
    } else {
      statusElement.style.backgroundColor = 'transparent';
      statusElement.style.padding = '0';
    }
    
    console.log(isError ? 'Login error:' : 'Login status:', message);
  }
}

/**
 * Navigate to the dashboard
 */
function goToDashboard() {
  showLoginStatus('Redirecting to dashboard...');
  
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const dashboardUrl = `index.html?auth=${timestamp}`;
    
    // Log the navigation attempt
    console.log('Navigating to dashboard:', dashboardUrl);
    
    // Use window.location.href for the most reliable navigation
    window.location.href = dashboardUrl;
  } catch (error) {
    console.error('Navigation error:', error);
    showLoginStatus('Failed to redirect to dashboard: ' + error.message, true);
  }
}

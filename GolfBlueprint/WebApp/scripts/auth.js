// Enhanced authentication script for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth navigation
    updateAuthNavigation();
    
    // Check if current page requires authentication
    checkPageAccess();
});

/**
 * Updates navigation elements based on authentication status
 */
function updateAuthNavigation() {
    const authLinkElement = document.getElementById('auth-link');
    const profileLinkElement = document.getElementById('profile-link');
    
    // Get ONLY the navigation menu elements for protected pages
    // Use more specific selectors that only target nav links
    const recordRoundLinks = document.querySelectorAll('.nav-links a[href="round-details.html"], .nav-links a[href="../round-details.html"]');
    const shotAnalysisLinks = document.querySelectorAll('.nav-links a[href="shot-analysis.html"], .nav-links a[href="../shot-analysis.html"]');
    
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    
    if (userData) {
        // User is logged in
        try {
            const user = JSON.parse(userData);
            
            // Update auth link to logout
            if (authLinkElement) {
                authLinkElement.innerHTML = '<a href="#" class="nav-link" onclick="logout()">Logout</a>';
            }
            
            // Show profile link
            if (profileLinkElement) {
                profileLinkElement.style.display = 'block';
            }
            
            // Show protected navigation links
            recordRoundLinks.forEach(link => {
                if (link.parentElement) {
                    link.parentElement.style.display = 'block';
                }
            });
            
            shotAnalysisLinks.forEach(link => {
                if (link.parentElement) {
                    link.parentElement.style.display = 'block';
                }
            });
            
            // Make sure welcome section is visible
            const welcomeSection = document.querySelector('.welcome-section');
            if (welcomeSection) {
                welcomeSection.style.display = 'block';
            }
            
        } catch (error) {
            console.error('Error parsing user data:', error);
            // If there's an error, treat as logged out
            handleLoggedOutState(authLinkElement, profileLinkElement, recordRoundLinks, shotAnalysisLinks);
        }
    } else {
        // User is logged out
        handleLoggedOutState(authLinkElement, profileLinkElement, recordRoundLinks, shotAnalysisLinks);
    }
}

/**
 * Handle logged out state UI
 */
function handleLoggedOutState(authLinkElement, profileLinkElement, recordRoundLinks, shotAnalysisLinks) {
    // Update auth link to login
    if (authLinkElement) {
        authLinkElement.innerHTML = '<a href="login.html" class="nav-link">Login</a>';
    }
    
    // Hide profile link
    if (profileLinkElement) {
        profileLinkElement.style.display = 'none';
    }
    
    // Hide protected navigation links - only in the navigation menu
    recordRoundLinks.forEach(link => {
        if (link.parentElement && link.parentElement.closest('.nav-links')) {
            link.parentElement.style.display = 'none';
        }
    });
    
    shotAnalysisLinks.forEach(link => {
        if (link.parentElement && link.parentElement.closest('.nav-links')) {
            link.parentElement.style.display = 'none';
        }
    });
    
    // Make sure the welcome section is always visible
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        welcomeSection.style.display = 'block';
    }
}

/**
 * Function to handle logout
 */
function logout() {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    
    // Update navigation
    updateAuthNavigation();
    
    // Optional: Show logout message
    alert('You have been logged out successfully.');
    
    // Determine correct path for redirection
    let redirectPath = 'index.html';
    if (window.location.pathname.includes('/holes/')) {
        redirectPath = '../index.html';
    }
    
    // Redirect to home page
    window.location.href = redirectPath;
    
    return false; // Prevent default link behavior
}

/**
 * Check if current page requires authentication
 */
function checkPageAccess() {
    // Determine current page path
    const currentPath = window.location.pathname;
    
    // Only check specific protected pages - not the home page
    const isRoundDetails = currentPath.includes('round-details.html');
    const isShotAnalysis = currentPath.includes('shot-analysis.html');
    const isHolePage = currentPath.includes('/holes/hole');
    
    // These pages require authentication
    const requiresAuth = isRoundDetails || isShotAnalysis || isHolePage;
    
    if (requiresAuth) {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        
        if (!userData) {
            // User is not logged in, show error and redirect
            displayAuthError();
            return false;
        }
    }
    
    return true;
}

/**
 * Display authentication error message
 */
function displayAuthError() {
    // Create container for error message
    const errorContainer = document.createElement('div');
    errorContainer.className = 'auth-error';
    errorContainer.style.backgroundColor = '#f8d7da';
    errorContainer.style.color = '#721c24';
    errorContainer.style.padding = '20px';
    errorContainer.style.margin = '50px auto';
    errorContainer.style.borderRadius = '5px';
    errorContainer.style.maxWidth = '600px';
    errorContainer.style.textAlign = 'center';
    errorContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    
    // Add error message
    errorContainer.innerHTML = `
        <h2>Account Required</h2>
        <p>You must be logged in to access this page.</p>
        <button id="login-redirect" style="
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 15px;">Go to Login</button>
    `;
    
    // Get the appropriate container based on the page type
    const currentPath = window.location.pathname;
    let mainContent;
    
    if (currentPath.includes('/holes/')) {
        // For hole pages
        mainContent = document.querySelector('.hole-content');
        if (mainContent) {
            // Clear existing hole content
            mainContent.innerHTML = '';
            mainContent.appendChild(errorContainer);
        } else {
            // Fallback
            document.body.innerHTML = '';
            document.body.appendChild(document.querySelector('.navbar') || document.createElement('div'));
            document.body.appendChild(errorContainer);
        }
    } else {
        // For other protected pages
        document.body.innerHTML = '';
        // Keep the navbar if it exists
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            document.body.appendChild(navbar.cloneNode(true));
        }
        document.body.appendChild(errorContainer);
    }
    
    // Add event listener to the login button
    setTimeout(() => {
        const loginButton = document.getElementById('login-redirect');
        if (loginButton) {
            loginButton.addEventListener('click', function() {
                // Determine the correct path for login.html based on current location
                let loginPath = 'login.html';
                if (window.location.pathname.includes('/holes/')) {
                    loginPath = '../login.html';
                }
                window.location.href = loginPath;
            });
        }
    }, 100);
}
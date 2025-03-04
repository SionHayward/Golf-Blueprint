// Standard authentication script for all pages
function updateAuthNavigation() {
    const authLinkElement = document.getElementById('auth-link');
    const profileLinkElement = document.getElementById('profile-link');
    
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    
    if (userData) {
        // User is logged in
        try {
            const user = JSON.parse(userData);
            
            // Update auth link to logout
            authLinkElement.innerHTML = '<a href="#" class="nav-link" onclick="logout()">Logout</a>';
            
            // Show profile link
            if (profileLinkElement) {
                profileLinkElement.style.display = 'block';
            }
            
        } catch (error) {
            console.error('Error parsing user data:', error);
            // If there's an error, treat as logged out
            authLinkElement.innerHTML = '<a href="login.html" class="nav-link">Login</a>';
            if (profileLinkElement) {
                profileLinkElement.style.display = 'none';
            }
        }
    } else {
        // User is logged out
        authLinkElement.innerHTML = '<a href="login.html" class="nav-link">Login</a>';
        if (profileLinkElement) {
            profileLinkElement.style.display = 'none';
        }
    }
}

// Function to handle logout
function logout() {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    
    // Update navigation
    updateAuthNavigation();
    
    // Optional: Show logout message
    alert('You have been logged out successfully.');
    
    // Redirect to home page if not already there
    if (window.location.pathname !== '/index.html' && 
        window.location.pathname !== '/' && 
        window.location.pathname !== '') {
        window.location.href = 'index.html';
    }
    
    return false; // Prevent default link behavior
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateAuthNavigation);
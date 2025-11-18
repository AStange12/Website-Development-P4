// Login functionality for Yippee! splash page
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.getElementsByClassName('close')[0];
    const loginForm = document.getElementById('loginForm');
    
    // Demo user accounts (hardcoded as specified)
    const users = {
        'Joe': 'joe123',
        'Jane': 'jane321'
    };
    
    // Open modal when login button is clicked
    loginBtn.onclick = function() {
        modal.style.display = 'block';
        // Focus on username field for better UX
        document.getElementById('username').focus();
    }
    
    // Close modal when X is clicked
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        clearForm();
    }
    
    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            clearForm();
        }
    }
    
    // Handle form submission
    loginForm.onsubmit = function(event) {
        event.preventDefault(); // Prevent actual form submission
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validate login credentials
        if (users[username] && users[username] === password) {
            // Success! Store login status and redirect to FotoFan
            sessionStorage.setItem('loggedInUser', username);
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // Show success message briefly
            alert(`Welcome back, ${username}! Redirecting to FotoFan...`);
            
            // Redirect to FotoFan page
            window.location.href = 'FotoFan.html';
        } else {
            // Invalid credentials
            alert('Invalid username or password. Please try again.\\n\\nDemo accounts:\\n- Joe / joe123\\n- Jane / jane321');
            clearForm();
        }
    }
    
    // Clear form function
    function clearForm() {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
    
    // Update UI based on login status
    function updateLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        
        if (isLoggedIn && loggedInUser) {
            loginBtn.textContent = `Hello, ${loggedInUser}!`;
            loginBtn.style.background = 'rgba(34, 197, 94, 0.2)';
            loginBtn.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            
            // Change click behavior to logout
            loginBtn.onclick = function() {
                const confirmLogout = confirm('Are you sure you want to logout?');
                if (confirmLogout) {
                    sessionStorage.removeItem('loggedInUser');
                    sessionStorage.removeItem('isLoggedIn');
                    location.reload(); // Refresh page to reset UI
                }
            }
        }
    }
    
    // Handle service links
    const serviceLinks = document.querySelectorAll('.service-link');
    serviceLinks.forEach(link => {
        if (link.getAttribute('href') === 'FotoFan.html') {
            // FotoFan requires login
            link.onclick = function(event) {
                const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
                
                if (!isLoggedIn) {
                    event.preventDefault(); // Stop navigation
                    alert('Please login to access FotoFan!');
                    modal.style.display = 'block';
                    document.getElementById('username').focus();
                }
                // If logged in, allow normal navigation
            }
        } else if (link.getAttribute('href') === '#') {
            // Other services show development message
            link.onclick = function(event) {
                event.preventDefault();
                alert('This service is currently in development by other web teams. Check back soon!');
            }
        }
    });
    
    // Check login status on page load
    updateLoginStatus();
});

// Escape key closes modal
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('loginModal');
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggling
    const themeToggle = document.getElementById('theme-toggle');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');

            if (isDarkMode) {
                themeIconLight.style.display = 'none';
                themeIconDark.style.display = 'block';
            } else {
                themeIconLight.style.display = 'block';
                themeIconDark.style.display = 'none';
            }

            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }

    // Initialize theme from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIconLight) themeIconLight.style.display = 'none';
        if (themeIconDark) themeIconDark.style.display = 'block';
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navbar = document.querySelector('.navbar nav');

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
});

/**
 * Helper to get the base API URL.
 * It will use port 3000 if the frontend is served via a different port (like 5500 for Live Server).
 */
function getApiBase() {
    const { protocol, hostname, port } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        if (port !== '3000' && port !== '') {
            return `${protocol}//${hostname}:3000/api`;
        }
    }
    return '/api';
}

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic (if applicable)
    const themeToggle = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');

    const applyTheme = (theme) => {
        if (!lightIcon || !darkIcon) return;
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        } else {
            document.body.classList.remove('dark-mode');
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const newTheme = isDarkMode ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Login/Logout Toggle Logic
    const loginLinks = document.querySelectorAll('.btn-outline a');
    const token = localStorage.getItem('token');

    loginLinks.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        if (text === 'log in' || link.href.includes('sign-up.html') || link.href.includes('sign-in.html')) {
            if (token) {
                link.textContent = 'Log Out';
                link.href = '#';
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('token');
                    window.location.href = 'index.html';
                });
            } else {
                // Point to the signin tab if the text says "Log In"
                if (text === 'log in') {
                    link.href = 'sign-up.html#signin';
                }
            }
        }
    });
});

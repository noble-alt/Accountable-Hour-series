document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signupForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${getApiBase()}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Sign up successful! Please log in.');
                    window.location.hash = '#signin';
                } else {
                    alert(result.message || 'Sign up failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signinForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${getApiBase()}/auth/signin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    alert('Login successful!');
                    window.location.href = 'index.html';
                } else {
                    alert(result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Toggle between Sign Up and Sign In based on hash
    const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash === '#signin') {
            document.querySelector('.container').classList.add('right-panel-active');
        } else {
            document.querySelector('.container').classList.remove('right-panel-active');
        }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
});

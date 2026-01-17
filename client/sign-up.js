document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const toggleMessage = document.querySelector('.toggle-message');
    const fullnameGroup = document.getElementById('fullname-group');
    const fullnameInput = fullnameGroup.querySelector('input');
    const form = document.getElementById('login-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('error-message');

    const showError = (msg) => {
        errorMessage.textContent = msg;
        errorMessage.style.display = 'block';
    };

    const hideError = () => {
        errorMessage.style.display = 'none';
    };

    const updateUI = (mode) => {
        const title = document.querySelector('.login-box h1');
        if (mode === 'signup') {
            title.textContent = 'Create Account';
            signupBtn.classList.add('active');
            signinBtn.classList.remove('active');
            toggleMessage.innerHTML = 'Already have an account? <a href="#signin">Sign in!</a>';
            fullnameGroup.style.display = 'block';
            fullnameInput.required = true;
            submitBtn.textContent = 'Continue';
        } else {
            title.textContent = 'Welcome Back';
            signinBtn.classList.add('active');
            signupBtn.classList.remove('active');
            toggleMessage.innerHTML = 'No Account? <a href="#signup">Sign up!!</a>';
            fullnameGroup.style.display = 'none';
            fullnameInput.required = false;
            submitBtn.textContent = 'Log In';
        }
    };

    signupBtn.addEventListener('click', () => {
        window.location.hash = 'signup';
    });

    signinBtn.addEventListener('click', () => {
        window.location.hash = 'signin';
    });

    window.addEventListener('hashchange', () => {
        const mode = window.location.hash === '#signin' ? 'signin' : 'signup';
        updateUI(mode);
    });

    // Redirect if already logged in
    if (localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize UI based on hash
    const initialMode = window.location.hash === '#signin' ? 'signin' : 'signup';
    updateUI(initialMode);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();
        const isSignUp = window.location.hash !== '#signin';
        const endpoint = isSignUp ? '/signup' : '/login';

        // More compatible form data extraction with trimming
        const data = {};
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            data[key] = typeof value === 'string' ? value.trim() : value;
        }

        if (!isSignUp) {
            delete data.fullname;
        } else if (!data.fullname) {
            showError('Fullname is required for signup');
            return;
        }

        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            let result;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                result = await response.json();
            } else {
                result = { message: await response.text() };
            }

            if (response.ok) {
                if (result.token) {
                    localStorage.setItem('token', result.token);
                }

                // Show success message on page instead of alert for better UX
                submitBtn.textContent = 'Success!';
                submitBtn.style.backgroundColor = '#6a994e';

                const successMsg = document.createElement('div');
                successMsg.textContent = (result.message || 'Success!') + ' Redirecting...';
                successMsg.style.color = '#6a994e';
                successMsg.style.marginTop = '10px';
                form.appendChild(successMsg);

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showError(result.message || 'An error occurred during ' + (isSignUp ? 'signup' : 'login'));
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Network error or server is down. Please try again later.');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    const socialIcons = document.querySelectorAll('.social-login i');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            showError('Social login is not yet implemented. Please use the form.');
        });
    });
});

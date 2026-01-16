document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const toggleMessage = document.querySelector('.toggle-message');
    const fullnameGroup = document.getElementById('fullname-group');
    const fullnameInput = fullnameGroup.querySelector('input');
    const form = document.getElementById('login-form');

    const updateUI = (mode) => {
        if (mode === 'signup') {
            signupBtn.classList.add('active');
            signinBtn.classList.remove('active');
            toggleMessage.innerHTML = 'Already have an account? <a href="#signin">Sign in!</a>';
            fullnameGroup.style.display = 'block';
            fullnameInput.required = true;
        } else {
            signinBtn.classList.add('active');
            signupBtn.classList.remove('active');
            toggleMessage.innerHTML = 'No Account? <a href="#signup">Sign up!!</a>';
            fullnameGroup.style.display = 'none';
            fullnameInput.required = false;
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

    // Initialize UI based on hash
    const initialMode = window.location.hash === '#signin' ? 'signin' : 'signup';
    updateUI(initialMode);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isSignUp = window.location.hash !== '#signin';
        const endpoint = isSignUp ? '/signup' : '/login';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!isSignUp) {
            delete data.fullname;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.token) {
                    localStorage.setItem('token', result.token);
                }
                alert(result.message || 'Success!');
                window.location.href = 'index.html';
            } else {
                alert(result.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Check console for details.');
        }
    });
});

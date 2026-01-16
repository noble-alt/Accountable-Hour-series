document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const toggleMessage = document.querySelector('.toggle-message');
    const fullnameGroup = document.getElementById('fullname-group');
    const form = document.getElementById('login-form');

    const updateUI = (mode) => {
        if (mode === 'signup') {
            signupBtn.classList.add('active');
            signinBtn.classList.remove('active');
            toggleMessage.textContent = 'Already have an account? Sign in!';
            fullnameGroup.style.display = 'block';
            window.location.hash = 'signup';
        } else {
            signinBtn.classList.add('active');
            signupBtn.classList.remove('active');
            toggleMessage.textContent = 'No Account, Sign up!!';
            fullnameGroup.style.display = 'none';
            window.location.hash = 'signin';
        }
    };

    signupBtn.addEventListener('click', () => updateUI('signup'));
    signinBtn.addEventListener('click', () => updateUI('signin'));

    // Initialize UI based on hash
    if (window.location.hash === '#signin') {
        updateUI('signin');
    } else {
        updateUI('signup');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isSignUp = signupBtn.classList.contains('active');
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

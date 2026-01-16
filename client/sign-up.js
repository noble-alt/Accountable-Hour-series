document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const toggleMessage = document.querySelector('.toggle-message');
    const fullnameGroup = document.getElementById('fullname-group');
    const form = document.getElementById('login-form');

    signupBtn.addEventListener('click', () => {
        signupBtn.classList.add('active');
        signinBtn.classList.remove('active');
        toggleMessage.textContent = 'No Account, Sign up!!';
        fullnameGroup.style.display = 'block';
    });

    signinBtn.addEventListener('click', () => {
        signinBtn.classList.add('active');
        signupBtn.classList.remove('active');
        toggleMessage.textContent = 'Already have an account? Sign in!';
        fullnameGroup.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isSignUp = signupBtn.classList.contains('active');
        const endpoint = isSignUp ? '/signup' : '/login';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

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
                console.log('Success:', result);
                if (!isSignUp && result.token) {
                    localStorage.setItem('token', result.token);
                }
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

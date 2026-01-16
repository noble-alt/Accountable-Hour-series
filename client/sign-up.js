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
});

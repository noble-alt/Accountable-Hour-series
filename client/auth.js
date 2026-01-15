document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');
    const formHelper = document.getElementById('form-helper');
    const continueBtn = document.querySelector('.continue-btn');

    // Event listener for the 'sign up' button
    signupBtn.addEventListener('click', () => {
        // Set button states
        signupBtn.classList.add('active');
        signinBtn.classList.remove('active');

        // Show the sign-up form and hide the sign-in form
        signupForm.classList.remove('hidden');
        signinForm.classList.add('hidden');

        // Update helper text
        formHelper.textContent = 'Already have an account? Sign in!';
    });

    // Event listener for the 'Sign in' button
    signinBtn.addEventListener('click', () => {
        // Set button states
        signinBtn.classList.add('active');
        signupBtn.classList.remove('active');

        // Show the sign-in form and hide the sign-up form
        signinForm.classList.remove('hidden');
        signupForm.classList.add('hidden');

        // Update helper text
        formHelper.textContent = 'No Account, Sign up!!';
    });

    // Event listener for the 'Continue' button
    continueBtn.addEventListener('click', () => {
        const isSignUp = signupBtn.classList.contains('active');
        const form = isSignUp ? signupForm : signinForm;
        const endpoint = isSignUp ? '/signup' : '/login';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation is now handled by the 'required' attribute in HTML.
        // You could add more complex validation here if needed.

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message) });
            }
            return response.json();
        })
        .then(result => {
            console.log('Success:', result);
            window.location.href = 'index.html'; // Redirect to homepage on success
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. (Check console for details)');
        });
    });
});

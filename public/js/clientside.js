document.addEventListener('DOMContentLoaded', function() {
    // Check if the user is logged in
    const isLoggedIn = true;

    // Get the sign-in/sign-up and user name elements
    const signinSignupElement = document.getElementById('signin-signup');
    const userNameElement = document.getElementById('user-name');

    // If the user is logged in, hide sign-in/sign-up and show user name
    if (isLoggedIn) {
        signinSignupElement.style.display = 'none';
        userNameElement.style.display = 'block';
    } else {
        signinSignupElement.style.display = 'block';
        userNameElement.style.display = 'none';
    }
});
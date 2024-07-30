document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await loginUser(email, password);
                
                if (response.ok) {
                    const data = await response.json();
                    document.cookie = `token=${data.access_token}; path=/`;
                    window.location.href = 'index.html';
                } else {
                    displayErrorMessage('Login failed: ' + response.statusText);
                }
            } catch (error) {
                displayErrorMessage('An error occurred: ' + error.message);
            }
        });
    }
});

async function loginUser(email, password) {
    const response = await fetch('https://your-api-url/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return response;
}

function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerText = message;
    errorMessageElement.style.display = 'block';
}

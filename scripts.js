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
    } else {
        checkAuthentication();
        setupCountryFilter();
    }
});

async function loginUser(email, password) {
    const response = await fetch('https://localhost:5000/login', {
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

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        fetchPlaces(token);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('https://your-api-url/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
            populateCountryFilter(places);
        } else {
            console.error('Failed to fetch places:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
            <img src="${place.image}" alt="${place.name}" class="place-image">
            <h3>${place.name}</h3>
            <p>Price per night: ${place.price}</p>
            <p>Location: ${place.location}</p>
            <button class="details-button" onclick="viewDetails(${place.id})">View Details</button>
        `;
        placeCard.dataset.country = place.country;
        placesList.appendChild(placeCard);
    });
}

function setupCountryFilter() {
    const countryFilter = document.getElementById('country-filter');
    countryFilter.addEventListener('change', filterPlacesByCountry);
}

function populateCountryFilter(places) {
    const countryFilter = document.getElementById('country-filter');
    const countries = [...new Set(places.map(place => place.country))];

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

function filterPlacesByCountry() {
    const selectedCountry = document.getElementById('country-filter').value;
    const placeCards = document.querySelectorAll('.place-card');

    placeCards.forEach(card => {
        if (selectedCountry === '' || card.dataset.country === selectedCountry) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function viewDetails(placeId) {
    window.location.href = `place.html?id=${placeId}`;
}

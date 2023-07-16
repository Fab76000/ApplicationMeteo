// Importing the 'tabJoursEnOrdre' module from the './Utilitaire/gestionTemps.js' file
import tabJoursEnOrdre from './Utilitaire/gestionTemps.mjs';

// Storing the API key for accessing weather data
const API_KEY = 'e15b4537e895c8d5969c66a1b778a5d3';


// Creating an object for handling DOM manipulation
const domManipulator = {
    // Storing references to various DOM elements
    temps: document.querySelector('.temps'),
    temperature: document.querySelector('.temperature'),
    localisation: document.querySelector('.localisation'),
    heure: document.querySelectorAll('.heure-nom-prevision'),
    tempPourH: document.querySelectorAll('.heure-prevision-valeur'),
    joursDiv: document.querySelectorAll('.jour-prevision-nom'),
    tempJoursDiv: document.querySelectorAll('.jour-prevision-temp'),
    imgIcone: document.querySelector('.logo-meteo'),
    chargementContainer: document.querySelector('.overlay-icone-chargement'),
    humidity: document.querySelector('.humidity'),

    displayWeatherData(weatherData) {
        const { current } = weatherData;
        const { description, temp, humidity } = current;

        this.temps.innerText = description;
        this.temperature.innerText = `${Math.trunc(temp)}°`;
        this.localisation.innerText = weatherData.timezone;
        this.humidity.innerText = `${Math.trunc(humidity)}%`;

        // ... update other DOM elements
    },

    // Function to show the loading state on the DOM
    showLoading() {
        this.chargementContainer.classList.add('disparition');
    },

    // Function to hide the loading state on the DOM
    hideLoading() {
        this.chargementContainer.classList.toggle('disparition');
    }
};

// Function for fetching weather data from the API
/*async function fetchWeatherData(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall`, {
            method: 'GET',
            params: {
                lat: latitude,
                lon: longitude,
                exclude: 'minutely',
                units: 'metric',
                lang: 'fr',
                appid: API_KEY
            }
        });
        console.log('response:', response); // Debug statement
        const weatherData = await response.json();
        console.log('weatherData:', weatherData); // Debug statement
        return weatherData && weatherData.current ? weatherData : null;

    } catch (error) {
        console.error(error);
        return null;
    }
}*/

async function fetchWeatherData(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=${API_KEY}`);
        console.log('response:', response);
        const weatherData = await response.json();
        console.log('weatherData:', weatherData);
        return weatherData && weatherData.current ? weatherData : null;
    } catch (error) {
        console.error(error); return null;
    }
}



// Refactored function to display weather data on the DOM
const displayFetchedWeatherData = (weatherData) => {
    weatherData && domManipulator.displayWeatherData(weatherData);
}

// Function for displaying weather data
async function displayWeather() {
    try {
        const { coords } = await getCurrentPosition();
        const weatherData = await fetchWeatherData(coords.latitude, coords.longitude);
        displayFetchedWeatherData(weatherData?.current || null);
    } catch (error) {
        handleGeolocationError(error);
    }
}

// Refactored function to get the current position
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            // Add a button click event listener to trigger geolocation request
            const button = document.querySelector('.geolocation-button');
            button.addEventListener('click', () => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

        } else {
            reject(new Error('Geolocation is not supported by your browser.'));
        }
    });
}

// Refactored function to handle geolocation error
const handleGeolocationError = (error) => console.error('An error occurred while retrieving the geolocation:', error);

// Call the displayWeather function to start fetching and displaying weather data
displayWeather();



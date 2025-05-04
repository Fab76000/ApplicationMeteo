//Axes d'amélioration : Afficher image de la météo
// Récupérer dans la barre de recherche les coordonnées de la ville en tapant le nom de la ville (apparement plus possible avec nouveau openweathermap api)



const apiKey = 'e15b4537e895c8d5969c66a1b778a5d3';
const apiUrl = 'https://api.openweathermap.org/data/3.0/onecall?exclude=minutely,alerts&units=metric&appid=' + apiKey;
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const cityName = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const humidityElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind");
let lat = "";
let lon = "";

//var geocodingUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;



async function checkWeather(lat, lon) {
    const response = await fetch(apiUrl + `&lat=${lat}&lon=${lon}`);
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        let data = await response.json();
        cityName.innerHTML = data.current.name;
        tempElement.innerHTML = Math.round(data.current.temp) + '°C';
        humidityElement.innerHTML = Math.round(data.current.humidity) + '%';

        if (data.current && data.current.wind_speed) {
            windElement.innerHTML = Math.round(data.current.wind_speed) + 'km/h';
        } else {
            windElement.innerHTML = 'N/A';
        }

        const weatherIcon = document.querySelector(".weather-icon");
        if (data && data.weather && data.weather.length > 0) {
            if (data.weather[0].main === "Clouds") {
                weatherIcon.src = "images/clouds.png";
            } else if (data.weather[0].main === 'Clear') {
                weatherIcon.src = "images/clear.png";
            } else if (data.weather[0].main === 'Rain') {
                weatherIcon.src = "images/rain.png";
            } else if (data.weather[0].main === 'Drizzle') {
                weatherIcon.src = "images/drizzle.png";
            } else if (data.weather[0].main === 'Mist') {
                weatherIcon.src = "images/mist.png";
            }

            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display = "none";
        }
    }
}


// Call the function with the desired latitude and longitude values

searchBtn.addEventListener("click", async () => {
    const coordinates = searchBox.value.split(",");
    if (coordinates.length === 2) {
        lat = parseFloat(coordinates[0].trim());
        lon = parseFloat(coordinates[1].trim());
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

        try {
            const response = await fetch(geocodingUrl);
            const data = await response.json();
            if (data && data.length > 0) {
                const city = data[0].name;
                console.log('City:', city);
                console.log(data)
                cityName.innerHTML = city; // Set the city name in the HTML

                const weatherData = await fetch(apiUrl + `&lat=${lat}&lon=${lon}`);
                const weather = await weatherData.json();
                console.log(weather)
                tempElement.innerHTML = Math.round(weather.current.temp) + '°C';
                humidityElement.innerHTML = Math.round(weather.current.humidity) + '%'
                windElement.innerHTML = Math.round(weather.current.wind_speed) + 'km/h';

                console.log('API Response:', data);

            } else {
                console.error('Invalid response:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        // Handle invalid input or show an error message
        console.log("Invalid input. Please enter latitude and longitude in the format: LATITUDE, LONGITUDE");
    }
});


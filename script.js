
const apiKey = 'e15b4537e895c8d5969c66a1b778a5d3';
const cityInput = document.getElementById('cityInput');
const cityName = document.querySelector('.city');
const tempElement = document.querySelector('.temp');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind');
const weatherIcon = document.querySelector('.weather-icon');

// Fonction : récupérer les coordonnées d'une ville
async function getCityCoordinates(city) {
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(geocodingUrl);
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon, name, country } = data[0];
            checkWeather(lat, lon, `${name}, ${country}`);
        } else {
            showError("Ville non trouvée.");
        }
    } catch (error) {
        showError("Erreur lors de la récupération des coordonnées.");
        console.error(error);
    }
}

// Fonction : afficher la météo avec les coordonnées
async function checkWeather(lat, lon, cityName) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        // Mettre à jour les données météo
        document.querySelector(".city").textContent = cityName;
        document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
        document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
        document.querySelector(".wind-speed").textContent = `${data.wind.speed}`;

        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.querySelector(".weather-icon").src = iconUrl;

        // Afficher les sections météo
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".details").style.display = "flex";

    } catch (error) {
        console.error("Erreur lors de la récupération des données météo", error);
        alert("Impossible de récupérer la météo.");
    }
}



function showError(message) {
    alert(message);
    document.querySelector(".weather").style.display = "none";
    const errorBlock = document.querySelector(".error");
    if (errorBlock) errorBlock.style.display = "block";
}

function searchCity() {
    const city = cityInput.value.trim();
    if (city !== "") {
        getCityCoordinates(city);
        cityInput.value = "";
        suggestionBox.innerHTML = "";
    } else {
        alert("Veuillez entrer une ville.");
    }
}

document.getElementById('searchBtn').addEventListener('click', searchCity);

const suggestionBox = document.createElement("ul");
suggestionBox.classList.add("suggestions");
document.querySelector(".search").appendChild(suggestionBox);

cityInput.addEventListener("input", async () => {
    const input = cityInput.value.trim();
    if (input.length === 0) {
        suggestionBox.innerHTML = "";
        return;
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=10&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const seen = new Set();
        const uniqueResults = data.filter(item => {
            const key = `${item.name},${item.state || ""},${item.country}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        suggestionBox.innerHTML = "";
        uniqueResults.forEach(place => {
            const fullCityName = `${place.name}${place.state ? ', ' + place.state : ''}, ${place.country}`;
            const item = document.createElement("li");
            item.textContent = fullCityName;
            item.addEventListener("click", () => {
                const fullCityName = `${place.name}${place.state ? ', ' + place.state : ''}, ${place.country}`;
                checkWeather(place.lat, place.lon, fullCityName); // Utiliser coordonnées précises
                suggestionBox.innerHTML = "";
            });
            suggestionBox.appendChild(item);
        });
    } catch (error) {
        console.error("Erreur dans la récupération des suggestions", error);
    }
});

document.addEventListener("click", (e) => {
    if (!document.querySelector(".search").contains(e.target)) {
        suggestionBox.innerHTML = "";
    }

});

document.getElementById('resetBtn').addEventListener('click', () => {
    cityInput.value = "";
    suggestionBox.innerHTML = "";
    document.querySelector(".weather").style.display = "none";
    const errorBlock = document.querySelector(".error");
    if (errorBlock) errorBlock.style.display = "none";
})
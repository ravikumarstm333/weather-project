const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const locationButton = document.getElementById('location-button');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const forecastList = document.getElementById('forecast-list');
const errorPopup = document.getElementById('error-popup');

const apiKey = 'a6d1db3c85c08141f7ae84bee8e2cdce'; // Replace with your weather API key
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// Function to toggle button visibility
function toggleButtons() {
    if (searchBar.value.trim()) {
        searchButton.style.display = 'inline-block';
        locationButton.style.display = 'none';
    } else {
        searchButton.style.display = 'none';
        locationButton.style.display = 'inline-block';
    }
}

// Set initial button visibility when the page loads
window.addEventListener('load', toggleButtons);

// Update button visibility whenever the search bar content changes
searchBar.addEventListener('input', toggleButtons);

// Function to fetch weather data
async function fetchWeather(city) {
    const response = await fetch(`${weatherApiUrl}?q=${city}&appid=${apiKey}&units=metric`);
    if (response.status !== 200) {
        throw new Error('City not found');
    }
    const data = await response.json();
    return data;
}

// Function to fetch hourly forecast
async function fetchForecast(city) {
    const response = await fetch(`${forecastApiUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}

// Function to get day weather icon
function getDayWeatherIcon(condition) {
    switch (condition) {
        case 'clouds':
            return '<img src="images/clouds.png" alt="Clouds">';
        case 'clear':
            return '<img src="images/clear.png" alt="Clear">';
        case 'rain':
            return '<img src="images/rain.png" alt="Rain">';
        case 'snow':
            return '<img src="images/snow.png" alt="Snow">';
        case 'thunderstorm':
            return '<img src="images/thunderstorm.png" alt="Thunderstorm">';
        case 'drizzle':
            return '<img src="images/drizzle.png" alt="Drizzle">';
        case 'mist':
            return '<img src="images/mist.png" alt="Mist">';
        case 'wind':
            return '<img src="images/wind.png" alt="Wind">';
        case 'humidity':
            return '<img src="images/humidity.png" alt="Humidity">';
        default:
            return '<img src="images/clear.png" alt="Clear">';
    }
}

// Function to get night weather icon
function getNightWeatherIcon(condition) {
    switch (condition) {
        case 'clouds':
            return '<img src="images/clouds.png" alt="Clouds">';
        case 'clear':
            return '<img src="images/clear.png" alt="Clear">';
        case 'rain':
            return '<img src="images/rain.png" alt="Rain">';
        case 'snow':
            return '<img src="images/snow.png" alt="Snow">';
        case 'thunderstorm':
            return '<img src="images/thunderstorm.png" alt="Thunderstorm">';
        case 'drizzle':
            return '<img src="images/drizzle.png" alt="Drizzle">';
        case 'mist':
            return '<img src="images/mist.png" alt="Mist">';
        case 'wind':
            return '<img src="images/wind.png" alt="Wind">';
        case 'humidity':
            return '<img src="images/humidity.png" alt="Humidity">';
        default:
            return '<img src="images/clear.png" alt="Clear">';
    }
}

// Function to get weather icon based on time of day
function getWeatherIcon(condition, isDayTime) {
    return isDayTime ? getDayWeatherIcon(condition) : getNightWeatherIcon(condition);
}

// Function to update weather display
function updateWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;

    // Determine if it's day or night based on the current time
    const currentTime = new Date().getHours();
    const isDayTime = currentTime >= 6 && currentTime < 18;
    const weatherCondition = data.weather[0].main.toLowerCase();
    
    // Update weather icon based on conditions and time of day
    weatherIcon.innerHTML = getWeatherIcon(weatherCondition, isDayTime);
}

// Function to update hourly forecast
function updateForecast(data) {
    forecastList.innerHTML = ''; // Clear previous content

    // Display the next 10 forecast items
    const forecastItems = data.list.slice(0, 10);

    forecastItems.forEach(item => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';

        // Get weather condition and icon
        const weatherCondition = item.weather[0].main.toLowerCase();
        
        // Determine if it's day or night based on the forecast time
        const forecastTime = new Date(item.dt * 1000);
        const hours = forecastTime.getHours();
        const isDayTime = hours >= 6 && hours < 18;
        const weatherIcon = getWeatherIcon(weatherCondition, isDayTime);

        // Format time in 12-hour AM/PM format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format

        // Add content to the forecast item
        forecastItem.innerHTML = `
            <p><strong>${formattedHours}:00 ${ampm}</strong></p>
            <p class="weather-icon">${weatherIcon}</p> <!-- Weather icon -->
            <p>${Math.round(item.main.temp)}°C</p>
            <p>${item.weather[0].main}</p>
        `;
        forecastList.appendChild(forecastItem);
    });
}

// Function to show the error pop-up
function showPopup() {
    errorPopup.style.display = 'block';
}

// Function to close the error pop-up
function closePopup() {
    errorPopup.style.display = 'none';
}

// Event listeners
searchButton.addEventListener('click', async () => {
    const city = searchBar.value.trim();
    if (city) {
        try {
            const weatherData = await fetchWeather(city);
            const forecastData = await fetchForecast(city);
            updateWeather(weatherData);
            updateForecast(forecastData);
            closePopup(); // Hide error message if successful
            cityName.style.display = 'block'; // Show city name
        } catch (error) {
            showPopup(); // Show error message
            cityName.style.display = 'none'; // Hide city name
        }
    }
});

locationButton.addEventListener('click', async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`${weatherApiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            const weatherData = await response.json();
            const forecastData = await fetchForecast(weatherData.name);
            updateWeather(weatherData);
            updateForecast(forecastData);
            closePopup(); // Hide error message if successful
            cityName.style.display = 'block'; // Show city name
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});
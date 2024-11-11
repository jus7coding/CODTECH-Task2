// script.js

// Move API key to a separate configuration file
const API_KEY = atob('OGFhMDcwYzA3MGJkOWJmNTM0YjZhNjAzOWNlZGQ4YjE='); // Base64 encoded

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn'); 
const weatherInfo = document.querySelector('.weather-info');

async function getWeather() {
    const city = cityInput.value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayWeather(data);
        
        // Get and display forecast
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
        
        weatherInfo.style.display = 'block';

    } catch (error) {
        if (error.message.includes('404')) {
            alert('City not found! Please check the city name.');
        } else {
            alert('Error fetching weather data! Please try again.');
        }
        console.error('Error:', error);
    }
}

function displayWeather(data) {
    document.getElementById('city').textContent = data.name;
    document.getElementById('country').textContent = data.sys.country;
    document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    
    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ''; // Clear previous forecast

    // Get one forecast per day
    const dailyData = data.list.filter(reading => reading.dt_txt.includes('12:00:00'));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const description = day.weather[0].description;
        const iconCode = day.weather[0].icon;

        const forecastCard = `
            <div class="forecast-card">
                <div class="date">${dayName}</div>
                <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
                <div class="temp">${temp}°C</div>
                <div class="description">${description}</div>
            </div>
        `;

        forecastDiv.innerHTML += forecastCard;
    });
}

// Event Listeners
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Load default city weather
window.addEventListener('load', () => {
    cityInput.value = '';
    getWeather();
}); 
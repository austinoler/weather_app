var API_KEY = "ad03ec6026a6a854547434fe2090eef0"; // Replace with your API key
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast";

var searchForm = document.getElementById("search-form");
var cityInput = document.getElementById("city-input");
var currentWeather = document.getElementById("current-weather");
var forecast = document.getElementById("forecast");
var searchHistory = document.getElementById("search-history");

// Function to get the day of the week from a Date object
function getDayOfWeek(date) {
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getUTCDay()];
}

// Function to format a Date object as "MM/DD/YYYY"
function formatDate(date) {
    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1; // Months are 0-indexed, so add 1
    var year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
}

// Function to fetch weather data from the OpenWeatherMap API
function getWeatherData(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            displayCurrentWeather(data);
            displayWeatherData(data);
            saveCityToLocalStorage(city); // Save the city to search history
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            // Display an error message to the user
            currentWeather.innerHTML = "Error: Could not retrieve weather data.";
        });
}

// Function to display current weather data in the UI
function displayCurrentWeather(data) {
    var city = data.city.name;
    var currentWeatherData = data.list[0];
    var temperatureKelvin = currentWeatherData.main.temp;
    var temperatureFahrenheit = ((temperatureKelvin - 273.15) * 9/5) + 32;
    var weatherIcon = currentWeatherData.weather[0].icon;
    var humidity = currentWeatherData.main.humidity;
    var windSpeed = currentWeatherData.wind.speed;

    // Get the current date and time based on the user's time zone
    var currentTime = new Date();
    var formattedDate = formatDate(currentTime);
    var localTime = formatTime(currentTime);

    // Update the currentWeather section with current weather data and local date/time
    currentWeather.innerHTML = `
        <h2>Current Weather in ${city}</h2>
        <p>Date: ${formattedDate}</p>
        <p>Time: ${localTime}</p>
        <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
        <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are 0-indexed, so add 1
    var year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return `${hours}:${(minutes < 10 ? '0' : '')}${minutes}`;
}

// Function to display 5-day forecast weather data in the UI
function displayWeatherData(data) {
    var forecastData = data.list;

    // Clear the forecast section
    forecast.innerHTML = "";

    // Add a title for the 5-day forecast
    var forecastTitle = document.createElement("h2");
    forecastTitle.textContent = "5 Day Forecast";
    forecast.appendChild(forecastTitle);

    var currentDate = null;

    forecastData.forEach((dayData) => {
        var timestamp = dayData.dt * 1000;
        var date = new Date(timestamp);
        var dayOfWeek = getDayOfWeek(date);
        var formattedDate = formatDate(date);
        var temperatureKelvin = dayData.main.temp;
        var temperatureFahrenheit = ((temperatureKelvin - 273.15) * 9/5) + 32;
        var weatherIcon = dayData.weather[0].icon;
        var humidity = dayData.main.humidity;
        var windSpeed = dayData.wind.speed;

        if (formattedDate !== currentDate) {
            // Create a container for each day's data
            var dayContainer = document.createElement("div");
            dayContainer.classList.add("forecast-day");

            // Create a title for the day (day of the week and date)
            var dayTitle = document.createElement("h3");
            dayTitle.textContent = `${dayOfWeek}, ${formattedDate}`;

            dayContainer.appendChild(dayTitle);

            dayContainer.innerHTML += `
                <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
                <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            `;

            // Append the day's container to the forecast section
            forecast.appendChild(dayContainer);

            currentDate = formattedDate;
        }
    });
}

// Function to save the city to localStorage
function saveCityToLocalStorage(city) {
    var searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!searchHistoryArray.includes(city)) {
        searchHistoryArray.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));
        renderSearchHistory();
    }
}

// Function to render search history
function renderSearchHistory() {
    var searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.innerHTML = "";
    searchHistoryArray.forEach((city) => {
        var li = document.createElement("li");
        li.textContent = city;
        searchHistory.appendChild(li);
    });
}

// Event listener for the search form submission
searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var city = cityInput.value.trim();
    if (city !== "") {
        getWeatherData(city);
        cityInput.value = "";
    }
});

// Event listener for clicking on a city in the search history
searchHistory.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        var city = e.target.textContent;
        getWeatherData(city);
    }
});

// Initial rendering of the search history
renderSearchHistory();
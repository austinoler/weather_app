var API_KEY = "ad03ec6026a6a854547434fe2090eef0"; // Replace with your API key
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast";

var searchForm = document.getElementById("search-form");
var cityInput = document.getElementById("city-input");
var currentWeather = document.getElementById("current-weather");
var forecast = document.getElementById("forecast");
var searchHistory = document.getElementById("search-history");

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
    var date = new Date(data.list[0].dt * 1000).toLocaleDateString();
    var temperatureKelvin = data.list[0].main.temp;
    var temperatureFahrenheit = ((temperatureKelvin - 273.15) * 9/5) + 32;
    var weatherIcon = data.list[0].weather[0].icon;
    var humidity = data.list[0].main.humidity;
    var windSpeed = data.list[0].wind.speed;

    // Update the currentWeather section with current weather data
    currentWeather.innerHTML = `
        <h2>Current Weather in ${city}</h2>
        <p>Date: ${date}</p>
        <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
        <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

// Function to display 5-day forecast weather data in the UI
function displayWeatherData(data) {
    var forecastData = data.list;

    // Clear the forecast section
    forecast.innerHTML = "";

    var currentDate = null;

    forecastData.forEach((dayData) => {
        var date = new Date(dayData.dt * 1000).toLocaleDateString();
        var temperatureKelvin = dayData.main.temp;
        var temperatureFahrenheit = ((temperatureKelvin - 273.15) * 9/5) + 32;
        var weatherIcon = dayData.weather[0].icon;
        var humidity = dayData.main.humidity;
        var windSpeed = dayData.wind.speed;

        if (date !== currentDate) {
            var dayContainer = document.createElement("div");
            dayContainer.classList.add("forecast-day");

            dayContainer.innerHTML = `
                <h3>${date}</h3>
                <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
                <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            `;

            forecast.appendChild(dayContainer);

            currentDate = date;
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
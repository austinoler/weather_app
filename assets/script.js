var API_KEY = "YOUR_ad03ec6026a6a854547434fe2090eef0";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast";

var searchForm = document.getElementById("search-form");
var cityInput = document.getElementById("city-input");
var currentWeather = document.getElementById("current-weather");
var forecast = document.getElementById("forecast");
var searchHistory = document.getElementById("search-history");

// Function to fetch weather data from the OpenWeatherMap API
function getWeatherData(city) {
    // Construct the API URL with the city name and your API key
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

    // Make the API request using the fetch API
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Parse the response data and update the currentWeather and forecast sections
            displayWeatherData(data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            // You can handle and display an error message to the user here
        });
}

// Function to save the city to localStorage
function saveCityToLocalStorage(city) {
    // Store the city in localStorage to maintain search history.
    // Use an array to keep track of the searched cities and update the search history section.
}

// Function to render search history
function renderSearchHistory() {
    // Retrieve the search history from localStorage and display it in the search history section.
}

// Event listener for the search form submission
searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var city = cityInput.value.trim();
    if (city !== "") {
        getWeatherData(city);
        saveCityToLocalStorage(city);
        cityInput.value = ""; // Clear the input field after the search
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
const apiKey = '6b9f9dffc8cfccd81a37431cb7516917';
const historyList = document.getElementById('history-list');
const weatherForecastDiv = document.getElementById('weatherForecast');

// uses the provided API to run a function to look up the weather of a user given city/state
function searchWeather() {
  const cityInput = document.getElementById('cityInput').value;
  const stateInput = document.getElementById('stateInput').value;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput},${stateInput}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Display 5-day forecast
      displayWeather(data);

      // Save search history to local storage
      saveToLocalStorage(cityInput, stateInput);
    })
    .catch((error) => console.error('Error fetching data:', error));
}

function displayWeather(data) {
  // Clear previous forecast
  weatherForecastDiv.innerHTML = '';

  // Display each day's weather information
  for (let i = 0; i < data.list.length; i += 8) {
    const day = data.list[i];
    const date = new Date(day.dt * 1000);
    const icon = day.weather[0].icon;
    const temperature = day.main.temp;
    const humidity = day.main.humidity;
    const windSpeed = day.wind.speed;

    const forecastItem = document.createElement('div');
    forecastItem.classList.add('day-forecast'); // Add a class for styling
    forecastItem.innerHTML = `
      <p>${date.toDateString()}</p>
      <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
      <p>Temperature: ${temperature} K</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    weatherForecastDiv.appendChild(forecastItem);
  }
}

function saveToLocalStorage(city, state) {
  // Retrieve existing history from local storage
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

  // Add new search to history
  const newSearch = `${city}, ${state}`;
  if (!history.includes(newSearch)) {
    history.push(newSearch);

    // Save updated history to local storage
    localStorage.setItem('weatherHistory', JSON.stringify(history));

    // Update the displayed history
    updateHistoryList();
  }
}

function updateHistoryList() {
  // Clear previous history
  historyList.innerHTML = '';

  // Retrieve and display updated history
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  history.forEach((search) => {
    const historyItem = document.createElement('li');
    historyItem.textContent = search;
    historyItem.onclick = () => loadHistorySearch(search);
    historyList.appendChild(historyItem);
  });
}

function loadHistorySearch(search) {
  const [city, state] = search.split(', ');
  document.getElementById('cityInput').value = city;
  document.getElementById('stateInput').value = state;
  searchWeather();
}

// Function to clear search history
function clearHistory() {
  // Clear history from local storage
  localStorage.removeItem('weatherHistory');

  // Update the displayed history
  updateHistoryList();
}

// Initial load of search history
updateHistoryList();

const apiKey = '6b9f9dffc8cfccd81a37431cb7516917';
const historyList = document.getElementById('history-list');
const weatherForecastDiv = document.getElementById('weatherForecast');

// uses the provided API to run a function to look up the weather of a user given city/state
function searchWeather() {
  const cityInput = document.getElementById('cityInput').value;
  const stateInput = document.getElementById('stateInput').value;

  if (!cityInput || !stateInput) {
    openErrorModal('Please enter both city and state.');
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput},${stateInput}&appid=${apiKey}`;

  // Function that fetches information from the API and saves it to local storage or throws an error if the city and state aren't legitimate
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);

      saveToLocalStorage(cityInput, stateInput);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      openErrorModal('Error fetching weather data. Please try again.');
    });
}

// Opens a modal if the city or state are invalid.
function openErrorModal(message) {
  const modal = document.getElementById('errorModal');
  const modalContent = document.getElementById('modalContent');

  modalContent.textContent = 'Please enter a valid City and State.';
  modal.style.display = 'block';

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
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
    forecastItem.classList.add('day-forecast');
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

// Function to clear top history city and replace it with the newly searched city.
function updateHistoryList() {
  historyList.innerHTML = '';

  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  history.forEach((search) => {
    const historyItem = document.createElement('li');
    historyItem.textContent = search;
    historyItem.onclick = () => loadHistorySearch(search);
    historyList.appendChild(historyItem);
  });
}

// Function to populate the search history cities on the page
function loadHistorySearch(search) {
  const [city, state] = search.split(', ');
  document.getElementById('cityInput').value = city;
  document.getElementById('stateInput').value = state;
  searchWeather();
}

// Function to clear the search history upon user clicking a button. This will also clear the history from local storage.
function clearHistory() {
  localStorage.removeItem('weatherHistory');
  updateHistoryList();
}

updateHistoryList();

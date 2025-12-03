import React, { useState } from 'react'
import './App.css'
import SearchModule from './Components/search-module.jsx'
import WeatherHourlyCard from './Components/weather-hourly-card.jsx'
import WeatherReport from './Components/weather-report.jsx'

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    const apiKey = import.meta.env.VITE_API_KEY;

    setError(null);
    setWeatherData(null);
    setForecastData([]);

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const weatherRes = await fetch(currentWeatherUrl);
      const weatherJson = await weatherRes.json();

      if (weatherJson.cod === '404') {
        setError(weatherJson.message);
        return;
      }

      setWeatherData(weatherJson);

      const forecastRes = await fetch(forecastUrl);
      const forecastJson = await forecastRes.json();

      if (forecastJson.list) {
        setForecastData(forecastJson.list.slice(0, 8));
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while fetching data. Please check your connection or try again later.');
    }
  };

  return (
    <div id="weather-container">
      <h2>Weather App</h2>
      <SearchModule onSearch={fetchWeather} />

      <WeatherReport data={weatherData} error={error} />

      <div id="hourly-forecast">
        {
          forecastData.map((item, index) => (
            <WeatherHourlyCard key={index} item={item} />
          ))
        }
      </div>
    </div>
  );
}

export default App

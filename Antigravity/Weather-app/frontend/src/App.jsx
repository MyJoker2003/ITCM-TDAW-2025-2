import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import History from './components/History';
import { getWeather, getForecast } from './services/weatherService';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleSearch = async (city) => {
    try {
      setError('');
      const weatherData = await getWeather(city);
      const forecastData = await getForecast(city);

      setWeather(weatherData);
      setForecast(forecastData);

      updateHistory(city);
    } catch (err) {
      setError(err.detail || 'Failed to fetch weather data');
      setWeather(null);
      setForecast(null);
    }
  };

  const updateHistory = (city) => {
    const newHistory = [city, ...history.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('weatherHistory', JSON.stringify(newHistory));
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '300' }}>Weather<span style={{ fontWeight: '600' }}>App</span></h1>
      <SearchBar onSearch={handleSearch} />

      {error && (
        <div style={{ background: 'rgba(255, 0, 0, 0.2)', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,0,0,0.3)', marginTop: '20px' }}>
          {error}
        </div>
      )}

      <CurrentWeather data={weather} />
      <Forecast data={forecast} />
      <History history={history} onSelect={handleSearch} />
    </div>
  );
}

export default App;

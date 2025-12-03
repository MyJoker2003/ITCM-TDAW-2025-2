import React from 'react';
import { Wind, Droplets } from 'lucide-react';

const CurrentWeather = ({ data }) => {
    if (!data) return null;

    const { name, main, weather, wind } = data;
    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    return (
        <div className="glass-panel weather-card">
            <h2 className="city">{name}</h2>
            <div className="desc">{weather[0].description}</div>
            <img src={iconUrl} alt={weather[0].description} />
            <div className="temp">{Math.round(main.temp)}°C</div>

            <div className="details">
                <div className="detail-item">
                    <Droplets size={20} />
                    <span className="detail-value">{main.humidity}%</span>
                    <span className="detail-label">Humidity</span>
                </div>
                <div className="detail-item">
                    <Wind size={20} />
                    <span className="detail-value">{wind.speed} m/s</span>
                    <span className="detail-label">Wind</span>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;

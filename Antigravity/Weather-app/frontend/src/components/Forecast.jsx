import React from 'react';

const Forecast = ({ data }) => {
    if (!data) return null;

    return (
        <div className="glass-panel" style={{ padding: '20px', marginTop: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>Hourly Forecast</h3>
            <div className="forecast-list">
                {data.list.slice(0, 8).map((item, index) => (
                    <div key={index} className="forecast-item">
                        <span>{new Date(item.dt * 1000).getHours()}:00</span>
                        <img
                            src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                            alt="icon"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>{Math.round(item.main.temp)}°</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forecast;

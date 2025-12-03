import React from "react";

const WeatherReport = ({ data, error }) => {
    if (error) {
        return <div id="weather-info"><p>{error}</p></div>
    }

    if (!data) {
        return null; // No mostar nada si no hay datos
    }

    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    return (
        <>
            <img id="weather-icon" src={iconUrl} alt={description} style={{ display: 'block' }} />

            <div id="temp-div">
                <p>{temperature}°C</p>
            </div>

            <div id="weather-info">
                <p>{data.name}</p>
                <p>{description}</p>
            </div>
        </>
    );
};

export default WeatherReport;
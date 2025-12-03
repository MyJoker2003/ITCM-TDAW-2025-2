import React from "react";

const WeatherHourlyCard = ({ item }) => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    return (
        <div className="hourly-item">
            <span>{hour}:00</span>
            <img src={iconUrl} alt="Hourly Weather Item" />
            <span>{temperature}°C</span>
        </div>
    );
};
export default WeatherHourlyCard;
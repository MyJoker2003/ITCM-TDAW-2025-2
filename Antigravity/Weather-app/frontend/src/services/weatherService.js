import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getWeather = async (city) => {
    try {
        const response = await axios.get(`${API_URL}/weather/${city}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getForecast = async (city) => {
    try {
        const response = await axios.get(`${API_URL}/forecast/${city}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

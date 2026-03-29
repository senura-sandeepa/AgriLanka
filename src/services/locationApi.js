// services/locationApi.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

export const fetchLocations = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/locations`);
        return response.data; // assuming it returns [{id: 1, name: "Colombo"}, ...]
    } catch (error) {
        console.error('fetchLocations error:', error.response?.data || error.message);
        throw error;
    }
};

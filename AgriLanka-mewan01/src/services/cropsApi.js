import axios from "axios";

import { API_BASE_URL } from "../config/apiConfig";

export const cropsApi = {
    addCrop: (data) =>
        axios.post(`${API_BASE_URL}/crops`, data),

    getByFarmer: (farmerId) =>
        axios.get(`${API_BASE_URL}/crops/farmer/${farmerId}`),

    delete: (cropId) =>
        axios.delete(`${API_BASE_URL}/crops/${cropId}`)
};

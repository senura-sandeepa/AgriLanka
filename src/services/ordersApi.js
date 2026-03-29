import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

export const ordersApi = {
    create: (data) => axios.post(`${API_BASE_URL}/orders`, data),
    getByFarmer: (id) => axios.get(`${API_BASE_URL}/orders/farmer/${id}`),
    updateStatus: (id, status) =>
        axios.put(`${API_BASE_URL}/orders/${id}/status`, { status })
};
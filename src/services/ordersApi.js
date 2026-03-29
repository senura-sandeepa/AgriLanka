import axios from "axios";

const BASE_URL = "../config/apiConfig";

export const ordersApi = {
    create: (data) => axios.post(`${BASE_URL}/orders`, data),
    getByFarmer: (id) => axios.get(`${BASE_URL}/orders/farmer/${id}`),
    updateStatus: (id, status) =>
        axios.put(`${BASE_URL}/orders/${id}/status`, { status })
};

import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

// Fetch farmer profile by user ID
export const fetchFarmerProfile = async (userId) => {
    try {
        console.log('📤 Fetching farmer profile for userId:', userId);

        const res = await axios.get(`${API_BASE_URL}/farmer-profile/${userId}`);

        console.log('📥 Profile received:', res.data);
        return res.data;
    } catch (error) {
        console.error("❌ Error fetching farmer profile:", error.response?.data || error.message);
        throw error;
    }
};

// Update farmer profile
export const updateFarmerProfile = async (userId, data) => {
    try {
        console.log('📤 Updating farmer profile for userId:', userId);
        console.log('📝 Update payload:', data);

        const res = await axios.put(`${API_BASE_URL}/farmer-profile/${userId}`, data);

        console.log('📥 Update response:', res.data);
        return res.data;
    } catch (error) {
        console.error("❌ Error updating farmer profile:", error.response?.data || error.message);
        throw error;
    }
};
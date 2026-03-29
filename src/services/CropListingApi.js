import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

// Get all crop types from database
export const fetchCropTypes = async () => {
    try {
        console.log('📤 Fetching crop types...');
        const res = await axios.get(`${API_BASE_URL}/crop-types`);
        console.log('📥 Crop types received:', res.data.length);
        return res.data;
    } catch (error) {
        console.error("❌ Error fetching crop types:", error.response?.data || error.message);
        throw error;
    }
};

// Create new crop listing
export const createCropListing = async ({ userId, cropId, quantity, price, availableFrom }) => {
    try {
        console.log('📤 Creating crop listing:', {
            userId,
            cropId,
            quantity,
            price,
            availableFrom
        });

        const res = await axios.post(`${API_BASE_URL}/crop-listings`, {
            userId,
            cropId,
            quantity,
            price,
            availableFrom
        });

        console.log('📥 Crop listing created:', res.data);
        return res.data;
    } catch (error) {
        console.error("❌ Error creating crop listing:", error.response?.data || error.message);
        throw error;
    }
};

// Get farmer's crop listings
export const fetchFarmerCropListings = async (userId) => {
    try {
        console.log('📤 Fetching crop listings for user:', userId);
        const res = await axios.get(`${API_BASE_URL}/crop-listings/farmer/${userId}`);
        console.log('📥 Crop listings received:', res.data.length);
        return res.data;
    } catch (error) {
        console.error("❌ Error fetching crop listings:", error.response?.data || error.message);
        throw error;
    }
};

// Delete crop listing
export const deleteCropListing = async (listingId, userId) => {
    try {
        console.log('📤 Deleting crop listing:', listingId);
        const res = await axios.delete(`${API_BASE_URL}/crop-listings/${listingId}`, {
            data: { userId }
        });
        console.log('📥 Crop listing deleted');
        return res.data;
    } catch (error) {
        console.error("❌ Error deleting crop listing:", error.response?.data || error.message);
        throw error;
    }
};

// Update crop listing
export const updateCropListing = async (listingId, userId, data) => {
    try {
        console.log('📤 Updating crop listing:', listingId);
        const res = await axios.put(`${API_BASE_URL}/crop-listings/${listingId}`, {
            userId,
            ...data
        });
        console.log('📥 Crop listing updated');
        return res.data;
    } catch (error) {
        console.error("❌ Error updating crop listing:", error.response?.data || error.message);
        throw error;
    }
};
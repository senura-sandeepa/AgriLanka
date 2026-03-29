import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

export const saveUserProfile = async ({
                                          uid,
                                          name,
                                          email,
                                          phone,
                                          location,
                                          userType,
                                          ownerName,  // ← add this
                                          addressNo,  // ← add this
                                      }) => {
    try {
        const payload = {
            uid,
            name,
            email,
            phone,
            location,
            userType,
        };

        // Only send these for farmers
        if (userType === 'farmer') {
            payload.ownerName = ownerName;
            payload.addressNo = addressNo;
        }

        const response = await axios.post(
            `${API_BASE_URL}/users`,
            payload,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            'saveUserProfile error:',
            error.response?.data || error.message
        );
        throw error;
    }
};


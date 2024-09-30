import axios from 'axios';

// Base URL for your API
const API_URL = 'http://localhost:3000/api/v1/auth'; // Update if your backend URL changes

// Function to register a user
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data; // Return the response data
    } catch (error) {
        throw error.response.data; // Throw an error for handling in the component
    }
};

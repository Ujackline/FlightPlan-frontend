import apiClient from "./services";
const baseURL = "/badge";

export default {
    // Fetch all badges
    getAll() {
        return apiClient.get(baseURL);
    },
    // Get badges for a specific user
    getAlBadgesForUser(userId) {
        console.log('Fetching badges for user ID:', userId);
        if (!userId) {
          console.error('User ID is undefined - cannot fetch badges');
          return Promise.reject(new Error('User ID is required'));
        }
        // Use the correct endpoint path based on your backend API structure
        return apiClient.get(`${baseURL}/badge/user/${userId}`);
      },
    // Get a single badge by ID
    getOne(badgeId) {
        return apiClient.get(`${baseURL}${badgeId}`);
    },
    // Create a new badge
    create(data) {
        return apiClient.post(baseURL, data);
    },
    // Update a badge
    update(badgeId, data) {
        return apiClient.put(`${baseURL}${badgeId}`, data);
    },
    // Delete a badge
    delete(badgeId) {
        return apiClient.delete(`${baseURL}${badgeId}`);
    },
    // Delete all badges
    deleteAll() {
        return apiClient.delete(baseURL);
    }
};
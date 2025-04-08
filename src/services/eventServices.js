import apiClient from "./services";

const baseURL = "/event";

export default {
    // Get all events
    getAll() {
        return apiClient.get(baseURL);
    },
    
    // Get one event by ID
    getOne(eventId) {
        return apiClient.get(`${baseURL}/${eventId}`);
    },
    
    // Create a new event (admin only)
    create(data) {
        return apiClient.post(baseURL, data);
    },
    
    // Update an event (admin only)
    update(eventId, data) {
        return apiClient.put(`${baseURL}/${eventId}`, data);
    },
    
    // Delete an event (admin only)
    delete(eventId) {
        return apiClient.delete(`${baseURL}/${eventId}`);
    },
    
    // Delete all events (admin only - use with caution)
    deleteAll() {
        return apiClient.delete(baseURL);
    },
    
    // Get events registered by a specific user
    getByUser(userId) {
        return apiClient.get(`${baseURL}/user/${userId}`);
    },
    
    // Register a user for an event
    register(eventId, userId) {
        return apiClient.post(`${baseURL}/${eventId}/register/${userId}`);
    },
    
    // Cancel a user's registration for an event
    cancelRegistration(eventId, userId) {
        return apiClient.delete(`${baseURL}/${eventId}/register/${userId}`);
    },
    
    // Get all users registered for an event (admin only)
    getRegisteredUsers(eventId) {
        return apiClient.get(`${baseURL}/${eventId}/registrations`);
    }
};
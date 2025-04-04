import apiClient from "./services";
const baseURL = "/event";

export default {
    // Core event CRUD operations
    getAll() {
        return apiClient.get(baseURL);
    },
    getOne(eventId) {
        return apiClient.get(`${baseURL}/${eventId}`);
    },
    create(data) {
        return apiClient.post(baseURL, data);
    },
    update(eventId, data) {
        return apiClient.put(`${baseURL}/${eventId}`, data);
    },
    delete(eventId) {
        return apiClient.delete(`${baseURL}/${eventId}`);
    },
    deleteAll() {
        return apiClient.delete(baseURL);
    },
    
    // Registration operations
    register(eventId, userId) {
        return apiClient.post(`${baseURL}/${eventId}/register`, { userId });
    },
    cancelRegistration(eventId, userId) {
        return apiClient.delete(`${baseURL}/${eventId}/register`, { data: { userId } });
    },
    
    // Attendance and points tracking
    markAttendance(eventId, userId, attendanceCode) {
        return apiClient.post(`${baseURL}/attendance`, {
            eventId,
            userId,
            attendanceCode
        });
    },
    
    // User event history
    getCompletedEvents(userId) {
        return apiClient.get(`${baseURL}/completed/${userId}`);
    },
    
    // Get events registered by a specific user
    getUserEvents(userId) {
        return apiClient.get(`${baseURL}/user/${userId}`);
    }
};
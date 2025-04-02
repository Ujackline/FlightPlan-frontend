import apiClient from "./services";

const baseURL = "/event";

export default {
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
    // Registers a user for an event
    // register(eventId, userId) {
    //     return apiClient.post(`${baseURL}/${eventId}/register`, { userId });
    // },
    // // Cancels a user's registration for an event
    // cancelRegistration(eventId, userId) {
    //     return apiClient.delete(`${baseURL}/${eventId}/register`, { data: { userId } });
    // }
};
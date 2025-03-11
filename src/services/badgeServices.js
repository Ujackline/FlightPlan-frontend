import apiClient from "./services";
var baseURL = "/flight-plan-t9/badge/";

export default {
    getAll() {
        return apiClient.get(baseURL);
    },
    getOne(badgeId) {
        return apiClient.get(baseURL + `${badgeId}`);
    },
    create(data) {
        return apiClient.post(baseURL, data);
    },
    update(badgeId, data) {
        return apiClient.put(baseURL + `${badgeId}`, data);
    },
    delete(badgeId) {
        return apiClient.delete(baseURL + `${badgeId}`);
    },

    getUserBadges(userId) {
    
        return apiClient.get(`/flight-plan-t9/user/${userId}/badges`);
    }
};
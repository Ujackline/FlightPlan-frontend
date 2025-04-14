import apiClient from "./services";
const baseURL = "/badge";

export default {
  // Fetch all badges
  getAll() {
    return apiClient.get(baseURL);
  },
  
  // Get a single badge by ID
  getOne(badgeId) {
    console.log(`Fetching badge with ID: ${badgeId}`);
    return apiClient.get(`${baseURL}/${badgeId}`)
      .then(response => {
        console.log("Badge fetched successfully:", response.data);
        return response.data;
      })
      .catch(error => {
        console.error("Error fetching badge:", error.response?.data || error.message);
        throw error;
      });
  },
  
  // Get all badges for a specific user
  getAllUserBadges(studentId) {
    console.log(`Fetching badges for student ID: ${studentId}`);
    return apiClient.get(`${baseURL}/student/${studentId}`)
      .then(response => {
        console.log("Student badges fetched successfully:", response.data);
        return response.data;
      })
      .catch(error => {
        console.error("Error fetching student badges:", error.response?.data || error.message);
        throw error;
      });
  },
  
  // Create a new badge
  create(data) {
    return apiClient.post(baseURL, data);
  },
  
  // Update a badge
  update(badgeId, data) {
    return apiClient.put(`${baseURL}/${badgeId}`, data);
  },
  
  // Delete a badge
  delete(badgeId) {
    return apiClient.delete(`${baseURL}/${badgeId}`);
  },
  
  // Delete all badges
  deleteAll() {
    return apiClient.delete(baseURL);
  }
};
// studentServices.js
import apiClient from "./services";

const API_BASE_URL = "/student";

export default {
  async getStudentById(studentId) {
    try {
      // If no studentId is provided, get the current logged-in student
      const endpoint = studentId ? `${API_BASE_URL}/${studentId}` : `${API_BASE_URL}/current`;
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching student data:", error);
      throw error;
    }
  },

  async getStudents() {
    try {
      const response = await apiClient.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  // New method to create student profile
  async createStudentProfile(profileData) {
    try {
      console.log("Sending student profile data:", JSON.stringify(profileData, null, 2));
      const response = await apiClient.post(`${API_BASE_URL}`, profileData);
      return response.data;
    } catch (error) {
      console.error("Detailed error creating student profile:", {
        message: error.message,
        response: error.response ? JSON.stringify(error.response.data, null, 2) : 'No response',
        status: error.response ? error.response.status : 'No status'
      });
      
      // More comprehensive error handling
      if (error.response) {
        // If server responded with an error
        const errorMessage = error.response.data.message || 
                             error.response.data.error || 
                             'Failed to create student profile';
        
        throw new Error(errorMessage);
      }
      
      // Network error or other issues
      throw new Error('Network error or unexpected issue creating student profile');
    }
  },
  async update(id, data) {
    return apiClient.put(`/student/${id}`, data);
  }

};
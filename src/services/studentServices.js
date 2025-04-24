// studentServices.js
import apiClient from "./services";

const API_BASE_URL = "/student";

export default {
  async getStudentByUserId(userId) {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching student by userId:", error);
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
  

  async updateStudentPoints(studentId, newPointsTotal) {
    try {
      const response = await apiClient.patch(`${API_BASE_URL}/${studentId}/points`, {
        points: newPointsTotal
      });
      return response;
    } catch (error) {
      console.error('Error updating student points:', error);
      throw error;
    }
  }

};
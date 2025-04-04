import apiClient from "../services/services"; // Import your configured API client

const API_ENDPOINT = "student";

export default {
  async getStudentById(studentId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINT}/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching student data:", error);
      throw error;
    }
  },
  async getStudents() {
    try {
      const response = await apiClient.get(API_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },
};

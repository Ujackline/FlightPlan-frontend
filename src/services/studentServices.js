import apiClient from "../services/services"; // Import your configured API client

const API_BASE_URL = "http://localhost:3029/flight-plan-t9/student";

export default {
  async getStudentById(studentId) {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/${studentId}`);
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
};
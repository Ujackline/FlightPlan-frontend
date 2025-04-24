// studentServices.js - merged version
import apiClient from "../services/services";

const API_BASE_URL = "http://localhost:3029/flight-plan-t9/student";

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

  async getLeaderboard() {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/leaderboard`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
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

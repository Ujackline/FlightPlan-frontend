import apiClient from "../services/services"; // Import your configured API client

const API_BASE_URL = "http://localhost:3029/flight-plan-t9/student";

export default {
  async getStudentById(studentId) {
    const response = await apiClient.get(`${API_BASE_URL}/${studentId}`);
    return response.data;
  },

  async getStudents() {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },

  // ✅ Get student points
  async getStudentPoints(studentId) {
    const response = await apiClient.get(`${API_BASE_URL}/${studentId}/points`);
    return response.data;
  },

  // ✅ Add points to student
  async addStudentPoints(studentId, amount) {
    const response = await apiClient.patch(`${API_BASE_URL}/${studentId}/addPoints`, { amount });
    return response.data;
  },

  // ✅ Redeem points from student
  async redeemStudentPoints(studentId, amount) {
    const response = await apiClient.patch(`${API_BASE_URL}/${studentId}/redeemPoints`, { amount });
    return response.data;
  },
};

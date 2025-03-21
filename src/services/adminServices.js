import apiClient from "../services/services"; // Configured API client
const API_URL = "http://localhost:3029/flight-plan-t9/admin";

const adminService = {
  // Fetch all users (Admin Only)
  async getUsers() {
    return apiClient.get(`${API_URL}/user`);
  },

  // ✅ Fetch a single user by ID
  async getUserById(userId) {
    return apiClient.get(`${API_URL}/user/${userId}`);
  },

  // ✅ Fetch all admins (Admin Only)
  async getAdmins() {
    return apiClient.get(`${API_URL}/`);
  },

  async getAdminInfo() {
    return apiClient.get(`${API_URL}/info`).then(response => response.data)
      .catch(error => {
        console.error("Error fetching admin info:", error);
        throw error;
      });
  },

  // ✅ Update user role (Admin Only)
  async updateUserRole(userId, role) {
    return apiClient.put(`${API_URL}/users/${userId}/role`, { role });
  },

  // ✅ Delete a user (Admin Only)
  async deleteUser(userId) {
    return apiClient.delete(`${API_URL}/users/${userId}`);
  },

  // Fetch Notifications
  async getNotifications() {
    console.log(API_URL)
    return apiClient.get(`${API_URL}/notifications`).then(response => response.data);
  },


  //  Delete a notification
  async deleteNotification(id) {
    return apiClient.delete(`${API_URL}/notifications/${id}`).then(response => response.data);
  },

  //  Fetch Students
  async fetchStudents() {
    return apiClient.get(`${API_URL}/students`);
  },

  //  Fetch Point Redemptions
  async fetchPointRedemptions() {
    return apiClient.get(`${API_URL}/points`);
  },

  // Update System Settings (Admin Only)
  async updateSettings(settingsData) {
    return apiClient.put(`${API_URL}/settings`, settingsData);
  },

  // ✅ Logout Admin
  async logout() {
    return apiClient.post(`${API_URL}/logout`);
  },
};

export default adminService;

import apiClient from "../services/services"; // Importing configured API client

const API_BASE_URL = "http://localhost:3029/flight-plan-t9/user"; // Updated to use only `/user`

const adminService = {
  // ✅ Get all users (Admin Only)
  async getUsers() {
    return apiClient.get(`${API_BASE_URL}/`);
    
  },

  // ✅ Get all admins (Admin Only)
  async getAdmins() {
    return apiClient.get(`${API_BASE_URL}/admin/list`);
  },

  // ✅ Add a new user
  async addUser(userData) {
    return apiClient.post(`${API_BASE_URL}/`, userData);
  },

  // ✅ Update user role (Admin Only)
  async updateUserRole(userId, role) {
    return apiClient.put(`${API_BASE_URL}/admin/${userId}`, { role });
  },

  // ✅ Delete a user (Admin Only)
  async deleteUser(userId) {
    return apiClient.delete(`${API_BASE_URL}/admin/${userId}`);
  },

  // ✅ Get notifications
  async getNotifications() {
    return apiClient.get(`${API_BASE_URL}/notifications`);
  },

  // ✅ Get system statistics
  async getStats() {
    return apiClient.get(`${API_BASE_URL}/stats`);
  },

  // ✅ Get recent activities
  async getRecentActivities() {
    return apiClient.get(`${API_BASE_URL}/recent-activities`);
  },

  // ✅ Get upcoming events
  async getUpcomingEvents() {
    return apiClient.get(`${API_BASE_URL}/upcoming-events`);
  },

  // ✅ Get all events
  async getEvents() {
    return apiClient.get(`${API_BASE_URL}/events`);
  },

  // ✅ Create a new event
  async createEvent(eventData) {
    return apiClient.post(`${API_BASE_URL}/events`, eventData);
  },

  // ✅ Update an existing event
  async updateEvent(eventId, eventData) {
    return apiClient.put(`${API_BASE_URL}/events/${eventId}`, eventData);
  },

  // ✅ Delete an event
  async deleteEvent(eventId) {
    await apiClient.delete(`${API_BASE_URL}/events/${eventId}`);
  },

  // ✅ Upload attendance file for an event
  async uploadAttendance(eventId, attendanceFile) {
    const formData = new FormData();
    formData.append("file", attendanceFile);
    return apiClient.post(`${API_BASE_URL}/events/${eventId}/upload-attendance`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // ✅ Fetch students
  async fetchStudents() {
    return apiClient.get(`${API_BASE_URL}/students`);
  },

  // ✅ Fetch point redemptions
  async fetchPointRedemptions() {
    return apiClient.get(`${API_BASE_URL}/points`);
  },

  // ✅ Update settings (Admin Only)
  async updateSettings(settingsData) {
    return apiClient.put(`${API_BASE_URL}/settings`, settingsData);
  },

  // ✅ Logout user
  async logout() {
    return apiClient.post(`${API_BASE_URL}/logout`);
  },
};

export default adminService;

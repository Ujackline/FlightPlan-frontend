import apiClient from "../services/services"; // Importing your configured API client

const API_BASE_URL = "http://localhost:3029/flight-plan-t9";

const adminService = {
  async getAdminInfo() {
    const response = await apiClient.get(`${API_BASE_URL}/info`);
    return response.data;
  },

  async getNotifications() {
    const response = await apiClient.get(`${API_BASE_URL}/notifications`);
    return response.data;
  },

  async getStats() {
    const response = await apiClient.get(`${API_BASE_URL}/stats`);
    return response.data;
  },

  async getRecentActivities() {
    const response = await apiClient.get(`${API_BASE_URL}/recent-activities`);
    return response.data;
  },

  async getUpcomingEvents() {
    const response = await apiClient.get(`${API_BASE_URL}/upcoming-events`);
    return response.data;
  },

  async getEvents() {
    const response = await apiClient.get(`${API_BASE_URL}/events`);
    return response.data;
  },

  async createEvent(eventData) {
    const response = await apiClient.post(`${API_BASE_URL}/events`, eventData);
    return response.data;
  },

  async updateEvent(eventId, eventData) {
    const response = await apiClient.put(`${API_BASE_URL}/events/${eventId}`, eventData);
    return response.data;
  },

  async deleteEvent(eventId) {
    await apiClient.delete(`${API_BASE_URL}/events/${eventId}`);
  },

  async uploadAttendance(eventId, attendanceFile) {
    const formData = new FormData();
    formData.append('file', attendanceFile);
    return apiClient.post(`${API_BASE_URL}/events/${eventId}/upload-attendance`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  async fetchStudents() {
    return apiClient.get(`${API_BASE_URL}/students`);
  },

  async fetchPointRedemptions() {
    return apiClient.get(`${API_BASE_URL}/points`);
  },

  async updateSettings(settingsData) {
    return apiClient.put(`${API_BASE_URL}/settings`, settingsData);
  },

  async logout() {
    return apiClient.post(`${API_BASE_URL}/logout`);
  },

async getUsers() {
  return apiClient.get(`${API_BASE_URL}/user`);
},

async updateUserRole(userId, role) {
  return apiClient.put(`${API_BASE_URL}/users/${userId}/role`, { role });
},

async deleteUser(userId) {
  return apiClient.delete(`${API_BASE_URL}/users/${userId}`);
},

async addUser(userData) {
  return apiClient.post(`${API_BASE_URL}/users`, userData);
},


}

export default adminService;

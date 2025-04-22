import apiClient from "../services/services"; // Importing your configured API client
const API_BASE_URL = "http://localhost:3029/flight-plan-t9/experience";


export default {
  async getExperiences() {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },

  async getExperiencesBySemester(semester) {
    const response = await apiClient.get(`${API_BASE_URL}/semester/${semester}`);
    return response.data;
  },
  

  async getExperienceById(experienceId) {
    const response = await apiClient.get(`${API_BASE_URL}/${experienceId}`);
    return response.data;
  },

  // in experienceServices.js
async getMyExperiences(studentId) {
  const response = await apiClient.get(`${API_BASE_URL}/my-experiences/${studentId}`);
  return response.data;
},

  async createExperience(experienceData) {
    const response = await apiClient.post(API_BASE_URL, experienceData);
    return response.data;
  },


  async updateExperience(experienceId, updatedData) {
    const response = await apiClient.put(`${API_BASE_URL}/${experienceId}`, updatedData);
    return response.data;
  },

  async deleteExperience(experienceId) {
    await apiClient.delete(`${API_BASE_URL}/${experienceId}`);
  },

  async deleteAllExperiences() {
    await apiClient.delete(API_BASE_URL);
  },

  // Mark an experience as complete (Student Action)
  async markAsComplete(id) {
    return apiClient.patch(`${API_BASE_URL}/${id}/mark-complete`, { status: "Pending" }).then(response => response.data);
  },

  // Approve an experience (Admin Action)
  
async approveExperience(id, adminName) {
    return apiClient.patch(`${API_BASE_URL}/${id}/approve`, { approvedBy: adminName }).then(response => response.data);
},
async rejectExperience(id) {
    return apiClient.patch(`${API_BASE_URL}/${id}/reject`).then(response => response.data);
},


};

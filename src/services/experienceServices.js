import apiClient from "../services/services"; // Importing your configured API client

   const API_BASE_URL = "http://localhost:3029/flight-plan-t9/experience";


export default {
  async getExperiences() {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },

  async getExperienceById(experienceId) {
    const response = await apiClient.get(`${API_BASE_URL}/${experienceId}`);
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
};



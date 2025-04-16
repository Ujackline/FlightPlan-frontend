import apiClient from '../services/services';


const API_BASE_URL = "/semester";

const semesterServices = {
  getAllSemesters() {
    return apiClient.get(API_BASE_URL);
  },
  
  getCurrentSemester() {
    return apiClient.get(`${API_BASE_URL}/current`);
  },
  
  getActiveSemester() {
    return apiClient.get(`${API_BASE_URL}/active`);
  },
  
  getSemesterById(id) {
    return apiClient.get(`${API_BASE_URL}/${id}`);
  },
  
  createSemester(data) {
    return apiClient.post(API_BASE_URL, data);
  },
  
  updateSemester(id, data) {
    return apiClient.put(`${API_BASE_URL}/${id}`, data);
  },
  
  setActiveSemester(id) {
    return apiClient.patch(`${API_BASE_URL}/${id}/setActive`);
  },
  
  deleteSemester(id) {
    return apiClient.delete(`${API_BASE_URL}/${id}`);
  },
  
  deleteAllSemesters() {
    return apiClient.delete(API_BASE_URL);
  }
};

export default semesterServices;
import apiClient from "./services";

const SEMESTER_API = "/semester";

const semesterServices = {

  createSemester(semesterData) {
    return apiClient.post(SEMESTER_API, semesterData);
  },


  getAllSemesters() {
    return apiClient.get(SEMESTER_API);
  },

  getActiveSemester() {
    return apiClient.get(`${SEMESTER_API}/active`);
  },


  getSemesterById(id) {
    return apiClient.get(`${SEMESTER_API}/${id}`);
  },


  updateSemester(id, updateData) {
    return apiClient.put(`${SEMESTER_API}/${id}`, updateData);
  },

  setActiveSemester(id) {
    return apiClient.patch(`${SEMESTER_API}/${id}/setActive`);
  },


  deleteSemester(id) {
    return apiClient.delete(`${SEMESTER_API}/${id}`);
  },


  deleteAllSemesters() {
    return apiClient.delete(SEMESTER_API);
  }
};

export default semesterServices;
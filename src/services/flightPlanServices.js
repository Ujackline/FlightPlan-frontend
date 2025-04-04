import apiClient from './services';

export default {
  // Get flight plan by student and semester
  getFlightPlanBySemester(studentId, semester) {
    //return apiClient.get(`/flight-plan-t9/flightplan/student/${studentId}/semester/${semester}`);
    return apiClient.get(`/flightplan/student/${studentId}/semester/${encodeURIComponent(semester)}`);

  }
};

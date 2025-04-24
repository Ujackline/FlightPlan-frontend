import apiClient from "./services";

export default {
  // Get flight plan by student and semester
  getFlightPlanBySemester(studentId, semester) {
    console.log('Fetching flight plan for:', { studentId, semester });
    return apiClient.get(`/flightplan/student/${studentId}/semester/${semester}`);
  },
  

getFlightPlanTasks(flightPlanId) {
  
  if (!flightPlanId) {
    console.error('Cannot fetch tasks: No flight plan ID provided');
    return Promise.reject(new Error('Missing flight plan ID'));
  }
  
  console.log('Fetching tasks for Flight Plan:', flightPlanId);
  return apiClient.get(`/flightplan/${flightPlanId}/tasks`);
},
  // Get all flight plans
  getAllFlightPlans() {
    return apiClient.get("/flightplan");
  },

  // Get a specific flight plan by ID
  getFlightPlanById(flightPlanId) {
    return apiClient.get(`/flightplan/${flightPlanId}`);
  }
};


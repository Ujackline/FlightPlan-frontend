// Fixed taskService.js with better debugging and error handling
import apiClient from "./services"; // Import your API client setup

const TASK_API = "/task";

const taskService = {
  // Create a new task
  createTask(taskData) {
    return apiClient.post(TASK_API, taskData);
  },
  
  // Retrieve all tasks
  getAllTasks() {
    return apiClient.get(TASK_API);
  },
  
  // Retrieve a single task by ID
  getTaskById(id) {
    return apiClient.get(`${TASK_API}/${id}`);
  },
  
  // Update a task by ID
  updateTask(id, updatedData) {
    return apiClient.put(`${TASK_API}/${id}`, updatedData);
  },
  
  // Delete a task by ID
  deleteTask(id) {
    return apiClient.delete(`${TASK_API}/${id}`);
  },

  
  
  // Delete all tasks
  deleteAllTasks() {
    return apiClient.delete(TASK_API);
  },
  
getStudentTasks(userId) {
  return apiClient.get(`${TASK_API}/student/${userId}`);
},

completeTaskForStudent(userId, taskId) {
  return apiClient.post(`${TASK_API}/student/${userId}/complete/${taskId}`);
},
completeTask(taskId) {

  return apiClient.put(`${TASK_API}/${taskId}/complete`);
},
  // Mark a task as complete (admin review function)
  markComplete(taskId) {
    return apiClient.patch(`${TASK_API}/${taskId}/markComplete`);
  },
  
  // Approve a task (admin function)
  approveTask(taskId, approvedBy = "Admin") {
    return apiClient.patch(`${TASK_API}/${taskId}/approve`, { approvedBy });
  },
  
  // Reject a task (admin function)
  rejectTask(taskId) {
    return apiClient.patch(`${TASK_API}/${taskId}/reject`);
  },
    
  // Find tasks by flight plan
  getTasksByFlightPlan(flightPlanId) {
    return apiClient.get(`${TASK_API}/flightplan/${flightPlanId}`);
  },
    
  // Find tasks by applicable year
  getTasksByYear(year) {
    return apiClient.get(`${TASK_API}/year/${year}`);
  }
};

export default taskService;
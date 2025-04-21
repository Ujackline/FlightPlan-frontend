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

  // ✅ Mark a task as complete (submitted for review)
  // markComplete(taskId) {
  //   return apiClient.patch(`${TASK_API}/${taskId}/markComplete`);
  // },
//   completeTask(id) {
//     return apiClient.post("/task/complete", { studentId: 1, id }); // Use the correct casing: studentId
// },

// In your taskServices.js file

completeTask(taskId) {
  // Using PUT instead of PATCH to match your route
  return apiClient.put(`${TASK_API}/${taskId}/complete`);
},
  approveTask(taskId, approvedBy = "Admin") {
    return apiClient.patch(`${TASK_API}/${taskId}/approve`, { approvedBy });
  },

  // ✅ Reject a task (admin)
  rejectTask(taskId) {
    return apiClient.patch(`${TASK_API}/${taskId}/reject`);
  }
};

export default taskService;

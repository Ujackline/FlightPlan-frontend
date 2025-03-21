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
  }
};

export default taskService;

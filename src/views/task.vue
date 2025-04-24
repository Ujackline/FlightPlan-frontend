<template>
  <div class="task-container">
    <div class="header-section">
      <h2>Completed Tasks</h2>
      <div class="decoration-line"></div>
    </div>

    <div class="status-messages">
      <p v-if="loading" class="loading-message">
        <span class="loading-spinner"></span>
        Loading tasks...
      </p>
      <p v-if="error" class="error-message">
        <span class="error-icon">!</span>
        {{ error }}
      </p>
      <p v-if="!loading && completedTasks.length === 0" class="empty-message">
        <span class="empty-icon">📋</span>
        No completed tasks available.
      </p>
    </div>

    <div v-if="!loading && completedTasks.length > 0" class="table-container">
      <table class="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Points</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in completedTasks" :key="task.id" class="completed-task">
            <td class="task-id">{{ task.id }}</td>
            <td class="task-name">{{ task.taskName }}</td>
            <td class="task-description">{{ task.description || 'No description' }}</td>
            <td class="task-points">{{ task.NumOfPoints }}</td>
            <td class="task-complete">
              <span class="status-badge">Completed</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import taskService from "../services/taskServices";

export default {
  setup() {
    const tasks = ref([]);
    const loading = ref(true);
    const error = ref(null);

    // Computed property to filter only completed tasks
    const completedTasks = computed(() => {
      return tasks.value.filter(task => 
        task.completed === true || 
        task.status === 'Approved' || 
        task.status === 'approved'
      );
    });

    const fetchTasks = async () => {
      try {
        loading.value = true;
        const response = await taskService.getStudentTasks;
        tasks.value = response.data;
        console.log("Fetched all tasks:", tasks.value);
        console.log("Completed tasks:", completedTasks.value);
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to fetch tasks.";
        console.error("Error fetching tasks:", err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchTasks);

    return { 
      tasks, 
      completedTasks, // Return the computed property
      loading, 
      error 
    };
  }
};
</script>

<style scoped>
/* Main container styles */
.task-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(128, 0, 32, 0.12);
  position: relative;
  overflow: hidden;
}

/* Header section */
.header-section {
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
}

.header-section h2 {
  color: #800020;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-align: left;
}

.decoration-line {
  height: 4px;
  width: 60px;
  background: linear-gradient(90deg, #800020, #A52A2A);
  border-radius: 2px;
}

/* Status messages */
.status-messages {
  text-align: center;
  padding: 1rem 0;
}

.loading-message, .error-message, .empty-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  font-weight: 500;
}

.loading-message {
  color: #800020;
  background-color: rgba(128, 0, 32, 0.05);
}

.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 10px;
  border: 3px solid rgba(128, 0, 32, 0.2);
  border-top: 3px solid #800020;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #d9534f;
  background-color: rgba(217, 83, 79, 0.05);
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 10px;
  background-color: #d9534f;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.empty-message {
  color: #5bc0de;
  background-color: rgba(91, 192, 222, 0.05);
}

.empty-icon {
  margin-right: 10px;
  font-size: 1.1rem;
}

/* Table styles */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  border: 1px solid #f0f0f0;
}

.task-table th {
  background: linear-gradient(to bottom, #f8f8f8, #f0f0f0);
  color: #4A0010;
  font-weight: 600;
  padding: 1rem;
  border-bottom: 2px solid #800020;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #444;
  transition: all 0.3s ease;
}

.task-table tbody tr:hover {
  background-color: rgba(128, 0, 32, 0.02);
}

.task-table tbody tr:last-child td {
  border-bottom: none;
}

.completed-task {
  background-color: rgba(128, 0, 32, 0.03);
}

.completed-task .task-name {
  text-decoration: line-through;
  color: #888;
}

.task-id {
  color: #800020;
  font-weight: 500;
  width: 60px;
}

.task-name {
  font-weight: 500;
}

.task-description {
  color: #666;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-points {
  font-weight: 600;
  color: #800020;
  text-align: center;
  width: 80px;
}

.task-complete {
  text-align: center;
  width: 100px;
}

/* Status badge styling */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #fff;
  background-color: #4CAF50;
  border-radius: 12px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .task-container {
    padding: 1rem;
    margin: 1rem;
  }
  
  .task-table th, .task-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .task-description {
    max-width: 150px;
  }
}
</style>
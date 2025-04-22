<!-- <template>
  <div class="task-container">
    <h2>Task List</h2>
    
    <p v-if="loading">Loading tasks...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="!loading && tasks.length === 0">No tasks available.</p>

    <table v-if="!loading && tasks.length > 0" class="task-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.name }}</td>
          <td>{{ task.description }}</td>
          <td>
            <button class="edit-btn" @click="editTask(task)">Edit</button>
            <button class="delete-btn" @click="deleteTask(task.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import task from "../services/task";

export default {
  setup() {
    const tasks = ref([]);
    const loading = ref(true);
    const error = ref(null);

    // Fetch tasks from API
    const fetchTasks = async () => {
      try {
        const response = await task.getAllTasks();
        tasks.value = response.data;
      } catch (err) {
        error.value = "Failed to fetch tasks.";
        console.error("Error fetching tasks:", err);
      } finally {
        loading.value = false;
      }
    };

    // Delete a task
    const deleteTask = async (id) => {
      if (!confirm("Are you sure you want to delete this task?")) return;
      try {
        await task.deleteTask(id);
        tasks.value = tasks.value.filter(task => task.id !== id); // Update state
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    };

    // Edit task (placeholder function)
    const editTask = (task) => {
      alert(`Edit functionality not implemented yet for task: ${task.name}`);
    };

    onMounted(fetchTasks);

    return { tasks, loading, error, deleteTask, editTask };
  }
};
</script>

<style scoped>
.task-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.task-table th, .task-table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.task-table th {
  background-color: #f4f4f4;
}

.edit-btn, .delete-btn {
  padding: 8px 12px;
  margin: 5px;
  border: none;
  cursor: pointer;
}

.edit-btn {
  background-color: #ffc107;
  color: #fff;
}

.delete-btn {
  background-color: #dc3545;
  color: #fff;
}
</style> -->
<!-- 
<template>
  <div class="task-container">
    <h2>Task List</h2>

    <p v-if="loading" class="loading">Loading tasks...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="!loading && tasks.length === 0">No tasks available.</p>

    <table v-if="!loading && tasks.length > 0" class="task-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Points</th>
          <th>Complete</th> 
               </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.taskName }}</td>
          <td>{{ task.description || 'No description' }}</td>
          <td>{{ task.NumOfPoints }}</td> 
          <td>
            <input 
              type="checkbox" 
              :checked="task.completed"
              @change="toggleCompletion(task)" 
            />
          </td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import task from "../services/task";

export default {
  setup() {
    const tasks = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchTasks = async () => {
      try {
        const response = await task.getAllTasks();
        tasks.value = response.data;
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to fetch tasks.";
        console.error("Error fetching tasks:", err);
      } finally {
        loading.value = false;
      }
    };


    const toggleCompletion = async (task) => {

      try {
        const response = await taskService.completeTask(task.id, !task.completed);
        if (response.data.success) {
          task.completed = !task.completed;
          task.points = response.data.newTotalPoints; // Update UI with new total points
        }
      } catch (err) {
        console.error("Error updating task completion:", err);
      }
    };

    onMounted(fetchTasks);

    return { tasks, loading, error, toggleCompletion  };
  }
};
</script>

<style scoped>
.task-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.loading {
  font-size: 18px;
  color: #ff007bf4;
}

.error {
  color: red;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.task-table th, .task-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.task-table th {
  background-color: #f4f4f4;
}

.edit-btn, .delete-btn {
  padding: 8px 12px;
  margin: 5px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 5px;
}

.edit-btn {
  background-color: #ffc107;
  color: #fff;
}

.delete-btn {
  background-color: #dc3545;
  color: #fff;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>
 -->

 <template>
  <div class="task-container">
    <div class="header-section">
      <h2>Task List</h2>
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
      <p v-if="!loading && tasks.length === 0" class="empty-message">
        <span class="empty-icon">📋</span>
        No tasks available.
      </p>
    </div>

    <div v-if="!loading && tasks.length > 0" class="table-container">
      <table class="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Points</th>
            <th>Complete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id" :class="{ 'completed-task': task.completed }">
            <td class="task-id">{{ task.id }}</td>
            <td class="task-name">{{ task.taskName }}</td>
            <td class="task-description">{{ task.description || 'No description' }}</td>
            <td class="task-points">{{ task.NumOfPoints }}</td>
            <td class="task-complete">
              <label class="checkbox-container">
                <input 
                  type="checkbox" 
                  :checked="task.completed"
                  @change="toggleCompletion(task)" 
                />
                <span class="checkmark"></span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// import { ref, onMounted } from "vue";
// import task from "../services/taskServices";

// export default {
//   setup() {
//     const tasks = ref([]);
//     const loading = ref(true);
//     const error = ref(null);

//     const fetchTasks = async () => {
//       try {
//         const response = await task.getAllTasks();
//         tasks.value = response.data;
//       } catch (err) {
//         error.value = err.response?.data?.message || "Failed to fetch tasks.";
//         console.error("Error fetching tasks:", err);
//       } finally {
//         loading.value = false;
//       }
//     };

//     const toggleCompletion = async (task) => {
//   try {
//     const response = await task.completeTask(1, task.id); // Call the actual service
//     if (response.data.success) {
//       task.completed = true;
//       task.points = response.data.newTotalPoints || task.points;
//     }
//   } catch (err) {
//     console.error("Error updating task completion:", err);
//   }
// };

//     onMounted(fetchTasks);

//     return { tasks, loading, error, toggleCompletion };
//   }
// };
import { ref, onMounted } from "vue";
import taskService from "../services/taskServices"; // Rename to taskService instead of task

export default {
  setup() {
    const tasks = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchTasks = async () => {
      try {
        const response = await taskService.getAllTasks();
        tasks.value = response.data;
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to fetch tasks.";
        console.error("Error fetching tasks:", err);
      } finally {
        loading.value = false;
      }
    };

    const toggleCompletion = async (taskItem) => {
      try {
        const response = await taskService.completeTask(taskItem.id);
        if (response.data.success) {
          taskItem.completed = !taskItem.completed;
          // Update points if needed
        }
      } catch (err) {
        console.error("Error updating task completion:", err);
      }
    };

    onMounted(fetchTasks);

    return { tasks, loading, error, toggleCompletion };
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
  width: 80px;
}

/* Custom checkbox */
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 26px;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  margin: 0 auto;
  width: 20px;
  height: 20px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #e0e0e0;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #800020;
  border-color: #800020;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
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

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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.name }}</td>
          <td>{{ task.description || 'No description' }}</td>
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
import task from "../services/taskServices";

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
//
    const deleteTask = async (id) => {
      if (!confirm("Are you sure you want to delete this task?")) return;
      try {
        await task.deleteTask(id);
        tasks.value = tasks.value.filter(task => task.id !== id);
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task.");
      }
    };

    const editTask = (task) => {
      // Placeholder: Replace with navigation or modal opening logic
      alert(`Editing task: ${task.name}`);
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


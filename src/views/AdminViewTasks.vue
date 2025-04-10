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
            <td>{{ task.taskName }}</td>
            <td>{{ task.description || 'No description' }}</td>
            <td>
              <button class="edit-btn" @click="editTask(task)">Edit</button>
              <button class="delete-btn" @click="deleteTask(task.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <button type="button" @click="$router.push('/create-task')">
            <span class="icon">✓</span> Create Task
          </button> -->
          <!-- <router-link to="/admin/create-task" class="btn">
  <span class="icon">✓</span> Create Task
</router-link> -->
<div class="btn-container">
<router-link to="/admin/create-task" class="btn" :class="{ active: currentRoute === 'create-task' }">
            <i class="fas fa-tasks"></i> Create Tasks 
            <span class="icon">➜</span> 
          </router-link>
        </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import AdminViewTask from "../views/AdminViewTasks.vue"; 
  
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
    color: #007bff;
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
    background-color: #70111b;
    color: #fff;
  }
  
  .edit-btn:hover {
    background-color: #e0a800;
  }
  
  .delete-btn:hover {
    background-color:#70111b;
  }

  button {
    background: linear-gradient(to right, #800020, #4A0010);
    color: white;
    border: none;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    margin-top: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
  }
  
  button:hover {
    background: linear-gradient(to right, #4A0010, #800020);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  button:active {
    transform: translateY(0);
  }

  /* .btn {
    background: linear-gradient(to right, #800020, #4A0010);
    color: white;
    border: none;
    padding: 0.875rem 8rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    margin-top: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn i {
  font-size: 18px;
}

.btn:hover {
  background-color: #A6754F; 
  transform: translateY(-2px);
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
}

.active {
  background-color: #D2A679 !important; 
  color: #fff !important;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
} */
.btn-container {
  display: flex;
  justify-content: flex-end; /* Moves button to the right */
  width: 100%;
}

.btn {
    
  display: inline-flex;
  align-items: center;
   /* Pushes arrow to the end */
  gap: 8px;
  background: linear-gradient(to right, #800020, #4A0010);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 16px;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px; /* Ensures button is wide enough */
  position: relative;
}

.btn i {
  font-size: 18px;
}

.btn .icon {
  position: absolute;
  right: 12px; /* Moves arrow to the far right */
  justify-content: space-between;
}

.btn:hover {
  background-color: #A6754F;
  transform: translateY(-2px);
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
}

.active {
  background-color: #D2A679 !important;
  color: #fff !important;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
}

  </style>
  
  
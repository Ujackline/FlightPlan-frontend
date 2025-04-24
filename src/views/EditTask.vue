<template>
    <div class="container">
      <div class="task-form">
        <h2>Edit Task</h2>
        <form @submit.prevent="updateTask">
          <div class="form-grid">
            <div class="form-field">
              <label for="taskName">Task Name</label>
              <input id="taskName" v-model="task.taskName" placeholder="Enter task name" required />
            </div>
  
            <div class="form-field">
              <label for="category">Category</label>
              <input id="category" v-model="task.category" placeholder="e.g., Academic, Personal" required />
            </div>
  
            <div class="form-field full-width">
              <label for="description">Description</label>
              <textarea id="description" v-model="task.description" placeholder="Describe the task in detail..."></textarea>
            </div>
  
            <div class="form-field">
              <label for="task_type">Task Type</label>
              <input id="task_type" v-model="task.task_type" placeholder="e.g., Assignment, Project" required />
            </div>
  
            <div class="form-field">
              <label for="grad_semester">Graduation Semester</label>
              <input id="grad_semester" v-model="task.grad_semester" placeholder="e.g., Spring 2025" required />
            </div>
  
            <div class="form-field">
              <label for="CliftonStrengths">Clifton Strength</label>
              <input id="CliftonStrengths" v-model="task.CliftonStrengths" placeholder="e.g., Achiever, Focus" required />
            </div>
  
            <div class="form-field">
              <label for="NumOfPoints">Points</label>
              <input type="number" id="NumOfPoints" v-model="task.NumOfPoints" min="0" placeholder="0" required />
            </div>
  
            <div class="form-field full-width">
              <label for="majors">Majors</label>
              <textarea id="majors" v-model="task.majors" placeholder="List applicable majors..."></textarea>
            </div>
  
            <div class="form-field">
              <label for="reflection_required">Reflection Required?</label>
              <select id="reflection_required" v-model="task.reflection_required">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>
  
            <div class="form-field">
              <label for="scheduling_type">Scheduling Type</label>
              <input id="scheduling_type" v-model="task.scheduling_type" placeholder="e.g., Every Semester" />
            </div>
  
            <div class="form-field full-width">
              <label for="rationale">Rationale</label>
              <textarea id="rationale" v-model="task.rationale" placeholder="Why is this task needed?"></textarea>
            </div>
  
            <div class="form-field">
              <label for="completion_type">Completion Type</label>
              <select id="completion_type" v-model="task.completion_type">
                <option value="confirmed">Confirmed by Admin</option>
                <option value="self-reported">Self-Reported</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
  
            <div class="form-field">
              <label for="badge">Badge</label>
              <input id="badge" v-model="task.badge" placeholder="Badge earned (if any)" />
            </div>
          </div>
  
          <button type="submit">
            <span class="icon"></span> Update Task
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import taskService from "../services/taskServices";
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  
  export default {
    setup() {
      const task = ref({});
      const route = useRoute();
      const router = useRouter();
  
      const fetchTask = async () => {
        const id = route.params.id;
        const response = await taskService.getTaskById(id);
        task.value = response.data;
      };
  
      const updateTask = async () => {
        try {
          await taskService.updateTask(task.value.id, task.value);
          router.push("/admin/view-task");
        } catch (err) {
          console.error("Error updating task:", err);
        }
      };
  
      onMounted(fetchTask);
  
      return { task, updateTask };
    }
  };
  </script>

  
<style scoped>
:root {
  --primary: #800020;
  --primary-light: #A52A2A;
  --primary-dark: #4A0010;
  --secondary: #F5F5F5;
  --text: #333333;
  --shadow: rgba(128, 0, 32, 0.2);
}

.container {
  width: 100%;
  /* max-width: 600px; */
  padding: 2rem;
  margin: 0 auto;
  background-color: rgb(148, 79, 66);

}

.task-form {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow);
  padding: 2rem;
  overflow: hidden;
  position: relative;
}

.task-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 8px;
  width: 100%;
  background: linear-gradient(90deg, #800020 0%, #A52A2A 100%);
}

h2 {
  color: #800020;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.75rem;
  position: relative;
  padding-bottom: 0.75rem;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #A52A2A;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  margin-bottom: 1.25rem;
}

.form-field.full-width {
  grid-column: span 2;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4A0010;
  font-size: 0.9rem;
}

input, textarea, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #FAFAFA;
  color: var(--text);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #800020;
  box-shadow: 0 0 0 3px rgba(128, 0, 32, 0.1);
  background-color: white;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

button {
  background: linear-gradient(to right, #9f0128, #743b47);
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

.icon {
  margin-right: 0.5rem;
}

/* Task theme decorations */
.task-decoration {
  position: absolute;
  width: 120px;
  height: 120px;
  background-color: rgba(128, 0, 32, 0.07);
  border-radius: 50%;
  z-index: -1;
}

.task-decoration-1 {
  top: -60px;
  right: -60px;
}

.task-decoration-2 {
  bottom: -60px;
  left: -60px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-field.full-width {
    grid-column: span 1;
  }
}
</style>



  
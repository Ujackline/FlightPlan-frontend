<!-- <template>
    <div class="admin-task-form">
      <h2>Create a New Task</h2>
      <form @submit.prevent="createTask">
        <div>
          <label>Task Name:</label>
          <input v-model="task.taskName" required />
        </div>
  
        <div>
          <label>Description:</label>
          <textarea v-model="task.description"></textarea>
        </div>
  
        <div>
          <label>Number of Points:</label>
          <input type="number" v-model="task.NumOfPoints" required />
        </div>
  
        <button type="submit">Create Task</button>
      </form>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
 import task from "../services/task"; 
  
  export default {
    data() {
      return {
        task: {
          taskName: "",
          description: "",
          NumOfPoints: 0,
        },
        message: "",
      };
    },
    methods: {
      async createTask() {
        try {
          const response = await apiClient.post("/tasks", this.task);
          this.message = "Task created successfully!";
          this.task = { taskName: "", description: "", NumOfPoints: 0 }; // Reset form
        } catch (error) {
          console.error("Error creating task:", error);
          this.message = "Failed to create task.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .admin-task-form {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  input, textarea {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    background-color: #28a745;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    margin-top: 10px;
  }
  
  button:hover {
    background-color: #218838;
  }
  </style>
   -->



   <!-- <template>
    <div class="task-form">
      <h2>Create a New Task</h2>
      <form @submit.prevent="createTask">
        <input v-model="task.taskName" placeholder="Task Name" required />
        <input v-model="task.category" placeholder="Category" required />
        <textarea v-model="task.description" placeholder="Description"></textarea>
        <input v-model="task.task_type" placeholder="Type" required />
        <input v-model="task.grad_semester" placeholder="Graduation Semester" required />
        <input v-model="task.CliftonStrengths" placeholder="Clifton Strength" required />
        <textarea v-model="task.majors" placeholder="Major"></textarea>
        <input type="number" v-model="task.NumOfPoints" placeholder="Points" required />
        <button type="submit">Create Task</button>
      </form>
    </div>
  </template>
  
  <script>
import taskService from "../services/task";
  
  export default {
    data() {
      return {
        task: {
          taskName: "",
          category: "",
          description: "",
          NumOfPoints: 0, 
        task_type: "",
        grad_semester: "",
        CliftonStrengths: "",
        completed:"",
        majors:"",
    

        }
      };
    },
    methods: {
      async createTask() {
        try {
          await taskService.createTask(this.task);
          alert("Task created successfully!");
          this.$router.push("/admin");
        } catch (error) {
          console.error("Error creating task:", error);
        }
      }
    }
  };
  </script>
   -->

   <!-- <template>
    <div class="container">
    <div class="task-form">
      <div class="task-decoration task-decoration-1"></div>
      <div class="task-decoration task-decoration-2"></div>
      
      <h2>Create a New Task</h2>
      
      <form @submit.prevent="createTask">
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
        </div>
        
        <button type="submit">
          <span class="icon">✓</span> Create Task
        </button>
      </form>
    </div>
  </div>
  </template>
  
  <script>
  import taskService from "../services/task";
  
  export default {
    data() {
      return {
        task: {
          taskName: "",
          category: "",
          description: "",
          NumOfPoints: 0,
          task_type: "",
          grad_semester: "",
          CliftonStrengths: "",
          completed: "",
          majors: "",
        },
      };
    },
    methods: {
      async createTask() {
        try {
          await taskService.createTask(this.task);
          alert("Task created successfully!");
          this.$router.push("/admin");
        } catch (error) {
          console.error("Error creating task:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>

/* :root {
      --primary: #8B6E4E;
      --primary-light: #D2B48C;
      --primary-dark: #5D4037;
      --secondary: #F5F5DC;
      --text: #3E2723;
      --shadow: rgba(139, 110, 78, 0.2);
    } */
    
    :root {
      --primary: #8B6E4E;
      --primary-light: #D2B48C;
      --primary-dark: #5D4037;
      --secondary: #F5F5DC;
      --text: #3E2723;
      --shadow: rgba(139, 110, 78, 0.2);
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9f0f0;
      color: var(--text);
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
    .container {
      width: 100%;
      max-width: 600px;
      padding: 2rem;
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
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
    }
    
    h2 {
      color: var(--primary-dark);
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
      background-color: var(--primary-light);
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
      color: var(--primary-dark);
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
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(139, 110, 78, 0.1);
      background-color: white;
    }
    
    textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    button {
      background: linear-gradient(to right, var(--primary), var(--primary-dark));
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
      background-color: rgb(109, 18, 18);
    }
    
    button:hover {
      background: linear-gradient(to right, var(--primary-dark), var(--primary));
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(62, 2, 2, 0.15);
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
      background-color: rgba(210, 180, 140, 0.1);
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
   
  </style> -->

  <template>
    <div class="container">
      <div class="task-form">
        <div class="task-decoration task-decoration-1"></div>
        <div class="task-decoration task-decoration-2"></div>
        
        <h2>Create a New Task</h2>
        
        <form @submit.prevent="createTask">
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
          </div>
          
          <button type="submit">
            <span class="icon">✓</span> Create Task
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import taskService from "../services/taskServices";
  
  export default {
    data() {
      return {
        task: {
          taskName: "",
          category: "",
          description: "",
          NumOfPoints: 0,
          task_type: "",
          grad_semester: "",
          CliftonStrengths: "",
          completed: "",
          majors: "",
        }
      };
    },
    methods: {
      async createTask() {
        try {
          await taskService.createTask(this.task);
          alert("Task created successfully!");
          this.$router.push("/admin");
        } catch (error) {
          console.error("Error creating task:", error);
        }
      }
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
    background-color: rgb(118, 43, 30);

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
  
  
  
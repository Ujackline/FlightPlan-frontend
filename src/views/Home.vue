<template>
  <div class="dashboard-container">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <h2>Welcome, {{ firstName }}!</h2>
      <p>Track your progress and achievements</p>
    </div>
    
    <!-- Main content area with 3 columns -->
    <div class="dashboard-columns">
      <!-- Left Column: Points & Progress -->
      <div class="dashboard-column left-column">

        <div class="column-card">
          <h3 class="column-title">Your Eagle Flight Progress</h3>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="progress-text">{{ progress }}% completed</p>
        </div>
        <div class="column-card">
          
          <h3 class="column-title">Points & Rewards</h3>
          
          <!-- Circular Points Gauge -->
          <div class="gauge-container">
            <CircularPoints :points="points" :maxPoints="100" />
          </div>
          
          <p class="points-subtitle">Total earned points</p>
      <center>
        <router-link to="/pointRedemption" class="redeem-button" style="color: white; text-decoration: none;">Redeem Rewards</router-link>
      </center>

     
        </div>
        
      </div>
      
      <!-- Center Column: Flight Plan Tasks -->
      <!-- <div class="dashboard-column center-column">
        <div class="column-card">
          <h3 class="column-title">Flight Plan</h3>
          <div class="task-list">
            <div class="task-header">
              <span>Task</span>
              <th>Points</th>
              <span>Complete</span>
            </div>
            
            <div v-for="task in tasks" :key="task.id" :class="{ 'completed-task': task.completed }">
            <td class="task-name">{{ task.taskName }}</td>
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
            </div>
          </div>
          <button class="view-button">View Completed Tasks</button>
        </div>
      </div> -->

      <div class="dashboard-column center-column">
  <div class="column-card1">
    <div class="card-header1">
      <h3 class="column-title1">Flight Plan</h3>
      <div class="decoration-line"></div>
    </div>
    
    <div class="flight-tasks-container">
      <div class="task-list">
        <div class="task-header">
          <span class="header-task">Task</span>
          <span class="header-points">Points</span>
          <span class="header-complete">Complete</span>
        </div>
        
        <div v-if="tasks && tasks.length === 0" class="empty-tasks">
          <p>No tasks available in your flight plan</p>
        </div>
        
        <div v-for="task in tasks" :key="task.id" class="task-item" :class="{ 'completed-task': task.completed }">
          <div class="task-name">{{ task.taskName }}</div>
          <div class="task-points">{{ task.NumOfPoints }}</div>
          <div class="task-complete">
            <label class="checkbox-container">
              <input 
                type="checkbox" 
                :checked="task.completed"
                @change="toggleCompletion(task)" 
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      
      <button class="view-button">
        <span class="button-icon">✓</span>
        View Completed Tasks
      </button>
    </div>
  </div>
</div>

      
      <!-- Right Column: Upcoming Events -->
      <div class="dashboard-column right-column">
        <div class="column-card">
          <div class="card-header">
            <h3 class="column-title">Upcoming Events</h3>
            
          </div>
          
          <div class="events-list">
            <div v-if="events.length === 0" class="empty-state">
              No upcoming events
            </div>
            <div v-else v-for="event in events" :key="event.id" class="event-item">
              <div class="event-title">{{ event.name }}</div>
              <div class="event-date">{{ formatDate(event.date) }}</div>
              <div class="event-location" v-if="event.location">{{ event.location }}</div>
              <div class="event-category" v-if="event.category">{{ event.category }}</div>
            </div>
          </div>
          <button class="view-button" @click="$router.push('/events')">View All Events</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import CircularPoints from '../components/CircularPoints.vue';
import Utils from '../config/utils';
import eventServices from '../services/eventServices';
// import task from '../services/taskServices';

import taskService from "../services/taskServices"; // Rename to taskService instead of task


export default {
  components: {
    CircularPoints
  },
  setup() {
    const firstName = ref('');
    const progress = ref(10);
    const points = ref(24);
    
    const tasks = ref([]);
    
    const events = ref([]);
    const loading = ref(false);
    const error = ref(null);
   
    
    const formatDate = (dateString) => {
      const options = { month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const fetchUserData = async () => {
      try {
        const storedUser = Utils.getStore("user");
        
        if (storedUser && storedUser.fName) {
          firstName.value = storedUser.fName;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        loading.value = true;
        const response = await eventServices.getAll();
        events.value = response.data;
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to fetch events.";
        console.error("Error fetching upcoming events:", err);
      } finally {
        loading.value = false;
      }
    };



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

    
    
    onMounted(() => {
      fetchUserData();
      fetchEvents();
      fetchTasks();
    });
    
    return {
      firstName,
      progress,
      points,
      tasks,
      events,
      formatDate,
      toggleCompletion
    };
  }
};
</script>

<style scoped>
/* Main container */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Welcome banner */
.welcome-banner {
  background-color: #8B2332;
  color: white;
  padding: 20px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 24px;
}

.welcome-banner h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

/* Columns layout */
.dashboard-columns {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 20px;
}

.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Column cards */
.column-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.column-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

/* Card header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.see-all {
  color: #3182ce;
  font-size: 14px;
  text-decoration: none;
}

/* Points section */
.gauge-container {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.points-subtitle {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.redeem-button {
  width: 100%;
  background-color: #4169E1;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

/* Progress bar */
.progress-bar {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 14px;
  color: #666;
}

/* Task list */
.task-list {
  margin-bottom: 16px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 8px;
  border-bottom: 2px solid #eee;
  font-weight: bold;
  color: #555;
}

.task-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
}

.task-check {
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-check input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

/* Events list */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.event-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #3182ce;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
}

.event-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.event-date, .event-location {
  font-size: 13px;
  color: #666;
  margin-bottom: 3px;
}

.event-category {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  color: #666;
}

.no-events, .no-badges {
  padding: 20px;
  text-align: center;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
  font-size: 14px;
}

/* Badges list */
.badges-list {
  margin-bottom: 16px;
}

.badge-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.badge-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  color: white;
}



/* Badges list */
.badges-list {
  margin-bottom: 16px;
}

.badge-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.badge-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  color: white;
}
.badge-icon.career {
  background-color: #4169E1;
}

.badge-icon.achievement {
  background-color: #FFA500;
}

.badge-name {
  font-weight: bold;
  margin-bottom: 2px;
}

.badge-date {
  font-size: 12px;
  color: #666;
}

/* Button styles */
.view-button {
  width: 100%;
  background-color: #f1f1f1;
  color: #333;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-button:hover {
  background-color: #e5e5e5;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .dashboard-columns {
    grid-template-columns: 1fr 1fr;
  }
  
  .right-column {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .dashboard-columns {
    grid-template-columns: 1fr;
  }
  
  .left-column, .center-column {
    grid-column: 1 / -1;
  }
}

/* // <style scoped> */
/* Main container styles */
.column-card1 {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 8px 24px rgba(128, 0, 32, 0.08);
  border-top: 4px solid #800020;
  overflow: hidden;
}

.card-header1 {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
}

.column-title1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #800020;
  margin: 0 0 0.5rem 0;
}

.decoration-line {
  height: 3px;
  width: 50px;
  background: linear-gradient(90deg, #800020, #A52A2A);
  border-radius: 2px;
  margin-bottom: 0.5rem;
}

/* Task list styling */
.flight-tasks-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-list {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.task-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  background: linear-gradient(to bottom, #f9f9f9, #f0f0f0);
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: #4A0010;
  border-bottom: 2px solid rgba(128, 0, 32, 0.2);
  text-transform: uppercase;
}

.header-task {
  text-align: left;
}

.header-points {
  text-align: center;
}

.header-complete {
  text-align: center;
}

.empty-tasks {
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
  font-style: italic;
}

.task-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background-color 0.2s ease;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item:hover {
  background-color: rgba(128, 0, 32, 0.02);
}

.completed-task {
  background-color: rgba(128, 0, 32, 0.04);
}

.completed-task .task-name {
  text-decoration: line-through;
  color: #888;
}

.task-name {
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 1rem;
}

.task-points {
  font-weight: 600;
  color: #800020;
  text-align: center;
}

.task-complete {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Custom checkbox styling */
.checkbox-container {
  display: block;
  position: relative;
  cursor: pointer;
  user-select: none;
  width: 20px;
  height: 20px;
  margin: 0;
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
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #e9e9e9;
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

/* Button styling */
.view-button {
  background-color: white;
  color: #800020;
  border: 1px solid #800020;
  border-radius: 6px;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-button:hover {
  background-color: rgba(128, 0, 32, 0.05);
  box-shadow: 0 2px 4px rgba(128, 0, 32, 0.1);
}

.view-button:active {
  transform: translateY(1px);
}

.button-icon {
  margin-right: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .task-header, .task-item {
    grid-template-columns: 2fr 1fr 1fr;
    font-size: 0.9rem;
    padding: 0.75rem 0.5rem;
  }
  
  .column-title {
    font-size: 1.1rem;
  }
}
</style>

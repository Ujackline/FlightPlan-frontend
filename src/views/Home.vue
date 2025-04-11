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
      <div class="dashboard-column center-column">
        <div class="column-card">
          <h3 class="column-title">Flight Plan</h3>
          <div class="task-list">
            <div class="task-header">
              <span>Task</span>
              <span>Complete</span>
            </div>
            
            <div v-for="task in tasks" :key="task.id" class="task-item">
              <span class="task-name">{{ task.name }}</span>
              <span class="task-check">
                <input type="checkbox" v-model="task.completed" :disabled="task.locked">
              </span>
            </div>
          </div>
          <button class="view-button">View Completed Tasks</button>
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
import task from '../services/taskServices.js';

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
        const response = await task.getAllTasks();
        tasks.value = response.data;
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to fetch tasks.";
        console.error("Error fetching tasks:", err);
      } finally {
        loading.value = false;
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
      formatDate
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
</style>


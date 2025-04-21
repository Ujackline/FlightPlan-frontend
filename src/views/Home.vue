<!-- Updated template section to support completed tasks toggle -->
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
         
        </div>
      </div>
      
      <!-- Center Column: Flight Plan Tasks -->
      <div class="dashboard-column center-column">
        <div class="column-card1">
          <div class="card-header1">
            <div class="flight-plan-header">
              <h3 class="column-title1">Flight Plan</h3>
              <span v-if="currentSemester" class="current-semester-tag">{{ currentSemester }}</span>
            </div>
            <div class="decoration-line"></div>
          </div>
          
          <div class="flight-tasks-container">
            <div class="task-list">
              <div class="task-header">
                <span class="header-task">Task</span>
                <span class="header-points">Points</span>
                <span class="header-complete">Complete</span>
              </div>
              
              <div v-if="loading" class="empty-tasks">
                <p>Loading tasks...</p>
              </div>
              
              <div v-else-if="flightPlanTasks.length === 0" class="empty-tasks">
                <p>No tasks available in your flight plan</p>
              </div>
              
              <div v-else-if="showCompletedTasks && tasksToDisplay.length === 0" class="empty-tasks">
                <p>No completed tasks yet</p>
              </div>
              
              <div v-else-if="!showCompletedTasks && tasksToDisplay.length === 0" class="empty-tasks">
                <p>All tasks completed! 🎉</p>
              </div>
              
              <div v-else v-for="task in tasksToDisplay" :key="task.id" class="task-item" :class="{ 'completed-task': task.completed }">
                <div class="task-name">{{ task.name }}</div>
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
            
            <button class="view-button" @click="toggleTasksView">
              
              {{ showCompletedTasks ? 'View Active Tasks' : 'View Completed Tasks' }}
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
            <div v-if="eventsLoading" class="empty-state">
              Loading events...
            </div>
            <div v-else-if="events.length === 0" class="empty-state">
              No upcoming events
            </div>
            <div v-else v-for="event in events" :key="event.id" class="event-item">
              <div class="event-title">{{ event.name }}</div>
              <div class="event-date">{{ formatDate(event.date) }}</div>
              <div class="event-location" v-if="event.location">{{ event.location }}</div>
              <div class="event-category" v-if="event.event_type">{{ event.event_type }}</div>
            </div>
          </div>
          <button class="view-button" @click="$router.push('/events')">View All Events</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import CircularPoints from '../components/CircularPoints.vue';
import Utils from '../config/utils';
import apiClient from '../services/services';
import taskService from "../services/taskServices";
import flightPlanServices from "../services/flightPlanServices";
import studentServices from "../services/studentServices";

export default {
  components: {
    CircularPoints
  },
  setup() {
    const firstName = ref('');
    const progress = ref(0);
    const points = ref(0);
    const tasks = ref([]); // All tasks
    const flightPlanTasks = ref([]); 
    const completedTasks = ref([]); // New ref for completed tasks
    const events = ref([]);
    const loading = ref(false);
    const eventsLoading = ref(false);
    const error = ref(null);
    const currentSemester = ref('Fall 2025');
    const currentFlightPlanId = ref(null);
    const showCompletedTasks = ref(false);
    
    // Compute filtered tasks based on completion status
    const activeTasks = computed(() => {
      return flightPlanTasks.value.filter(task => !task.completed);
    });
    
    const tasksToDisplay = computed(() => {
      return showCompletedTasks.value ? 
        flightPlanTasks.value.filter(task => task.completed) : 
        flightPlanTasks.value.filter(task => !task.completed);
    });
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const options = { month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Load main user data
    const fetchUserData = async () => {
      try {
        const storedUser = Utils.getStore("user");
        
        if (storedUser && storedUser.fName) {
          firstName.value = storedUser.fName;
          
          // Get the student data using studentServices
          await fetchUserFlightPlan(storedUser.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    // Fetch the user's current flight plan
    const fetchUserFlightPlan = async (userId) => {
      try {
        console.log('Fetching flight plan for user:', userId);

        // Get the student data using studentServices
        const student = await studentServices.getStudentByUserId(userId);
        console.log('Student data:', student);

        if (!student) {
          console.error('Student data not found');
          return;
        }
        
        // Use student's semester directly
        if (student.semester) {
          currentSemester.value = student.semester;
        }
        
        // Update points
        if (student.points) {
          points.value = parseInt(student.points);
        }

        try {
          // Get flight plan for this student
          const response = await flightPlanServices.getFlightPlanBySemester(student.id, student.semester);
          
          console.log('Flight plan response:', response);
          
          if (response.data && response.data.id) {
            currentFlightPlanId.value = response.data.id;
            console.log('Set current flight plan ID:', currentFlightPlanId.value);
            
            // Fetch tasks now that we have a flight plan ID
            await fetchTasks();
          } else {
            console.warn('No flight plan found for this student');
            flightPlanTasks.value = [];
          }
        } catch (error) {
          console.error('Error fetching flight plan:', 
            error.response?.data || error.message, 
            error.response?.status
          );
          flightPlanTasks.value = [];
        }
      } catch (error) {
        console.error('Error in fetchUserFlightPlan:', error);
      }
    };
    
    // Fetch tasks for the flight plan
    const fetchTasks = async () => {
      try {
        loading.value = true;
        
        if (!currentFlightPlanId.value) {
          console.warn('No flight plan ID available - cannot fetch tasks');
          flightPlanTasks.value = [];
          return;
        }
        
        console.log('Fetching tasks for flight plan ID:', currentFlightPlanId.value);
        
        const response = await flightPlanServices.getFlightPlanTasks(currentFlightPlanId.value);
        console.log('Flight plan tasks response:', response);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          flightPlanTasks.value = response.data;
          
          // Calculate progress
          updateProgress();
        } else {
          console.log('No tasks found for this flight plan');
          flightPlanTasks.value = [];
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        flightPlanTasks.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Function to update progress calculation
    const updateProgress = () => {
      if (flightPlanTasks.value.length > 0) {
        const completedCount = flightPlanTasks.value.filter(t => t.completed).length;
        progress.value = Math.round((completedCount / flightPlanTasks.value.length) * 100);
      } else {
        progress.value = 0;
      }
    };
    
    // Fetch events
    const fetchEvents = async () => {
      try {
        eventsLoading.value = true;
        
        // Get events directly
        const response = await apiClient.get('/event');
        console.log('Events response:', response);
        
        if (response.data && Array.isArray(response.data)) {
          events.value = response.data.slice(0, 5); // Limit to 5 most recent events
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        eventsLoading.value = false;
      }
    };
    

// Toggle task completion
const toggleCompletion = async (task) => {
  try {
    console.log('Toggling task completion:', task);
    
    // Optimistically update UI first
    task.completed = !task.completed;
    
    // Calculate new points value if task is completed
    if (task.completed) {
      points.value += task.NumOfPoints;
    } else {
      points.value -= task.NumOfPoints;
    }
    
    // Update progress
    updateProgress();
    
    // Call API to update server - using the non-async version of your service
    taskService.completeTask(task.id)
      .then(response => {
        console.log('Task completion response:', response);
        
        // Update student points in the background
        const storedUser = Utils.getStore("user");
        if (storedUser && storedUser.id) {
          studentServices.getStudentByUserId(storedUser.id)
            .then(student => {
              if (student) {
                // Update points on server
                studentServices.updateStudentPoints(student.id, points.value);
              }
            })
            .catch(err => {
              console.error("Error updating student points:", err);
            });
        }
      })
      .catch(err => {
        console.error("Error updating task completion:", err);
        // Revert UI changes if server call fails
        task.completed = !task.completed;
        
        // Revert points calculation if task completion failed
        if (!task.completed) {
          points.value -= task.NumOfPoints;
        } else {
          points.value += task.NumOfPoints;
        }
        
        // Update progress after reverting
        updateProgress();
      });
  } catch (err) {
    console.error("Unexpected error in toggleCompletion:", err);
  }
};
    
    // Toggle between showing active and completed tasks
    const toggleTasksView = () => {
      showCompletedTasks.value = !showCompletedTasks.value;
    };
    
    onMounted(() => {
      fetchUserData();
      fetchEvents();
    });
    
    return {
      firstName,
      progress,
      points,
      tasks,
      flightPlanTasks,
      events,
      loading,
      eventsLoading,
      error,
      currentSemester,
      formatDate,
      toggleCompletion,
      showCompletedTasks,
      toggleTasksView,
      tasksToDisplay,
      activeTasks
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

.flight-plan-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.current-semester-tag {
  background-color: #8B2332;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
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
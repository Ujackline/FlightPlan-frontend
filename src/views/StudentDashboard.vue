<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo-container">
        <div class="logo">
          <v-icon color="white" size="x-large">mdi-school</v-icon>
        </div>
      </div>
      <div class="nav-item">
        <v-icon color="white" class="nav-icon">mdi-clipboard-check</v-icon>
        <router-link to="/profile" class="nav-text" style="color: white; text-decoration: none;">My Profile</router-link>
      </div>

      <div class="nav-item">
        <v-icon color="white" class="nav-icon">mdi-clipboard-check</v-icon>
        <router-link to="/task" class="nav-text" style="color: white; text-decoration: none;">My Tasks</router-link>
      </div>

      <div class="nav-item">
        <v-icon color="white" class="nav-icon">mdi-medal</v-icon>
        <router-link to="/badge" class="nav-text" style="color: white; text-decoration: none;">My Badges</router-link>
      </div>

      <div class="nav-item">
        <v-icon color="white" class="nav-icon">mdi-chart-bar</v-icon>
        <router-link to="/experience" class="nav-text" style="color: white; text-decoration: none;">My Points</router-link>
      </div>
   
      <div class="nav-item">
        <v-icon color="white" class="nav-icon">mdi-pencil</v-icon>
        <router-link to="/events" class="nav-text" style="color: white; text-decoration: none;">Event Registration</router-link>
      </div>

      <div class="sidebar-spacer"></div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      
      <!-- Header with Search and Profile -->
      <div class="header">
        <input type="text" placeholder="">
        <div class="profile">
          <div class="profile-pic">
            <img src="https://via.placeholder.com/40" alt="Profile">
          </div>
          
          <div class="profile-info">
  <div class="profile-name">{{ firstName }} {{ lastName }}</div>
  <div class="profile-year">{{ studentSemester }}</div>
</div>
          <div class="notification-icon">
            <v-icon>mdi-bell</v-icon>
            <div v-if="notifications > 0" class="notification-badge"></div>
          </div>
        </div>
      </div>

      <!-- Progress Bar
      <div class="progress-section">
        <p class="progress-text">Flight Plan Progress</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="progress-percentage">{{ progressPercentage }}% complete</p>
      </div> -->

      <!-- Points Section -->
      <div class="points-card">
        <h2 class="card-title">Total Points Earned</h2>
        <p class="total-points">{{ totalPoints }}</p>
        <div class="points-breakdown">
          <span>Tasks: {{ pointsBreakdown.tasks }}</span>
          <span>Events: {{ pointsBreakdown.events }}</span>
          <span>Experiences: {{ pointsBreakdown.experiences }}</span>
        </div>
      </div>

    
      <div class="dashboard-grid">
        <!-- My Experiences -->
        <div class="card-container">
          <div class="card-header">
            <h2 class="card-title">My Experiences</h2>
            <router-link to="/experience" class="see-all">Manage Experiences →</router-link>
          </div>
          <div class="experiences-list">
            <div v-for="exp in experiences.slice(0, 3)" :key="exp.id" class="experience-item">
              <div class="experience-title">{{ exp.name }}</div>
              <div class="experience-details">{{ exp.status }}</div>
              <div class="badge-category" v-if="exp.category">{{ exp.category }}</div>
            </div>
            <div v-if="experiences.length === 0" class="empty-state">
              No experiences added yet
            </div>
          </div>
        </div>

        <!-- My Badges -->
        <div class="card-container">
          <div class="card-header">
            <h2 class="card-title">My Badges</h2>
            <router-link to="/badge" class="see-all">View All Badges →</router-link>
          </div>
          
          <!-- Badge count indicator -->
          <div class="badge-count">Showing {{ Math.min(badges.length, displayedBadgeCount) }} of {{ badges.length }} badges</div>
          
          <div class="badges-container">
            <div v-for="(badge, index) in badges.slice(0, displayedBadgeCount)" :key="index" class="badge-item" :class="badge.badge_type.toLowerCase()">
              <!-- Workforce Debut -->
              <svg v-if="badge.name === 'Workforce Debut'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
              </svg>

              <!-- Interview Master -->
              <svg v-else-if="badge.name === 'Interview Master'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>

              <!-- Resume Builder -->
              <svg v-else-if="badge.name === 'Resume Builder'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM12 18H8v-2h4v2zm4-4H8v-2h8v2zm0-4H8V8h8v2zm-3-5V3.5L18.5 9H13V5z" />
              </svg>

              <!-- Interview Ready -->
              <svg v-else-if="badge.name === 'Interview Ready'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
              </svg>

              <!-- Network Starter -->
              <svg v-else-if="badge.name === 'Network Starter'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>

              <!-- Portfolio Creator -->
              <svg v-else-if="badge.name === 'Portfolio Creator'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
              </svg>

              <!-- Default icon if no specific icon is defined -->
              <i v-else :class="badge.badge_type === 'Career' ? 'fas fa-briefcase' : 'fas fa-trophy'"></i>
              
              <div class="badge-tooltip">{{ badge.name }}</div>
            </div>
            <div v-if="badges.length === 0" class="empty-state">
              No badges earned yet
            </div>
          </div>
          
          <!-- Show more/less badges button -->
          <div v-if="badges.length > 6" class="show-more-container">
            <button 
              @click="toggleBadgeCount" 
              class="show-more-btn"
            >
              {{ displayedBadgeCount === 6 ? 'Show More Badges' : 'Show Fewer Badges' }}
            </button>
          </div>
        </div>
        

 
<!-- Completed Tasks -->
<div class="card-container">
  <div class="card-header">
    <h2 class="card-title">Completed Tasks</h2>
    <router-link to="/task" class="see-all">View All →</router-link>
  </div>
  <div class="tasks-list">
    <div v-for="task in tasks.filter(t => t.completed).slice(0, 3)" :key="task.id" class="task-item">
      <!-- Use taskName as primary with name as fallback -->
      <div class="task-title">{{ task.taskName || task.name || 'Unnamed Task' }}</div>
      <div class="task-date">{{ task.completionDate ? formatDate(task.completionDate) : 'Completed' }}</div>
    </div>
    <div v-if="tasks.filter(t => t.completed).length === 0" class="empty-state">
      No completed tasks
    </div>
  </div>
</div>
        <!-- Completed Events -->
        <div class="card-container">
          <div class="card-header">

            <h2 class="card-title">Registered Events</h2>
            <router-link to="/event" class="see-all">View All →</router-link>
          </div>
          <div class="events-list">
            <div v-for="event in registeredEvents.slice(0, 3)" :key="event.id" class="event-item">
              <div class="event-title">{{ event.name }}</div>
              <div class="event-date">{{ formatDate(event.date) }}</div>
              <div class="event-location">{{ event.location }}</div>
            </div>
            <div v-if="registeredEvents.length === 0" class="empty-state">
              No registered events
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import taskService from '../services/taskServices';
import badgeServices from '../services/badgeServices';
import studentServices from '../services/studentServices';
import experienceServices from '../services/experienceServices';
import eventServices from '../services/eventServices';
import Utils from '../config/utils';
import semesterServices from '../services/semesterServices';

export default {
  name: 'StudentDashboard',
  components: {
    CareerResources
  },
  setup() {
    const store = useStore();
    
    // State management
    const studentId = ref(null);
    const studentName = ref('');
    const studentSemester = ref('');
    const progressPercentage = ref(65);
    const totalPoints = ref(0);
    const pointsBreakdown = ref({ tasks: 0, events: 0, experiences: 0 });
    const experiences = ref([]);
    const badges = ref([]);
    const tasks = ref([]);
    const registeredEvents = ref([]);
    const notifications = ref(0);
    const firstName = ref(null);
    const lastName = ref(null);
    const error = ref(null);
    const loading = ref(true);
    const message = ref('');
    const currentUser = ref(null);

    
    // Badge display count control
    const displayedBadgeCount = ref(6); // Default to showing 6 badges

    const toggleBadgeCount = () => {
      displayedBadgeCount.value = displayedBadgeCount.value === 6 ? 12 : 6;
    };
    
    // Computed properties
    const user = computed(() => store.getters.getLoginUserInfo);
    
    // Methods
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return 'Unknown date';
        }
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      } catch (e) {
        return 'Unknown date';
      }
    };
    
    const formatTime = (timeString) => {
      try {
        const time = new Date(timeString);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        return timeString;
      }
    };
    
    const setUserFromStore = () => {
      const userData = user.value;
      if (userData) {
        studentId.value = userData.id || null;
        studentName.value = userData.name || 'Student';
        studentSemester.value = userData.year || '3rd year';
        console.log('User data from store:', userData);
      } else {
        console.warn('No user data found in store');
      }
    };
   
    // Comprehensive function to get current user from all available sources
    const getCurrentUser = async () => {
      try {
        // Try to get from store first
        const storeUser = store.getters.getLoginUserInfo;
        
        if (storeUser && storeUser.id) {
          console.log('User found in store:', storeUser.id);
          currentUser.value = storeUser;
          firstName.value = storeUser.fName || storeUser.firstName;
          lastName.value = storeUser.lName || storeUser.lastName;
          return storeUser;
        }
        
        // If not in store, try localStorage
        const storedUser = Utils.getStore("user");
        if (storedUser && (storedUser.id || storedUser.userId)) {
          console.log('User found in localStorage:', storedUser);
          currentUser.value = storedUser;
          firstName.value = storedUser.fName || storedUser.firstName;
          lastName.value = storedUser.lName || storedUser.lastName;
          return storedUser;
        }
        
        // If not in localStorage, try API
        console.log('User not found in store or localStorage, attempting to fetch from API');
        message.value = 'Retrieving user data...';
        
        const response = await studentServices.getStudentById();
        
        if (response && response.id) {
          console.log('User fetched from API:', response.id);
          currentUser.value = response;
          firstName.value = response.fName || response.firstName;
          lastName.value = response.lName || response.lastName;
          return response;
        } else {
          throw new Error('Could not retrieve user information');
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        message.value = 'Unable to determine current user. Please log in again.';
        loading.value = false;
        return null;
      }
    };
    const fetchStudentSemester = async () => {
  try {
    const response = await semesterServices.getActiveSemester;
    studentSemester.value = response.data || response;
    console.log('Current Semester loaded:', studentSemester.value);
  } catch (error) {
    console.error('Error fetching current semester:', error);
    studentSemester.value = '';
  }
};
    const fetchExperiences = async () => {
      try {
        const response = await experienceServices.getExperiences();
        experiences.value = response.data || response;
        console.log('Experiences loaded:', experiences.value);
        
        // Calculate points from experiences
        const experiencePoints = experiences.value
          .filter(exp => exp.status === 'Approved')
          .reduce((sum, exp) => sum + (exp.points || 0), 0);
        
        pointsBreakdown.value.experiences = experiencePoints;
        updateTotalPoints();
      } catch (error) {
        console.error('Error fetching experiences:', error);
        experiences.value = [];
      }
    };

    const fetchBadges = async () => {
  try {
  loading.value = true;
  message.value = '';
  
  const user = currentUser.value || await getCurrentUser();
  
  if (!user || !user.id) {
  message.value = 'User not found. Please log in again.';
  loading.value = false;
  return;
  }
  
  console.log('Fetching badges for user:', user.id);
  const response = await badgeServices.getAllUserBadges(user.id);
  
  console.log('Badge API response:', response);
  
  // Handle different possible data structures
  if (Array.isArray(response)) {
  // If response is directly an array
  badges.value = response.map(badge => ({
  ...badge,
  badge_type: badge.badge_type || badge.type || 'Achievement'
  }));
  } else if (response && Array.isArray(response.data)) {
  // If response has a data array property
  badges.value = response.data.map(badge => ({
  ...badge,
  badge_type: badge.badge_type || badge.type || 'Achievement'
  }));
  } else if (response && typeof response === 'object') {
  // If response is a single object or has a different structure
  // Try to extract badges if they exist in the response
  const badgeData = response.data || response;
  
  if (Array.isArray(badgeData)) {
  badges.value = badgeData.map(badge => ({
  ...badge,
  badge_type: badge.badge_type || badge.type || 'Achievement'
  }));
  } else {
  // If it's a single badge object
  badges.value = [{ 
  ...badgeData,
  badge_type: badgeData.badge_type || badgeData.type || 'Achievement'
  }];
  }
  } else {
  badges.value = [];
  message.value = 'No badges found for this user.';
  }
  
  console.log('Processed badges:', badges.value);
  
  if (badges.value.length === 0) {
  message.value = 'No badges found for this user.';
  }
  } catch (error) {
  console.error('Error fetching badges:', error);
  message.value = 'Failed to load your badges. Please try again.';
  badges.value = [];
  } finally {
  loading.value = false;
  }
};


const fetchTasks = async () => {
  try {
    const response = await taskService.getAllTasks();
    tasks.value = response.data || [];
    console.log('Tasks loaded:', tasks.value);
    
    // Calculate points from completed tasks
    const taskPoints = tasks.value
      .filter(task => task.completed)
      .reduce((sum, task) => sum + (task.NumOfPoints || 0), 0);
    
    pointsBreakdown.value.tasks = taskPoints;
    updateTotalPoints();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    tasks.value = [];
  }
};
const fetchStudentPoints = async () => {
  try {
    const user = currentUser.value || await getCurrentUser();
    
    if (user && user.id) {
      const studentData = await studentServices.getStudentByUserId(user.id);
      if (studentData && typeof studentData.points === 'number') {
        totalPoints.value = studentData.points;
        console.log('Student points loaded:', totalPoints.value);
      }
    }
  } catch (error) {
    console.error('Error fetching student points:', error);
    // Keep using calculated points if we can't fetch the actual value
  }
};
    const fetchRegisteredEvents = async () => {
      try {
        if (studentId.value) {
          const response = await eventServices.getRegisteredEvents(studentId.value);
          registeredEvents.value = response.data || [];
          console.log('Registered events loaded:', registeredEvents.value);
          
          const eventPoints = registeredEvents.value.length * 75; 
          
          pointsBreakdown.value.events = eventPoints;
          updateTotalPoints();
        } else {
          // Load from localStorage if not logged in
          const stored = localStorage.getItem('eventRegistrations');
          if (stored) {
            const localRegistrations = JSON.parse(stored);
            // Get full event details
            const allEvents = await eventServices.getAll();
            registeredEvents.value = allEvents.data.filter(event => 
              localRegistrations.includes(event.id)
            );
          }
        }
      } catch (error) {
        console.error('Error fetching registered events:', error);
        registeredEvents.value = [];
      }
    };
    
    const updateTotalPoints = () => {
      totalPoints.value = 
        pointsBreakdown.value.tasks + 
        pointsBreakdown.value.events + 
        pointsBreakdown.value.experiences;
      
      // Update progress percentage based on points
      // Assuming 1000 points is 100% completion
      progressPercentage.value = Math.min(Math.round((totalPoints.value / 1000) * 100), 100);
    };
    
    const refreshDashboard = async () => {
      await getCurrentUser(); // Get user data first
      
      await Promise.all([
        fetchExperiences(),
        fetchBadges(),
        fetchTasks(),
        fetchStudentPoints,
        fetchRegisteredEvents(),
        fetchStudentSemester()
      
      ]);
    };
    
    onMounted(() => {
      refreshDashboard();
    });
    
    return {
      studentId,
      firstName,
      lastName,
      studentName,
      studentSemester,
      progressPercentage,
      totalPoints,
      pointsBreakdown,
      experiences,
      badges,
      tasks,
      registeredEvents,
      notifications,
      displayedBadgeCount,
      toggleBadgeCount,
      formatDate,
      formatTime,
      refreshDashboard,
    };
  }
 };
 </script>
 
 <style scoped>
 * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
 }
 
 .dashboard-container {
  background-color: white;
  width: 100%;
  height: 100vh;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Sidebar Styles */
.sidebar {
  background-color: #660000;
  width: 220px;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  background-color: #660000;
  width: 90px;
  height: 90px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
 }
 
 .logo {
  width: 50px;
  height: 50px;
  color: white;
  font-size: 24px;
 }
 
 .nav-item {
  width: 100%;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  color: white;
  cursor: pointer;
  margin-bottom: 5px;
  transition: background-color 0.3s;
 }
 
 .nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
 }
 
 .nav-icon {
  margin-right: 15px;
  width: 20px;
  text-align: center;
 }
 
 .nav-text {
  font-size: 14px;
 }
 
 .sidebar-spacer {
  flex-grow: 1;
 }
 
 
 .main-content {
  flex-grow: 1;
  padding: 20px 30px;
  overflow-y: auto;
  margin-top: 30px; 
  padding-top: 20px;
 }
 
 .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
 }
 
 
 .profile {
  display: flex;
  align-items: center;
 }
 
 .profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  background-color: #f0f0f0;
 }
 
 .profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
 }
 
 .profile-info {
  font-size: 14px;
 }
 
 .profile-name {
  font-weight: bold;
 }
 
 .profile-year {
  color: #666;
 }
 
 .notification-icon {
  margin-left: 15px;
  color: #333;
  position: relative;
 }
 
 .notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}

/* Welcome Banner */
.welcome-banner {
  background-color: #660000;
  border-radius: 15px;
  padding: 30px;
  color: white;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
 }
 
 .welcome-text h1 {
  font-size: 28px;
  margin-bottom: 10px;
 }
 
 .welcome-text p {
  font-size: 14px;
  opacity: 0.9;
 }
 
 
 .progress-section {
  margin-bottom: 25px;
 }
 
 .progress-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
 }
 
 .progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
 }
 
 .progress-fill {
  height: 100%;
  background-color: #289e32;
  border-radius: 4px;
 }
 
 .progress-percentage {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 5px;
 }
 
 /* Card Layouts */
 .card-title {
  font-size: 18px;
  font-weight: bold;
 }
 
 .see-all {
  color: #3182ce;
  font-size: 14px;
  text-decoration: none;
 }
 
 .card-container {
  background-color: #eff6ff;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  height: 100%;
 }
 
 .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
 }
 
 /* Points Card */
 .points-card {
  background-color: #eff6ff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
 }
 
 .total-points {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
 }
 
 .points-breakdown {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  margin-top: 10px;
}


.task-item, .event-item {
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  border-left: 4px solid #3182ce;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
 }
 
 .task-title, .event-title {
  font-weight: 500;
  margin-bottom: 5px;
 }
 
 .task-date, .event-date, .event-location {
  font-size: 13px;
  color: #666;
 }
 
 
 .badge-count {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
  text-align: center;
 }
 
 .badges-container {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  flex-wrap: wrap;
  justify-content: center;
 }
 
 .badge-item {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  color: white;
  font-size: 20px;
 }
 
 .badge-item.career {
  background-color: #4169E1;
 }
 
 .badge-item.achievement {
  background-color: #FFA500;
 }
 
 .badge-tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 10;
 }
 
 .badge-item:hover .badge-tooltip {
  opacity: 1;
 }
 
 .show-more-container {
  text-align: center;
  margin-top: 15px;
 }
 
 .show-more-btn {
  background-color: transparent;
  color: #3182ce;
  border: 1px solid #3182ce;
  border-radius: 4px;
  padding: 5px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
 }
 
 .show-more-btn:hover {
  background-color: #3182ce;
  color: white;
 }
 
 /* Experiences */
 .experiences-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
 }
 
 .experience-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #3182ce;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
 }
 
 .experience-title {
  font-weight: 500;
  margin-bottom: 5px;
 }
 
 .experience-details {
  font-size: 13px;
  color: #666;
 }
 
 .badge-category {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  color: #666;
 }
 
 /* Empty State */
 .empty-state {
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
  font-size: 14px;
 }
 
 .badge-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
 }
 
 .image-badge-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
 }
 
 /* Update the grid layout */
 .dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
 }
 
 @media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
 }
 </style>
 
<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo-container">
        <div class="logo">
  <i class="fas fa-graduation-cap"></i>
</div>
      </div>

      <div class="nav-item">
        <i class="fas fa-th-large"></i>
        <div class="nav-text">Dashboard Here</div>
      </div>


      <div class="nav-item">
        <i class="fas fa-pen"></i>
        <div class="nav-text"> Event Registration</div>
      </div>


      <div class="nav-item">
        <i class="fas fa-award"></i>
        <div class="nav-text">Badges</div>
      </div>

      <div class="nav-item">
        <i class="fas fa-tasks"></i>
        <div class="nav-text">Tasks</div>
      </div>

      <div class="nav-item">
        <i class="fas fa-calendar-alt"></i>
        <div class="nav-text">Events</div>
      </div>

      <div class="nav-item">
        <i class="fas fa-star"></i>
        <div class="nav-text">Experiences</div>
      </div>

      <div class="nav-item">
        <i class="fas fa-poll"></i>
        <div class="nav-text">Points</div>
      </div>

      <div class="sidebar-spacer"></div>

      <div class="nav-item">
        <i class="fas fa-sign-out-alt"></i>
        <div class="nav-text">Logout</div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header with Search and Profile -->
      <div class="header">
        <input type="text" class="search-bar" placeholder="Search">
        <div class="profile">
          <div class="profile-pic">
            <img src="https://via.placeholder.com/40" alt="Profile">
          </div>
          <div class="profile-info">
            <div class="profile-name">{{ studentName || 'John Doe' }}</div>
            <div class="profile-year">3rd year</div>
          </div>
          <div class="notification-icon">
            <i class="fas fa-bell"></i>
            <div class="notification-badge"></div>
          </div>
        </div>
      </div>

      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="welcome-text">
          <h1>Eagle Flight Plan</h1>
          <p>Track your progress and achievements</p>
        </div>
        
        <div class="decoration decoration-1"></div>
        <div class="decoration decoration-2"></div>
        <div class="decoration decoration-3"></div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <p class="progress-text">Flight Plan Progress</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>

      <!-- Points Section -->
      <div class="points-card">
        <h2 class="card-title">Total Points Earned</h2>
        <p class="total-points">{{ totalPoints }}</p>
        <div class="points-breakdown">
          <span>Tasks: {{ pointsBreakdown.tasks }}</span>
          <span>Events: {{ pointsBreakdown.events }}</span>
          <span>Extras: {{ pointsBreakdown.extras }}</span>
        </div>
      </div>

      <!-- Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- My Experiences -->
        <div class="card-container">
          <div class="card-header">
            <h2 class="card-title">My Experiences</h2>
            <router-link to="/experience" class="see-all">Manage Experiences →</router-link>
          </div>
          <div class="experiences-list">
            <div v-for="(experience, index) in experiences" :key="index" class="experience-item">
              <div class="experience-title">{{ experience.title }}</div>
              <div class="experience-details">{{ experience.details }}</div>
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
            <router-link to="/badge" class="see-all">View Badges →</router-link>
          </div>
          <div class="badges-container">
            <div v-for="(badge, index) in badges" :key="index" class="badge-item">
              <i :class="['fas', badge.icon, 'badge-icon']"></i>
            </div>
            <div v-if="badges.length === 0" class="empty-state">
              No badges earned yet
            </div>
          </div>
        </div>


        <!-- Completed Tasks -->
        <div class="card-container">
          <div class="card-header">
            <h2 class="card-title">Completed Tasks</h2>
            <a href="#" class="see-all" @click.prevent="$emit('navigate', 'completed-tasks')">View All →</a>
          </div>
          <div class="tasks-list">
            <div v-for="task in completedTasks" :key="task.id" class="task-item">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-date">Completed: {{ task.completedDate }}</div>
            </div>
            <div v-if="completedTasks.length === 0" class="empty-state">
              No completed tasks
            </div>
          </div>
        </div>

       

        <!-- Completed Events -->
        <div class="card-container">
          <div class="card-header">
            <h2 class="card-title">Completed Events</h2>
            <a href="#" class="see-all" @click.prevent="$emit('navigate', 'completed-events')">View All →</a>
          </div>
          <div class="events-list">
            <div v-for="event in completedEvents" :key="event.id" class="event-item">
              <div class="event-date">{{ event.date }}, {{ event.time }}</div>
              <div class="event-title">{{ event.title }}</div>
              <div class="event-location">{{ event.location }}</div>
            </div>
            <div v-if="completedEvents.length === 0" class="empty-state">
              No completed events
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="$emit('navigate', 'dashboard')" class="primary-btn">GO TO DASHBOARD</button>
        <button @click="$emit('navigate', 'profile')" class="secondary-btn">VIEW PROFILE</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StudentDashboard',
  data() {
    return {
      studentId: null,
      studentName: '',
      progressPercentage: 0,
      totalPoints: 0,
      pointsBreakdown: { tasks: 0, events: 0, extras: 0 },
      experiences: [],
      badges: [],
      upcomingTasks: [],
      completedTasks: [],
      upcomingEvents: [],
      completedEvents: []
    };
  },
  async created() {
    await this.fetchStudentId();
    if (this.studentId) {
      await Promise.all([
        this.fetchDashboardData(),
        this.fetchExperiences(),
        this.fetchBadges(),
        this.fetchTasks(),
        this.fetchEvents()
      ]);
    }
  },
  methods: {
    async fetchStudentId() {
      try {
        const response = await axios.get('/flight-plan-t9/user'); 
        this.studentId = response.data.id; 
        this.studentName = response.data.name || 'Student'; 
      } catch (error) {
        console.error('Error fetching student ID:', error);
        // Set default values for demo
        this.studentId = 1;
        this.studentName = 'Mwiza Laura ';
      }
    },
    async fetchDashboardData() {
      try {
        const [progressRes, pointsRes] = await Promise.all([
          axios.get(`/flight-plan-t9/student/progress/${this.studentId}`),
          axios.get(`/flight-plan-t9/student/points/${this.studentId}`)
        ]);

        this.progressPercentage = progressRes.data.progress || 65;
        this.totalPoints = pointsRes.data.total || 850;
        this.pointsBreakdown = pointsRes.data.breakdown || { tasks: 350, events: 250, extras: 250 };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values for demo
        this.progressPercentage = 65;
        this.totalPoints = 850;
        this.pointsBreakdown = { tasks: 350, events: 250, extras: 250 };
      }
    },
    async fetchExperiences() {
      try {
        const response = await axios.get(`/flight-plan-t9/experience/${this.studentId}`);
        this.experiences = response.data || [];
      } catch (error) {
        console.error('Error fetching experiences:', error);
        // Sample data for demo
        this.experiences = [
          { title: 'Research Assistant', details: 'Computer Science Department' },
          { title: 'Leadership Workshop', details: 'Student Leadership Program' }
        ];
      }
    },
    async fetchBadges() {
      try {
        const response = await axios.get(`/flight-plan-t9/badge/${this.studentId}`);
        this.badges = response.data || [];
      } catch (error) {
        console.error('Error fetching badges:', error);
        // Sample data for demo
        this.badges = [
          { name: 'Achievement', icon: 'fa-award' },
          { name: 'Excellence', icon: 'fa-certificate' },
          { name: 'Leadership', icon: 'fa-medal' },
          { name: 'Completion', icon: 'fa-trophy' }
        ];
      }
    },
    async fetchTasks() {
      try {
        const response = await axios.get('/flight-plan-t9/task/');
        // Filter tasks into upcoming and completed
        this.upcomingTasks = response.data.filter(task => !task.completed) || [];
        this.completedTasks = response.data.filter(task => task.completed) || [];
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Sample data for demo
        this.upcomingTasks = [
          { id: 1, title: 'Submit Research Proposal', dueDate: 'April 15, 2025' },
          { id: 2, title: 'Complete Career Assessment', dueDate: 'April 8, 2025' }
        ];
        this.completedTasks = [
          { id: 3, title: 'Resume Review Session', completedDate: 'March 25, 2025' },
          { id: 4, title: 'Internship Application', completedDate: 'March 20, 2025' }
        ];
      }
    },
    async fetchEvents() {
      try {
        const response = await axios.get('/flight-plan-t9/event/');
        const currentDate = new Date();
        
        // Filter events into upcoming and completed based on date
        this.upcomingEvents = response.data.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= currentDate;
        }) || [];
        
        this.completedEvents = response.data.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate < currentDate;
        }) || [];
      } catch (error) {
        console.error('Error fetching events:', error);
        // Sample data for demo
        this.upcomingEvents = [
          { id: 1, title: 'Career Fair', date: 'April 5, 2025', time: '2:00 PM', location: 'Student Union Building' },
          { id: 2, title: 'Industry Panel Discussion', date: 'April 12, 2025', time: '10:00 AM', location: 'Engineering Hall, Room 203' }
        ];
        this.completedEvents = [
          { id: 3, title: 'Resume Workshop', date: 'March 18, 2025', time: '3:00 PM', location: 'Career Center' },
          { id: 4, title: 'Networking Mixer', date: 'March 10, 2025', time: '1:00 PM', location: 'Alumni Hall' }
        ];
      }
    }
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
  background-color: #963030;
  width: 220px;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  background-color: #963030;
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

.nav-item i {
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

/* Main Content Styles */
.main-content {
  flex-grow: 1;
  padding: 20px 30px;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  background-color: #f5f5f5;
  border-radius: 20px;
  width: 300px;
  padding: 10px 20px;
  border: none;
  outline: none;
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
  background-color: #963030;
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

.welcome-illustration {
  position: relative;
  width: 200px;
  height: 120px;
}

.welcome-illustration img {
  max-width: 100%;
  max-height: 100%;
}

/* Progress Bar */
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

/* Card Layouts */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

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

/* Tasks and Events */
.task-item, .event-item {
  background-color: white;
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

/* Badges */
.badges-container {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.badge-item {
  width: 60px;
  height: 60px;
  background-color: #e0e7ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.badge-icon {
  color: #4f46e5;
  font-size: 24px;
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
}

.experience-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.experience-details {
  font-size: 13px;
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

/* Sections Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.primary-btn {
  background-color: #963030;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
}

.secondary-btn {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
}

/* Decorative elements */
.decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0.6;
}

.decoration-1 {
  background-color: #ff7e7e;
  top: 50px;
  right: 180px;
}

.decoration-2 {
  background-color: #7ee8ff;
  top: 30px;
  right: 80px;
}

.decoration-3 {
  background-color: #ffd37e;
  bottom: 40px;
  right: 120px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    height: auto;
  }
  
  .sidebar {
    width: 100%;
    padding: 15px 0;
  }
  
  .logo-container {
    margin-bottom: 15px;
  }
  
  .welcome-banner {
    flex-direction: column;
  }
  
  .welcome-illustration {
    display: none;
  }
}
</style>

<template>
  <div class="admin-dashboard">
    <!-- Sidebar Navigation -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h1>Flight Plan</h1>
        <div class="admin-info">
          <div class="admin-name">{{ admin.fName }} {{ admin.lName }}</div>
        </div>
        <nav>
          <div class="nav-item">
          <v-icon color="white" class="nav-icon">mdi-briefcase</v-icon>
            <router-link to="/experience" class="nav-text" style="color: white; text-decoration: none;">Experience Management</router-link>
          </div>

          <div class="nav-item">
            <v-icon color="white" class="nav-icon">mdi-calendar</v-icon>
            <router-link to="/admin/AdminEvents" class="nav-text" style="color: white; text-decoration: none;">Event Management</router-link>
          </div>

          <div class="nav-item">
            <v-icon color="white" class="nav-icon">mdi-account-multiple</v-icon>
            <router-link to="/admin/students" class="nav-text" style="color: white; text-decoration: none;">Student Flight Plans</router-link>
          </div>

          <div class="nav-item">
          <i class="fas fa-coins nav-icon" style="color: white;"></i>
          <router-link to="/admin/pointRedemption" class="nav-text" style="color: white; text-decoration: none;">Point Redemption</router-link>
          </div>


          <div class="nav-item">
            <v-icon color="white" class="nav-icon">mdi-clipboard-text</v-icon>
            <router-link to="/admin/view-task" class="nav-text" style="color: white; text-decoration: none;">Task Management</router-link>
          </div>

          <div class="nav-item">
            <v-icon color="white" class="nav-icon">mdi-medal</v-icon>
            <router-link to="/admin/adminBadges" class="nav-text" style="color: white; text-decoration: none;">Manage Badges</router-link>
          </div>

          <div class="nav-item">
            <v-icon color="white" class="nav-icon">mdi-file-document</v-icon>
            <router-link to="/admin/dashboard/documents" class="nav-text" style="color: white; text-decoration: none;">Manage Documents</router-link>
          </div>

          <div class="nav-item">
            <v-icon color="white" class="nav-icon">mdi-account-cog</v-icon>
            <router-link to="/admin/manageusers" class="nav-text" style="color: white; text-decoration: none;">Manage Users</router-link>
          </div>
        </nav>
      </div>
    </div>
  
    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Top Navigation Bar -->
      <header class="top-nav">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search..." v-model="searchQuery" @input="handleSearch" />
        </div>

        <!-- Notifications Section -->
        <div class="notifications">
          <div class="notification-icon">
            <i class="fas fa-bell"></i>
            <span class="badge" v-if="experienceNotifications && experienceNotifications.length > 0">
              {{ experienceNotifications.length }}
            </span>
          </div>
        </div>
      </header>

      <!-- Router View for Child Routes -->
      <router-view v-if="$route.name !== 'adminDashboard'"></router-view>

      <!-- Admin Dashboard Content -->
      <div v-if="$route.name === 'adminDashboard'" class="dashboard-content">
        <h2>Admin Dashboard</h2>

        <!-- Experience Notifications -->
        <div class="experience-notifications">
          <h3>Experience Approval Requests</h3>

          <!-- ✅ Show confirmation if experience was just approved -->
          <p v-if="successMessage" class="success-message">
            ✅ {{ successMessage }}
          </p>

          <div v-if="experienceNotifications.length > 0">
            <ul class="notification-list">
              <li v-for="note in experienceNotifications" :key="note.id" class="notification-item">
                <div class="notification-text">
                  <strong>{{ note.message }}</strong>
                  <p class="timestamp">{{ formatDate(note.createdAt) }}</p>
                </div>
                <div class="notification-actions">
                  <button @click="viewExperience(note.experienceId)" class="view-btn">View</button>
                  <button @click="approveExperience(note)" class="approve-btn">Approve</button>
                  <button @click="rejectExperience(note)" class="reject-btn">Reject</button>
                </div>
              </li>
            </ul>
          </div>

          <p v-else>No experience notifications.</p>
        </div>

        <!-- ✅ Modal to show experience details -->
        <div v-if="selectedExperience" class="modal-overlay">
          <div class="modal">
            <h3>{{ selectedExperience.name }}</h3>
            <p><strong>Category:</strong> {{ selectedExperience.category }}</p>
            <p><strong>Description:</strong> {{ selectedExperience.description }}</p>
            <p><strong>Type:</strong> {{ selectedExperience.type }}</p>
            <p><strong>Clifton Strength:</strong> {{ selectedExperience.cliftonStrength }}</p>
            <p><strong>Major:</strong> {{ selectedExperience.major }}</p>
            <p><strong>Points:</strong> {{ selectedExperience.points }}</p>
            <p><strong>Status:</strong> {{ selectedExperience.status }}</p>
            <button @click="selectedExperience = null" class="close-btn">Close</button>
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
import flightPlanServices from '../services/flightPlanServices';
import CareerResources from '../components/CareerResources.vue';
 
export default {
  name: 'StudentDashboard',
  components: {
    CareerResources
  },
  setup() {
    const store = useStore();

    const isAdmin = ref(false);
    // State management
    const studentId = ref(null);
    const studentName = ref('');
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
    const semester = ref(null);
    const error = ref(null);
    const loading = ref(true);
    const message = ref('');
    const currentUser = ref(null);
    const badgeProgressList = ref([]);

    const semesterIndex = (semesterStr) => {
  if (!semesterStr) return null;

  const [term, year] = semesterStr.split(' ');
  const base = parseInt(year) * 2;
  return term.toLowerCase() === 'spring' ? base : base + 1;
};

const calculateStudentYear = (current, graduation) => {
  const currentIndex = semesterIndex(current);
  const gradIndex = semesterIndex(graduation);

  if (currentIndex === null || gradIndex === null) return 'Senior'; // fallback

  const semestersLeft = gradIndex - currentIndex;

  if (semestersLeft <= 2) return 'Senior';
  else if (semestersLeft <= 4) return 'Junior';
  else if (semestersLeft <= 6) return 'Sophomore';
  else return 'Freshman';
};


    // Badge display count control
    const displayedBadgeCount = ref(6); // Default to showing 6 badges

    const toggleBadgeCount = () => {
      displayedBadgeCount.value = displayedBadgeCount.value === 6 ? 12 : 6;
    };
    
    // Badge image handling methods
    const hasImageUrl = (description) => {
      return description && description.includes('http');
    };
    
    const extractImageUrl = (description) => {
      if (!description) return '';
      const urlMatch = description.match(/(https?:\/\/[^\s]+)/);
      return urlMatch ? urlMatch[0] : '';
    };
    
    const handleImageError = (event, badge) => {
      console.error('Image failed to load for badge:', badge.name);
      event.target.style.display = 'none';
    };
    
    const onImageLoad = (event) => {
      event.target.style.opacity = 1;
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
          isAdmin.value = storeUser.role === 'admin'; // ✅ Set role
          studentSemester.value = storeUser.semester || storeUser.grad_semester || ''; // ✅ Set semester
          studentYear.value = calculateStudentYear(storeUser.semester, storeUser.grad_semester);
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
        
        const response = await studentServices.getStudentByUserId;
        
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


    
    const fetchExperiences = async () => {
      try {
        const storedUser = Utils.getStore("user");
        const studentId = storedUser?.id;
        console.log(studentId);
        console.log("her", storedUser);

        if (!studentId) {
          console.warn("No student ID found.");
          return;
        }

        // Get full student object from DB
        const student = await studentServices.getStudentByUserId(studentId);
        const semester = student.semester || student.grad_semester;
        console.log("semester", semester);
        
        if (!semester) {
          console.warn("Student record is missing semester info.");
          return;
        }

        // Get all experiences for this semester
        const all = await experienceServices.getExperiencesBySemester(semester);
        const allExperiences = all.data || all;
        console.log("here", allExperiences);

        // Extract student-specific experience progress
        const myData = await experienceServices.getMyExperiences(studentId);
        const studentExperiences = myData || []; // <-- assuming it's already a flat array of objects
        const badgeProgress = myData.badgeProgress || [];

        // Merge student progress with all experiences
        const merged = allExperiences.map(exp => {
          // Find matching student experience based on nested experience.id
          const match = studentExperiences.find(se =>
            se.experience?.id === exp.id
          );

          return {
            ...exp,
            status: match?.status || 'Incomplete',
            approvedBy: match?.approvedBy || null,
            completionDate: match?.CompletionDate || null,
            pointsEarned: match?.pointsEarned || 0,
            completed: match?.status === 'Approved',
            studentExperienceId: match?.id || null
          };
        });

        // Set state
        experiences.value = merged;
        
        const experiencePoints = merged
          .filter(exp => exp.completed)
          .reduce((sum, exp) => sum + (exp.pointsEarned || 0), 0);

        pointsBreakdown.value.experiences = experiencePoints;
        badgeProgressList.value = badgeProgress;
        updateTotalPoints();
        
      } catch (error) {
        console.error("Error fetching experiences:", error);
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



      return {
        ...exp,
        status: match?.status || 'Incomplete',
        approvedBy: match?.approvedBy || null,
        completionDate: match?.CompletionDate || null,
        pointsEarned: match?.pointsEarned || 0,
        completed: match?.status === 'Approved',
        studentExperienceId: match?.id || null
      };
    });

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
          .length * 50; // Assuming each task is worth 50 points
        
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
        fetchRegisteredEvents(),
      
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
      isAdmin,
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
      hasImageUrl,
      extractImageUrl,
      handleImageError,
      onImageLoad
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
 
 
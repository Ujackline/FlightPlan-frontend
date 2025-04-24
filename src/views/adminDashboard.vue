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
import adminServices from "../services/adminServices";
import experienceServices from "../services/experienceServices";
import { useRouter } from "vue-router";

export default {
  name: "AdminDashboard",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      admin: {},
      currentRoute: "AdminDashboard",
      searchQuery: "",
      notifications: [], // Holds all notifications
      selectedExperience: null,
      successMessage: "",
    };
  },

  computed: {
    // ✅ Extracts only unread experience approval notifications
    experienceNotifications() {
      if (!this.notifications || !Array.isArray(this.notifications)) return [];

      const filtered = this.notifications.filter(
        (n) =>
          n.type?.trim().toLowerCase() === "experience_approval" &&
          n.status?.trim().toLowerCase() === "unread"
      );

      console.log("🔎 Filtered Experience Notifications:", filtered);
      return filtered;
    },
  },

  mounted() {
    this.fetchAdminInfo();
    this.fetchNotifications();
  },

  methods: {
    // ✅ Fetch Admin Info
    async fetchAdminInfo() {
  try {
    const adminData = await adminServices.getAdminInfo();
    console.log("✅ Admin info fetched:", adminData);
    this.admin = adminData; // ✅ assign the actual data
  } catch (error) {
    console.error("❌ Error fetching admin info:", error);
  }
},



    // ✅ Fetch All Notifications
    async fetchNotifications() {
      try {
        const response = await adminServices.getNotifications();
        this.notifications = response;
        console.log("✅ Notifications fetched:", this.notifications);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    },

    // ✅ Extract experience ID from notification message
    extractExperienceIdFromMessage(message) {
      // Example message: "Experience 'Resume Review' (ID: 42) needs approval."
      const match = message.match(/ID:\s*(\d+)/);
      return match ? parseInt(match[1]) : null;
    },

    async viewExperience(id) {
  try {
    const exp = await experienceServices.getExperienceById(id);
    this.selectedExperience = exp;
  } catch (error) {
    console.error("❌ Error fetching experience details:", error);
  }
},

async approveExperience(notification) {
  try {
    const experienceId = notification.experienceId;
    await experienceServices.approveExperience(
      experienceId,
      `${this.admin.fName} ${this.admin.lName}`
    );

    await adminServices.deleteNotification(notification.id);

    this.successMessage = "Experience approved successfully!";
    this.fetchNotifications();

    // Clear success message after a short delay
    setTimeout(() => {
      this.successMessage = "";
    }, 3000);
  } catch (error) {
    console.error("❌ Error approving experience:", error);
  }
},

async rejectExperience(notification) {
  try {
    const experienceId = notification.experienceId;
    await experienceServices.rejectExperience(experienceId);

    await adminServices.deleteNotification(notification.id);

    this.successMessage = "Experience rejected successfully.";
    this.fetchNotifications();

    setTimeout(() => {
      this.successMessage = "";
    }, 3000);
  } catch (error) {
    console.error("❌ Error rejecting experience:", error);
  }
},

    // ✅ Get Admin Initials
    getInitials() {
  const f = this.admin?.fName?.charAt(0) || '';
  const l = this.admin?.lName?.charAt(0) || '';
  return `${f}${l}`.toUpperCase();
},

formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
},


  },
};
</script>

<style scoped>
.nav-item i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.sidebar {
  background-color: #8B2332;
  width: 220px;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-header {
  padding: 0 20px;
  margin-bottom: 30px;
}

.sidebar-header h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.admin-info {
  font-size: 14px;
  opacity: 0.9;
}

nav {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
}


.nav-icon {
  margin-right: 15px;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.15);
}

.sidebar-footer {
  padding: 20px;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn i {
  margin-right: 8px;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-content {
  margin-left: 250px;
  padding: 20px;
}

.quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.action-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;
    text-align: center;
}

.action-card:hover {
    transform: translateY(-5px);
}

.action-card i {
    font-size: 2em;
    color: #3498db;
    margin-bottom: 10px;
}

.action-card h3 {
    margin: 10px 0;
    color: #2c3e50;
}

.action-card p {
    color: #666;
    font-size: 0.9em;
}
</style>




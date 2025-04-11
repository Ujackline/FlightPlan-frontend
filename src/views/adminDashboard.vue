<template>
  <div class="admin-dashboard">
      <!-- Sidebar Navigation -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h1>Flight Plan</h1>
          <div class="admin-info">
            <div class="admin-name">{{ admin.fName }} {{ admin.lName }}</div>
          </div>
        </div>
        <nav>
          <router-link to="/admin/AdminDashboard" class="nav-item" :class="{ active: currentRoute === 'AdminDashboard' }">
            <i class="fas fa-tachometer-alt"></i> Dashboard
          </router-link>
          <router-link to="/experience" class="nav-item" :class="{ active: currentRoute === 'experience' }">
            <i class="fas fa-tasks"></i> Experiences & Tasks
          </router-link>

          <router-link to="/admin/dashboard/events" class="nav-item" :class="{ active: currentRoute === 'adminEvents' }">
          </router-link>
          <router-link to="/admin/AdminEvents" class="nav-item" :class="{ active: currentRoute === 'AdminEvents' }">

            <i class="fas fa-calendar-alt"></i> Event Management
          </router-link>
          <router-link to="/admin/students" class="nav-item" :class="{ active: currentRoute === 'students' }">
            <i class="fas fa-users"></i> Student Flight Plans
          </router-link>
          <router-link to="/admin/points" class="nav-item" :class="{ active: currentRoute === 'points' }">
            <i class="fas fa-coins"></i> Point Redemption
          </router-link>
          <router-link to="admin/settings" class="nav-item" :class="{ active: currentRoute === 'settings' }">
            <i class="fas fa-cog"></i> Settings
          </router-link>
          <!-- <router-link to="/admin/create-task" class="nav-item" :class="{ active: currentRoute === 'create-task' }">
            <i class="fas fa-tasks"></i> Create Tasks
          </router-link> -->
          <router-link to="/admin/view-task" class="nav-item" :class="{ active: currentRoute === 'view-task' }">
            <i class="fas fa-tasks"></i> Tasks
          </router-link>


          <router-link to="/tasks" class="nav-item" :class="{ active: currentRoute === 'tasks' }">
            <i class="fas fa-tasks"></i> Manage Tasks
          </router-link>
          <router-link to="/admin/users" class="nav-item" :class="{ active: currentRoute === 'manageusers' }">
            <i class="fas fa-users-cog"></i> Manage Users
          </router-link>
          <router-link to="/admin/dashboard/documents" class="nav-item" :class="{ active: currentRoute === 'adminDocuments' }">
            <i class="fas fa-file-alt"></i> Manage Documents
          </router-link>

        </nav>
        <div class="sidebar-footer">
          <button @click="logout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
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

    <!-- Admin Dashboard Content -->
    <div v-if="currentRoute === 'AdminDashboard'" class="dashboard-content">
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

export default {
  name: "AdminDashboard",
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

    // Add method to navigate to document management
    goToDocuments() {
      this.router.push('/admin/dashboard/documents');
  },
};
</script>



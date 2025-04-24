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
          <router-link to="/admin/AdminDashboard" class="nav-item" :class="{ active: currentRoute === 'AdminDashboard' }">
            <i class="fas fa-tachometer-alt"></i> Dashboard
          </router-link>
          <router-link to="/experience" class="nav-item" :class="{ active: currentRoute === 'experience' }">
            <i class="fas fa-tasks"></i> Experiences & Tasks
            <i class="fas fa-tasks"></i> Experiences & Tasks
          </router-link>

          <router-link to="/admin/events" class="nav-item" :class="{ active: currentRoute === 'events' }">
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
          <router-link to="/admin/view-task" class="nav-item" :class="{ active: currentRoute === 'view-task' }">

            <i class="fas fa-tasks"></i> Tasks
          </router-link>


          <router-link to="/task" class="nav-item" :class="{ active: currentRoute === 'task' }">
            <i class="fas fa-tasks"></i> Manage Tasks
          </router-link>
          
          <router-link to="/admin/dashboard/documents" class="nav-item" :class="{ active: currentRoute === 'adminDocuments' }">
            <i class="fas fa-file-alt"></i> Manage Documents

           </router-link>
          <router-link to="/manageusers" class="nav-item" :class="{ active: currentRoute === 'manageusers' }">
            <i class="fas fa-cog"></i> Manage Users
          </router-link>

          <div class="nav-item">
          <v-icon color="white" class="nav-icon">mdi-pencil</v-icon>
         <router-link to="/report" class="nav-text" style="color: white; text-decoration: none;">Need Help or Found a Bug?</router-link>
        </div>

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

         <!-- Task Notifications
         <div class="task-notifications">
            <h3>Task Completion Requests</h3>
            <p v-if="successMessage" class="success-message">
              ✅ {{ successMessage }}
            </p> -->

            <!-- <table v-if="taskNotifications.length > 0" class="task-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="note in taskNotifications" :key="note.id" class="notification-row">
                  <td>{{ note.id }}</td>
                  <td>
                    <strong>{{ note.message }}</strong>
                  </td>
                  <td>{{ formatDate(note.createdAt) }}</td>
                  <td class="notification-actions">
                    <button @click="approveTask(note)" class="approve-btn">Approve</button>
                    <button @click="rejectTask(note)" class="reject-btn">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <p v-else>No task completion notifications.</p> -->
          <!-- </div> -->

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
    <div v-if="currentRoute === 'AdminDashboard'" class="dashboard-content">
        <h2>Admin Dashboard</h2>

        <!-- Task Notifications -->
        <div class="task-notifications">
            <h3>Task Completion Requests</h3>
            <p v-if="successMessage" class="success-message">
              ✅ {{ successMessage }}
            </p>

            <table v-if="taskNotifications.length > 0" class="task-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="note in taskNotifications" :key="note.id" class="notification-row">
                  <td>{{ note.id }}</td>
                  <td>
                    <strong>{{ note.message }}</strong>
                  </td>
                  <td>{{ formatDate(note.createdAt) }}</td>
                  <td class="notification-actions">
                    <button @click="approveTask(note)" class="approve-btn">Approve</button>
                    <button @click="rejectTask(note)" class="reject-btn">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <p v-else>No task completion notifications.</p>
          </div>
          
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
  </div>
</template>

<script>
import adminServices from "../services/adminServices";
import experienceServices from "../services/experienceServices";
import taskServices from "../services/taskServices";

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

    taskNotifications() {
      console.log("Diella", this.notifications);
      return this.notifications.filter(
        (n) => n.type?.trim().toLowerCase() === "task_completion" && n.status === "unread"
      );
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

// async approveTask(notification) {
//       try {
//         const { studentId, taskId } = notification;
//         await taskServices.approveTask({ studentId, taskId });
//         await adminServices.deleteNotification(notification.id);
//         this.successMessage = "Task approved successfully!";
//         this.fetchNotifications();
//         setTimeout(() => (this.successMessage = ""), 3000);
//       } catch (error) {
//         console.error("❌ Error approving task:", error);
//       }
//     },

// async approveTask(notification) {
//   try {
//     console.log("Notification object:", notification);
//     const { studentId, taskId } = notification;
//     console.log("Extracted values:", { studentId, taskId });
//     await taskServices.approveTask(taskId, studentId); // ✅ fixed
//     await adminServices.deleteNotification(notification.id);
//     this.successMessage = "Task approved successfully!";
//     this.fetchNotifications();
//     setTimeout(() => (this.successMessage = ""), 3000);
//   } catch (error) {
//     console.error("❌ Error approving task:", error);
//   }
// },

async approveTask(notification) {
  try {
    console.log("Notification object:", notification);
    const studentId = notification.studentId;
    const taskId = notification.taskId;
    
    console.log("About to send:", { taskId, studentId });
    
    if (!taskId || !studentId) {
      console.error("Missing required IDs", { taskId, studentId });
      this.successMessage = "Error: Missing task or student ID";
      return;
    }
    
   // await taskServices.approveTask(taskId, studentId);
  //  console.log("Attempting direct API call with hardcoded values");
  //   const response = await apiClient.put(`${TASK_API}/approve`, {
  //     taskId: 3,
  //     studentId: 1,
  //     approvedBy: "Admin"
  //   });

 //  console.log("Attempting service call with hardcoded values");
    // const response = await taskServices.approveTask(3, 1, "Admin");
   // console.log("Service call response:", response);
    
    // Comment out the original call temporarily
     await taskServices.approveTask(taskId, studentId);

    await adminServices.deleteNotification(notification.id);
    this.successMessage = "Task approved successfully!";
    this.fetchNotifications();
    setTimeout(() => (this.successMessage = ""), 3000);
  } catch (error) {
    console.error("❌ Error approving task:", error, error.response?.data);
    this.successMessage = `Error: ${error.response?.data?.message || error.message}`;
    setTimeout(() => (this.successMessage = ""), 5000);
  }
},

    async rejectTask(notification) {
      try {
        await adminServices.deleteNotification(notification.id);
        this.successMessage = "Task rejected.";
        this.fetchNotifications();
        setTimeout(() => (this.successMessage = ""), 3000);
      } catch (error) {
        console.error("❌ Error rejecting task:", error);
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



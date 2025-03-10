<template>
    <div class="admin-dashboard">
      <!-- Sidebar Navigation -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h1>Flight Plan</h1>
          <div class="admin-info">
            <div class="avatar">{{ getInitials() }}</div>
            <div class="admin-name">{{ admin.fname }} {{ admin.lname }}</div>
          </div>
        </div>
        <nav>
          <router-link to="/admin/dashboard" class="nav-item" :class="{ active: currentRoute === 'dashboard' }">
            <i class="fas fa-tachometer-alt"></i> Dashboard
          </router-link>
          <router-link to="/experience" class="nav-item" :class="{ active: currentRoute === 'experience' }">
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
          <router-link to="/settings" class="nav-item" :class="{ active: currentRoute === 'settings' }">
            <i class="fas fa-cog"></i> Settings
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
          <div class="notifications">
            <div class="notification-icon">
              <i class="fas fa-bell"></i>
              <span class="badge" v-if="notifications.length > 0">{{ notifications.length }}</span>
            </div>
          </div>
        </header>
  
        <!-- Page Content -->
        <div class="page-content">
          <div v-if="currentRoute === 'dashboard'" class="dashboard-content">
            <h2>Admin Dashboard</h2>
            
            <!-- Stats Cards -->
            <div class="stats-container">
              <div class="stat-card">
                <div class="stat-icon students">
                  <i class="fas fa-user-graduate"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.studentCount }}</h3>
                  <p>Active Students</p>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon events">
                  <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.upcomingEvents }}</h3>
                  <p>Upcoming Events</p>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon tasks">
                  <i class="fas fa-clipboard-check"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.completedTasks }}</h3>
                  <p>Completed Tasks</p>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon points">
                  <i class="fas fa-coins"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.pointsRedeemed }}</h3>
                  <p>Points Redeemed</p>
                </div>
              </div>
            </div>
            
            <!-- Recent Activity & Upcoming Events -->
            <div class="dashboard-grid">
              <div class="recent-activity">
                <h3>Recent Activity</h3>
                <div class="activity-list">
                  <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                    <div class="activity-icon" :class="activity.type">
                      <i :class="getActivityIcon(activity.type)"></i>
                    </div>
                    <div class="activity-details">
                      <p class="activity-desc">{{ activity.description }}</p>
                      <p class="activity-time">{{ formatTime(activity.timestamp) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="upcoming-events">
                <h3>Upcoming Events</h3>
                <div class="event-list">
                  <div v-for="(event, index) in upcomingEvents" :key="index" class="event-item">
                    <div class="event-date">
                      <span class="day">{{ formatDay(event.date) }}</span>
                      <span class="month">{{ formatMonth(event.date) }}</span>
                    </div>
                    <div class="event-details">
                      <h4>{{ event.title }}</h4>
                      <p>{{ event.location }}</p>
                      <p class="event-time">{{ formatEventTime(event.date) }}</p>
                      <div class="event-stats">
                        <span><i class="fas fa-user"></i> {{ event.attendees }}/{{ event.capacity }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Event Management Section -->
          <div v-if="currentRoute === 'events'" class="events-content">
            <div class="section-header">
              <h2>Event Management</h2>
              <button class="add-btn" @click="openCreateEventModal">
                <i class="fas fa-plus"></i> Create New Event
              </button>
            </div>
            
            <!-- Event Filters -->
            <div class="filter-controls">
              <div class="filter-group">
                <label>Filter by Status:</label>
                <select v-model="eventFilters.status">
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label>Sort by:</label>
                <select v-model="eventFilters.sortBy">
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                  <option value="attendance">Attendance</option>
                </select>
              </div>
              
              <div class="search-events">
                <input type="text" placeholder="Search events..." v-model="eventFilters.search" />
              </div>
            </div>
            
            <!-- Events Table -->
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(event, index) in filteredEvents" :key="index">
                    <td>{{ event.title }}</td>
                    <td>{{ formatDateTime(event.date) }}</td>
                    <td>{{ event.location }}</td>
                    <td>{{ event.attendees }}/{{ event.capacity }}</td>
                    <td>
                      <span class="status-badge" :class="event.status">
                        {{ event.status.charAt(0).toUpperCase() + event.status.slice(1) }}
                      </span>
                    </td>
                    <td class="actions">
                      <button class="action-btn edit" @click="editEvent(event.id)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="action-btn attendance" @click="uploadAttendance(event.id)" :disabled="event.status !== 'completed'">
                        <i class="fas fa-file-upload"></i>
                      </button>
                      <button class="action-btn delete" @click="confirmDeleteEvent(event.id)">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1">
                <i class="fas fa-chevron-left"></i>
              </button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Event Creation Modal -->
      <div class="modal" v-if="showEventModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Edit Event' : 'Create New Event' }}</h3>
            <button class="close-btn" @click="closeModal"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEvent">
              <div class="form-group">
                <label for="eventTitle">Event Title</label>
                <input type="text" id="eventTitle" v-model="eventForm.title" required />
              </div>
              
              <div class="form-group">
                <label for="eventDate">Date & Time</label>
                <input type="datetime-local" id="eventDate" v-model="eventForm.date" required />
              </div>
              
              <div class="form-group">
                <label for="eventLocation">Location</label>
                <input type="text" id="eventLocation" v-model="eventForm.location" required />
              </div>
              
              <div class="form-group">
                <label for="eventCapacity">Capacity</label>
                <input type="number" id="eventCapacity" v-model="eventForm.capacity" min="1" required />
              </div>
              
              <div class="form-group">
                <label for="eventDescription">Description</label>
                <textarea id="eventDescription" v-model="eventForm.description" rows="4"></textarea>
              </div>
              
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
                <button type="submit" class="save-btn">{{ isEditing ? 'Update Event' : 'Create Event' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Upload Attendance Modal -->
      <div class="modal" v-if="showAttendanceModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Upload Attendance for {{ selectedEvent?.title }}</h3>
            <button class="close-btn" @click="closeAttendanceModal"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="onFileDrop">
              <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" accept=".csv, .xlsx" />
              <div class="upload-icon">
                <i class="fas fa-file-upload"></i>
              </div>
              <p>Drop your attendance file here or click to browse</p>
              <p class="file-types">Supported formats: CSV, Excel</p>
            </div>
            
            <div class="file-preview" v-if="uploadedFile">
              <div class="file-info">
                <i class="fas fa-file-alt"></i>
                <span>{{ uploadedFile.name }}</span>
              </div>
              <button class="remove-file" @click="removeFile">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeAttendanceModal">Cancel</button>
              <button type="button" class="save-btn" :disabled="!uploadedFile" @click="processAttendance">
                Process Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div class="modal" v-if="showDeleteModal">
        <div class="modal-content delete-modal">
          <div class="modal-header">
            <h3>Confirm Deletion</h3>
            <button class="close-btn" @click="cancelDelete"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="delete-warning">
              <i class="fas fa-exclamation-triangle"></i>
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="cancelDelete">Cancel</button>
              <button type="button" class="delete-confirm-btn" @click="deleteEvent">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import adminService from '../services/adminServices';
export default {
  name: 'AdminDashboard',
  data() {
    return {
      admin: {},
      currentRoute: 'dashboard',
      searchQuery: '',
      notifications: [],
      stats: {},
      recentActivities: [],
      upcomingEvents: [],
      events: [],
      eventFilters: {
        status: 'all',
        sortBy: 'date',
        search: ''
      },
      currentPage: 1,
      itemsPerPage: 5,
      showEventModal: false,
      showAttendanceModal: false,
      showDeleteModal: false,
      isEditing: false,
      eventForm: {
        id: null,
        title: '',
        date: '',
        location: '',
        capacity: 30,
        description: ''
      },
      selectedEvent: null,
      eventToDelete: null,
      uploadedFile: null
    };
  },
  mounted() {
    this.fetchAdminInfo();
    this.fetchNotifications();
    this.fetchStats();
    this.fetchRecentActivities();
    this.fetchUpcomingEvents();
    this.fetchEvents();
  },
  methods: {
    async fetchAdminInfo() {
      try {
        const response = await adminService.getAdminInfo();
        this.admin = response.data;
      } catch (error) {
        console.error('Error fetching admin info:', error);
      }
    },

    getInitials() {
    if (!this.admin.fname || !this.admin.lname) return '';
    return `${this.admin.fname.charAt(0)}${this.admin.lname.charAt(0)}`.toUpperCase();
  },
    async fetchNotifications() {
      try {
        const response = await adminService.getNotifications();
        this.notifications = response.data;
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },
    async fetchStats() {
      try {
        const response = await adminService.getStats();
        this.stats = response.data;
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    },
    async fetchRecentActivities() {
      try {
        const response = await adminService.getRecentActivities();
        this.recentActivities = response.data;
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      }
    },
    async fetchUpcomingEvents() {
      try {
        const response = await adminService.getUpcomingEvents();
        this.upcomingEvents = response.data;
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    },
    async fetchEvents() {
      try {
        const response = await adminService.getEvents();
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
  },
  computed: {
    filteredEvents() {
      let filtered = [...this.events];
      
      if (this.eventFilters.status !== 'all') {
        filtered = filtered.filter(event => event.status === this.eventFilters.status);
      }
      
      if (this.eventFilters.search) {
        const query = this.eventFilters.search.toLowerCase();
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(query) || 
          event.location.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        );
      }
      
      filtered.sort((a, b) => {
        if (this.eventFilters.sortBy === 'date') {
          return new Date(a.date) - new Date(b.date);
        } else if (this.eventFilters.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (this.eventFilters.sortBy === 'attendance') {
          return (b.attendees / b.capacity) - (a.attendees / a.capacity);
        }
        return 0;
      });
      
      return filtered;
    }
  }
};

</script>

<style>
.admin-dashboard {
    display: flex;
    height: 100vh;
    background-color: #f4f4f4;
    font-family: 'Arial', sans-serif;
}

/* Sidebar */
.sidebar {
    width: 250px;
    background-color: #2b020b;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.sidebar-header h1 {
    font-size: 22px;
    text-align: center;
}

.admin-info {
    display: flex;
    align-items: center;
    margin-top: 15px;
}

/* .avatar {
    width: 40px;
    height: 40px;
    background: #3498DB;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    margin-right: 10px;
} */

.nav-item {
    color: white;
    text-decoration: none;
    display: block;
    padding: 10px;
    border-radius: 5px;
}

.nav-item:hover,
.nav-item.active {
    background-color: #1A252F;
}

/* Main Content */
.main-content {
    flex-grow: 1;
    padding: 20px;
    background-color: white;
}

.top-nav {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    background: #fff;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
}

.search-bar {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 5px 10px;
}

.search-bar input {
    border: none;
    outline: none;
    padding-left: 10px;
}

/* Dashboard Stats */
.stats-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-top: 20px;
}

.stat-card {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.stat-icon {
    font-size: 24px;
    color: #3498DB;
}

.stat-info h3 {
    font-size: 22px;
    margin: 0;
}

.stat-info p {
    color: #666;
    margin: 5px 0 0;
}

/* Recent Activity & Events */
.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
}

.activity-item, .event-item {
    background: white;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
}

.activity-icon {
    font-size: 18px;
    margin-right: 10px;
}

.event-details h4 {
    margin: 5px 0;
}
</style>
<template>
  <div class="attendance-tracking-container">
    <h1>Student Attendance Tracking</h1>

    <!-- Dashboard summary -->
    <div class="dashboard-summary">
      <div class="stat-card">
        <div class="stat-value">{{ registeredStudents.length }}</div>
        <div class="stat-label">Total Registrations</div>
      </div>
    </div>

    <!-- Event selection dropdown -->
    <div class="filter-section">
      <div class="select-container">
        <label for="event-select">Select Event:</label>
        <select id="event-select" v-model="selectedEventId" @change="loadEventAttendance">
          <option value="">All Events</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.name }} ({{ formatDate(event.date) }})
          </option>
        </select>
      </div>

      <div class="filter-buttons">
        <button
          @click="currentTab = 'all'"
          :class="['filter-button', currentTab === 'all' ? 'active' : '']"
        >
          All Records
        </button>
        <button
          @click="currentTab = 'registered'"
          :class="['filter-button', currentTab === 'registered' ? 'active' : '']"
        >
          Registered Students
        </button>
      </div>

      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by student name or ID..."
          class="search-input"
        />
      </div>
    </div>

    <!-- All records section -->
    <div v-if="registeredStudents.length > 0" class="section">
      <h2>Student Attendance Records</h2>
      <table class="attendance-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Event</th>
            <th>Status</th>
            <th>Points</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in registeredStudents" :key="record.id" :class="{'rejected-row': record.status === 'rejected', 'revoked-row': record.status === 'revoked'}">
            <td>
              <div class="student-info">
                <span class="student-name">{{ getStudentName(record.student) }}</span>
                <span class="student-id">ID: {{ getStudentId(record.student) }}</span>
              </div>
            </td>
            <td>{{ record.event.name || 'Unknown Event' }}</td>
            <td>
              <span :class="['status-badge', record.status]">
                {{ formatStatus(record.status) }}
              </span>
            </td>
            <td>
              <span v-if="record.pointsEarned">
                +{{ record.pointsEarned }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ formatDateTime(record.createdAt) }}</td>
            <td>{{ formatDateTime(record.updatedAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
      <p>No attendance records found for the selected criteria.</p>
    </div>

    <!-- Confirmation or error message -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script>
import eventServices from '../services/eventServices';

export default {
  name: 'AttendanceTracking',
  data() {
    return {
      events: [],
      students: [],
      studentEvents: [],
      selectedEventId: '',
      currentTab: 'all',
      searchQuery: '',
      message: '',
      messageType: 'success',
    };
  },
  computed: {
    registeredStudents() {
      // Filter student events based on selected event
      let filtered = this.studentEvents || [];
      
      if (this.selectedEventId) {
        filtered = filtered.filter(record => record.eventId == this.selectedEventId);
      }
      
      if (this.searchQuery && this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(record => {
          // Get student info
          const student = this.students.find(s => s.id === record.studentId);
          if (!student) return false;
          
          const studentName = `${student.fName || ''} ${student.lName || ''}`.toLowerCase();
          const studentId = student.studentID?.toString() || '';
          
          return studentName.includes(query) || studentId.includes(query);
        });
      }
      
      // Transform to include student data
      return filtered.map(record => {
        const student = this.students.find(s => s.id === record.studentId) || {};
        const event = this.events.find(e => e.id === record.eventId) || {};
        
        return {
          ...record,
          student,
          event,
          id: `${record.eventId}-${record.studentId}`
        };
      });
    },
  },
  async created() {
    await this.fetchEvents();
    await this.fetchStudents();
    await this.fetchStudentEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await eventServices.getAll();
        if (response && response.data) {
          this.events = response.data;
        } else {
          this.events = [];
          this.showMessage('Failed to load events.', 'error');
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        this.showMessage('Failed to load events.', 'error');
      }
    },
    
    async fetchStudents() {
      try {
        // Direct API call to get students data
        const response = await fetch('http://localhost:3029/flight-plan-t9/students');
        const data = await response.json();
        this.students = data;
      } catch (error) {
        console.error('Failed to fetch students:', error);
        this.showMessage('Failed to load student data.', 'error');
        this.students = [];
      }
    },
    
    async fetchStudentEvents() {
      try {
        // Direct API call to get studentevents data
        const response = await fetch('http://localhost:3029/flight-plan-t9/studentevents');
        const data = await response.json();
        this.studentEvents = data;
      } catch (error) {
        console.error('Failed to fetch student events:', error);
        this.showMessage('Failed to load attendance data.', 'error');
        this.studentEvents = [];
      }
    },

    loadEventAttendance() {
      if (this.selectedEventId) {
        this.selectedEvent = this.events.find(event => event.id == this.selectedEventId);
      } else {
        this.selectedEvent = null;
      }
    },

    getStudentName(student) {
      if (!student) return 'Unknown Student';
      if (student.fName && student.lName) return `${student.fName} ${student.lName}`;
      return 'Unknown Student';
    },
    
    getStudentId(student) {
      if (!student) return 'N/A';
      if (student.studentID) return student.studentID;
      if (student.studentId) return student.studentId;
      return 'N/A';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      } catch (e) {
        return dateString || 'N/A';
      }
    },

    formatDateTime(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleString();
      } catch (e) {
        return dateString || 'N/A';
      }
    },

    formatStatus(status) {
      switch (status) {
        case 'attended':
          return '✓ Attended';
        case 'registered':
          return '⏳ Registered';
        case 'approved':
          return '✓ Approved';
        case 'rejected':
          return '✗ Rejected';
        case 'revoked':
          return '⚠ Revoked';
        case 'pending':
          return '⏳ Pending';
        default:
          return status || 'Unknown';
      }
    },

    showMessage(message, type = 'success') {
      this.message = message;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
};
</script>
<style scoped>
.attendance-tracking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 25px;
  font-family: 'Inter', 'Segoe UI', Roboto, -apple-system, sans-serif;
  color: #333;
}

h1 {
  color: #48111c;
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 3px solid #f9c634;
  padding-bottom: 12px;
  width: fit-content;
}

h2 {
  color: #48111c;
  font-size: 24px;
  margin-bottom: 15px;
  font-weight: 500;
}

h3 {
  color: #48111c;
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 500;
}

/* Dashboard summary styles */
.dashboard-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  flex: 1;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.stat-card:nth-child(1) {
  border-top: 4px solid #f68d76;
}

.stat-card:nth-child(2) {
  border-top: 4px solid #f9c634;
}

.stat-card:nth-child(3) {
  border-top: 4px solid #708e9a;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #48111c;
  margin-bottom: 8px;
}

.stat-label {
  color: #708e9a;
  font-size: 16px;
  font-weight: 500;
}

/* Filter section styles */
.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.select-container {
  min-width: 250px;
  flex: 1;
}

.select-container label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #48111c;
  font-size: 14px;
}

select {
  width: 100%;
  padding: 12px;
  border: 2px solid #d5dfe7;
  border-radius: 6px;
  font-size: 15px;
  background-color: #f9fafb;
  transition: border-color 0.3s, box-shadow 0.3s;
}

select:focus {
  outline: none;
  border-color: #708e9a;
  box-shadow: 0 0 0 3px rgba(112, 142, 154, 0.2);
  background-color: white;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-button {
  background-color: #d5dfe7;
  color: #48111c;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.filter-button:hover {
  background-color: #c4cfd8;
}

.filter-button.active {
  background-color: #708e9a;
  color: white;
}

.search-box {
  min-width: 250px;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #d5dfe7;
  border-radius: 6px;
  font-size: 15px;
  background-color: #f9fafb;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #708e9a;
  box-shadow: 0 0 0 3px rgba(112, 142, 154, 0.2);
  background-color: white;
}

/* Code verification styles */
.code-verification {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #f9c634;
}

.verification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.code-display {
  background-color: #f0f5f9;
  padding: 10px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.event-code {
  background-color: #f4ecd0;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: monospace;
  letter-spacing: 1px;
  font-weight: bold;
  color: #48111c;
  font-size: 16px;
}

.code-time {
  color: #708e9a;
  font-size: 14px;
}

.verification-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.generate-code-button {
  background-color: #f9c634;
  color: #48111c;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-code-button:hover {
  background-color: #edbb2d;
  transform: translateY(-2px);
}

.code-instructions {
  color: #708e9a;
  font-size: 14px;
  margin-left: 15px;
}

/* Table styles */
.section {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.attendance-table th, 
.attendance-table td {
  border: none;
  padding: 15px;
  text-align: left;
}

.attendance-table th {
  background-color: #d5dfe7;
  color: #48111c;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.attendance-table tr {
  border-bottom: 1px solid #eee;
}

.attendance-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.attendance-table tr:hover {
  background-color: #f0f6ff;
}

.attendance-table tr:last-child {
  border-bottom: none;
}

.rejected-row {
  background-color: rgba(220, 53, 69, 0.05) !important;
}

.revoked-row {
  background-color: rgba(255, 193, 7, 0.05) !important;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 500;
  color: #48111c;
}

.student-id {
  font-size: 13px;
  color: #708e9a;
  margin-top: 3px;
}

.attendance-status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.attendance-status.attended {
  background-color: #e2effa;
  color: #2c5282;
}

.attendance-status.not-attended {
  background-color: #f8f9fa;
  color: #6c757d;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.approved {
  background-color: #e2effa;
  color: #2c5282;
}

.status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.revoked {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.pending {
  background-color: #f4ecd0;
  color: #48111c;
}

.points-badge {
  background-color: #e2effa;
  color: #2c5282;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.action-buttons {
  white-space: nowrap;
}

/* Button styles */
button {
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.1s;
  margin-right: 5px;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(1px);
}

.approve-button {
  background-color: #f9c634;
  color: #333;
}

.approve-button:hover {
  background-color: #edbb2d;
}

.reject-button {
  background-color: #dc3545;
  color: white;
}

.reject-button:hover {
  background-color: #c82333;
}

.reopen-button {
  background-color: #f68d76;
  color: white;
}

.reopen-button:hover {
  background-color: #f57a5f;
}

.revoke-button {
  background-color: #708e9a;
  color: white;
}

.revoke-button:hover {
  background-color: #5f7a85;
}

.mark-button {
  background-color: #28a745;
  color: white;
}

.mark-button:hover {
  background-color: #218838;
}

/* Empty state styles */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 25px;
  border: 2px dashed #d5dfe7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #708e9a;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.event-info {
  background-color: #f0f5f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #f9c634;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  width: 80px;
  color: #48111c;
}

.info-value {
  flex-grow: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #48111c;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #d5dfe7;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #f9fafb;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #708e9a;
  box-shadow: 0 0 0 3px rgba(112, 142, 154, 0.2);
  background-color: white;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.helper-text {
  font-size: 13px;
  color: #708e9a;
  margin-top: 6px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
}

.cancel-button {
  background-color: #d5dfe7;
  color: #333;
}

.save-button {
  background-color: #f9c634;
  color: #333;
}

/* Message notification */
.message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  animation: fadeInUp 0.4s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 350px;
  z-index: 1000;
}

@keyframes fadeInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.success {
  background-color: #d5dfe7;
  color: #48111c;
  border-left: 5px solid #f9c634;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 5px solid #dc3545;
}

/* Responsive styles */
@media (max-width: 768px) {
  .dashboard-summary {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-buttons {
    order: 3;
  }
  
  .attendance-table {
    font-size: 14px;
  }
  
  .attendance-table th,
  .attendance-table td {
    padding: 10px;
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .action-buttons button {
    margin-right: 0;
    margin-bottom: 5px;
  }
  
  .verification-actions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .code-instructions {
    margin-left: 0;
    margin-top: 10px;
  }
  
  .modal {
    width: 95%;
    padding: 20px;
  }
}
</style>
<template>
  <div class="attendance-container">
    <h1>Student Attendance Tracking</h1>
    
    <!-- Search Section -->
    <div class="search-section">
      <div class="search-input">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by student name or ID..." 
          @input="handleSearch"
        />
        <button class="search-button" @click="handleSearch">🔍</button>
      </div>
      <div class="filter-options">
        <select v-model="selectedEvent" @change="filterByEvent">
          <option value="">All Events</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">Total Records</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.pending }}</div>
        <div class="stat-label">Pending</div>
      </div>
      <!-- New Registered stat card -->
      <div class="stat-card">
        <div class="stat-value">{{ stats.registered }}</div>
        <div class="stat-label">Registered</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.attended }}</div>
        <div class="stat-label">Attended</div>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading attendance records...</p>
    </div>
    
    <!-- Table -->
    <div v-else class="table-container">
      <table class="attendance-table" v-if="filteredRecords.length > 0">
        <thead>
          <tr>
            <th>Student</th>
            <th>Event</th>
            <th>Date</th>
            <th>Status</th>
            <th>Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in paginatedRecords" :key="`${record.studentId}-${record.eventId}`">
            <td>
              <div>
                <div>{{ record.studentName }}</div>
                <div style="font-size: 12px; color: #666;">ID: {{ record.displayStudentId || record.studentId }}</div>
              </div>
            </td>
            <td>{{ record.eventName }}</td>
            <td>{{ formatDate(record.eventDate) }}</td>
            <td>
              <span class="status-badge" :class="record.status.toLowerCase()">
                {{ record.status }}
              </span>
            </td>
            <td>{{ record.pointsEarned || 0 }}</td>
            <td>
              <div class="actions">
                <button 
                  v-if="record.status === 'Pending'" 
                  @click="approveAttendance(record)"
                  class="approve-button"
                >
                  Approve
                </button>
                <button 
                  v-if="record.status === 'Pending'" 
                  @click="rejectAttendance(record)"
                  class="reject-button"
                >
                  Reject
                </button>
                <button 
                  v-if="record.status === 'Attended' || record.status === 'Registered'" 
                  @click="viewDetails(record)"
                  class="view-button"
                >Details
                </button>
                <button 
                  v-if="record.status === 'Attended'" 
                  @click="resetStatus(record)"
                  class="reset-button"
                >
                  Reset
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="empty-icon">📊</div>
        <p>No attendance records found. Try adjusting your search or filters.</p>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="pagination" v-if="filteredRecords.length > recordsPerPage">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        Next
      </button>
    </div>
    
    <!-- Approval Modal -->
    <div v-if="showApprovalModal" class="modal-overlay">
      <div class="modal">
        <h3>Approve Attendance</h3>
        <div class="student-info">
          <p><strong>Student:</strong> {{ selectedRecord.studentName }}</p>
          <p><strong>Event:</strong> {{ selectedRecord.eventName }}</p>
          <p><strong>Date:</strong> {{ formatDate(selectedRecord.eventDate) }}</p>
        </div>
        <div class="form-group">
          <label for="points">Points to Award:</label>
          <input 
            type="number" 
            id="points" 
            v-model="approvalPoints" 
            min="0" 
            max="100"
          />
        </div>
        <div class="button-group">
          <button @click="closeModal" class="cancel-button">Cancel</button>
          <button @click="confirmApproval" class="save-button">Approve</button>
        </div>
      </div>
    </div>
    
    <!-- View Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay">
      <div class="modal">
        <h3>Attendance Details</h3>
        <div class="details-container">
          <div class="detail-row">
            <span class="detail-label">Student:</span>
            <span class="detail-value">{{ selectedRecord.studentName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Student ID:</span>
            <span class="detail-value">{{ selectedRecord.displayStudentId || selectedRecord.studentId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event:</span>
            <span class="detail-value">{{ selectedRecord.eventName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">{{ formatDate(selectedRecord.eventDate) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">
              <span class="status-badge" :class="selectedRecord.status.toLowerCase()">
                {{ selectedRecord.status }}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Points:</span>
            <span class="detail-value">{{ selectedRecord.pointsEarned || 0 }}</span>
          </div>
          <div class="reflection-section" v-if="selectedRecord.reflectionText">
            <h4>Student Reflection</h4>
            <p class="reflection-text">{{selectedRecord.reflectionText }}</p>
          </div>
        </div>
        <div class="button-group">
          <button @click="closeModal" class="close-button">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventServices from '../services/eventServices';
import apiClient from '../services/services';

export default {
  data() {
    return {
      attendanceRecords: [],
      filteredRecords: [],
      events: [],
      students: {},  // Changed to object for student cache
      searchQuery: '',
      selectedEvent: '',
      currentPage: 1,
      recordsPerPage: 10,
      stats: {
        total: 0,
        pending: 0,
        attended: 0,
        registered: 0
      },
      showApprovalModal: false,
      showDetailsModal: false,
      selectedRecord: null,
      approvalPoints: 50,
      message: '',
      messageType: 'success',
      loading: true
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredRecords.length / this.recordsPerPage);
    },
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.recordsPerPage;
      const end = start + this.recordsPerPage;
      return this.filteredRecords.slice(start, end);
    }
  },
  async mounted() {
    try {
      await this.fetchEvents();
      // Removed fetchStudents() call to avoid 500 error
      await this.fetchPendingApprovals();
      this.updateStats();
    } catch (error) {
      console.error("Error initializing attendance tracking:", error);
      this.showMessage("Failed to initialize attendance tracking", "error");
    } finally {
      this.loading = false;
    }
  },
  methods: {
    // New method to fetch a single student by ID
    async fetchStudent(studentId) {
      // Check if we already have this student cached
      if (this.students[studentId]) {
        return this.students[studentId];
      }
      
      try {
        const response = await eventServices.getStudent(studentId);
        if (response && response.data) {
          // Cache the student data
          this.students[studentId] = response.data;
          return response.data;
        }
      } catch (error) {
        console.warn(`Error fetching student ${studentId}:`, error);
      }
      
      return null;
    },
    
    // New method to update student name in records
    async updateStudentName(record) {
      const student = await this.fetchStudent(record.studentId);
      if (student) {
        record.studentName = `${student.fName} ${student.lName}`;
        
        // Update the studentId display with the actual student ID from the record
        // Use studentID field (uppercase ID) if available as this is the "visible" ID
        if (student.studentID) {
          record.displayStudentId = student.studentID;
        }
        
        // Force component update if needed
        this.$forceUpdate();
      }
    },
    
    async fetchEvents() {
      try {
        const response = await eventServices.getAll();
        this.events = response.data || [];
        console.log("Fetched events:", this.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        this.showMessage("Failed to load events", "error");
        this.events = [];
      }
    },
    
    async fetchPendingApprovals() {
      try {
        const response = await eventServices.getPendingApprovals();
        const pendingApprovals = response.data || [];
        
        console.log("Fetched pending approvals:", pendingApprovals);
        
        // Process the response
        this.processApprovals(pendingApprovals);
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
        this.showMessage("Failed to load pending approvals", "error");
        this.createDbRecordsDisplay();
      }
    },
    
    // Updated to fetch student data as needed
    processApprovals(approvals) {
      const records = [];
      
      if (approvals && approvals.length > 0) {
        // Process actual pending approvals
        for (const approval of approvals) {
          const record = {
            id: `${approval.eventId}-${approval.studentId}`,
            eventId: approval.eventId,
            eventName: approval.eventName || `Event ${approval.eventId}`,
            eventDate: approval.verificationDate || new Date().toISOString(),
            studentId: approval.studentId,
            studentName: approval.studentName || `Student ${approval.studentId}`,
            displayStudentId: approval.studentId, // Default to database ID
            status: 'Pending',
            pointsEarned: approval.points || 0
          };
          
          records.push(record);
          
          // Fetch student data asynchronously
          this.updateStudentName(record);
        }
      } else {
        // If no pending approvals, use the database records
        this.createDbRecordsDisplay();
        return;
      }
      
      this.attendanceRecords = records;
      this.filteredRecords = [...this.attendanceRecords];
    },
    
    // Updated to fetch student data as needed
    createDbRecordsDisplay() {
      // Example hard-coded records - usually these would come from your API
      const records = [
        {
          id: "1-2",
          eventId: "1",
          eventName: this.events.find(e => e.id === 1)?.name || "Career Fair",
          eventDate: "2025-04-24T00:00:00.000Z",
          studentId: "2",
          studentName: "Student 2", // Will be updated
          displayStudentId: "2", // Will be updated with real student ID
          pointsEarned: 30,
          status: "Attended"
        },
        {
          id: "3-2",
          eventId: "3",
          eventName: this.events.find(e => e.id === 3)?.name || "Career Fair",
          eventDate: "2025-04-24T00:00:00.000Z",
          studentId: "2",
          studentName: "Student 2", // Will be updated
          displayStudentId: "2", // Will be updated with real student ID
          pointsEarned: 0,
          status: "Registered"
        }
      ];
      
      // Fetch student data for each record asynchronously
      for (const record of records) {
        this.updateStudentName(record);
      }
      
      this.attendanceRecords = records;
      this.filteredRecords = [...this.attendanceRecords];
    },
    
    mapStatus(status) {
      if (!status) return "Registered";
      
      const statusMap = {
        'registered': 'Registered',
        'pending': 'Pending',
        'attended': 'Attended', 
        'approved': 'Attended',
        'completed': 'Attended',
        'rejected': 'Rejected'
      };
      
      return statusMap[status.toLowerCase()] || status;
    },
    
    handleSearch() {
      const query = this.searchQuery.toLowerCase().trim();
      
      if (!query) {
        this.applyFilters(); // Reset to just filtered records
        return;
      }
      
      this.filteredRecords = this.attendanceRecords.filter(record => {
        // Match by student ID (both display and actual) or name
        return (
          (record.displayStudentId && record.displayStudentId.toString().toLowerCase().includes(query)) ||
          (record.studentId && record.studentId.toString().toLowerCase().includes(query)) ||
          (record.studentName && record.studentName.toLowerCase().includes(query))
        );
      });
      
      // Reset to first page
      this.currentPage = 1;
    },
    
    applyFilters() {
      let filtered = [...this.attendanceRecords];
      
      // Filter by event if selected
      if (this.selectedEvent) {
        filtered = filtered.filter(record => 
          record.eventId === this.selectedEvent
        );
      }
      
      // Apply the filter
      this.filteredRecords = filtered;
      
      // Then apply search query if it exists
      if (this.searchQuery.trim()) {
        this.handleSearch();
      }
      
      // Update stats based on filtered records
      this.updateFilteredStats();
      
      // Reset to first page
      this.currentPage = 1;
    },
    
    filterByEvent() {
      this.applyFilters();
    },
    
    updateStats() {
      const stats = {
        total: this.attendanceRecords.length,
        pending: 0,
        attended: 0,
        registered: 0
      };
      
      this.attendanceRecords.forEach(record => {
        const status = record.status.toLowerCase();
        if (status === 'pending') stats.pending++;
        if (status === 'attended') stats.attended++;
        if (status === 'registered') stats.registered++; 
      });
      
      this.stats = stats;
    },
    
    // New method to update stats based on filtered records
    updateFilteredStats() {
      const stats = {
        total: this.filteredRecords.length,
        pending: 0,
        attended: 0,
        registered: 0
      };
      
      this.filteredRecords.forEach(record => {
        const status = record.status.toLowerCase();
        if (status === 'pending') stats.pending++;
        if (status === 'attended') stats.attended++;
        if (status === 'registered') stats.registered++;
      });
      
      this.stats = stats;
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    approveAttendance(record) {
      this.selectedRecord = record;
      this.approvalPoints = record.pointsEarned || 50;
      this.showApprovalModal = true;
    },
    
    async confirmApproval() {
      try {
        const eventId = this.selectedRecord.eventId;
        const studentId = this.selectedRecord.studentId;
        
        // Use your existing API method to approve attendance
        await eventServices.approveAttendance(eventId, studentId, {
          points: this.approvalPoints
        });
        
        // Update local record
        const record = this.attendanceRecords.find(
          r => r.id === `${eventId}-${studentId}`
        );
        
        if (record) {
          record.status = 'Attended';
          record.pointsEarned = this.approvalPoints;
        }
        
        this.showMessage('Attendance approved successfully', 'success');
        this.updateStats();
        this.applyFilters(); // Update filtered records
        this.closeModal();
        
        // Refresh data after approving
        await this.fetchPendingApprovals();
      } catch (error) {
        console.error("Error approving attendance:", error);
        this.showMessage('Failed to approve attendance', 'error');
      }
    },
    
    async rejectAttendance(record) {
      try {
        const eventId = record.eventId;
        const studentId = record.studentId;
        
        // Use your existing API method to reject attendance
        await eventServices.rejectAttendance(eventId, studentId);
        
        // Update local record
        const localRecord = this.attendanceRecords.find(
          r => r.id === `${eventId}-${studentId}`
        );
        
        if (localRecord) {
          localRecord.status = 'Rejected';
        }
        
        this.showMessage('Attendance request rejected', 'success');
        this.updateStats();
        this.applyFilters(); // Update filtered records
        
        // Refresh data after rejecting
        await this.fetchPendingApprovals();
      } catch (error) {
        console.error("Error rejecting attendance:", error);
        this.showMessage('Failed to reject attendance', 'error');
      }
    },
    
    async resetStatus(record) {
      try {
        const eventId = record.eventId;
        const studentId = record.studentId;
        
        // There's no specific reset API in your controller, 
        // so we'll try to find a way to do it
        try {
          // We could try to use the register endpoint again
          await eventServices.registerStudent(eventId, studentId);
        } catch (regError) {
          console.warn("Could not re-register:", regError);
          
          // Or we could try a general update if available
          try {
            await apiClient.put(`/flight-plan-t9/studentevents/${record.id}`, {
              status: 'registered',
              pointsEarned: 0
            });
          } catch (updateError) {
            console.warn("Could not update via API:", updateError);
          }
        }
        
        // Update local record regardless
        const localRecord = this.attendanceRecords.find(
          r => r.id === `${eventId}-${studentId}`
        );
        
        if (localRecord) {
          localRecord.status = 'Registered';
          localRecord.pointsEarned = 0;
        }
        
        this.showMessage('Attendance status has been reset', 'success');
        this.updateStats();
        this.applyFilters(); // Update filtered records
      } catch (error) {
        console.error("Error resetting attendance status:", error);
        this.showMessage('Failed to reset attendance status', 'error');
      }
    },
    
    viewDetails(record) {
      this.selectedRecord = record;
      this.showDetailsModal = true;
    },
    
    closeModal() {
      this.showApprovalModal = false;
      this.showDetailsModal = false;
      this.selectedRecord = null;
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      } catch (e) {
        return dateString;
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
.attendance-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
  color: #333;
}

h1 {
  color: #48111c;
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 2px solid #f9c634;
  padding-bottom: 10px;
}

/* Search and filter section */
.search-section {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-input input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.filter-options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-options label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-options select {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Stats section */
.stats-section {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.stat-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  flex: 1;
  min-width: 120px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #48111c;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* Table styles */
.table-container {
  margin-bottom: 20px;
  overflow-x: auto;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.attendance-table th,
.attendance-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.attendance-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.attendance-table tr:hover {
  background-color: #f9f9f9;
}

/* Status badges */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  text-transform: capitalize;
}

.pending {
  background-color: #fff3cd;
  color: #856404;
}

.attended, .completed {
  background-color: #d4edda;
  color: #155724;
}

.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.registered {
  background-color: #e2e3e5;
  color: #383d41;
}

/* Action buttons */
.actions {
  display: flex;
  gap: 5px;
}

button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
}

.approve-button {
  background-color: #48111c;
  color: white;
}

.reject-button {
  background-color: #dc3545;
  color: white;
}

.view-button {
  background-color: #2196f3;
  color: white;
}

.reset-button {
  background-color: #e2e3e5;
  color: #333;
}

/* Empty state */
.empty-state {
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 4px;
  text-align: center;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 10px;
  color: #666;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination-button {
  background-color: #f2f2f2;
  color: #333;
  padding: 6px 12px;
  border-radius: 4px;
}

.pagination-button:disabled {
  color: #aaa;
  cursor: not-allowed;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  color: #48111c;
  font-size: 20px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.student-info {
  background-color: #f2f2f2;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button {
  background-color: #e2e3e5;
  color: #333;
}

.save-button {
  background-color: #f9c634;
  color: #333;
}

.close-button {
  background-color: #e2e3e5;
  color: #333;
  padding: 8px;
  margin-top: 15px;
  display: block;
  width: 100%;
}

/* Details modal */
.details-container {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.detail-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-label {
  flex: 0 0 120px;
  font-weight: bold;
  color: #48111c;
}

.detail-value {
  flex: 1;
}

.reflection-section {
  margin-top: 15px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.reflection-section h4 {
  color: #48111c;
  margin-bottom: 8px;
  font-size: 16px;
}

.reflection-text {
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #f9c634;
  line-height: 1.5;
}

/* Message notification */
.message {
  padding: 12px;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 300px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.success {
  background-color: #d4edda;
  color: #155724;
  border-left: 4px solid #48111c;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stats-section {
    gap: 8px;
  }
  
  .stat-card {
    min-width: calc(50% - 8px);
  }
  
  .search-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-options {
    width: 100%;
  }
  
  .attendance-table th,
  .attendance-table td {
    padding: 8px;
    font-size: 14px;
  }
  
  .actions {
    flex-direction: column;
    gap: 4px;
  }
  
  .actions button {
    width: 100%;
  }
  
  .detail-row {
    flex-direction: column;
  }
  
  .detail-label {
    margin-bottom: 4px;
  }
  
  .modal {
    padding: 15px;
  }
}
</style>
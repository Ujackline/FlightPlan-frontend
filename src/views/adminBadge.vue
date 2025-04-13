<template>
  <div class="admin-badges-container">
    <h1>Admin Badges</h1>
    
    <!-- Badge List -->
    <div class="badge-list">
      <div class="list-header">
        <h2>All Badges</h2>
        <button @click="showAddBadgeModal = true" class="add-button">
          <span class="button-icon">+</span> Add New Badge
        </button>
      </div>
      
      <table v-if="badges.length > 0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Points</th>
            <th>Category</th>
            <th>Level</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="badge in badges" :key="badge.id">
            <td><span class="badge-name">{{ badge.name }}</span></td>
            <td>{{ badge.points }}</td>
            <td>{{ badge.category }}</td>
            <td>{{ badge.level }}</td>
            <td>{{ badge.description }}</td>
            <td class="actions">
              <button @click="openEditModal(badge)" class="edit-button">Edit</button>
              <button @click="confirmDelete(badge)" class="delete-button">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <div class="empty-icon">🏅</div>
        <p>No badges found. Add your first badge!</p>
      </div>
    </div>
    
    <!-- Add/Edit Badge Modal -->
    <div v-if="showAddBadgeModal || showEditBadgeModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ showEditBadgeModal ? 'Edit Badge' : 'Add New Badge' }}</h3>
        <form @submit.prevent="showEditBadgeModal ? updateBadge() : addBadge()">
          <div class="form-group">
            <label for="badge-name">Badge Name*</label>
            <input
              id="badge-name"
              v-model="badgeForm.name"
              type="text"
              required
              placeholder="Enter badge name"
            >
          </div>
          
          <div class="form-group">
            <label for="badge-description">Description*</label>
            <textarea
              id="badge-description"
              v-model="badgeForm.description"
              required
              placeholder="Enter badge description"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group form-group-half">
              <label for="badge-points">Points*</label>
              <input
                id="badge-points"
                v-model="badgeForm.points"
                type="number"
                min="0"
                required
                placeholder="Points value"
              >
            </div>
            
            <div class="form-group form-group-half">
              <label for="badge-category">Category*</label>
              <select
                id="badge-category"
                v-model="badgeForm.category"
                required
              >
                <option value="">Select a category</option>
                <option value="academic">Academic</option>
                <option value="achievement">Achievement</option>
                <option value="participation">Participation</option>
                <option value="leadership">Leadership</option>
                <option value="service">Service</option>
                <option value="skill">Skill</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group form-group-half">
              <label for="badge-level">Level*</label>
              <select
                id="badge-level"
                v-model="badgeForm.level"
                required
              >
                <option value="">Select level</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
            
            <div class="form-group form-group-half">
              <label for="badge-requirement">Requirement*</label>
              <input
                id="badge-requirement"
                v-model="badgeForm.requirement"
                type="text"
                required
                placeholder="What's needed to earn this badge"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="badge-icon">Badge Icon</label>
            <select
              id="badge-icon"
              v-model="badgeForm.icon"
            >
              <option value="trophy">Trophy</option>
              <option value="star">Star</option>
              <option value="medal">Medal</option>
              <option value="certificate">Certificate</option>
              <option value="crown">Crown</option>
              <option value="award">Award</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="badge-color">Badge Color</label>
            <input
              id="badge-color"
              v-model="badgeForm.color"
              type="color"
            >
          </div>
          
          <div class="button-group">
            <button
              type="button"
              @click="closeModal()"
              class="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" class="save-button">
              {{ showEditBadgeModal ? 'Save Changes' : 'Add Badge' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Badge Assignment Modal -->
    <div v-if="showAssignModal" class="modal-overlay">
      <div class="modal">
        <h3>Assign Badge</h3>
        
        <div class="badge-info">
          <div class="info-row">
            <span class="info-label">Badge:</span>
            <span class="info-value">{{ selectedBadge?.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Points:</span>
            <span class="info-value">{{ selectedBadge?.points }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="search-student">Search Student</label>
          <input
            id="search-student"
            v-model="studentSearch"
            type="text"
            placeholder="Enter student name or ID"
          >
        </div>
        
        <div v-if="filteredStudents.length > 0" class="student-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.id">
                <td>{{ student.name }}</td>
                <td>{{ student.studentId }}</td>
                <td>
                  <button @click="assignBadge(student)" class="assign-button">
                    Assign Badge
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="studentSearch.length > 0" class="empty-state">
          <p>No students match your search criteria.</p>
        </div>
        
        <div class="button-group">
          <button @click="closeAssignModal()" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal delete-modal">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete the badge <strong>"{{ badgeToDelete?.name }}"</strong>?</p>
        <p class="warning-text">This action cannot be undone.</p>
        
        <div class="button-group">
          <button @click="showDeleteModal = false" class="cancel-button">Cancel</button>
          <button @click="deleteBadge()" class="delete-button">Delete Badge</button>
        </div>
      </div>
    </div>
    
    <!-- Confirmation or error message -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script>
import badgeServices from '../services/badgeServices';
import Utils from '../config/utils';

export default {
  data() {
    return {
      badges: [],
      showAddBadgeModal: false,
      showEditBadgeModal: false,
      showDeleteModal: false,
      showAssignModal: false,
      badgeToDelete: null,
      selectedBadge: null,
      message: '',
      messageType: 'success',
      badgeForm: {
        name: '',
        description: '',
        points: 0,
        category: '',
        level: '',
        requirement: '',
        icon: 'trophy',
        color: '#f9c634'
      },
      studentSearch: '',
      filteredStudents: []
    };
  },
  
  created() {
    // Check if user has admin rights
    if (!this.isAdmin()) {
      this.$router.push('/');
      return;
    }
    
    this.fetchBadges();
  },
  
  methods: {
    // Check if current user is admin
    isAdmin() {
      const user = Utils.getStore("user");
      return user && user.role === 'admin';
    },
    
    // Close any open modal
    closeModal() {
      this.showAddBadgeModal = false;
      this.showEditBadgeModal = false;
      this.resetForm();
    },
    
    // Fetch all badges
    async fetchBadges() {
      try {
        const response = await badgeServices.getAll();
        this.badges = response.data;
      } catch (error) {
        console.error('Failed to fetch badges', error);
        this.showMessage('Failed to load badges.', 'error');
      }
    },
    
    // Open the assign badge modal
    assignBadgeModal(badge) {
      this.selectedBadge = badge;
      this.studentSearch = '';
      this.filteredStudents = [];
      this.showAssignModal = true;
    },
    
    // Close the assign badge modal
    closeAssignModal() {
      this.showAssignModal = false;
      this.selectedBadge = null;
      this.studentSearch = '';
      this.filteredStudents = [];
    },
    
    // Search for students
    async searchStudents() {
      if (this.studentSearch.length < 2) {
        this.filteredStudents = [];
        return;
      }
      
      try {
        // In a real app, this would be an API call
        // const response = await this.$axios.get(`/api/students/search?q=${this.studentSearch}`);
        // this.filteredStudents = response.data;
        
        // Mocked data for demonstration
        this.filteredStudents = [
          { id: 1, name: 'John Doe', studentId: 'S12345' },
          { id: 2, name: 'Jane Smith', studentId: 'S12346' },
          { id: 3, name: 'Robert Johnson', studentId: 'S12347' }
        ].filter(s => 
          s.name.toLowerCase().includes(this.studentSearch.toLowerCase()) || 
          s.studentId.includes(this.studentSearch)
        );
      } catch (error) {
        console.error('Failed to search students', error);
      }
    },
    
    // Assign badge to student
    async assignBadge(student) {
      if (!this.selectedBadge) return;
      
      try {
        // In a real app, this would be an API call
        // await this.$axios.post('/api/badges/assign', {
        //   badgeId: this.selectedBadge.id,
        //   studentId: student.id
        // });
        
        console.log(`Assigning badge ${this.selectedBadge.name} to student ${student.name}`);
        
        this.closeAssignModal();
        this.showMessage(`Badge "${this.selectedBadge.name}" assigned to ${student.name} successfully!`, 'success');
      } catch (error) {
        console.error('Failed to assign badge', error);
        this.showMessage('Failed to assign badge.', 'error');
      }
    },
    
    // Open the edit modal with badge data
    openEditModal(badge) {
      this.badgeForm = {
        id: badge.id,
        name: badge.name,
        description: badge.description || '',
        points: badge.points,
        category: badge.category,
        level: badge.level,
        requirement: badge.requirement || '',
        icon: badge.icon || 'trophy',
        color: badge.color || '#f9c634'
      };
      this.showEditBadgeModal = true;
    },
    
    // Prepare delete confirmation
    confirmDelete(badge) {
      this.badgeToDelete = badge;
      this.showDeleteModal = true;
    },
    
    // Add a new badge
    async addBadge() {
      try {
        const response = await badgeServices.create(this.badgeForm);
        this.badges.push(response.data);
        this.showAddBadgeModal = false;
        this.resetForm();
        this.showMessage('Badge created successfully!', 'success');
      } catch (error) {
        console.error('Failed to create badge', error);
        this.showMessage('Failed to create badge.', 'error');
      }
    },
    
    // Update an existing badge
    async updateBadge() {
      try {
        await badgeServices.update(this.badgeForm.id, this.badgeForm);
        
        // Update local badges array with edited badge
        const index = this.badges.findIndex(b => b.id === this.badgeForm.id);
        if (index !== -1) {
          // Use the response data or create a merged object
          await this.fetchBadges(); // Refresh badges from server
        }
        
        this.showEditBadgeModal = false;
        this.resetForm();
        this.showMessage('Badge updated successfully!', 'success');
      } catch (error) {
        console.error('Failed to update badge', error);
        this.showMessage('Failed to update badge.', 'error');
      }
    },
    
    // Delete a badge
    async deleteBadge() {
      if (!this.badgeToDelete?.id) return;
      
      try {
        await badgeServices.delete(this.badgeToDelete.id);
        
        // Remove from local badges array
        this.badges = this.badges.filter(b => b.id !== this.badgeToDelete.id);
        
        this.showDeleteModal = false;
        this.badgeToDelete = null;
        this.showMessage('Badge deleted successfully.', 'success');
      } catch (error) {
        console.error('Failed to delete badge', error);
        this.showMessage('Failed to delete badge.', 'error');
      }
    },
    
    // Reset the form
    resetForm() {
      this.badgeForm = {
        name: '',
        description: '',
        points: 0,
        category: '',
        level: '',
        requirement: '',
        icon: 'trophy',
        color: '#f9c634'
      };
    },
    
    // Show a message (success or error)
    showMessage(message, type = 'success') {
      this.message = message;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    },
    
    // Watch for changes in studentSearch to trigger search
    watch: {
      studentSearch() {
        this.searchStudents();
      }
    }
  }
};
</script>

<style scoped>
.admin-badges-container {
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

.badge-list {
  margin-top: 25px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

th, td {
  border: none;
  padding: 14px 16px;
  text-align: left;
}

th {
  background-color: #d5dfe7;
  color: #48111c;
  font-weight: 600;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tr {
  border-bottom: 1px solid #eee;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f0f6ff;
}

tr:last-child {
  border-bottom: none;
}

.actions {
  white-space: nowrap;
  width: 150px;
}

.add-button {
  background-color: #f9c634;
  color: #333;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  float: right;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(249, 198, 52, 0.3);
}

.add-button:hover {
  background-color: #edbb2d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(249, 198, 52, 0.4);
}

.edit-button {
  background-color: #708e9a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.edit-button:hover {
  background-color: #5a7985;
  transform: translateY(-1px);
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.delete-button:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.assign-button {
  background-color: #48111c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.assign-button:hover {
  background-color: #5e1a27;
  transform: translateY(-1px);
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.delete-modal {
  max-width: 450px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.form-group-half {
  flex: 1;
  min-width: 200px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #48111c;
  font-size: 14px;
}

input, textarea, select {
  width: 100%;
  padding: 12px;
  border: 2px solid #d5dfe7;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #f9fafb;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #708e9a;
  box-shadow: 0 0 0 3px rgba(112, 142, 154, 0.2);
  background-color: white;
}

textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;
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
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #c4cfd8;
}

.save-button {
  background-color: #f9c634;
  color: #333;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(249, 198, 52, 0.3);
}

.save-button:hover {
  background-color: #edbb2d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(249, 198, 52, 0.4);
}

.warning-text {
  color: #dc3545;
  font-weight: bold;
  background-color: rgba(220, 53, 69, 0.1);
  padding: 10px;
  border-radius: 5px;
  margin: 15px 0;
}

/* Message styling */
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

/* Additional styles */
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.button-icon {
  margin-right: 5px;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background-color: #f9f9fb;
  border-radius: 10px;
  margin: 20px 0;
  border: 2px dashed #d5dfe7;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #708e9a;
}

.badge-name {
  font-weight: 500;
  color: #48111c;
}

.badge-info {
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

.student-list {
  margin: 15px 0;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #d5dfe7;
  border-radius: 6px;
}
</style>
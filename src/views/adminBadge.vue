.badge-type-pill.default {
  background-color: #e6e6e6;
  color: #666666;
}

.badge-icon-small.default {
  background-color: #888888;
}    // Debounce student search to improve performance
    debounceStudentSearch() {
      // Clear any existing timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      // Set a new timeout to delay the search
      this.searchTimeout = setTimeout(() => {
        this.searchStudents();
      }, 300); // 300ms delay
    },.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-spinner {
  position: absolute;
  right: 12px;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #800000;
  animation: spin 1s linear infinite;
}.student-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.student-loading .spinner {
  width: 24px;
  height: 24px;
  margin-bottom: 10px;
}.header-actions {
  display: flex;
  gap: 10px;
}<template>
  <div class="admin-badges-container">
    <div class="header-container">
      <h1>Admin Badges</h1>
      
      <div class="filter-tabs">
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'ALL BADGE TYPES' }"
          @click="activeFilter = 'ALL BADGE TYPES'"
        >
          ALL BADGE TYPES
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'Career' }"
          @click="activeFilter = 'Career'"
        >
          CAREER
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'Achievement' }"
          @click="activeFilter = 'Achievement'"
        >
          ACHIEVEMENT
        </button>
      </div>
    </div>
    
    <!-- Badge List -->
          <div class="badge-list">
      <div class="list-header">
        <h2>All Badges ({{ filteredBadges.length }} {{ activeFilter !== 'ALL BADGE TYPES' ? activeFilter : '' }} badges)</h2>
        <div class="header-actions">
          <button @click="showAddBadgeModal = true" class="add-button">
            <span class="button-icon">+</span> Add New Badge
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading badges...</p>
      </div>
      
      <table v-else-if="filteredBadges.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Badge Type</th>
            <th>Points</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="badge in filteredBadges" :key="badge.id">
            <td>{{ badge.id }}</td>
            <td>
              <div class="badge-name-container">
                <div class="badge-icon-small" :class="badge.badge_type ? badge.badge_type.toLowerCase() : 'default'">
                  <!-- Workforce Debut -->
                  <svg v-if="badge.name === 'Workforce Debut'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                  </svg>
                  <!-- Interview Master -->
                  <svg v-else-if="badge.name === 'Interview Master'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                  <!-- Resume Builder -->
                  <svg v-else-if="badge.name === 'Resume Builder'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM12 18H8v-2h4v2zm4-4H8v-2h8v2zm0-4H8V8h8v2zm-3-5V3.5L18.5 9H13V5z" />
                  </svg>
                  <!-- Career icon default -->
                  <svg v-else-if="badge.badge_type === 'Career'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                  </svg>
                  <!-- Achievement icon default -->
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 14.63 21 12.55 21 10V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM19 8c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                  </svg>
                </div>
                <span class="badge-name">{{ badge.name }}</span>
              </div>
            </td>
            <td>
              <div>
                {{ badge.description }}
                <div v-if="hasImageUrl(badge.description)" class="badge-description-image">
                  <img 
                    :src="extractImageUrl(badge.description)" 
                    alt="Badge image" 
                    @error="handleImageError" 
                    referrerpolicy="no-referrer"
                  />
                </div>
              </div>
            </td>
            <td>
              <span class="badge-type-pill" :class="badge.badge_type ? badge.badge_type.toLowerCase() : 'default'">
                {{ badge.badge_type || 'Unknown' }}
              </span>
            </td>
            <td><span class="badge-points">{{ badge.points }}</span></td>
            <td>{{ formatDate(badge.createdAt) }}</td>
            <td>{{ formatDate(badge.updatedAt) }}</td>
            <td class="actions">
              <button @click="openEditModal(badge)" class="edit-button">Edit</button>
              <button @click="confirmDelete(badge)" class="delete-button">Delete</button>
              <button @click="assignBadgeModal(badge)" class="assign-button">Assign</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <div class="trophy-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 22H17V20H7V22ZM12 2C9.27 2 7 4.27 7 7V14H9V7C9 5.35 10.35 4 12 4C13.65 4 15 5.35 15 7V14H17V7C17 4.27 14.73 2 12 2ZM12 18C13.1 18 14 17.1 14 16H10C10 17.1 10.9 18 12 18Z" fill="#cccccc"/>
          </svg>
        </div>
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
              @input="checkForImageUrl"
            ></textarea>
            <div v-if="imageUrl" class="image-preview">
              <img 
                :src="imageUrl" 
                alt="Badge preview image" 
                @error="handleImageError" 
                @load="onImageLoad"
                referrerpolicy="no-referrer"
              >
              <button @click="removeImage" class="remove-image-btn">×</button>
            </div>
            <div class="description-hint" v-if="!imageUrl">
              <small>Add an image URL to your description to display a badge image</small>
            </div>
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
              <label for="badge-type">Badge Type*</label>
              <select
                id="badge-type"
                v-model="badgeForm.badge_type"
                required
              >
                <option value="">Select a type</option>
                <option value="Achievement">Achievement</option>
                <option value="Career">Career</option>
              </select>
            </div>
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
          <div class="search-input-container">
            <input
              id="search-student"
              v-model="studentSearch"
              type="text"
              placeholder="Enter student name or ID"
              @input="debounceStudentSearch"
            >
            <div v-if="loading" class="search-spinner"></div>
          </div>
        </div>
        
        <div v-if="loading" class="student-loading">
          <div class="spinner"></div>
          <p>Searching...</p>
        </div>
        
        <div v-else-if="filteredStudents.length > 0" class="student-list">
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
                  <button 
                    @click="assignBadge(student)" 
                    class="assign-button"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="button-loader"></span>
                    <span v-else>Assign Badge</span>
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
          <button @click="cancelDelete()" class="cancel-button">Cancel</button>
          <button @click="deleteBadge()" class="delete-button" :disabled="loading">
            <span v-if="loading" class="button-loader"></span>
            <span v-else>Delete Badge</span>
          </button>
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
// Update this import path to match your project structure
import badgeServices from '../services/badgeServices';
import Utils from '../config/utils';

export default {
  data() {
    return {
      badges: [],
      filteredBadges: [],
      activeFilter: 'ALL BADGE TYPES',
      showAddBadgeModal: false,
      showEditBadgeModal: false,
      showDeleteModal: false,
      showAssignModal: false,
      badgeToDelete: null,
      selectedBadge: null,
      message: '',
      messageType: 'success',
      loading: false,
      imageUrl: null,
      badgeForm: {
        name: '',
        description: '',
        points: 0,
        badge_type: '',
      },
      studentSearch: '',
      filteredStudents: [],
      // Used to control debouncing student search
      searchTimeout: null
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
  
  watch: {
    activeFilter() {
      this.filterBadges();
    }
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
    
    // Filter badges based on active filter
    filterBadges() {
      if (this.activeFilter === 'ALL BADGE TYPES') {
        this.filteredBadges = this.badges;
      } else {
        this.filteredBadges = this.badges.filter(badge => 
          badge.badge_type && badge.badge_type === this.activeFilter
        );
      }
    },
    
    // Fetch all badges
    async fetchBadges() {
      try {
        this.loading = true;
        const response = await badgeServices.getAll();
        this.badges = response.data;
        
        // DEBUG: Log all badge descriptions to check URLs
        console.log("All badges:", this.badges);
        this.badges.forEach(badge => {
          if (badge.description && badge.description.includes('http')) {
            console.log("Badge with URL:", badge.name, badge.description);
            const imgUrl = this.extractImageUrl(badge.description);
            console.log("Extracted URL:", imgUrl);
            
            // Create a test image to verify URL works
            const img = new Image();
            img.onload = () => console.log("Image loaded successfully:", imgUrl);
            img.onerror = () => console.error("Image failed to load:", imgUrl);
            img.src = imgUrl;
          }
        });
        
        this.filterBadges();
        this.loading = false;
      } catch (error) {
        console.error('Failed to fetch badges', error);
        this.showMessage('Failed to load badges.', 'error');
        this.loading = false;
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
        this.loading = true;
        
        // In a real application, you would call an API endpoint to search for students
        // For example:
        // const response = await apiClient.get(`/students/search?q=${this.studentSearch}`);
        // this.filteredStudents = response.data;
        
        // For now, using mock data for demonstration
        setTimeout(() => {
          this.filteredStudents = [
            { id: 1, name: 'John Doe', studentId: 'S12345' },
            { id: 2, name: 'Jane Smith', studentId: 'S12346' },
            { id: 3, name: 'Robert Johnson', studentId: 'S12347' }
          ].filter(s => 
            s.name.toLowerCase().includes(this.studentSearch.toLowerCase()) || 
            s.studentId.includes(this.studentSearch)
          );
          this.loading = false;
        }, 500); // Simulate API delay
      } catch (error) {
        console.error('Failed to search students:', error);
        this.loading = false;
      }
    },
    
    // Assign badge to a student
    async assignBadge(student) {
      if (!this.selectedBadge) return;
      
      try {
        this.loading = true;
        
        // In a real application, you would call an API endpoint to assign the badge
        // For example:
        // await apiClient.post(`/badge/${this.selectedBadge.id}/assign/${student.id}`);
        
        console.log(`Assigning badge ${this.selectedBadge.name} (ID: ${this.selectedBadge.id}) to student ${student.name} (ID: ${student.id})`);
        
        // Show success message
        this.showMessage(`Badge "${this.selectedBadge.name}" has been assigned to ${student.name}.`, 'success');
        
        // Close modal
        this.closeAssignModal();
      } catch (error) {
        console.error('Failed to assign badge:', error);
        this.showMessage(`Error assigning badge: ${error.response?.data?.message || error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },
    
    // Open the edit modal with badge data
    openEditModal(badge) {
      this.badgeForm = {
        id: badge.id,
        name: badge.name,
        description: badge.description || '',
        points: badge.points,
        badge_type: badge.badge_type
      };
      this.showEditBadgeModal = true;
    },
    
    // Confirm delete badge
    confirmDelete(badge) {
      this.badgeToDelete = badge;
      this.showDeleteModal = true;
    },
    
    // Cancel badge deletion
    cancelDelete() {
      this.showDeleteModal = false;
      this.badgeToDelete = null;
    },
    
    // Add a new badge
    async addBadge() {
      try {
        this.loading = true;
        
        // Prepare the data for creating a new badge
        const formData = {
          ...this.badgeForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Call the create method from your badgeServices
        const response = await badgeServices.create(formData);
        
        if (response && response.data) {
          // Add the new badge to our array
          this.badges.push(response.data);
          
          // Update filtered badges
          this.filterBadges();
          
          // Show success message
          this.showMessage(`Badge "${this.badgeForm.name}" has been created successfully.`, 'success');
          
          // Close modal and reset form
          this.showAddBadgeModal = false;
          this.resetForm();
        }
      } catch (error) {
        console.error('Failed to create badge:', error);
        this.showMessage(`Error creating badge: ${error.response?.data?.message || error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },
    
    // Update an existing badge
    async updateBadge() {
      try {
        this.loading = true;
        
        // Prepare the data for update
        const formData = {
          ...this.badgeForm,
          updatedAt: new Date().toISOString()
        };
        
        // Call the update method from your badgeServices
        const response = await badgeServices.update(this.badgeForm.id, formData);
        
        // If update was successful, update the local data
        if (response) {
          // Find the badge in the array and update it
          const index = this.badges.findIndex(b => b.id === this.badgeForm.id);
          if (index !== -1) {
            // If we have a response with data, use that, otherwise use our formData
            const updatedBadge = response.data || { 
              ...this.badges[index], 
              ...formData 
            };
            
            // Update the badge in our array
            this.badges.splice(index, 1, updatedBadge);
            
            // Update filtered badges
            this.filterBadges();
          }
          
          // Show success message
          this.showMessage(`Badge "${this.badgeForm.name}" has been updated successfully.`, 'success');
          
          // Close modal and reset form
          this.showEditBadgeModal = false;
          this.resetForm();
        }
      } catch (error) {
        console.error('Failed to update badge:', error);
        this.showMessage(`Error updating badge: ${error.response?.data?.message || error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },
    
    // Delete a badge
    async deleteBadge() {
      if (!this.badgeToDelete?.id) return;
      
      try {
        this.loading = true;
        
        // Call the delete method from your badgeServices
        await badgeServices.delete(this.badgeToDelete.id);
        
        // Show success message
        this.showMessage(`Badge "${this.badgeToDelete.name}" has been deleted successfully.`, 'success');
        
        // Remove from local badges array
        this.badges = this.badges.filter(b => b.id !== this.badgeToDelete.id);
        
        // Update filtered badges
        this.filterBadges();
        
        // Close the modal
        this.showDeleteModal = false;
        this.badgeToDelete = null;
      } catch (error) {
        console.error('Failed to delete badge:', error);
        this.showMessage(`Error deleting badge: ${error.response?.data?.message || error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },
    
    // Reset the form
    resetForm() {
      this.badgeForm = {
        name: '',
        description: '',
        points: 0,
        badge_type: '',
      };
    },
    
    // Format date for display
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleString();
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
    },
    
    // Check if description has an image URL (simplified)
    hasImageUrl(description) {
      if (!description) return false;
      // Check for both standard image URLs and LinkedIn URLs
      return /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/i.test(description) || 
             /https?:\/\/(media\.licdn\.com|linkedin\.com)[^\s]+/i.test(description);
    },
    
    // Extract image URL from the description text
    extractImageUrl(description) {
      if (!description) return '';
      
      // Try to match standard image URLs
      let match = description.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s]*)?/i);
      if (match) return match[0];
      
      // Try to match LinkedIn media URLs even without file extension
      match = description.match(/https?:\/\/(media\.licdn\.com|linkedin\.com)[^\s]+/i);
      return match ? match[0] : '';
    },
    
    // Check if description contains a URL and extract it
    checkForImageUrl() {
      this.imageUrl = this.extractImageUrl(this.badgeForm.description);
    },
    
    // Handle image loading success
    onImageLoad(event) {
      console.log("Image loaded successfully");
      event.target.style.opacity = 1;
    },
    
    // Handle image loading error
    handleImageError(event) {
      console.error("Failed to load image");
      event.target.style.display = 'none';
      this.showMessage('Failed to load image. Please check the URL.', 'error');
    },
    
    // Remove image preview
    removeImage() {
      this.imageUrl = null;
    },
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

.button-loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

.save-button:disabled,
.delete-button:disabled,
.assign-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.assign-button:hover:not(:disabled) {
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

.header-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-tabs {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.filter-tab {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.filter-tab.active {
  background-color: #800000;
  color: white;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  margin: 20px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #800000;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.trophy-icon {
  margin-bottom: 15px;
  color: #708e9a;
}

.badge-name-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-icon-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge-icon-small.career {
  background-color: #4169E1; /* Royal blue for career */
}

.badge-icon-small.achievement {
  background-color: #FFA500; /* Orange for achievement */
}

.badge-name {
  font-weight: 500;
  color: #48111c;
}

.badge-type-pill {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.badge-type-pill.career {
  background-color: #e6f0ff;
  color: #0047AB;
}

.badge-type-pill.achievement {
  background-color: #fff4e6;
  color: #FF8C00;
}

.badge-points {
  font-weight: 600;
  color: #FF8C00;
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

.image-preview {
  margin-top: 10px;
  position: relative;
  max-width: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background-color 0.2s;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.badge-description-image {
  margin-top: 8px;
  max-width: 120px;
  border-radius: 6px;
  overflow: hidden;
}

.badge-description-image img {
  width: 100%;
  height: auto;
  display: block;
}

.description-hint {
  margin-top: 5px;
  font-style: italic;
  color: #708e9a;
}
</style>
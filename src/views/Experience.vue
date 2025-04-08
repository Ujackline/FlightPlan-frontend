<template>
  <div class="experiences-page">
    <h2 class="page-title">Experiences</h2>

    <!-- Experience Form -->
    <section v-if="showForm" class="form-section">
      <h3 class="section-title">{{ editing ? "Edit Experience" : "Add New Experience" }}</h3>
      <form @submit.prevent="editing ? updateExperience() : addExperience()">
        <div class="form-group" v-for="field in fields" :key="field.name">
          <label :for="field.name" class="form-label">{{ field.label }}<span v-if="field.required" class="required">*</span></label>
          <input v-if="field.type !== 'textarea' && field.type !== 'checkbox'" 
                 :type="field.type" 
                 :id="field.name" 
                 v-model="experience[field.name]" 
                 :required="field.required"
                 class="form-control" 
                 :placeholder="'Enter ' + field.label.toLowerCase()" />
          <textarea v-else-if="field.type === 'textarea'" 
                    :id="field.name" 
                    v-model="experience[field.name]" 
                    :required="field.required"
                    class="form-control textarea"
                    :placeholder="'Enter ' + field.label.toLowerCase()"></textarea>
          <div v-else-if="field.type === 'checkbox'" class="checkbox-container">
            <input type="checkbox" 
                   :id="field.name" 
                   v-model="experience[field.name]" 
                   class="form-checkbox" />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn cancel-btn" @click="resetForm">Cancel</button>
          <button type="submit" class="btn save-btn">{{ editing ? "Update Experience" : "Add Experience" }}</button>
        </div>
      </form>
    </section>

    <!-- Add New Experience Button -->
    <div class="button-container" v-if="!showForm">
      <button v-if="isAdmin" @click="toggleForm" class="btn add-btn">
        <span class="add-icon">+</span> Add New Experience
      </button>
    </div>

    <!-- Experience List -->
    <section v-if="experiences.length > 0" class="experience-list">
      <h3 class="section-title">Experiences</h3>
      <div class="admin-controls" v-if="isAdmin">
        <div class="search-filter">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search experiences..."
            class="search-input"
          >
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading experiences...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button @click="fetchExperiences" class="retry-button">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!experiences.length" class="empty-state">
        <i class="fas fa-folder-open"></i>
        <p>No experiences found</p>
      </div>

      <ul v-else class="experiences-ul">
        <li v-for="exp in filteredExperiences" :key="exp.id" class="experience-item" :class="{ 'admin-view': isAdmin }">
          <div class="experience-info">
            <div class="experience-main-info">
              <span class="experience-name">{{ exp.name }}</span>
              <span v-if="!isAdmin" class="experience-status" :class="'status-' + exp.status.toLowerCase()">{{ exp.status }}</span>
              <span v-if="isAdmin" class="admin-badge" :class="'status-' + exp.status.toLowerCase()">{{ exp.status }}</span>
            </div>
            <div v-if="isAdmin" class="experience-details">
              <span class="detail-item"><i class="fas fa-user"></i> {{ exp.major }}</span>
              <span class="detail-item"><i class="fas fa-calendar"></i> {{ exp.semester }}</span>
              <span class="detail-item"><i class="fas fa-star"></i> {{ exp.points }} points</span>
            </div>
          </div>
          <div class="actions">
            <button @click="viewExperience(exp)" class="btn view-btn">
              <span class="btn-icon">👁️</span> View
            </button>
            <button v-if="!isAdmin && exp.status !== 'Approved'" @click="markAsComplete(exp)" class="btn complete-btn">
              <span class="btn-icon">✓</span> Mark Complete
            </button>
            <button v-if="isAdmin" @click="editExperience(exp)" class="btn edit-btn">
              <span class="btn-icon">✏️</span> Edit
            </button>
            <button v-if="isAdmin" @click="deleteExperience(exp.id)" class="btn delete-btn">
              <span class="btn-icon">🗑️</span> Delete
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- No Experiences Message -->
    <div v-if="experiences.length === 0 && !showForm" class="no-experiences">
      <p>No experiences found. Add your first experience!</p>
    </div>

    <!-- Experience Details Modal -->
    <div v-if="selectedExperience" class="modal-overlay">
      <div class="modal">
        <h3 class="modal-title">{{ selectedExperience.name }}</h3>
        <div class="modal-content">
          <p><strong>Category:</strong> {{ selectedExperience.category }}</p>
          <p><strong>Description:</strong> {{ selectedExperience.description }}</p>
          <p><strong>Type:</strong> {{ selectedExperience.type }}</p>
          <p><strong>Clifton Strength:</strong> {{ selectedExperience.cliftonStrength }}</p>
          <p><strong>Major:</strong> {{ selectedExperience.major }}</p>
          <p><strong>Semester:</strong> {{ selectedExperience.semester }}</p>
          <p><strong>Reflection Required:</strong> {{ selectedExperience.reflectionRequired ? "Yes" : "No" }}</p>
          <p><strong>Points:</strong> {{ selectedExperience.points }}</p>
        
          <p><strong>Status:</strong> {{ selectedExperience.status }}</p>
          <p><strong>Completion Date:</strong> {{ selectedExperience.completionDate || "N/A" }}</p>
          <p v-if="selectedExperience.approvedBy"><strong>Approved By:</strong> {{ selectedExperience.approvedBy }}</p>
        </div>
        <div class="modal-actions">
          <div v-if="isAdmin" class="admin-actions">
            <button v-if="selectedExperience.status === 'Pending'" @click="approveExperience(selectedExperience)" class="btn approve-btn">Approve</button>
            <button v-if="selectedExperience.status === 'Pending'" @click="rejectExperience(selectedExperience)" class="btn reject-btn">Reject</button>
          </div>
          <button @click="selectedExperience = null" class="btn close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import experienceServices from "../services/experienceServices";
import Utils from '../config/utils';

export default {
  data() {
    return {
      experiences: [],
      experience: {
        id: null,
        name: "",
        category: "",
        description: "",
        type: "",
        cliftonStrength: "",
        major: "",
        semester:"",
        reflectionRequired: false,
        points: 0,
        status: "Incomplete",
        approvedBy: "",
        completionDate: null,
      },
      editing: false,
      selectedExperience: null,
      showForm: false,
      isAdmin: false,
      fields: [
        { name: "name", label: "Experience Name", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "type", label: "Type", type: "text" },
        { name: "cliftonStrength", label: "Clifton Strength", type: "text" },
        { name: "major", label: "Major", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "reflectionRequired", label: "Reflection Required", type: "checkbox" },
        { name: "points", label: "Points", type: "number" },
        { name: "badge", label: "Badge", type: "text" },
      ],
      loading: false,
      error: null,
      searchQuery: '',
    };
  },

  async mounted() {
    this.fetchExperiences();
    this.isAdmin = this.checkAdmin();
  },

  async created() {
    await this.fetchStudentId();
    await this.fetchExperiences();
  },

  computed: {
    filteredExperiences() {
      if (!this.searchQuery) return this.experiences;
      const query = this.searchQuery.toLowerCase();
      return this.experiences.filter(exp => 
        exp.name.toLowerCase().includes(query) ||
        exp.major.toLowerCase().includes(query) ||
        exp.status.toLowerCase().includes(query)
      );
    }
  },

  methods: {
    async fetchStudentId() {
      try {
        const storedUser = Utils.getStore("user");
        this.studentId = storedUser?.id;
        this.studentName = `${storedUser?.fName || ''} ${storedUser?.lName || ''}`.trim();
      } catch (error) {
        console.error("Error fetching student from local storage:", error);
        this.studentId = null;
        this.studentName = "Unknown Student";
      }
    },

    async fetchExperiences() {
      this.loading = true;
      this.error = null;
      try {
        const response = await experienceServices.getExperiences();
        if (Array.isArray(response)) {
          this.experiences = response;
        } else if (response && typeof response === 'object') {
          this.experiences = [response];
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
        this.error = "Failed to load experiences. Please try again.";
        this.experiences = [];
      } finally {
        this.loading = false;
      }
    },
    
    checkAdmin() {
        const user = JSON.parse(localStorage.getItem("user")); 
        return user && user.role === "admin";
    },

    async addExperience() {
      try {
        const response = await experienceServices.createExperience(this.experience);
        this.experiences.push(response.data);
        this.resetForm();
      } catch (error) {
        console.error("Error adding experience:", error);
      }
    },

    viewExperience(exp) {
      this.selectedExperience = exp;
    },

    toggleForm() {
      this.showForm = !this.showForm;
      if (!this.showForm) this.resetForm();
    },

    resetForm() {
      this.experience = { id: null, name: "", category: "", description: "", type: "", cliftonStrength: "", major: "" };
      this.editing = false;
      this.showForm = false;
    },

    editExperience(exp) {
      this.experience = { ...exp };
      this.editing = true;
      this.showForm = true;
    },

    async updateExperience() {
      try {
        await experienceServices.updateExperience(this.experience.id, this.experience);
        this.fetchExperiences();
        this.resetForm();
      } catch (error) {
        console.error("Error updating experience:", error);
      }
    },

    async deleteExperience(id) {
      if (confirm("Are you sure you want to delete this experience?")) {
        try {
          await experienceServices.deleteExperience(id);
          this.experiences = this.experiences.filter(exp => exp.id !== id);
        } catch (error) {
          console.error("Error deleting experience:", error);
        }
      }
    },

    async markAsComplete(exp) {
      try {
        await experienceServices.markAsComplete(exp.id);
        this.fetchExperiences();
      } catch (error) {
        console.error("Error marking experience as complete:", error);
      }
    },

    async approveExperience(exp) {
      try {
        await experienceServices.approveExperience(exp.id, "Admin Name");
        this.fetchExperiences();
      } catch (error) {
        console.error("Error approving experience:", error);
      }
    },

    async rejectExperience(exp) {
      try {
        await experienceServices.rejectExperience(exp.id);
        this.fetchExperiences();
      } catch (error) {
        console.error("Error rejecting experience:", error);
      }
    }
  },
};
</script>

<style scoped>
/* Admin Dashboard specific styles */
.experiences-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  background-color: #f3f4f6;
}

.admin-view {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
}

.admin-view::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #4f46e5, #6366f1);
}

.admin-view .experience-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-view .experience-main-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-view .experience-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.admin-view .experience-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 6px;
  margin-top: 8px;
}

.admin-view .detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-size: 14px;
}

.admin-view .detail-item i {
  color: #6366f1;
  font-size: 16px;
}

.admin-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.admin-badge::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.admin-badge.status-pending {
  background-color: #fff7ed;
  color: #9a3412;
}

.admin-badge.status-pending::before {
  background-color: #f97316;
}

.admin-badge.status-approved {
  background-color: #f0fdf4;
  color: #166534;
}

.admin-badge.status-approved::before {
  background-color: #22c55e;
}

.admin-badge.status-rejected {
  background-color: #fef2f2;
  color: #991b1b;
}

.admin-badge.status-rejected::before {
  background-color: #ef4444;
}

.admin-badge.status-incomplete {
  background-color: #f3f4f6;
  color: #374151;
}

.admin-badge.status-incomplete::before {
  background-color: #9ca3af;
}

.admin-view .actions {
  padding: 16px;
  background-color: #f8fafc;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.admin-view .btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.admin-view .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-view .view-btn {
  background-color: #3b82f6;
  color: white;
}

.admin-view .edit-btn {
  background-color: #f59e0b;
  color: white;
}

.admin-view .delete-btn {
  background-color: #ef4444;
  color: white;
}

.admin-view .btn-icon {
  font-size: 16px;
}

/* Enhanced modal styles for admin */
.modal {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 95%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.modal-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.modal-content p {
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin: 0;
  transition: all 0.2s ease;
}

.modal-content p:hover {
  background-color: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.modal-content strong {
  color: #4f46e5;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
}

.admin-actions {
  display: flex;
  gap: 12px;
}

.admin-actions .btn {
  min-width: 120px;
  padding: 12px 24px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 14px;
}

.approve-btn {
  background-color: #22c55e;
  color: white;
}

.reject-btn {
  background-color: #ef4444;
  color: white;
}

.close-btn {
  background-color: #e5e7eb;
  color: #4b5563;
}

/* Page title for admin */
.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 32px;
  position: relative;
  padding-bottom: 16px;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(to right, #4f46e5, #6366f1);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr;
  }

  .admin-view .experience-details {
    grid-template-columns: 1fr;
  }

  .admin-view .actions {
    flex-wrap: wrap;
  }

  .admin-view .btn {
    flex: 1;
    justify-content: center;
  }

  .modal-actions {
    flex-direction: column;
    gap: 12px;
  }

  .admin-actions {
    flex-direction: column;
    width: 100%;
  }

  .admin-actions .btn {
    width: 100%;
  }
}

/* Add new styles */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 1rem 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #e74c3c;
}

.error-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
}

.retry-button:hover {
  background: #2980b9;
}

.empty-state {
  color: #7f8c8d;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.search-filter {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #3498db;
  outline: none;
}

.admin-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.admin-title {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.admin-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #3498db, #2980b9);
  border-radius: 3px;
}
</style>

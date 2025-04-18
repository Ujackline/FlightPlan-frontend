<template>
  <div class="admin-events-container">
    <h1>Experience Management</h1>

    <!-- Form -->
    <section v-if="showForm" class="event-list">
      <h3>{{ editing ? "Edit Experience" : "Add New Experience" }}</h3>
      <form @submit.prevent="editing ? updateExperience() : addExperience()">
        <div class="form-row">
          <div class="form-group form-group-half" v-for="field in fields" :key="field.name">
            <label :for="field.name">{{ field.label }}</label>
            <input v-if="field.type !== 'textarea' && field.type !== 'checkbox'" :type="field.type" :id="field.name" v-model="experience[field.name]" />
            <textarea v-else-if="field.type === 'textarea'" :id="field.name" v-model="experience[field.name]"></textarea>
            <div v-else-if="field.type === 'checkbox'" class="checkbox-container">
              <input type="checkbox" :id="field.name" v-model="experience[field.name]" />
              <label :for="field.name" class="checkbox-label">{{ field.label }}</label>
            </div>
          </div>
        </div>
        <div class="button-group">
          <button type="button" class="cancel-button" @click="resetForm">Cancel</button>
          <button type="submit" class="save-button">{{ editing ? "Update" : "Add" }} Experience</button>
        </div>
      </form>
    </section>

    <!-- Add Button -->
    <div class="list-header" v-if="!showForm">
      <h2>All Experiences</h2>
      <button v-if="isAdmin" @click="toggleForm" class="add-button">
        <span class="button-icon">+</span> Add New Experience
      </button>
    </div>

<!-- Experience Cards -->
<section v-if="experiences.length > 0" class="experience-list">
  <div v-for="exp in experiences" :key="exp.id" class="experience-item-row">
    <!-- Name -->
    <div class="experience-name">
      {{ exp.name }}
    </div>

    <!-- Status (only for students) -->
    <div v-if="!isAdmin" class="experience-status">
      <span class="status-label" :class="exp.status?.toLowerCase()">
        {{ exp.status }}
      </span>
    </div>

    <!-- Actions -->
    <div class="experience-actions">
      <button class="view-button" @click="viewExperience(exp)">View</button>
      <button
        v-if="!isAdmin && exp.status !== 'Approved'"
        class="mark-button"
        @click="markAsComplete(exp)"
      >
        Mark Complete
      </button>
      <button v-if="isAdmin" class="edit-button" @click="editExperience(exp)">Edit</button>
      <button v-if="isAdmin" class="delete-button" @click="openDeleteModal(exp)">Delete</button>
    </div>
  </div>
</section>



<!-- Delete Modal -->
<div v-if="confirmDeleteModal" class="modal-overlay">
  <div class="modal delete-modal">
    <h3>Confirm Delete</h3>
    <p>Are you sure you want to delete the experience "<strong>{{ experienceToDelete?.name }}</strong>"?</p>
    <div class="warning-text">This action cannot be undone.</div>
    <div class="button-group">
      <button class="cancel-button" @click="confirmDeleteModal = false">Cancel</button>
      <button class="delete-button" @click="confirmDelete">Delete Experience</button>
    </div>
  </div>
</div>


<!-- ✅ Moved outside all modals -->
<div v-if="confirmDeleteModal" class="modal-overlay">
  <div class="modal delete-modal">
    <h3>Confirm Delete</h3>
    <p>Are you sure you want to delete the experience "<strong>{{ experienceToDelete?.name }}</strong>"?</p>
    <div class="warning-text">This action cannot be undone.</div>
    <div class="button-group">
      <button class="cancel-button" @click="confirmDeleteModal = false">Cancel</button>
      <button class="delete-button" @click="confirmDelete">Delete Experience</button>
    </div>
  </div>
</div>

    <!-- No Experiences -->
    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <p>You have no experiences yet. Click the button above to add one.</p>
    </div>

    <!-- Modal -->
    <div v-if="selectedExperience" class="modal-overlay">
      <div class="modal">
        <h3>{{ selectedExperience.name }}</h3>
        <p><strong>Category:</strong> {{ selectedExperience.category }}</p>
        <p><strong>Description:</strong> {{ selectedExperience.description }}</p>
        <p><strong>Type:</strong> {{ selectedExperience.type }}</p>
        <p><strong>Clifton Strength:</strong> {{ selectedExperience.cliftonStrength }}</p>
        <p><strong>Major:</strong> {{ selectedExperience.major }}</p>
        <p><strong>Semester:</strong> {{ selectedExperience.semester }}</p>
        <p><strong>Reflection Required:</strong> {{ selectedExperience.reflectionRequired ? "Yes" : "No" }}</p>
        <p><strong>Points:</strong> {{ selectedExperience.points }}</p>
        <p><strong>Status:</strong> <span :class="['status-label', selectedExperience.status?.toLowerCase()]">
          {{ selectedExperience.status }}</span></p>
        <p><strong>Completion Date:</strong> {{ selectedExperience.completionDate || "N/A" }}</p>
        <p v-if="selectedExperience.approvedBy"><strong>Approved By:</strong> {{ selectedExperience.approvedBy }}</p>
        <div v-if="isAdmin">
          <button v-if="selectedExperience.status === 'Pending'" class="attendance-button" @click="approveExperience(selectedExperience)">Approve</button>
          <button v-if="selectedExperience.status === 'Pending'" class="delete-button" @click="rejectExperience(selectedExperience)">Reject</button>
        </div>
        <button class="close-button" @click="selectedExperience = null">Close</button>




<!-- Delete Confirmation Modal -->
<div v-if="confirmDeleteModal" class="modal-overlay">
  <div class="modal delete-modal">
    <h3>Confirm Delete</h3>
    <p>Are you sure you want to delete the experience "<strong>{{ experienceToDelete?.name }}</strong>"?</p>
    <div class="warning-text">This action cannot be undone.</div>
    <div class="button-group">
      <button class="cancel-button" @click="confirmDeleteModal = false">Cancel</button>
      <button class="delete-button" @click="confirmDelete">Delete Experience</button>
    </div>
  </div>
</div>
</div>
</div>
</div>
</template>


<script>
import experienceServices from "../services/experienceServices";
import studentServices from "../services/studentServices";
//import { useRoute } from "vue-router";

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
       // badge: "",
        status: "Incomplete",
        approvedBy: "",
        completionDate: null,

       },
      editing: false,
      confirmDeleteModal: false,
      experienceToDelete: null,
      selectedExperience: null,
      showForm: false,
      isAdmin: false, // This should be dynamically set based on user role
   
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
        //{ name: "badge", label: "Badge", type: "text" },
      ],
    };
  },
  async mounted() {
    this.isAdmin = this.checkAdmin(); // Implement this function based on authentication
    await  this.fetchExperiences();
    
  },
  methods: {
    async fetchExperiences() {
  try {
    if (this.checkAdmin()) {
      // Admins: Get all experiences
      const all = await experienceServices.getExperiences();
      this.experiences = all.data || all;
      return;
    }

    // Students: Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const studentId = storedUser?.id;
    if (!studentId) {
      console.warn("No student ID found.");
      return;
    }

    //  Get student info (to fetch semester)
    const student = await studentServices.getStudentById(studentId);
    const semester = student.semester || student.grad_semester;
    if (!semester) {
      console.warn("Student record is missing semester info.");
      return;
    }

    //  Get all experiences for this semester
    const all = await experienceServices.getExperiencesBySemester(semester);
    const allExperiences = all.data || all;

    //  Get student-specific progress
    const studentData = await experienceServices.getMyExperiences(studentId);
    const studentExperiences = studentData || [];

    //  Merge student progress into experiences
    const merged = allExperiences.map(exp => {
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

    this.experiences = merged;

  } catch (error) {
    console.error("Error fetching experiences:", error);
    this.experiences = [];
  }
},


    
    openDeleteModal(exp) {
  this.experienceToDelete = exp;
  this.confirmDeleteModal = true;
},

async confirmDelete() {
  try {
    await experienceServices.deleteExperience(this.experienceToDelete.id);
    this.experiences = this.experiences.filter(exp => exp.id !== this.experienceToDelete.id);
  } catch (error) {
    console.error("Error deleting experience:", error);
  } finally {
    this.confirmDeleteModal = false;
    this.experienceToDelete = null;
  }
},


    checkAdmin() {
        // Assuming user role is stored in localStorage or Vuex
        const user = JSON.parse(localStorage.getItem("user")); 
        return user && user.role === "admin"; // Returns true if admin
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
        await experienceServices.approveExperience(exp.id, "Admin Name"); // Replace with actual admin name
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

.admin-events-container {
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

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.experience-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 12px 20px;
  transition: box-shadow 0.3s ease;
}

.experience-item:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.experience-left {
  display: flex;
  flex-direction: column;
}

.experience-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.experience-status {
  display: inline-block;
}

.status-label {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
}

/* Status-specific colors */
.approved {
  background-color: #d4edda;
  color: #155724;
}

.pending {
  background-color: #fff3cd;
  color: #856404;
}

.incomplete {
  background-color: #f8d7da;
  color: #721c24;
}

.rejected {
  background-color: #f5c6cb;
  color: #842029;
}

.experience-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.view-button,
.mark-button,
.edit-button,
.delete-button {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-button {
  background-color: #2196f3;
  color: white;
}

.view-button:hover {
  background-color: #1976d2;
}

.mark-button {
  background-color: #4caf50;
  color: white;
}

.mark-button:hover {
  background-color: #45a049;
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

.code-input-container {
  display: flex;
  gap: 10px;
}

.code-input-container input {
  flex-grow: 1;
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

.checkbox-container {
  margin-top: 10px;
  background-color: #f0f5f9;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.checkbox-container input {
  width: auto;
  margin-right: 8px;
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
/* Additional styles to complete the professional look */

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

.event-name {
  font-weight: 500;
  color: #48111c;
}

.attendance-code {
  background-color: #f4ecd0;
  padding: 6px 10px;
  border-radius: 4px;
  font-family: monospace;
  letter-spacing: 1px;
  color: #48111c;
  font-weight: bold;
  font-size: 14px;
  display: inline-block;
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

.code-display {
  background-color: #f4ecd0;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: monospace;
  letter-spacing: 1px;
  font-weight: bold;
  color: #48111c;
}

.checkbox-label {
  display: inline;
  margin-bottom: 0;
  font-weight: normal;
  /* Attendance modal specific styles */
.attendance-modal {
  max-width: 900px;
  width: 95%;
}

.attendance-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.stat-box {
  flex: 1;
  background-color: #f4ecd0;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #48111c;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #708e9a;
  font-weight: 500;
}

.filter-tools {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  padding: 10px 15px;
  border-radius: 6px;
  border: 2px solid #d5dfe7;
  width: 100%;
  font-size: 14px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.filter-button {
  background-color: #d5dfe7;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #333;
  transition: all 0.2s;
}

.filter-button.active {
  background-color: #708e9a;
  color: white;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 14px;
}

.attendance-table th {
  background-color: #d5dfe7;
  padding: 12px;
  text-align: left;
  font-weight: 600;
}

.attendance-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.attended-row {
  background-color: rgba(244, 236, 208, 0.2);
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.attended {
  background-color: #f4ecd0;
  color: #48111c;
}

.status-badge.pending {
  background-color: #d5dfe7;
  color: #708e9a;
}

.mark-button, .undo-button {
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.mark-button {
  background-color: #f68d76;
  color: white;
}

.undo-button {
  background-color: #708e9a;
  color: white;
}

.empty-registrations {
  padding: 30px;
  text-align: center;
  background-color: #f9f9fb;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px dashed #d5dfe7;
  color: #708e9a;
}

.export-section {
  margin-top: 15px;
  margin-bottom: 20px;
  text-align: right;
}

.export-button {
  background-color: #48111c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.close-button {
  background-color: #d5dfe7;
  color: #48111c;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

}
</style>
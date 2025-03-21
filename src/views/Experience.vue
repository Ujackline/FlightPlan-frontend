<template>
  <div class="experiences-page">
    <h2>Experiences & Tasks</h2>

    <!-- Experience Form -->
    <section v-if="showForm" class="form-section">
      <h3>{{ editing ? "Edit Experience" : "Add New Experience" }}</h3>
      <form @submit.prevent="editing ? updateExperience() : addExperience()">
        <div class="form-group" v-for="field in fields" :key="field.name">
          <label :for="field.name">{{ field.label }}:</label>
          <input v-if="field.type !== 'textarea' && field.type !== 'checkbox'" 
                 :type="field.type" 
                 :id="field.name" 
                 v-model="experience[field.name]" required />
          <textarea v-else-if="field.type === 'textarea'" 
                    :id="field.name" 
                    v-model="experience[field.name]" required></textarea>
          <input v-else-if="field.type === 'checkbox'" 
                 type="checkbox" 
                 :id="field.name" 
                 v-model="experience[field.name]" />
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="resetForm">Cancel</button>
          <button type="submit" class="save-btn">{{ editing ? "Update Experience" : "Add Experience" }}</button>
        </div>
      </form>
    </section>

    <!-- Add New Experience Button -->
    <div class="button-container">
      <button @click="toggleForm" class="add-btn">
        {{ showForm ? "Close Form" : "Add New Experience" }}
      </button>
    </div>

    <!-- Experience List -->
    <section v-if="experiences.length > 0" class="experience-list">
      <h3>Experiences</h3>
        <ul v-if="Array.isArray(experiences)">
          <li v-for="exp in experiences" :key="exp.id" class="experience-item">
                      <span>{{ exp.name }} ({{ exp.status }})</span>
          <div class="actions">
            <button @click="viewExperience(exp)" class="view-btn">View</button>
            <button v-if="exp.status !== 'Approved'" @click="markAsComplete(exp)" class="complete-btn">Mark Complete</button>
            <button @click="editExperience(exp)" class="edit-btn">Edit</button>
            <button @click="deleteExperience(exp.id)" class="delete-btn">Delete</button>
          </div>
        </li>
      </ul>
    </section>

    <!-- No Experiences Message -->
    <div v-if="experiences.length === 0" class="no-experiences">
      <p>You have no experiences yet. Add a new experience.</p>
    </div>

    <!-- Experience Details Modal -->
    <div v-if="selectedExperience" class="modal-overlay">
      <div class="modal">
        <h3>{{ selectedExperience.name }}</h3>
        <p><strong>Category:</strong> {{ selectedExperience.category }}</p>
        <p><strong>Description:</strong> {{ selectedExperience.description }}</p>
        <p><strong>Type:</strong> {{ selectedExperience.type }}</p>
        <p><strong>Clifton Strength:</strong> {{ selectedExperience.cliftonStrength }}</p>
        <p><strong>Major:</strong> {{ selectedExperience.major }}</p>
        <p><strong>Reflection Required:</strong> {{ selectedExperience.reflectionRequired ? "Yes" : "No" }}</p>
        <p><strong>Points:</strong> {{ selectedExperience.points }}</p>
        <p><strong>Badge:</strong> {{ selectedExperience.badge || "None" }}</p>
        <p><strong>Status:</strong> {{ selectedExperience.status }}</p>
        <p><strong>Completion Date:</strong> {{ selectedExperience.completionDate || "N/A" }}</p>
        <p v-if="selectedExperience.approvedBy"><strong>Approved By:</strong> {{ selectedExperience.approvedBy }}</p>
        <div v-if="isAdmin">
          <button v-if="selectedExperience.status === 'Pending'" @click="approveExperience(selectedExperience)" class="approve-btn">Approve</button>
          <button v-if="selectedExperience.status === 'Pending'" @click="rejectExperience(selectedExperience)" class="reject-btn">Reject</button>
        </div>
        <button @click="selectedExperience = null" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import experienceServices from "../services/experienceServices";

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
        reflectionRequired: false,
        points: 0,
        badge: "",
        status: "Incomplete",
        approvedBy: "",
        completionDate: null,
      },
      editing: false,
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
        { name: "reflectionRequired", label: "Reflection Required", type: "checkbox" },
        { name: "points", label: "Points", type: "number" },
        { name: "badge", label: "Badge", type: "text" },
      ],
    };
  },
  async mounted() {
    this.fetchExperiences();
    this.isAdmin = this.checkAdmin(); // Implement this function based on authentication
  },
  methods: {
    async fetchExperiences() {
      try {
        this.experiences = await experienceServices.getExperiences();
      } catch (error) {
        console.error("Error fetching experiences:", error);
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
.experiences-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: rgb(246, 244, 244);
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-section {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.save-btn {
  background: #3498db;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background: #aaa;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button-container {
  text-align: center;
  margin-bottom: 20px;
}

.add-btn {
  background: #27ae60;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.experience-list {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
}

.experience-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 15px;
  border-radius: 5px;
}


.actions {
  display: flex;
  gap: 10px; /* Adds space between buttons */
}


.view-btn  {
  color: #27ae60; /* Green for View */
}

.edit-btn  {
  color: #3498db; /* Blue for Edit */
}

.delete-btn  {
  color: #e74c3c; /* Red for Delete */
}

.icon-btn:hover {
  opacity: 0.7;
}



</style>

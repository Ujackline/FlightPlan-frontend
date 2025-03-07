<template>
  <div class="min-h-screen bg-black py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-white mb-6 text-center bg-red-900 p-4">Career Services</h1>

      <!-- Add New Experience Button -->
      <div class="text-center mb-6">
        <button @click="toggleForm" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow-md">
          {{ showForm ? "Close Form" : "Add New Experience" }}
        </button>
      </div>

      <!-- No Experiences Message -->
      <div v-if="experiences.length === 0" class="text-center text-white mb-6">
        <p class="text-xl">You have no experiences yet, add a new experience.</p>
      </div>

      <!-- Experience Form (Toggled on Button Click) -->
      <div v-if="showForm" class="bg-white p-6 rounded-lg shadow-md mb-6 max-w-2xl mx-auto">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
          {{ editing ? "Edit Experience" : "Add New Experience" }}
        </h2>
        <form @submit.prevent="editing ? updateExperience() : addExperience()" class="space-y-4">
          <div v-for="field in fields" :key="field.name" class="mb-4">
            <label class="block text-red-700 font-medium">{{ field.label }}</label>
            <input 
              v-if="field.type !== 'textarea'" 
              :type="field.type" 
              v-model="experience[field.name]" 
              class="w-full p-2 border rounded bg-gray-200" 
              required 
            />
            <textarea 
              v-else 
              v-model="experience[field.name]" 
              class="w-full p-2 border rounded bg-gray-200">
            </textarea>
          </div>
          <div class="flex justify-between">
            <button @click="resetForm" type="button" class="bg-gray-600 text-black px-6 py-2 rounded hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" class="bg-blue-600 text-black px-6 py-2 rounded hover:bg-blue-700 shadow-md">
              {{ editing ? "Update Experience" : "Add Experience" }}
            </button>
          </div>
        </form>
      </div>

      <!-- Experience List -->
      <div v-if="experiences.length > 0" class="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Experiences</h2>
        <ul class="space-y-4">
          <li v-for="exp in experiences" :key="exp.id" class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <span class="text-lg font-medium">{{ exp.name }}</span>
            <div class="space-x-2">
              <button @click="viewExperience(exp)" class="bg-green-600 text-black px-4 py-1 rounded hover:bg-green-700 shadow">View</button>
              <button @click="editExperience(exp)" class="bg-blue-600 text-black px-4 py-1 rounded hover:bg-blue-700 shadow">Edit</button>
              <button @click="deleteExperience(exp.id)" class="bg-red-600 text-black px-4 py-1 rounded hover:bg-red-700 shadow">Delete</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Experience Details Modal -->
      <div v-if="selectedExperience" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          <h2 class="text-2xl font-semibold mb-4">{{ selectedExperience.name }}</h2>
          <p><strong>Category:</strong> {{ selectedExperience.category }}</p>
          <p><strong>Description:</strong> {{ selectedExperience.description }}</p>
          <p><strong>Type:</strong> {{ selectedExperience.type }}</p>
          <p><strong>Clifton Strength:</strong> {{ selectedExperience.cliftonStrength }}</p>
          <p><strong>Major:</strong> {{ selectedExperience.major }}</p>
          <div class="flex justify-end mt-4">
            <button @click="selectedExperience = null" class="bg-gray-600 text-black px-4 py-2 rounded hover:bg-gray-700">Close</button>
          </div>
        </div>
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
      },
      editing: false,
      selectedExperience: null, // Stores the experience to be viewed
      showForm: false, // Controls form visibility
      fields: [
        { name: "name", label: "Name", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "type", label: "Type", type: "text" },
        { name: "cliftonStrength", label: "Clifton Strength", type: "text" },
        { name: "major", label: "Major", type: "text" },
      ],
    };
  },
  async mounted() {
    this.fetchExperiences();
  },
  methods: {
    async fetchExperiences() {
      try {
        this.experiences = await experienceServices.getExperiences();
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
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
    editExperience(exp) {
      this.experience = { ...exp };
      this.editing = true;
      this.showForm = true; // Show form when editing
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
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.3s;
}
</style>

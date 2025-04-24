<template>
  <div class="profile-wrapper">
    <div class="profile-card">
      <h2 class="text-3xl font-bold text-center text-blue-800 mb-6">Student Profile</h2>

      <!-- Profile Image Upload (click on image to upload) -->
      <div class="flex flex-col items-center mb-10">
        <label for="profile-upload" class="relative cursor-pointer">
          <div class="profile-img-wrapper">
            <img :src="student.profilePicture || '/default-profile.png'" alt="Profile" class="profile-img" />
            <div class="upload-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93..." />
              </svg>
            </div>
          </div>
          <input id="profile-upload" type="file" accept="image/*" @change="handleImageChange" class="hidden" />
        </label>
      </div>

      <!-- Form Start -->
      <form @submit.prevent="updateProfile">
        <!-- Two-Column: Personal & Academic -->
        <div class="info-columns-container">
          <!-- Left Column -->
          <div class="info-column">
            <h3 class="section-heading">Personal Information</h3>
            <div class="section-divider"></div>
            <div class="form-group">
              <label>First Name</label>
              <input v-model="user.fName" class="form-input" type="text" required />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input v-model="user.lName" class="form-input" type="text" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="user.email" class="form-input" disabled />
              <p class="text-xs text-gray-500 mt-1">Contact administration to update email</p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="info-column">
            <h3 class="section-heading">Academic Information</h3>
            <div class="section-divider"></div>
            <div class="form-group">
              <label>Student ID</label>
              <input v-model="student.studentID" class="form-input" type="text" required />
            </div>
            <div class="form-group">
              <label>Major</label>
              <select v-model="student.major" class="form-input" required>
                <option value="" disabled>Select your major</option>
                <option v-for="major in majors" :key="major" :value="major">{{ major }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="section-container">
          <h3 class="section-heading">Academic Timeline</h3>
          <div class="section-divider"></div>
          <div class="timeline-container">
            <div class="form-group">
              <label>Current Semester</label>
              <input v-model="student.semester" class="form-input" placeholder="e.g. Spring 2025" />
            </div>
            <div class="form-group">
              <label>Graduation Semester</label>
              <input v-model="student.grad_semester" class="form-input" placeholder="e.g. Fall 2026" />
            </div>
          </div>
        </div>

        <!-- Clifton Strengths -->
        <div class="section-container">
          <h3 class="section-heading">Personal Development</h3>
          <div class="section-divider"></div>
          <div class="form-group">
            <label>Clifton Strengths</label>
            <input v-model="student.cliftonstrengths" class="form-input" placeholder="e.g. Achiever, Learner..." />
            <p class="text-xs text-gray-500 mt-1">Enter your top 5 strengths, separated by commas</p>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-center mt-8">
          <button type="submit" class="save-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Save Profile
          </button>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="showSuccessMessage" class="success-message">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Profile updated successfully!
      </div>
    </div>
  </div>
</template>


<script>
import userServices from "../services/userServices";
import studentServices from "../services/studentServices";
import Utils from "../config/utils";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const user = ref({});
    const student = ref({});
    const loading = ref(true);
    const error = ref("");
    const showSuccessMessage = ref(false);

    const majors = [
      "Computer Science",
      "Business",
      "Engineering",
      "Art",
      "Marketing",
      "Natural Sciences",
      "English",
      "Education",
      "History",
      "Other"
    ];

    const fetchUserProfile = async () => {
      try {
        const storedUser = Utils.getStore("user");
        if (!storedUser?.id) throw new Error("No user ID found.");

        const userData = await userServices.getOne(storedUser.id);
        const studentData = await studentServices.getStudentById(storedUser.id);

        user.value = userData;
        student.value = studentData;
      } catch (err) {
        error.value = "Error loading profile: " + err.message;
      } finally {
        loading.value = false;
      }
    };

    const updateProfile = async () => {
      try {
        loading.value = true;
        const storedUser = Utils.getStore("user");
        if (!storedUser?.id) throw new Error("Missing user ID.");

        await userServices.update(storedUser.id, {
          fName: user.value.fName,
          lName: user.value.lName
        });

        await studentServices.update(storedUser.id, student.value);

        setTimeout(() => {
          loading.value = false;
          showSuccessMessage.value = true;
          
          // Hide the success message after 3 seconds
          setTimeout(() => {
            showSuccessMessage.value = false;
          }, 3000);
        }, 500);
      } catch (err) {
        console.error("Update error:", err);
        error.value = "Error updating profile: " + err.message;
        loading.value = false;
      }
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file && file.size < 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          student.value.profilePicture = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        error.value = "Image is too large. Please upload an image under 2MB.";
        setTimeout(() => {
          error.value = "";
        }, 3000);
      }
    };

    onMounted(fetchUserProfile);

    return {
      user,
      student,
      loading,
      error,
      updateProfile,
      handleImageChange,
      majors,
      showSuccessMessage
    };
  }
};
</script>

<style>





.profile-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  background-color: #f9fafb;
  min-height: 100vh;
}

.profile-card {
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
}

.profile-img-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: #f1f5f9;
  margin: 0 auto;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #3b82f6;
  border-radius: 50%;
  padding: 0.3rem;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

/* Two column layout for Personal & Academic Info */
.info-columns-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-column {
  width: 100%;
}

.section-container {
  margin-bottom: 2rem;
}

.section-heading {
  font-size: 1rem;
  font-weight: 600;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.section-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin-bottom: 1rem;
  width: 100%;
}

.timeline-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
}

.form-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.save-btn {
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn:hover {
  background-color: #2563eb;
}

.success-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #10b981;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  animation: fade-in 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .info-columns-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .timeline-container {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
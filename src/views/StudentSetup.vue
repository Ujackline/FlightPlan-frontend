<template>
  <div class="student-setup container">
    <h2>Complete Your Profile</h2>
    <form @submit.prevent="submitProfile">

      <div class="form-group">
        <label for="studentID">Student ID</label>
        <input 
          v-model="profile.studentID" 
          id="studentID" 
          required 
          placeholder="Enter your student ID"
        />
      </div>

      <div class="form-group">
        <label for="major">Major</label>
        <select v-model="profile.major" id="major" required>
          <option value="" disabled>Select your major</option>
          <option v-for="major in majors" :key="major" :value="major">
            {{ major }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="currentSemester">Current Semester</label>
        <input 
          v-model="profile.currentSemester" 
          id="currentSemester" 
          required 
          placeholder="e.g., Spring 2025"
        />
      </div>

      <div class="form-group">
        <label for="gradSemester">Graduation Semester</label>
        <input 
          v-model="profile.gradSemester" 
          id="gradSemester" 
          required 
          placeholder="e.g., Fall 2026"
        />
      </div>

      <div class="form-group">
        <label for="cliftonstrengths">Clifton Strengths</label>
        <input 
          v-model="profile.cliftonstrengths" 
          id="cliftonstrengths" 
          required 
          placeholder="e.g., Achiever, Learner, Strategic"
        />
        <div class="help-text">Enter your top Clifton Strengths, separated by commas</div>
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        <span v-if="loading">Saving...</span>
        <span v-else>Complete Profile</span>
      </button>
    </form>

    <div v-if="message" :class="messageClass">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import studentServices from '../services/studentServices';
import Utils from '../config/utils';

const router = useRouter();

const profile = ref({
  studentID: '',
  major: '',
  currentSemester: '',
  gradSemester: '',
  cliftonstrengths: ''
});

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

const loading = ref(false);
const message = ref('');
const messageClass = ref('success-msg');

const submitProfile = async () => {
  try {
    loading.value = true;
    message.value = '';

    if (!profile.value.currentSemester || !profile.value.gradSemester) {
      message.value = 'Both current and graduation semesters are required.';
      messageClass.value = 'error-msg';
      loading.value = false;
      return;
    }

    const user = Utils.getStore('user');

    const payload = {
  id: user.id,
  fName: user.fName,
  lName: user.lName,
  email: user.email,
  studentID: profile.value.studentID.trim(),
  major: profile.value.major.trim(),
  semester: profile.value.currentSemester.trim(),      // ✅ maps to backend "semester"
  grad_semester: profile.value.gradSemester.trim(),    // ✅ maps to backend "grad_semester"
  cliftonstrengths: profile.value.cliftonstrengths.trim()
};


    await studentServices.createStudentProfile(payload);

    message.value = '✅ Profile completed successfully! Redirecting...';
    messageClass.value = 'success-msg';

    setTimeout(() => {
      router.push('/student/StudentDashboard');
    }, 1500);
  } catch (err) {
    console.error("Error saving profile:", err);
    message.value = "Something went wrong while saving your profile.";
    messageClass.value = 'error-msg';
  } finally {
    loading.value = false;
  }
};
</script>






<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #8B2332;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  border-color: #8B2332;
  outline: none;
  box-shadow: 0 0 0 2px rgba(139, 35, 50, 0.2);
}

.help-text {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #666;
}

.submit-btn {
  background-color: #8B2332;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #741D29;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.success-msg {
  margin-top: 1rem;
  padding: 0.75rem;
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
}

.error-msg {
  margin-top: 1rem;
  padding: 0.75rem;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
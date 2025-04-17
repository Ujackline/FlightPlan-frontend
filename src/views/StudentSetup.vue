<template>
  <div class="student-setup container">
    <h2>Complete Your Profile</h2>
    <form @submit.prevent="submitProfile">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input 
          v-model="profile.fName" 
          id="firstName" 
          required 
          placeholder="Enter your first name"
        />
      </div>

      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input 
          v-model="profile.lName" 
          id="lastName" 
          required 
          placeholder="Enter your last name"
        />
      </div>

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
        <label for="email">Email</label>
        <input 
          v-model="profile.email" 
          id="email" 
          type="email"
          required 
          placeholder="Enter your student email"
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
        <select v-model="profile.currentSemesterId" id="currentSemester" required>
          <option value="" disabled>Select your current semester</option>
          <option v-for="semester in semesters" :key="semester.id" :value="semester.id">
            {{ semester.name }} ({{ semester.academic_year }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="gradSemester">Graduation Semester</label>
        <select v-model="profile.gradSemesterId" id="gradSemester" required>
          <option value="" disabled>Select your graduation semester</option>
          <option v-for="semester in graduationSemesters" :key="semester.id" :value="semester.id">
            {{ semester.name }} ({{ semester.academic_year }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="cliftonstrengths">Clifton Strengths</label>
        <input 
          v-model="profile.cliftonstrengths" 
          id="cliftonstrengths" 
          placeholder="e.g., Achiever, Learner, Strategic, Futuristic, Communication" 
          required 
        />
        <div class="help-text">Enter your top Clifton Strengths, separated by commas</div>
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        <span v-if="loading">
          <span class="spinner"></span> Saving...
        </span>
        <span v-else>Complete Profile</span>
      </button>
    </form>

    <div v-if="message" :class="messageClass">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import semesterServices from '../services/semesterServices';
import studentServices from '../services/studentServices';
import { useRouter } from "vue-router";

export default {
  name: 'StudentProfileSetup',
  setup() {
    const router = useRouter();
    
    // State
    const profile = ref({
      fName: '',
      lName: '',
      studentID: '',
      email: '',
      major: '',
      currentSemesterId: '',
      gradSemesterId: '',
      cliftonstrengths: '',
      points: 0
    });
    
    const semesters = ref([]);
    const message = ref('');
    const messageClass = ref('success-msg');
    const loading = ref(false);
    
    // List of majors
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
    
    // Computed properties
    const graduationSemesters = computed(() => {
      if (!profile.value.currentSemesterId || !semesters.value.length) {
        return semesters.value;
      }
      
      const currentIndex = semesters.value.findIndex(s => s.id === parseInt(profile.value.currentSemesterId));
      if (currentIndex === -1) return semesters.value;
      
      return semesters.value.slice(currentIndex + 1);
    });
    
    // Fetch semesters
    const fetchSemesters = async () => {
      loading.value = true;
      message.value = '';
      
      try {
        const response = await semesterServices.getAllSemesters();
        
        if (response.data && response.data.length > 0) {
          // Sort semesters by date
          semesters.value = response.data.sort((a, b) => {
            return new Date(a.start_date) - new Date(b.start_date);
          });
          
          // Set default to active semester if available
          const activeSemester = response.data.find(s => s.is_active);
          if (activeSemester) {
            profile.value.currentSemesterId = activeSemester.id;
          }
        } else {
          message.value = 'No semesters found. Please contact an administrator.';
          messageClass.value = 'error-msg';
        }
      } catch (error) {
        console.error('Error fetching semesters:', error);
        message.value = error.message || 'Failed to load semesters. Please try refreshing the page.';
        messageClass.value = 'error-msg';
      } finally {
        loading.value = false;
      }
    };

    // Submit profile
    const submitProfile = async () => {
  try {
    const profileData = {
      fName: profile.value.fName.trim(),
      lName: profile.value.lName.trim(),
      email: profile.value.email.trim(),
      studentID: profile.value.studentID.trim(),
      major: profile.value.major.trim(),
      currentSemesterId: parseInt(profile.value.currentSemesterId),
      gradSemesterId: parseInt(profile.value.gradSemesterId),
      cliftonstrengths: profile.value.cliftonstrengths.trim()
    };

    const response = await studentServices.createStudentProfile(profileData);

    // Handle both creation scenarios
    message.value = response.userAssociated 
      ? 'Profile created and associated with existing user!' 
      : 'Profile created successfully!';
    
    messageClass.value = 'success-msg';

    setTimeout(() => {
      router.push('/home');
    }, 1500);

  } catch (error) {
    console.error('Full error creating profile:', error);
    
    message.value = error.message || 'Failed to create profile. Please try again.';
    messageClass.value = 'error-msg';
  } finally {
    loading.value = false;
  }
};
    // Initialize
    onMounted(() => {
      fetchSemesters();
    });
    
    return {
      profile,
      semesters,
      message,
      messageClass,
      loading,
      majors,
      graduationSemesters,
      submitProfile
    };
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
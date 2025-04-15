<template>
  <div class="student-setup container">
    <h2>Complete Your Profile</h2>
    <form @submit.prevent="submitProfile">
      <div class="form-group">
        <label for="studentID">Student ID</label>
        <input v-model="profile.studentID" id="studentID" required />
      </div>

      <div class="form-group">
        <label for="major">Major</label>
        <input v-model="profile.major" id="major" required />
      </div>

      <div class="form-group">
        <label for="current_semester">Current Semester</label>
        <select v-model="profile.current_semester" id="current_semester" required>
          <option value="" disabled>Select a semester</option>
          <option v-for="semester in availableSemesters" :key="semester.value" :value="semester.value">
            {{ semester.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="grad_semester">Graduation Semester</label>
        <select v-model="profile.grad_semester" id="grad_semester" required>
          <option value="" disabled>Select graduation semester</option>
          <option v-for="semester in graduationSemesters" :key="semester.value" :value="semester.value">
            {{ semester.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="cliftonstrengths">Clifton Strengths</label>
        <input v-model="profile.cliftonstrengths" id="cliftonstrengths" placeholder="Comma-separated list" required />
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        <span v-if="loading">Saving...</span>
        <span v-else>Save Profile</span>
      </button>
    </form>

    <p v-if="message" class="success-msg">{{ message }}</p>
  </div>
</template>

<script>
import apiClient from '../services/services';
import Utils from '../config/utils';

export default {
  name: 'StudentProfileSetup',
  data() {
    return {
      profile: {
        studentID: '',
        major: '',
        current_semester: '',
        grad_semester: '',
        cliftonstrengths: '',
      },
      message: '',
      loading: false,
      availableSemesters: [],
      graduationSemesters: []
    };
  },
  mounted() {
    this.generateSemesterOptions();
    this.generateGraduationOptions();
  },
  methods: {
    generateSemesterOptions() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 0-11 (Jan-Dec)
      
      // Determine current semester based on month
      const isSpring = currentMonth >= 0 && currentMonth <= 4; // Jan-May
      const isFall = currentMonth >= 7; // Aug-Dec
      
      const semesters = [];
      
      // Start from current year and go 6 years into the future (4 years of college + some buffer)
      for (let year = currentYear; year <= currentYear + 6; year++) {
        // For current year, only add current and future semesters
        if (year === currentYear) {
          if (isSpring) {
            semesters.push({ value: `Spring${year}`, label: `Spring ${year}` });
          }
          if (currentMonth <= 6 || isFall) { // Include summer/fall if not past them
            semesters.push({ value: `Fall${year}`, label: `Fall ${year}` });
          }
        } 
        // For future years, add both semesters
        else {
          semesters.push({ value: `Spring${year}`, label: `Spring ${year}` });
          semesters.push({ value: `Fall${year}`, label: `Fall ${year}` });
        }
      }
      
      this.availableSemesters = semesters;
      
      // Set default value to current semester if not already set
      if (!this.profile.current_semester) {
        if (isSpring) {
          this.profile.current_semester = `Spring${currentYear}`;
        } else if (isFall) {
          this.profile.current_semester = `Fall${currentYear}`;
        }
      }
    },
    
    generateGraduationOptions() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      
      const semesters = [];
      
      // Allow graduation selection from current year to 6 years in the future
      for (let year = currentYear; year <= currentYear + 6; year++) {
        semesters.push({ value: `Spring${year}`, label: `Spring ${year}` });
        semesters.push({ value: `Fall${year}`, label: `Fall ${year}` });
      }
      
      this.graduationSemesters = semesters;
    },
    
    async submitProfile() {
      try {
        this.loading = true;
        const user = Utils.getStore('user');
        
        // Parse semester information for flight plan
        const currentSemester = this.profile.current_semester;
        const gradSemester = this.profile.grad_semester;
        
        // Create or retrieve the appropriate flight plan ID based on semester
        const flightPlanResponse = await apiClient.post('/flightplan/semester', {
          studentId: user.id,
          semester: currentSemester,
          gradSemester: gradSemester,
          major: this.profile.major
        });
        
        // Get the flight plan ID from response
        const flightPlanId = flightPlanResponse.data.id;
        
        // Now submit the student profile with the flight plan ID
        const response = await apiClient.post('/student', {
          id: user.id,
          fName: user.fName,
          lName: user.lName,
          email: user.email,
          flightPlanId: flightPlanId,
          current_semester: currentSemester,
          ...this.profile
        });

        // Store the flight plan ID in local storage for easy access
        Utils.setStore('currentFlightPlan', {
          id: flightPlanId,
          semester: currentSemester
        });

        this.message = '✅ Profile completed successfully! Redirecting...';
        setTimeout(() => {
          this.$router.push('/student/StudentDashboard');
        }, 2000);
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 2rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  font-weight: bold;
  display: block;
}
input, select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
select {
  height: 38px;
  background-color: #fff;
}
.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}
.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.success-msg {
  margin-top: 1rem;
  color: green;
  font-weight: bold;
}
</style>
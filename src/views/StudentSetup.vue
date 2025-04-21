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
        <label for="semester">Current Semester</label>
        <select v-model="profile.semester" id="semester" required>
          <option value="" disabled>Select your current semester</option>
          <option v-for="semester in semesterOptions" :key="semester" :value="semester">
            {{ semester }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="grad_semester">Graduation Semester</label>
        <select v-model="profile.grad_semester" id="grad_semester" required>
          <option value="" disabled>Select your graduation semester</option>
          <option v-for="semester in graduationOptions" :key="semester" :value="semester">
            {{ semester }}
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

      <button type="submit" class="submit-btn">Save Profile</button>
    </form>

    <div v-if="message" class="success-msg">
      {{ message }}
    </div>
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
        semester: '',
        grad_semester: '',
        cliftonstrengths: '',
      },
      majors: [
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
      ],
      message: '',
      semesterOptions: [
        "Fall 2025",
        "Spring 2026",
        "Summer 2026",
        "Fall 2026",
        "Spring 2027",
        "Summer 2027",
        "Fall 2027",
        "Spring 2028",
        "Summer 2028",
        "Fall 2028",
        "Spring 2029",
        "Summer 2029",
        "Fall 2029",
        "Spring 2030",
        "Summer 2030",
        "Fall 2030"
      ]
    };
  },
  computed: {
    graduationOptions() {
      if (!this.profile.semester) {
        return this.semesterOptions;
      }
      
      const currentIndex = this.semesterOptions.findIndex(s => s === this.profile.semester);
      if (currentIndex === -1) return this.semesterOptions;
      
      return this.semesterOptions.slice(currentIndex + 1);
    }
  },
  
  methods: {
    async submitProfile() {
      try {
        const user = Utils.getStore('user');
        const response = await apiClient.post('/student', {
          id: user.id,
          fName: user.fName,
          lName: user.lName,
          email: user.email,
          ...this.profile
        });

        this.message = 'Profile completed successfully! Redirecting...';
        
        // Create flight plan
        try {
          await apiClient.post('/flightplan', {
            name: `${user.fName}'s Flight Plan - ${this.profile.semester}`,
            semester: this.profile.semester,
            grad_semester: this.profile.grad_semester,
            studentId: response.data.id || user.id
          });
        } catch (flightPlanError) {
          console.error('Error creating flight plan:', flightPlanError);
          // Continue since profile was created successfully
        }
        
        setTimeout(() => {
          this.$router.push('/home');
        }, 2000);
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Something went wrong. Please try again.');
      }
    }
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

.submit-btn:hover {
  background-color: #741D29;
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
</style>
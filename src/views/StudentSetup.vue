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
          <label for="semester">Current Semester</label>
          <input v-model="profile.semester" id="semester" placeholder="e.g. Fall 2025" required />
        </div>

  
        <div class="form-group">
          <label for="grad_semester">Graduation Semester</label>
          <input v-model="profile.grad_semester" id="grad_semester" placeholder="e.g. Fall 2025" required />
        </div>
  
        <div class="form-group">
          <label for="cliftonstrengths">Clifton Strengths</label>
          <input v-model="profile.cliftonstrengths" id="cliftonstrengths" placeholder="Comma-separated list" required />
        </div>
  
        <button type="submit" class="submit-btn">Save Profile</button>
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
          grad_semester: '',
          semester:'',
          cliftonstrengths: '',
        },
        message: '',
      };
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
  
          this.message = '✅ Profile completed successfully! Redirecting...';
          setTimeout(() => {
            this.$router.push('/student/StudentDashboard');
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
  input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .submit-btn {
    background-color: #007bff;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .success-msg {
    margin-top: 1rem;
    color: green;
    font-weight: bold;
  }
  </style>
  
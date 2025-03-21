<template>
    <div class="profile-container">
      <h2>Profile</h2>
  
      <div v-if="loading">Loading user data...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label>First Name:</label>
            <input type="text" v-model="user.fName" required />
          </div>
  
          <div class="form-group">
            <label>Last Name:</label>
            <input type="text" v-model="user.lName" required />
          </div>
  
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="user.email" disabled />
          </div>
  
          <div class="form-group">
            <label>Role:</label>
            <input type="text" v-model="user.role" disabled />
          </div>
  
          <button type="submit" class="update-btn">Update Profile</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import userServices from "../services/userServices"; // Import user services
  import Utils from "../config/utils"; // Utility to get userId from storage
  import { ref, onMounted } from "vue";
  
  export default {
    setup() {
      const user = ref({});
      const loading = ref(true);
      const error = ref("");
  
      // Fetch user profile
      const fetchUserProfile = async () => {
        try {
          const storedUser = Utils.getStore("user"); // Get user from local storage
          if (!storedUser || !storedUser.userId) {
            throw new Error("No user ID found. Please log in.");
          }
  
          const userData = await userServices.getOne(storedUser.userId);
          user.value = userData;
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false;
        }
      };
  
      // Update user profile
      const updateProfile = async () => {
        try {
          const storedUser = Utils.getStore("user");
          if (!storedUser || !storedUser.userId) {
            throw new Error("No user ID found.");
          }
  
          await userServices.update(storedUser.userId, user.value);
          alert("Profile updated successfully!");
        } catch (err) {
          error.value = "Error updating profile.";
          console.error("Update error:", err);
        }
      };
  
      // Fetch user on page load
      onMounted(() => {
        fetchUserProfile();
      });
  
      return { user, loading, error, updateProfile };
    },
  };
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .update-btn {
    background: #3498db;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .update-btn:hover {
    background: #2980b9;
  }
  </style>
  
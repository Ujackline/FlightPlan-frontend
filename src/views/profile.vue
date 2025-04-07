<template>
  <div class="profile-wrapper">
    <div class="profile-card">
      <h2 class="text-3xl font-bold text-blue-800 mb-6 text-center">My Profile</h2>

      <div v-if="loading" class="text-center text-gray-500">Loading your profile...</div>
      <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div>
      <div v-else>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div class="form-group">
            <label for="fName">First Name</label>
            <input id="fName" type="text" v-model="user.fName" required />
          </div>

          <div class="form-group">
            <label for="lName">Last Name</label>
            <input id="lName" type="text" v-model="user.lName" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" v-model="user.email" disabled />
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <input id="role" type="text" v-model="user.role" disabled />
          </div>

          <button type="submit" class="update-btn w-full">Update Profile</button>
        </form>
      </div>
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
          if (!storedUser || !storedUser.id) {
            throw new Error("No user ID found. Please log in.");
          }
  
          const userData = await userServices.getOne(storedUser.id);
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
          if (!storedUser || !storedUser.id) {
            throw new Error("No user ID found.");
          }
  
          await userServices.update(storedUser.id, user.value);
          
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
  
  <style>
  .profile-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    background: linear-gradient(to bottom, #f0f4ff, #ffffff);
    padding: 2rem;
  }
  
  .profile-card {
    width: 100%;
    max-width: 500px;
    background-color: #fff;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.3s ease;
  }
  
  .profile-card:hover {
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-weight: 600;
    margin-bottom: 6px;
    color: #333;
  }
  
  input {
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    transition: border-color 0.3s;
    font-size: 1rem;
  }
  
  input:focus {
    outline: none;
    border-color: #560608;
    box-shadow: 0 0 0 2px rgba(51, 2, 2, 0.2);
  }
  
  .update-btn {
    background: #3498db;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    transition: background 0.3s;
  }
  
  .update-btn:hover {
    background: #2c80b4;
  }
  
  </style>
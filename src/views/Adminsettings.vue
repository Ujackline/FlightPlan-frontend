<template>
    <div class="settings-page">
      <h2>Admin Settings</h2>
  
      <!-- Profile Section -->
      <section class="settings-section">
        <h3>Profile Settings</h3>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="fName">First Name:</label>
            <input type="text" id="fName" v-model="admin.fName" required />
          </div>
          <div class="form-group">
            <label for="lName">Last Name:</label>
            <input type="text" id="lName" v-model="admin.lName" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="admin.email" required />
          </div>
          <button type="submit" class="save-btn">Save Changes</button>
        </form>
      </section>
  
      <!-- Notifications Section -->
      <section class="settings-section">
        <h3>Notification Preferences</h3>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="settings.emailNotifications" />
            Receive Email Notifications
          </label>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="settings.pushNotifications" />
            Receive Push Notifications
          </label>
        </div>
        <button @click="updateSettings" class="save-btn">Update Preferences</button>
      </section>  
    </div>
  </template>
  
  <script>
  import adminServices from "../services/adminServices";
  
  export default {
    data() {
      return {
        admin: {
          fName: "",
          lName: "",
          email: ""
        },
        settings: {
          emailNotifications: false,
          pushNotifications: false
        },
        passwordForm: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }
      };
    },
    mounted() {
      this.fetchAdminInfo();
    },
    methods: {
      async fetchAdminInfo() {
        try {
          const response = await adminServices.getAdminInfo();
          this.admin = response.data;
        } catch (error) {
          console.error("Error fetching admin info:", error);
        }
      },
      async updateProfile() {
        try {
          await adminServices.updateSettings({ profile: this.admin });
          alert("Profile updated successfully!");
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      },
    }
  };
  </script>
  
  <style scoped>
  .settings-page {
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  }
  
  .settings-section {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #f9f9f9;
  }
  
  .form-group {
    margin-bottom: 10px;
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
  
  .save-btn {
    background: #3498db;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .save-btn:hover {
    background: #2980b9;
  }
  </style>
  
<template>
    <div class="manage-users-page">
      <h2>Manage Users</h2>
  
      <!-- Search Bar -->
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search users..." />
      </div>
  
      <!-- User List -->
      <section class="user-list">
        <h3>User Accounts</h3>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.fName }}</td>
                  <td>{{ user.lName }}</td>
                  <td>{{ user.email }}</td>
              <td>
                <select v-model="user.role" @change="updateUserRole(user)">
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="student_worker">Student Worker</option>
                </select>
              </td>
              <td class="actions">
                <button @click="deleteUser(user.id)" class="icon-btn delete-btn">
                  <i class="fas fa-trash-alt"></i> Delete
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </section>
  
      <!-- Add New User (Optional) -->
      <section class="add-user-section">
        <h3>Add New User</h3>
        <form @submit.prevent="addUser">
          <div class="form-group">
            <label>First Name:</label>
            <input type="text" v-model="newUser.fName"  required />
            <label>Last Name:</label>
            <input type="text" v-model="newUser.lName"  required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="newUser.email" required />
          </div>
          <div class="form-group">
            <label>Role:</label>
            <select v-model="newUser.role">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="student_worker">Student Worker</option>
            </select>
          </div>
          <button type="submit" class="save-btn">Add User</button>
        </form>
      </section>
    </div>
  </template>
  
  <script>
  import adminServices from "../services/adminServices";
  export default {
    data() {
      return {
        users: [],
        searchQuery: "",
        newUser: { fName: "",lName:"", email: "", role: "Admin" },
      };
    },
    computed: {
      filteredUsers() {
  if (!Array.isArray(this.users)) return [];

        return this.users.filter(user =>
          user.fName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

    },
    async mounted() {
      this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        try {
          const users = await adminServices.getUsers(); // calls /user now
          this.users = Array.isArray(users) ? users : [users]; //  make sure it’s always an array
          console.log(this.users);
          //    console.log("Fetched Users:", response.data); // Check what data is coming

        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
      async updateUserRole(user) {
        try {
          await adminServices.updateUserRole(user.id, user.role);
          alert("User role updated successfully!");
        } catch (error) {
          console.error("Error updating user role:", error);
        }
      },
      async deleteUser(userId) {
        if (confirm("Are you sure you want to delete this user?")) {
          try {
            await adminServices.deleteUser(userId);
            this.users = this.users.filter(user => user.id !== userId);
          } catch (error) {
            console.error("Error deleting user:", error);
          }
        }
      },
      async addUser() {
        try {
          const response = await adminServices.addUser(this.newUser);
          this.users.push(response.data);
          this.newUser = { fName: "", lName: "", email: "", role: "student" };
        } catch (error) {
          console.error("Error adding user:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .manage-users-page {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  }
  
  .search-bar {
    margin-bottom: 20px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .user-list table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  .user-list th, .user-list td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
  
  .icon-btn {
  background-color: #ffdddd;
  border: 1px solid #ccc;
  padding: 6px;
  margin: 4px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  color: red;
}
  
  .add-user-section {
    margin-top: 30px;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  input, select {
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
  </style>
  
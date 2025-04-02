<template>
  <div class="points-redeemer">
    <h1>Points Redeemer</h1>

    <!-- Search Bar -->
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search Student by Name or Email" />
    </div>

    <!-- Display Filtered Users -->
    <section class="user-list">
      <h3>Student Accounts</h3>
      <table>
        <thead>
          <tr>
            <th>Student Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Points</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.studentID }}</td>
            <td>{{ user.fName }} {{ user.lName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.studentPointsAvailable }}</td>
            <td>
              <button @click="selectUser(user)" class="select-btn">Select</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Display Selected Student Info -->
    <div v-if="selectedUser" class="selected-student">
      <h2>Selected Student</h2>
      <p><strong>ID:</strong> {{ selectedUser.studentID }}</p>
      <p><strong>Name:</strong> {{ selectedUser.fName }} {{ selectedUser.lName }}</p>
      <p><strong>Available Points:</strong> {{ selectedUser.studentPointsAvailable }}</p>

      <!-- Deduct Points for Reward -->
      <div class="form-group">
        <label>Reward Name:</label>
        <input v-model="rewardName" placeholder="Enter Reward Name" required />

        <label>Points to Deduct:</label>
        <input v-model.number="pointsToDeduct" type="number" min="1" required />

        <button @click="redeemPoints" :disabled="loading || !canRedeem">
          {{ loading ? "Processing..." : "Redeem" }}
        </button>
      </div>
    </div>

    <!-- Display Messages -->
    <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">{{ message }}</p>
  </div>
</template>

<script>
import userServices from "../services/userServices";
import adminServices from "../services/adminServices";
import axios from "axios";
import studentServices from "../services/studentServices";

export default {
  data() {
    return {
      users: [], // All students with points
      searchQuery: "",
      selectedUser: null,
      rewardName: "",
      pointsToDeduct: null,
      message: "",
      isSuccess: false,
      loading: false, // Disable button when processing
    };
  },
  computed: {
    // Filter users based on search query (by name or email)
    async fetchUsers() {
  try {
    console.log("Fetching students...");
    const response = await studentServices.getStudents();
    console.log("Raw API response:", response);


      this.users = response;

    console.log("Parsed Students:", this.users);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    this.message = "Failed to fetch student accounts.";
    this.isSuccess = false;
  }
},

    // Prevent redeeming if points are insufficient
    canRedeem() {
      return (
        this.selectedUser &&
        this.pointsToDeduct > 0 &&
        this.pointsToDeduct <= this.selectedUser.studentPointsAvailable
      );
    },
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
  try {
    console.log("Fetching students...");
    const response = await adminServices.fetchStudents(); // 👈 Use this instead
    this.users = response.data;
    console.log("Fetched Students:", this.users);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    this.message = "Failed to fetch student accounts.";
    this.isSuccess = false;
  }
},

    selectUser(user) {
      if (!user) {
        this.message = "Invalid student selection.";
        this.isSuccess = false;
        return;
      }
      this.selectedUser = user;
      this.message = "";
    },

    async redeemPoints() {
      if (!this.canRedeem) {
        this.message = "Invalid points amount or insufficient balance.";
        this.isSuccess = false;
        return;
      }

      this.loading = true;

      try {
        const response = await axios.post("/api/student/redeem", {
          studentId: this.selectedUser.id,
          pointsToDeduct: this.pointsToDeduct,
          rewardName: this.rewardName,
        });

        // Update local points balance
        this.selectedUser.studentPointsAvailable -= this.pointsToDeduct;

        this.message = response.data.message || "Points redeemed successfully!";
        this.isSuccess = true;
      } catch (error) {
        this.message = error.response?.data?.error || "Error processing request.";
        this.isSuccess = false;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.points-redeemer {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
}

.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
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

.select-btn {
  background: #3498db;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.selected-student {
  background: #f9f9f9;
  padding: 15px;
  margin-top: 20px;
  border-radius: 5px;
}

.form-group {
  margin-top: 10px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>

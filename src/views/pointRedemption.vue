<template>
  <div class="points-redeemer">
    <h1>Points Redeemer</h1>

    <!-- Debug Information -->
    <div v-if="showDebug" class="debug-info">
      <h3>Debug Information</h3>
      <button @click="toggleDebugInfo">Toggle Debug Info</button>
      <button @click="attemptDirectFetch">Try Direct Fetch</button>
      <button @click="showSampleAwards">Show Sample Awards</button>
      <pre v-if="debugInfo">{{ debugInfo }}</pre>
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search Student by Name or Email" />
    </div>

    <!-- User List Section with Loading and Error States -->
    <section class="user-list">
      <h3>Student Accounts</h3>
      
      <!-- Loading State -->
      <div v-if="loadingUsers" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading student accounts...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="userError" class="error-state">
        <p class="error-message">{{ userError }}</p>
        <p class="fallback-message">Showing sample student data</p>
      </div>

      <!-- User Table -->
      <table v-else>
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
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.studentID }}</td>
            <td>{{ user.fName }} {{ user.lName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.points }}</td>
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
      <p><strong>Available Points:</strong> {{ selectedUser.points }}</p>

      <!-- Available Awards -->
      <div class="awards-section">
        <h3>Available Awards</h3>
        <div class="awards-grid">
          <div v-for="award in awards" :key="award.AwardID" class="award-card" @click="selectAward(award)">
            <img :src="award.description" :alt="award.name" class="award-image" />
            <div class="award-details">
              <h4>{{ award.name }}</h4>
              <p>{{ award.points }} points</p>
              <button 
                @click.stop="redeemAward(award)" 
                :disabled="parseInt(award.points) > parseInt(selectedUser.points) || loading"
                class="redeem-btn"
              >
                {{ loading && selectedAward?.AwardID === award.AwardID ? "Processing..." : "Redeem" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Display Fallback Sample Awards if API fails -->
    <div v-if="usingSampleAwards && selectedUser" class="selected-student">
      <h3>Sample Awards (API Fallback)</h3>
      <div class="awards-grid">
        <div v-for="award in sampleAwards" :key="award.AwardID" class="award-card" @click="selectAward(award)">
          <img :src="award.description" :alt="award.name" class="award-image" />
          <div class="award-details">
            <h4>{{ award.name }}</h4>
            <p>{{ award.points }} points</p>
            <button 
              @click.stop="redeemAward(award)" 
              :disabled="parseInt(award.points) > parseInt(selectedUser.points) || loading"
              class="redeem-btn"
            >
              {{ loading && selectedAward?.AwardID === award.AwardID ? "Processing..." : "Redeem" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Display Messages -->
    <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">{{ message }}</p>
  </div>
</template>

<script>
import studentServices from "../services/studentServices";
import awardServices from "../services/awardServices";
import Utils from "../config/utils.js";
import axios from 'axios';
import apiClient from "../config/apiClient.js";

export default {
  data() {
    return {
      users: [],
      awards: [],
      searchQuery: "",
      selectedUser: null,
      selectedAward: null,
      message: "",
      isSuccess: false,
      loading: false,
      showDebug: false,
      debugInfo: null,
      usingSampleAwards: false,
      loadingUsers: false,
      userError: null,
      sampleUsers: [
        {
          id: 1,
          studentID: "12345",
          fName: "John",
          lName: "Doe",
          email: "john.doe@example.com",
          points: "100"
        },
        {
          id: 2,
          studentID: "67890",
          fName: "Jane",
          lName: "Smith",
          email: "jane.smith@example.com",
          points: "150"
        }
      ],
      sampleAwards: [
        {
          AwardID: 1,
          name: "Free Coffee",
          description: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1937&auto=format&fit=crop",
          points: 50,
          redemption_type: "food"
        },
        {
          AwardID: 2,
          name: "Parking Pass",
          description: "https://images.unsplash.com/photo-1590674899484-8a8ae973a5b2?q=80&w=2070&auto=format&fit=crop",
          points: 100,
          redemption_type: "service"
        },
        {
          AwardID: 3,
          name: "$10 Bookstore Credit",
          description: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop",
          points: 75,
          redemption_type: "merchandise"
        }
      ]
    };
  },
  computed: {
    filteredUsers() {
      const users = this.users.length > 0 ? this.users : this.sampleUsers;
      if (!this.searchQuery) return users;
      
      const query = this.searchQuery.toLowerCase();
      return users.filter(user => 
        user.fName.toLowerCase().includes(query) || 
        user.lName.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
  },
  async mounted() {
    // Check if user is logged in
    const user = Utils.getStore('user');
    if (!user || !user.token) {
      this.message = "Please log in to access this page.";
      this.isSuccess = false;
      return;
    }
    
    await this.fetchUsers();
    await this.fetchAwards();
    
    // If no awards were fetched from API, show sample awards
    if (this.awards.length === 0) {
      this.usingSampleAwards = true;
      this.awards = this.sampleAwards;
    }
  },
  methods: {
    async fetchUsers() {
      this.loadingUsers = true;
      this.userError = null;
      this.message = "";
      
      try {
        // Log API configuration
        if (this.showDebug) {
          const user = Utils.getStore('user');
          console.log("🔧 API Configuration:", {
            baseUrl: apiClient.defaults.baseURL,
            hasToken: !!user?.token,
            tokenExpiry: user?.tokenExpiry
          });
        }

        const response = await studentServices.getStudents();
        console.log("🔍 Raw student response:", response);
        
        if (response && (Array.isArray(response) || response.data)) {
          this.users = Array.isArray(response) ? response : response.data;
          console.log(`✅ Successfully fetched ${this.users.length} students`);
          this.message = "";
          this.isSuccess = true;
        } else {
          throw new Error("Unexpected student data format");
        }
      } catch (error) {
        console.error("❌ Error fetching students:", error);
        
        // Enhanced error handling with specific user messages
        if (error.message.includes("Session expired")) {
          this.userError = "Your session has expired. Please log in again.";
          // Optionally redirect to login
          // this.$router.push('/login');
        } else if (error.message.includes("Access denied")) {
          this.userError = "You don't have permission to view student data.";
        } else if (error.message.includes("service may be down")) {
          this.userError = "The student service is currently unavailable. Using sample data instead.";
        } else if (error.message.includes("check your connection")) {
          this.userError = "Unable to connect to the server. Please check your internet connection.";
        } else {
          this.userError = "Unable to load student data. Using sample data instead.";
        }

        this.message = "Using sample student data temporarily";
        this.isSuccess = true; // Still show success since we have fallback
        this.users = []; // Clear users to trigger fallback to sample data
        
        // Enhanced debug information
        if (this.showDebug) {
          const user = Utils.getStore('user');
          this.debugInfo = JSON.stringify({
            error: {
              message: error.message,
              type: error.name,
              stack: error.stack
            },
            apiConfig: {
              baseUrl: apiClient.defaults.baseURL,
              hasToken: !!user?.token,
              tokenExpiry: user?.tokenExpiry
            },
            response: error.response ? {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data
            } : "No response",
            timestamp: new Date().toISOString()
          }, null, 2);
        }
      } finally {
        this.loadingUsers = false;
      }
    },

    async fetchAwards() {
      try {
        console.log("Attempting to fetch awards...");
        console.log("API base URL being used:", import.meta.env.DEV ? "http://localhost:3029/flight-plan-t9" : "/flight-plan-t9/");
        
        const response = await awardServices.getAwards();
        console.log("Raw award response:", response);
        
        if (Array.isArray(response)) {
          this.awards = response;
          console.log("Fetched Awards:", this.awards);
          this.message = "";
        } else if (response && typeof response === 'object') {
          // Handle case where API returns an object with data property
          if (Array.isArray(response.data)) {
            this.awards = response.data;
            console.log("Fetched Awards from data property:", this.awards);
            this.message = "";
          } else {
            console.error("❌ Unexpected award data format:", response);
            this.message = "Failed to fetch awards: Unexpected data format.";
            this.isSuccess = false;
            this.awards = [];
          }
        } else {
          console.error("❌ Unexpected award response format:", response);
          this.message = "Failed to fetch awards: Unexpected response format.";
          this.isSuccess = false;
          this.awards = [];
        }
      } catch (error) {
        console.error("❌ Error fetching awards:", error);
        this.message = "Failed to fetch awards. Please make sure you're logged in.";
        this.isSuccess = false;
        this.awards = [];
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

    selectAward(award) {
      this.selectedAward = award;
    },

    async redeemAward(award) {
      if (!this.selectedUser || !award) {
        this.message = "Please select a student and an award.";
        this.isSuccess = false;
        return;
      }

      if (parseInt(award.points) > parseInt(this.selectedUser.points)) {
        this.message = "Insufficient points to redeem this award.";
        this.isSuccess = false;
        return;
      }

      this.loading = true;
      this.selectedAward = award;

      try {
        const response = await awardServices.redeemAward(
          this.selectedUser.id,
          award.AwardID,
          award.points
        );

        // Update the user's points locally
        this.selectedUser.points = (parseInt(this.selectedUser.points) - parseInt(award.points)).toString();

        // Remove the award from the list if successfully redeemed
        if (response && response.success) {
          this.awards = this.awards.filter(a => a.AwardID !== award.AwardID);
        }

        this.message = response.message || "Award redeemed successfully!";
        this.isSuccess = true;
      } catch (error) {
        this.message = error.response?.data?.error || "Error processing redemption.";
        this.isSuccess = false;
      } finally {
        this.loading = false;
      }
    },

    toggleDebugInfo() {
      this.showDebug = !this.showDebug;
      if (this.showDebug) {
        const user = Utils.getStore('user');
        const apiConfig = {
          baseUrl: apiClient.defaults.baseURL,
          hasToken: !!user?.token,
          tokenExpiry: user?.tokenExpiry,
          environment: import.meta.env.MODE,
          apiEndpoint: `${apiClient.defaults.baseURL}/student`
        };
        
        this.debugInfo = JSON.stringify({
          system: {
            timestamp: new Date().toISOString(),
            environment: import.meta.env.MODE,
            buildVersion: import.meta.env.VITE_APP_VERSION || 'unknown'
          },
          auth: {
            isLoggedIn: !!user,
            hasToken: user && !!user.token,
            tokenPrefix: user && user.token ? user.token.substring(0, 10) + '...' : null,
            tokenExpiry: user?.tokenExpiry
          },
          api: apiConfig,
          state: {
            usersLoaded: this.users.length > 0,
            usingFallback: this.users.length === 0,
            awardsLoaded: this.awards.length > 0,
            usingSampleAwards: this.usingSampleAwards
          }
        }, null, 2);
      } else {
        this.debugInfo = null;
      }
    },
    
    async attemptDirectFetch() {
      try {
        this.debugInfo = "Attempting direct fetch...";
        const user = Utils.getStore('user');
        
        if (!user || !user.token) {
          this.debugInfo = "No user token found.";
          return;
        }
        
        const endpoints = ["award", "awards", "reward", "rewards"];
        const baseUrl = "http://localhost:3029/flight-plan-t9";
        
        const results = {};
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(`${baseUrl}/${endpoint}`, {
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
              }
            });
            
            results[endpoint] = {
              status: response.status,
              data: response.data
            };
            
            // If we got a successful response with data, use it
            if (response.data && Array.isArray(response.data)) {
              this.awards = response.data;
              this.message = `Success! Found ${response.data.length} awards using endpoint '${endpoint}'`;
              this.isSuccess = true;
            }
          } catch (error) {
            results[endpoint] = {
              error: error.message,
              status: error.response?.status,
              data: error.response?.data
            };
          }
        }
        
        this.debugInfo = JSON.stringify(results, null, 2);
      } catch (error) {
        this.debugInfo = `Error in direct fetch: ${error.message}`;
      }
    },
    
    showSampleAwards() {
      this.usingSampleAwards = true;
      this.message = "Showing sample awards data (API fallback)";
      this.isSuccess = true;
    }
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

.awards-section {
  margin-top: 20px;
}

.awards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.award-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
  background-color: white;
}

.award-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.award-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.award-details {
  padding: 10px;
}

.award-details h4 {
  margin: 0 0 5px 0;
}

.redeem-btn {
  background-color: #4caf50;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  width: 100%;
}

.redeem-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success {
  color: green;
  margin-top: 15px;
}

.error {
  color: red;
  margin-top: 15px;
}

.debug-info {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
}

.debug-info pre {
  background: #333;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
}

.debug-info button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.loading-state {
  text-align: center;
  padding: 20px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 20px;
  color: red;
}

.error-message {
  margin-bottom: 10px;
}

.fallback-message {
  color: #666;
}
</style>

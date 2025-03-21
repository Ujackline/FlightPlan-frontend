<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <!-- Greeting -->
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Eagle Flight Plan
        </h1>

        <!-- Career Progress -->
        <div class="mb-8">
          <p class="text-sm text-gray-600 mb-2">Flight Plan Progress</p>
          <div class="h-2 bg-gray-200 rounded">
            <div class="h-full bg-blue-600 rounded" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>

        <!-- Experiences Section -->
        <div class="bg-gray-100 rounded-lg p-6 mb-8 shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Your Experiences</h2>
            <div class="flex space-x-2">
              <router-link to="/experience" class="text-blue-600 hover:text-blue-800">
                Manage Experiences →
              </router-link>
            </div>
          </div>
        </div>

        <!-- Total points Earned -->
        <div class="bg-blue-50 rounded-lg p-6 mb-8 shadow-md">
          <h2 class="text-xl font-semibold">Total Points Earned</h2>
          <p class="mt-2 text-2xl font-bold">{{ totalPoints }}</p>
          <div class="mt-4">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Tasks: {{ pointsBreakdown.tasks }}</span>
              <span>Events: {{ pointsBreakdown.events }}</span>
              <span>Extras: {{ pointsBreakdown.extras }}</span>
            </div>
          </div>
        </div>

        <!-- Upcoming Tasks -->
        <div class="bg-blue-50 rounded-lg p-6 mb-8 shadow-md">
          <h2 class="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          <ul class="mt-4 space-y-2">
            <li v-for="task in tasks" :key="task.id" class="bg-white p-4 rounded shadow-sm border-l-4 border-blue-600">
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-sm text-gray-600">Due: {{ task.dueDate }}</p>
            </li>
          </ul>
        </div>

        <!-- Upcoming Events -->
        <div class="bg-blue-50 rounded-lg p-6 mb-8 shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Upcoming Events</h2>
            <button 
              @click="navigateToEvents"
              class="text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="event in events" :key="event.id" class="bg-white p-4 rounded shadow-sm border-l-4 border-blue-600">
              <div class="text-sm text-gray-600">{{ formatDate(event.date) }}, {{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }}</div>
              <div class="font-medium text-gray-800">{{ event.name }}</div>
              <div class="text-sm text-gray-600">{{ event.location }}</div>
              <div class="text-sm text-gray-600">{{ event.description }}</div>
            </div>
          </div>

          <div class="flex justify-center mt-4 space-x-4">
            <button class="p-2 hover:bg-blue-100 rounded text-gray-600">
              ←
            </button>
            <button class="p-2 hover:bg-blue-100 rounded text-gray-600">
              →
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4 text-center">
          <button
            @click="navigateToDashboard"
            class="bg-red-900 text-white px-6 py-2 rounded hover:bg-red-800 w-48"
          >
            GO TO DASHBOARD
          </button>
          
          <div>
            <button
              @click="navigateToProfile"
              class="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 w-48"
            >
              VIEW PROFILE
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import studentServices from "../services/studentServices"; // Import studentServices
import axios from 'axios'; // Import axios

export default {
  name: 'StudentDashboard',
  data() {
    return {
      studentId: null,
      studentName: '',
      progressPercentage: 0,
      tasks: [],
      events: [], // List of events
      totalPoints: 0,
      pointsBreakdown: { tasks: 0, events: 0, extras: 0 },
      loading: false, // Loading state
      error: null, // Error message
    };
  },
  async created() {
    await this.fetchStudentId();
    if (this.studentId) {
      await this.fetchDashboardData();
    }
  },
  methods: {
    async fetchStudentId() {
      try {
        // Fetch the authenticated student's ID (e.g., from localStorage or a token)
        const token = localStorage.getItem("authToken"); // Example
        if (!token) {
          throw new Error("No token found");
        }

        // Decode the token to get the student ID (if the token contains the ID)
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Example
        this.studentId = decodedToken.id; // Assuming the token contains the student ID

        if (!this.studentId) {
          throw new Error("Student ID not found in token");
        }
      } catch (error) {
        console.error("Error fetching student ID:", error);
        throw error;
      }
    },
    async fetchDashboardData() {
      this.loading = true;
      this.error = null;
      try {
        // Fetch student data using studentServices
        const studentRes = await studentServices.getStudentById(this.studentId);
        this.studentName = studentRes.studentFirstName || 'Student';

        // Fetch tasks and events (replace with your actual endpoints)
        const [tasksRes, eventsRes] = await Promise.all([
          axios.get('/flight-plan-t9/task/'),
          axios.get('/flight-plan-t9/event/')
        ]);

        this.tasks = tasksRes.data;
        this.events = eventsRes.data;

        console.log("Fetched Events:", this.events); // Debugging

        // Calculate progress and points (frontend logic)
        this.progressPercentage = this.calculateProgress();
        this.totalPoints = this.calculateTotalPoints();
        this.pointsBreakdown = this.calculatePointsBreakdown();
      } catch (error) {
        this.error = "Failed to fetch dashboard data. Please try again later.";
        console.error("Error fetching dashboard data:", error);
      } finally {
        this.loading = false;
      }
    },
    calculateProgress() {
      // Replace with your logic to calculate progress
      return 50; // Example
    },
    calculateTotalPoints() {
      // Replace with your logic to calculate total points
      return 100; // Example
    },
    calculatePointsBreakdown() {
      // Replace with your logic to calculate points breakdown
      return { tasks: 50, events: 30, extras: 20 }; // Example
    },
    navigateToEvents() {
      this.$router.push('/events'); // Navigate to the events page
    },
    navigateToDashboard() {
      this.$router.push('/dashboard'); // Navigate to the dashboard page
    },
    navigateToProfile() {
      this.$router.push('/profile'); // Navigate to the profile page
    },
    formatDate(dateString) {
      // Format the date for display
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Adjust formatting as needed
    },
    formatTime(dateString) {
      // Format the time for display
      const date = new Date(dateString);
      return date.toLocaleTimeString(); // Adjust formatting as needed
    }
  }
};
</script>

<style scoped>
.bg-blue-50 {
  background-color: #eff6ff;
}
.bg-blue-600 {
  background-color: #3182ce;
}
.text-blue-600 {
  color: #3182ce;
}
.error {
  color: red;
}
</style>
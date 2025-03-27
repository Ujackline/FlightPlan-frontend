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
         //hi
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
              @click="$emit('navigate', 'events')"
              class="text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="event in events" :key="event.id" class="bg-white p-4 rounded shadow-sm border-l-4 border-blue-600">
              <div class="text-sm text-gray-600">{{ event.date }}, {{ event.time }}</div>
              <div class="font-medium text-gray-800">{{ event.title }}</div>
              <div class="text-sm text-gray-600">{{ event.location }}</div>
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
            @click="$emit('navigate', 'dashboard')"
            class="bg-red-900 text-white px-6 py-2 rounded hover:bg-red-800 w-48"
          >
            GO TO DASHBOARD
          </button>
          
          <div>
            <button
              @click="$emit('navigate', 'profile')"
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
import axios from 'axios';

export default {
  name: 'StudentDashboard',
  data() {
    return {
      studentId: null,
      studentName: '',
      progressPercentage: 0,
      tasks: [],
      events: [],
      totalPoints: 0,
      pointsBreakdown: { tasks: 0, events: 0, extras: 0 }
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
        const response = await axios.get('/flight-plan-t9/student/me'); 
        this.studentId = response.data.id; 
        this.studentName = response.data.name || 'Student'; 
      } catch (error) {
        console.error('Error fetching student ID:', error);
      }
    },
    async fetchDashboardData() {
      try {
        const [progressRes, tasksRes, eventsRes, pointsRes] = await Promise.all([
          axios.get(`/flight-plan-t9/student/progress/${this.studentId}`), 
          axios.get('/flight-plan-t9/task/'),
          axios.get('/flight-plan-t9/event/'),
          axios.get(`/flight-plan-t9/student/points/${this.studentId}`)
        ]);

        this.progressPercentage = progressRes.data.progress || 0;
        this.tasks = tasksRes.data;
        this.events = eventsRes.data;
        this.totalPoints = pointsRes.data.total;
        this.pointsBreakdown = pointsRes.data.breakdown;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
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
</style>
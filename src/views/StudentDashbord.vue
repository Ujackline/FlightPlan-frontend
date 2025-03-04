<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- Career Progress -->
        <div class="bg-blue-50 rounded-lg p-6 mb-8 shadow-md">
          <h2 class="text-xl font-semibold mb-4">Career Progress</h2>
          <p class="text-sm text-gray-600 mb-2">{{ progressPercentage }}% completed</p>
          <div class="h-2 bg-gray-200 rounded">
            <div class="h-full bg-blue-600 rounded" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>

        <!-- Total points Earns -->
        <div class="bg-blue-50 rounded-lg p-6 mb-8 shadow-md">
          <h2 class="text-xl font-semibold">Total Points Earns</h2>
          <ul class="mt-4 space-y-2">
            <li v-for="task in tasks" :key="task.id" class="bg-white p-4 rounded shadow-sm border-l-4 border-blue-600">
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-sm text-gray-600">Due: {{ task.dueDate }}</p>
            </li>
          </ul>
        </div>
        

        <!-- Upcoming tasks -->
        <div class="bg-blue-50 rounded-lg p-6 mb-8 shadow-md">
          <h2 class="text-xl font-semibold">Upcoming Events</h2>
          <ul class="mt-4 space-y-2">
            <li v-for="event in events" :key="event.id" class="bg-white p-4 rounded shadow-sm border-l-4 border-blue-600">
              <p class="text-sm text-gray-600">{{ event.date }}, {{ event.time }}</p>
              <p class="font-medium">{{ event.title }}</p>
              <p class="text-sm text-gray-600">{{ event.location }}</p>
            </li>
          </ul>
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
      studentId: null,  // Store student ID
      studentName: '',
      progressPercentage: 0,
      tasks: [],
      events: [],
      totalPoints: 0,
      pointsBreakdown: { tasks: 0, events: 0, extras: 0 }
    };
  },
  async created() {
    await this.fetchStudentId();  // Get the student ID first
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

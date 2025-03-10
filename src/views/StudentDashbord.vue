<template>
<<<<<<< HEAD:src/views/StudentDashbord.vue
    <div class="min-h-screen bg-white">
      
      
  
      <!-- Main Content -->
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto">
          <!-- Greeting -->
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
           Student Dashboard Page
          </h1>
  
          <!-- Fall 25 Progress -->
          <div class="mb-8">
            <p class="text-sm text-gray-600 mb-2">Fall 25' Progress</p>
            <div class="h-2 bg-gray-200 rounded">
              <div class="h-full bg-blue-600 rounded" style="width: 20%;"></div> <!-- 20% Progress -->
=======
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <!-- Greeting -->
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Eagle Flight Plan
        </h1>

        <!-- Progress Section -->
        <div class="mb-8">
          <p class="text-sm text-gray-600 mb-2">Flight Plan Progress</p>
          <div class="h-2 bg-gray-200 rounded">
            <div class="h-full bg-blue-600 rounded" :style="{ width: progress + '%' }"></div>
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
              <!-- <button @click="addExperience" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800">
                + Add Experience
              </button> -->
>>>>>>> e5ee80f386b0e571257ecd3539c267d2d14dff6b:src/views/FlightPlan.vue
            </div>
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
  </div>
  </template>
  
  <script>
  export default {
    name: 'WelcomePage',
    props: {
      firstName: {
        type: String,
        default: 'Guest'
      }
    },
    data() {
      return {
        events: [
          {
            id: 1,
            date: 'Wed, Jan 22',
            time: '11:00-2:00pm',
            title: 'Career Fair Preparation Workshop',
            location: 'Student Center 205'
          },
          {
            id: 2,
            date: 'Thu, Jan 23',
            time: '3:00-4:30pm',
            title: 'Resume Writing Seminar',
            location: 'Library Room 302'
          },
          {
            id: 3,
            date: 'Fri, Jan 24',
            time: '1:00-3:00pm',
            title: 'Interview Skills Workshop',
            location: 'Career Center'
          }
        ]
      }
    },
    emits: ['navigate']
  }
  </script>
  
  <style scoped>
  /* Additional styling for event items */
  .bg-blue-50 {
    background-color: #eff6ff;
  }
  
  .bg-blue-600 {
    background-color: #3182ce;
  }
  
  .text-blue-600 {
    color: #3182ce;
  }
  
  .text-blue-800 {
    color: #2b6cb0;
  }
  </style>
  
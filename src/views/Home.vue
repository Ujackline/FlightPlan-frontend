<template>

  <div class="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
    <!-- Personalized Greeting with Eagle Flight Plan Title -->
    <div class="container mx-auto px-4 py-6 max-w-4xl text-center">
      <h1 class="text-5xl font-bold text-blue-800 mb-4">EAGLE FLIGHT PLAN</h1>
      <h2 class="text-4xl font-bold text-gray-900">Welcome, {{ firstName || 'Guest' }}!</h2>
      <p class="text-gray-600 text-lg">Stay on track with your Eagle Flight Plan</p>
    </div>


    <!-- Flight Plan Progress & Points System -->
    <div class="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-1 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex flex-wrap justify-between items-center">
          <div class="w-full md:w-2/3">
            <h2 class="text-lg font-bold text-gray-900">Your Eagle Flight Progress</h2>
            <progress :value="progress" max="100" class="w-full h-3 mt-2 bg-gray-300 rounded"></progress>
            <p class="text-sm text-gray-600 mt-1">{{ progress }}% completed</p>
          </div>
          <div class="w-full md:w-1/3 mt-4 md:mt-0 p-4 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 class="text-xl font-semibold text-gray-900">Points & Rewards</h2>
            <p class="text-lg font-bold text-indigo-600">{{ points }} Points</p>
            <button class="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Redeem Rewards</button>
          </div>
        </div>
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
          <div class="home-container">
    <h1>Welcome to the Task Manager</h1>
    
    <!-- Clickable Text that Navigates to Task Page -->
    <router-link to="/task" class="task-link">
      Go to Task Page
    </router-link>
  </div>
          <div>
            <button
              @click="$emit('navigate', 'Admin')"
              class="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 w-48"
            >
              VIEW PROFILE
            </button>
           </div>


       


    <!-- Career Readiness Checklist & My Experiences in Two Tables -->
    <div class="container mx-auto px-4 py-8 max-w-6xl grid grid-cols-2 gap-6">
      <!-- Career Tasks Table -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-3xl font-bold text-burgundy mb-4 text-center">Career Readiness</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-blue-200 text-gray-700 uppercase text-sm">
                <th class="py-3 px-6 text-left">Task</th>
                <th class="py-3 px-6 text-center">Completed</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm bg-blue-50">
              <tr v-for="(task, index) in careerTasks" :key="task.id" class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6 whitespace-nowrap">{{ task.name }}</td>
                <td class="py-3 px-6 text-center">
                  <input type="checkbox" v-model="task.completed" class="form-checkbox h-5 w-5 text-blue-600">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-center mt-4">
          <button @click="saveChecklist" class="p-2 bg-green-600 text-white rounded hover:bg-green-700">Save Checklist</button>
        </div>
      </div>


      <!-- My Experiences Table -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-3xl font-bold text-burgundy mb-4 text-center">My Experiences</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-blue-200 text-gray-700 uppercase text-sm">
                <th class="py-3 px-6 text-left">Experience</th>
                <th class="py-3 px-6 text-left">Details</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm bg-blue-50">
              <tr v-for="(experience, index) in experiences" :key="experience.id" class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6 whitespace-nowrap">{{ experience.name }}</td>
                <td class="py-3 px-6 whitespace-nowrap">
                  <details>
                    <summary class="cursor-pointer font-bold text-blue-600">View Details</summary>
                    <ul class="list-disc pl-5">
                      <li v-for="detail in experience.details" :key="detail">{{ detail }}</li>
                    </ul>
                  </details>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Upcoming Events & Deadlines -->
    <div class="container mx-auto px-4 py-8 max-w-6xl text-center">
      <h2 class="text-3xl font-bold text-burgundy mb-4">Upcoming Events & Deadlines</h2>
    </div>
    <div class="container mx-auto px-4 py-6 max-w-6xl bg-white rounded-lg shadow-lg p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr class="bg-blue-200 text-gray-700 uppercase text-sm">
              <th class="py-3 px-6 text-left">Event Name</th>
              <th class="py-3 px-6 text-left">Date</th>
              <th class="py-3 px-6 text-left">Deadline</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm bg-blue-50">
            <tr v-for="event in upcomingEvents" :key="event.id" class="border-b border-gray-200 hover:bg-gray-100">
              <td class="py-3 px-6 whitespace-nowrap">{{ event.name }}</td>
              <td class="py-3 px-6 whitespace-nowrap">{{ event.date }}</td>
              <td class="py-3 px-6">{{ event.deadline }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import userServices from '../services/services.js';

import Utils from '../config/utils';
export default {
  //name: "HomeDashboard",
  setup() {
    const firstName = ref('Guest');
    const error = ref(null);

    const fetchUser = async () => {

  try {
    // Get the user object from local storage
    const storedUser = Utils.getStore("user"); //  Ensure "user" is a string

    if (!storedUser || !storedUser.userId) {
      console.error(" No user ID found in local storage:", storedUser);
      return;
    }

    console.log("Found user in storage:", storedUser); // Debugging

    // Send API request to fetch user data
    const response = await userServices.getOne(storedUser.userId); 

    if (response.data && response.data.fName) {
      firstName.value = response.data.fName;
      console.log("User fetched successfully:", response.data);
    }
  } catch (err) {
    error.value = "Failed to load user.";
    console.error(" Error fetching user:", err);
  }
};


// Fetch user when the component is mounted
onMounted(() => {
  fetchUser();
});




 return {
      firstName,
      // progress,
      // points,
      // careerTasks,
      // experiences,
      // upcomingEvents,
      // saveChecklist
    };
  }
};
</script>

<style>
.text-blue-800 {
  color: #2b6cb0;
}

.home-container {
  text-align: center;
  padding: 50px;
}

.task-link {
  font-size: 20px;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}

.task-link:hover {
  color: #0056b3;
}

</style>



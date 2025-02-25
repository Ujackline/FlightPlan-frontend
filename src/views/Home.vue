<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- Greeting -->
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Hello {{ firstName }},
        </h1>

        <!-- Fall 25 Progress -->
        <div class="mb-8">
          <p class="text-sm text-gray-600 mb-2">Fall 25' Progress</p>
          <div class="h-2 bg-gray-200 rounded">
            <div class="h-full bg-blue-600 rounded" style="width: 20%;"></div>
          </div>
        </div>

        <!-- Upcoming Events Panel - Styled like Chapel Events -->
        <div class="bg-white rounded-lg shadow-sm mb-8">
          <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-lg font-medium text-gray-900">Upcoming Events</h2>
            <button 
              @click="$emit('navigate', 'events')"
              class="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              View all →
            </button>
          </div>
          
          <div class="divide-y divide-gray-100">
            <div v-for="event in events" :key="event.id" class="p-4">
              <div class="text-sm text-gray-500 mb-1">{{ event.date }}, {{ event.time }}</div>
              <div class="text-gray-900 font-medium mb-1">{{ event.title }}</div>
              <div class="text-sm text-gray-600">{{ event.location }}</div>
            </div>
          </div>

          <div class="flex justify-end p-4 border-t">
            <div class="flex space-x-2">
              <button class="text-gray-600 hover:text-gray-800">
                ←
              </button>
              <button class="text-gray-600 hover:text-gray-800">
                →
              </button>
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
import { ref, onMounted } from 'vue';
import userServices from '../services/userServices';

export default {
  name: 'WelcomePage',
  setup() {
    const firstName = ref('Guest');
    const error = ref(null);

    const fetchUser = async () => {
      try {
        // Get the user ID from your authentication store/session
        // This should be set when the user logs in
        const userId = localStorage.getItem('userId'); 
        
        if (!userId) {
          console.error('No user ID found');
          return;
        }

        const response = await userServices.getOne(userId);
        if (response.data && response.data.fName) {
          firstName.value = response.data.fName;
        }
      } catch (err) {
        error.value = 'Failed to load user.';
        console.error('Error fetching user:', err);
      }
    };

    onMounted(() => {
      fetchUser();
    });

    return {
      firstName,
      error,
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
    };
  },
  emits: ['navigate']
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

.text-blue-800 {
  color: #2b6cb0;
}
</style>
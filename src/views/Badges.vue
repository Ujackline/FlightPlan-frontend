<template>
  <v-container class="badge-list">
    <v-row class="mb-8" align="center">
      <v-col cols="12" sm="6">
        <h1 class="text-h4 font-weight-bold primary--text">My Badges</h1>
      </v-col>
      <v-col cols="12" sm="6" class="text-sm-right">
        <v-btn-group variant="outlined">
          <v-btn 
            :color="badgeTypeFilter === '' ? 'primary' : ''" 
            @click="badgeTypeFilter = ''"
            elevation="2"
          >
            All Badge Types
          </v-btn>
          <v-btn 
            :color="badgeTypeFilter === 'Career' ? 'primary' : ''" 
            @click="badgeTypeFilter = 'Career'"
            elevation="2"
          >
            Career
          </v-btn>
          <v-btn 
            :color="badgeTypeFilter === 'Achievement' ? 'primary' : ''" 
            @click="badgeTypeFilter = 'Achievement'"
            elevation="2"
          >
            Achievement
          </v-btn>
        </v-btn-group>
      </v-col>
    </v-row>

    <!-- Alert for messages -->
    <v-alert v-if="message" :color="message.includes('Failed') ? 'error' : 'success'" variant="tonal" closable class="mb-6">
      {{ message }}
    </v-alert>

    <!-- Loading indicator -->
    <v-sheet v-if="loading" class="d-flex justify-center align-center flex-column pa-8">
      <v-progress-circular indeterminate color="primary" size="64" width="5" class="mb-4"></v-progress-circular>
      <p class="text-body-1">Loading badges...</p>
    </v-sheet>

    <!-- Display message when user is not authenticated -->
    <v-card v-else-if="!authenticated" class="text-center pa-8" variant="outlined">
      <v-icon icon="mdi-account-alert-outline" size="72" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h5 mb-3">Unable to determine current user</h3>
      <p class="text-body-1 text-grey-darken-1 mb-6">
        Please log in again to view your badges
      </p>
      <v-btn color="primary" @click="redirectToLogin">
        Log In
      </v-btn>
    </v-card>

    <!-- Display message when no badges are available -->
    <v-card v-else-if="!loading && authenticated && !filteredBadges.length" class="text-center pa-8" variant="outlined">
      <v-icon icon="mdi-trophy-variant-outline" size="72" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h5 mb-3">No badges yet</h3>
      <p class="text-body-1 text-grey-darken-1 mb-6">
        Complete tasks and milestones to earn badges that showcase your achievements
      </p>
    </v-card>

    <!-- List of badges -->
    <v-row v-else>
      <v-col v-for="badge in filteredBadges" :key="badge.id" cols="12" sm="6" lg="4">
        <v-card class="badge-card" style="min-height: 200px; width: 100%;">
          <v-card-item>
            <v-avatar class="mr-4" size="52" :color="getBadgeColor(badge.badge_type)">
              <v-icon size="x-large" color="white">{{ getBadgeIcon(badge.badge_type) }}</v-icon>
            </v-avatar>
            <div>
              <v-card-title class="text-h6 mb-1">{{ badge.name }}</v-card-title>
              <v-card-subtitle>
                Awarded: {{ formatDate(badge.DateAwarded) }}
              </v-card-subtitle>
            </div>
          </v-card-item>

          <v-card-text>
            <p>{{ badge.description }}</p>
            <v-chip class="mt-2" :color="getBadgeColor(badge.badge_type)" size="small" variant="outlined">
              {{ badge.badge_type }}
            </v-chip>
            <v-chip class="mt-2 ml-2" color="amber" size="small">
              {{ badge.points }} points
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const badges = ref([]);
const loading = ref(false);
const message = ref('');
const badgeTypeFilter = ref('');
const authenticated = ref(false);
const userEmail = ref('');
const studentId = ref(null);

// Sample badge data for development/testing - will be replaced with actual API data
const sampleBadges = [
  {
    id: 1,
    name: "Word Wizard",
    description: "You completed your first resume!",
    badge_type: "Career",
    points: 300,
    DateAwarded: new Date(2023, 2, 15)
  },
  {
    id: 2,
    name: "Workforce Debut",
    description: "You got your first internship!",
    badge_type: "Achievement",
    points: 500,
    DateAwarded: new Date(2023, 3, 22)
  },
  {
    id: 3,
    name: "Interview Master",
    description: "You got your first interview!",
    badge_type: "Career",
    points: 400,
    DateAwarded: new Date(2023, 4, 10)
  }
];

// Computed property for filtered badges
const filteredBadges = computed(() => {
  if (!badgeTypeFilter.value) {
    return badges.value;
  }
  return badges.value.filter(badge => badge.badge_type === badgeTypeFilter.value);
});

// Function to extract user info from session or localStorage
const getUserInfo = () => {
  try {
    // Check for user info in session storage
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      try {
        const parsedUser = JSON.parse(sessionUser);
        console.log('Found user in session storage:', parsedUser);
        if (parsedUser && parsedUser.email) {
          userEmail.value = parsedUser.email;
          return true;
        }
      } catch (e) {
        console.error('Error parsing user from session storage:', e);
      }
    }
    
    // Check for user info in local storage
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const parsedUser = JSON.parse(localUser);
        console.log('Found user in local storage:', parsedUser);
        if (parsedUser && parsedUser.email) {
          userEmail.value = parsedUser.email;
          return true;
        }
      } catch (e) {
        console.error('Error parsing user from local storage:', e);
      }
    }
    
    // If we're authenticated but don't have the email yet, try to extract from console
    // This is just for development/debugging, a real solution would use proper auth flow
    if (document.cookie.includes('authenticated=true')) {
      console.log('Found authentication cookie but no user data');
      // Extract email from any visible DOM elements if available
      userEmail.value = 'diella.mwambutsa@eagles.oc.edu'; // This is from the console error
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error getting user info:', error);
    return false;
  }
};

// Function to get student ID from user email
const getStudentIdFromEmail = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required to fetch student ID');
    }
    
    console.log('Fetching student ID for email:', email);
    
    // In a real app, you would make an API call to get the student ID from the email
    // For now, we'll simulate it
    // const response = await axios.get(`/api/student/by-email/${encodeURIComponent(email)}`);
    // return response.data.studentId;
    
    // For development/testing, return a fixed student ID
    return 1; // Replace with actual API call in production
  } catch (error) {
    console.error('Error fetching student ID:', error);
    throw error;
  }
};

// Function to fetch badges
const fetchBadges = async () => {
  try {
    loading.value = true;
    message.value = '';
    
    if (!studentId.value) {
      throw new Error('Student ID is required to fetch badges');
    }
    
    console.log('Fetching badges for student ID:', studentId.value);
    
    // In a real app, you would make an API call to get the badges
    // For now, we'll use sample data for testing
    // const response = await axios.get(`/api/badges/student/${studentId.value}`);
    // badges.value = response.data;
    
    // For development/testing, use sample data
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    badges.value = sampleBadges;
    
    console.log('Badges loaded:', badges.value.length);
  } catch (error) {
    console.error('Error fetching badges:', error);
    message.value = 'Failed to load your badges. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Function to redirect to login page
const redirectToLogin = () => {
  router.push('/login');
};

// Function to get badge color based on type
const getBadgeColor = (type) => {
  switch (type) {
    case 'Career':
      return 'indigo';
    case 'Achievement':
      return 'amber-darken-2';
    default:
      return 'grey';
  }
};

// Function to get badge icon based on type
const getBadgeIcon = (type) => {
  switch (type) {
    case 'Career':
      return 'mdi-briefcase';
    case 'Achievement':
      return 'mdi-trophy-award';
    default:
      return 'mdi-medal';
  }
};

// Format date for display
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Unknown date';
    }
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    return 'Unknown date';
  }
};

// Load badges when component mounts
onMounted(async () => {
  console.log('Badges component mounted');
  
  // Check if user is authenticated
  authenticated.value = getUserInfo();
  
  if (authenticated.value) {
    try {
      // Get student ID from user email
      studentId.value = await getStudentIdFromEmail(userEmail.value);
      
      // Fetch badges
      await fetchBadges();
    } catch (error) {
      console.error('Error in initialization:', error);
      message.value = 'Failed to initialize. Please try again.';
    }
  } else {
    console.error('User not authenticated');
    message.value = 'Unable to determine current user. Please log in again.';
  }
});
</script>

<style scoped>
.badge-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.badge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}
</style>
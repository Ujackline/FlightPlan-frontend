<template>
  <div class="container">
    <div class="header-container">
      <h1 class="my-badges-title">My Badges</h1>

      <div class="filter-tabs">
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'ALL BADGE TYPES' }"
          @click="activeFilter = 'ALL BADGE TYPES'"
        >
          ALL BADGE TYPES
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'Career' }"
          @click="activeFilter = 'Career'"
        >
          CAREER
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'Achievement' }"
          @click="activeFilter = 'Achievement'"
        >
          ACHIEVEMENT
        </button>
      </div>
    </div>

    <div class="content-area">
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading badges...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="message" class="error-container">
        <p>{{ message }}</p>
        <button @click="fetchBadges" class="retry-button">Try Again</button>
      </div>

      <!-- No badges state -->
      <div v-else-if="filteredBadges.length === 0" class="no-badges">
        <div class="trophy-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 22H17V20H7V22ZM12 2C9.27 2 7 4.27 7 7V14H9V7C9 5.35 10.35 4 12 4C13.65 4 15 5.35 15 7V14H17V7C17 4.27 14.73 2 12 2ZM12 18C13.1 18 14 17.1 14 16H10C10 17.1 10.9 18 12 18Z" fill="#cccccc"/>
          </svg>
        </div>
        <h3>No badges yet</h3>
        <p>Complete tasks and milestones to earn badges that showcase your achievements</p>
      </div>

      <!-- Badges display -->
      <div v-else class="badges-grid">
        <div v-for="badge in filteredBadges" :key="badge.id" class="badge-card">
          <!-- Badge icon -->
          <div class="badge-icon" :class="badge.badge_type.toLowerCase()">
            <i v-if="badge.badge_type === 'Career'" class="fas fa-briefcase"></i>
            <i v-else class="fas fa-trophy"></i>
          </div>
          
          <!-- Badge info -->
          <h2 class="badge-title">{{ badge.name }}</h2>
          <p class="badge-date">Awarded: {{ formatDate(badge.DateAwarded) }}</p>
          <p class="badge-description">{{ badge.description }}</p>
          
          <!-- Badge type and points -->
          <div class="badge-footer">
            <span class="badge-type" :class="badge.badge_type.toLowerCase()">{{ badge.badge_type }}</span>
            <span class="badge-points">{{ badge.points }} points</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import badgeServices from '../services/badgeServices';
import studentServices from '../services/studentServices';
import store from '../store/store';

const badges = ref([]);
const loading = ref(true);
const message = ref('');
const activeFilter = ref('ALL BADGE TYPES');
const currentUser = ref(null);

const filteredBadges = computed(() => {
  if (activeFilter.value === 'ALL BADGE TYPES') {
    return badges.value;
  }
  return badges.value.filter(badge => badge.badge_type === activeFilter.value);
});

// Function to get current user
const getCurrentUser = async () => {
  try {
    // Try to get from store first
    const user = store.getters.getLoginUserInfo;
    
    if (user && user.id) {
      console.log('User found in store:', user.id);
      currentUser.value = user;
      return user;
    } else {
      // If not in store, try to fetch from API
      console.log('User not found in store, attempting to fetch from API');
      message.value = 'Retrieving user data...';
      
      // You might need a different endpoint for getting the current user
      // This is just a placeholder based on your current code
      const response = await studentServices.getStudentById();
      
      if (response && response.id) {
        console.log('User fetched from API:', response.id);
        currentUser.value = response;
        return response;
      } else {
        throw new Error('Could not retrieve user information');
      }
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    message.value = 'Unable to determine current user. Please log in again.';
    loading.value = false;
    return null;
  }
};

// Function to fetch badges
const fetchBadges = async () => {
  try {
    loading.value = true;
    message.value = '';
    
    const user = currentUser.value || await getCurrentUser();
    
    if (!user || !user.id) {
      message.value = 'User not found. Please log in again.';
      loading.value = false;
      return;
    }
    
    console.log('Fetching badges for user:', user.id);
    const response = await badgeServices.getAllUserBadges(user.id);
    
    console.log('Badge API response:', response);
    
    // Handle different possible data structures
    if (Array.isArray(response)) {
      // If response is directly an array
      badges.value = response.map(badge => ({
        ...badge,
        badge_type: badge.badge_type || badge.type || 'Achievement'
      }));
    } else if (response && Array.isArray(response.data)) {
      // If response has a data array property
      badges.value = response.data.map(badge => ({
        ...badge,
        badge_type: badge.badge_type || badge.type || 'Achievement'
      }));
    } else if (response && typeof response === 'object') {
      // If response is a single object or has a different structure
      // Try to extract badges if they exist in the response
      const badgeData = response.data || response;
      
      if (Array.isArray(badgeData)) {
        badges.value = badgeData.map(badge => ({
          ...badge,
          badge_type: badge.badge_type || badge.type || 'Achievement'
        }));
      } else {
        // If it's a single badge object
        badges.value = [{ 
          ...badgeData,
          badge_type: badgeData.badge_type || badgeData.type || 'Achievement'
        }];
      }
    } else {
      badges.value = [];
      message.value = 'No badges found for this user.';
    }
    
    console.log('Processed badges:', badges.value);
    
    if (badges.value.length === 0) {
      message.value = 'No badges found for this user.';
    }
  } catch (error) {
    console.error('Error fetching badges:', error);
    message.value = 'Failed to load your badges. Please try again.';
    badges.value = [];
  } finally {
    loading.value = false;
  }
};


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
  await fetchBadges();
});
</script>


<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.my-badges-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.filter-tabs {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.filter-tab {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.filter-tab.active {
  background-color: #800000;
  color: white;
}

.content-area {
  clear: both;
  padding-top: 0.5rem;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.badge-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  background-color: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.badge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

.badge-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 1.5rem;
}

.badge-icon.career {
  background-color: #4169E1; /* Royal blue for career */
}

.badge-icon.achievement {
  background-color: #FFA500; /* Orange for achievement */
}

.badge-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.badge-date {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.badge-description {
  flex-grow: 1;
  margin-bottom: 1rem;
}

.badge-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-type {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-type.career {
  background-color: #e6f0ff;
  color: #0047AB;
}

.badge-type.achievement {
  background-color: #fff4e6;
  color: #FF8C00;
}

.badge-points {
  font-weight: 500;
  color: #FF8C00;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #800000;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 2rem;
  background-color: #fff8f8;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  margin: 2rem 0;
}

.retry-button {
  background-color: #800000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.no-badges {
  text-align: center;
  padding: 3rem;
  border: 1px dashed #ddd;
  border-radius: 8px;
  color: #777;
}

.trophy-icon {
  margin-bottom: 1rem;
}

.no-badges h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #555;
}
</style>
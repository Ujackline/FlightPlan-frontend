<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">My Badges</h1>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
        <div v-if="authError" class="mt-2">
          <button @click="redirectToLogin" class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
            Login Again
          </button>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="badges.length === 0" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No badges yet</h3>
        <p class="mt-1 text-gray-500">Complete tasks and missions to earn badges!</p>
      </div>
      
      <!-- Badges grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="badge in badges" :key="badge.id" 
             class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div class="p-4 flex flex-col items-center">
            <!-- Badge icon container -->
            <div class="mb-3 flex items-center justify-center w-20 h-20 rounded-full" :class="getBadgeColorClass(badge.badge_type)">
              <!-- Badge image (if available) -->
              <img 
                v-if="badge.imageUrl" 
                :src="badge.imageUrl" 
                :alt="badge.name" 
                class="h-16 w-16 object-contain"
              />
              <!-- Default badge icon -->
              <svg v-else class="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                <path d="M10 4a1 1 0 100 2 1 1 0 000-2zm0 3a1 1 0 011 1v4a1 1 0 01-2 0V8a1 1 0 011-1z"/>
              </svg>
            </div>
            
            <!-- Badge info -->
            <h3 class="text-lg font-semibold text-gray-800">{{ badge.name }}</h3>
            <div class="flex items-center justify-center mt-1 mb-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                    :class="getBadgeTypeClass(badge.badge_type)">
                {{ badge.badge_type || 'Standard' }}
              </span>
              <span class="ml-2 text-sm text-gray-600">{{ badge.points }} points</span>
            </div>
            <p class="text-gray-600 text-sm text-center">{{ badge.description || 'No description available' }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import BadgeService from '../services/badgeServices';
  import Utils from '../config/utils';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  export default {
    name: 'BadgesView',
    setup() {
      const badges = ref([]);
      const loading = ref(true);
      const error = ref(null);
      const authError = ref(false);
      const router = useRouter();
  
      const refreshToken = async () => {
        try {
          const user = Utils.getStore("user");
          if (!user) return false;
          
          const response = await axios.post('/flight-plan-t9/auth/refreshToken', {
            refreshToken: user.refreshToken
          });
          
          if (response.data && response.data.token) {
            user.token = response.data.token;
            Utils.setStore("user", user);
            return true;
          }
        } catch (err) {
          console.error('Error refreshing token:', err);
        }
        return false;
      };
  
      const fetchBadges = async (retryWithRefresh = true) => {
        try {
          loading.value = true;
          error.value = null;
          authError.value = false;
          
          // Check authentication
          const user = Utils.getStore("user");
          
          if (!user) {
            error.value = 'Authentication required. Please log in.';
            authError.value = true;
            loading.value = false;
            return;
          }
          
          console.log("Fetching badges...");
          
          try {
            const response = await BadgeService.getAll();
            console.log("Badge response:", response);
            
            // Add image URLs to badges or use predefined ones
            const badgesWithImages = (response.data || []).map(badge => {
              // If badge already has an imageUrl, use it
              if (badge.imageUrl) return badge;
              
              // Otherwise, assign image based on badge type or name
              const images = {
        
                career: 'public/badge1.png',
                skill: 'public/blue.png',
                achievement: 'public/mix.png',
                gold: '/images/badges/gold-badge.png',
                silver: '/images/badges/silver-badge.png',
                bronze: '/images/badges/bronze-badge.png',
                special: '/images/badges/special-badge.png',
                // Specific badges by name
                'Word Wizard': '/images/badges/word-wizard-badge.png'
              };
              
              // Try to find an image based on badge type or name
              const imageUrl = images[badge.badge_type?.toLowerCase()] || 
                              images[badge.name] || 
                              null;
              
              return {
                ...badge,
                imageUrl
              };
            });
            
            // Set badges from response with added image URLs
            badges.value = badgesWithImages;
            
          } catch (axiosError) {
            console.error('Axios error:', axiosError);
            
            // Handle authentication errors
            if (axiosError.response && axiosError.response.status === 401) {
              authError.value = true;
              
              // Try refreshing token if available and retry
              if (retryWithRefresh && user.refreshToken) {
                const refreshed = await refreshToken();
                if (refreshed) {
                  return fetchBadges(false); // Retry once with new token
                }
              }
              
              error.value = 'Session expired. Please log in again.';
            } else {
              error.value = axiosError.message || 'Failed to load badges';
            }
          }
          
        } catch (err) {
          console.error('Error details:', err);
          error.value = err.message || 'Failed to load badges';
        } finally {
          loading.value = false;
        }
      };
  
      const redirectToLogin = () => {
        // Clear user data
        Utils.removeItem("user");
        // Redirect to login page
        router.push({ name: "login" });
      };
  
      const getBadgeColorClass = (type) => {
        switch (type?.toLowerCase()) {
          case 'gold':
            return 'bg-yellow-500';
          case 'silver':
            return 'bg-gray-400';
          case 'bronze':
            return 'bg-yellow-700';
          case 'achievement':
            return 'bg-green-500';
          case 'skill':
            return 'bg-blue-500';
          case 'special':
            return 'bg-purple-500';
          case 'career':
            return 'bg-indigo-500';
          default:
            return 'bg-blue-500';
        }
      };
  
      const getBadgeTypeClass = (type) => {
        switch (type?.toLowerCase()) {
          case 'gold':
            return 'bg-yellow-100 text-yellow-800';
          case 'silver':
            return 'bg-gray-100 text-gray-800';
          case 'bronze':
            return 'bg-yellow-100 text-yellow-800';
          case 'achievement':
            return 'bg-green-100 text-green-800';
          case 'skill':
            return 'bg-blue-100 text-blue-800';
          case 'special':
            return 'bg-purple-100 text-purple-800';
          case 'career':
            return 'bg-indigo-100 text-indigo-800';
          default:
            return 'bg-blue-100 text-blue-800';
        }
      };
  
      onMounted(fetchBadges);
  
      return {
        badges,
        loading,
        error,
        authError,
        redirectToLogin,
        getBadgeColorClass,
        getBadgeTypeClass
      };
    }
  }
  </script>
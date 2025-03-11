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
            <!-- Badge icon based on type -->
            <div class="mb-3 p-3 rounded-full" :class="getBadgeColorClass(badge.badge_type)">
              <svg class="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
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
  
  export default {
    name: 'BadgesView',
    setup() {
      const badges = ref([]);
      const loading = ref(true);
      const error = ref(null);
  
      const fetchBadges = async () => {
        try {
          loading.value = true;
          error.value = null;
          const data = await BadgeService.getAllBadges();
          badges.value = data;
        } catch (err) {
          error.value = err.message || 'Failed to load badges';
          console.error('Error in fetchBadges:', err);
        } finally {
          loading.value = false;
        }
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
          default:
            return 'bg-blue-100 text-blue-800';
        }
      };
  
      onMounted(fetchBadges);
  
      return {
        badges,
        loading,
        error,
        getBadgeColorClass,
        getBadgeTypeClass
      };
    }
  }
  </script>
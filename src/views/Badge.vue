<template>
  <div class="container">
    <div class="header-container">
      <h1 class="my-badges-title">My Badges</h1>
      <div class="filter-tabs">
        <button
          class="filter-tab"
          :class="{ active: activeFilter === 'ALL BADGE TYPES' }"
          @click="activeFilter = 'ALL BADGE TYPES'"
        >ALL BADGE TYPES</button>
        <button
          class="filter-tab"
          :class="{ active: activeFilter === 'Career' }"
          @click="activeFilter = 'Career'"
        >CAREER</button>
        <button
          class="filter-tab"
          :class="{ active: activeFilter === 'Achievement' }"
          @click="activeFilter = 'Achievement'"
        >ACHIEVEMENT</button>
        <button
          class="refresh-button"
          @click="manualRefresh"
          :disabled="loading"
        >
          <span v-if="loading">Loading...</span>
          <span v-else>Refresh Badges</span>
        </button>
      </div>
    </div>

    <div class="content-area">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading badges...</p>
      </div>

      <div v-if="message" class="error-container">
        <p>{{ message }}</p>
        <button @click="fetchBadges" class="retry-button">Try Again</button>
      </div>

      <div v-else-if="filteredBadges.length === 0" class="no-badges">
        <h3>No badges yet</h3>
        <p v-if="currentUser && currentUser.points == 0">
          You currently have 0 points. Complete tasks to earn points and unlock badges!
        </p>
        <p v-else>
          Complete tasks to earn badges and track your progress!
        </p>
      </div>

      <div v-else class="badges-grid">
        <div v-for="(badge, index) in filteredBadges" :key="badge.id || index" class="badge-card">
          <!-- Image container for badge image -->
          <div v-if="badge.description && hasImageUrl(badge.description)" class="badge-image-container">
            <img
              :src="extractImageUrl(badge.description)"
              alt="Badge image"
              class="badge-image"
              @error="handleImageError"
              @load="onImageLoad"
            />
          </div>
          <div v-else class="badge-icon" :class="badge.badge_type && badge.badge_type.toLowerCase()">
            <i v-if="badge.badge_type === 'Career'" class="fas fa-briefcase"></i>
            <i v-else class="fas fa-trophy"></i>
          </div>

          <h2 class="badge-title">{{ badge.name || 'Unnamed Badge' }}</h2>
          <p class="badge-date">Awarded: {{ badge.DateAwarded ? formatDate(badge.DateAwarded) : 'Recently' }}</p>
          
          <!-- Display description without the URL part -->
          <p class="badge-description">
            {{ badge.description ? getDescriptionWithoutImageUrl(badge.description) : 'No description available' }}
          </p>

          <div class="badge-footer">
            <span class="badge-type" :class="badge.badge_type && badge.badge_type.toLowerCase()">{{ badge.badge_type || 'Achievement' }}</span>
            <span class="badge-points">{{ badge.points || 0 }} pts</span>
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
  if (activeFilter.value === 'ALL BADGE TYPES') return badges.value;
  return badges.value.filter(b => b.badge_type === activeFilter.value);
});

const fetchBadges = async () => {
  try {
    loading.value = true;
    message.value = '';

    // 1. Get the current user from the store
    const user = store.getters.getLoginUserInfo;
    currentUser.value = user;
    const studentId = user?.id;
    
    if (!studentId) {
      console.error("Student ID not found in user info");
      throw new Error('Student ID not found');
    }

    // 2. Get up-to-date student info with latest points
    console.log("Fetching student info...");
    let currentPoints = 0;
    
    try {
      // First try the direct points method
      const pointsResponse = await studentServices.getStudentPoints(studentId);
      if (pointsResponse && pointsResponse.points !== undefined) {
        currentPoints = parseInt(pointsResponse.points);
        console.log(`Student points from direct API: ${currentPoints}`);
      } else {
        // If that fails, try the email method
        const studentRes = await studentServices.searchStudentByEmail(user.email);
        console.log("Student info response:", studentRes);
        
        if (studentRes && studentRes.data) {
          // Store the complete student info
          const studentInfo = studentRes.data;
          console.log("Student info:", studentInfo);
          
          // Parse points, ensure it's a number
          currentPoints = parseInt(studentInfo.points || 0);
          console.log(`Student points from email API: ${currentPoints}`);
        } else {
          console.warn("Student info not found in API response");
          // Fallback to user points from store
          currentPoints = parseInt(user.points || 0);
          console.log(`Falling back to store points: ${currentPoints}`);
        }
      }
    } catch (err) {
      console.error("Error fetching student info:", err);
      // Fallback to user points from store
      currentPoints = parseInt(user.points || 0);
      console.log(`Error occurred, using store points: ${currentPoints}`);
    }
    
    console.log(`FINAL Current student points: ${currentPoints}`);
    
    // 3. Get all badges in the system
    console.log("Fetching all badges...");
    let allBadges = [];
    
    try {
      const allBadgesRes = await badgeServices.getAll();
      console.log("All badges response:", allBadgesRes);
      
      if (allBadgesRes?.data && Array.isArray(allBadgesRes.data)) {
        allBadges = allBadgesRes.data;
      } else if (Array.isArray(allBadgesRes)) {
        allBadges = allBadgesRes;
      }
      
      console.log("All badges:", allBadges);
    } catch (err) {
      console.error("Error fetching all badges:", err);
      allBadges = [];
    }
    
    if (allBadges.length === 0) {
      console.warn("No badges found in the system");
      badges.value = [];
      message.value = 'No badges available in the system.';
      loading.value = false;
      return;
    }
    
    // 4. Determine which badges the student qualifies for based on points
    console.log("Determining qualifying badges...");
    const qualifyingBadges = [];
    
    for (const badge of allBadges) {
      if (!badge) continue;
      
      // Ensure badge points is a number
      const badgePoints = parseInt(badge.points || 0);
      console.log(`Badge: ${badge.name}, Required Points: ${badgePoints}, Student Points: ${currentPoints}`);
      
      if (currentPoints >= badgePoints) {
        console.log(`Student qualifies for badge: ${badge.name}`);
        qualifyingBadges.push(badge);
      } else {
        console.log(`Student does NOT qualify for badge: ${badge.name}`);
      }
    }
    
    console.log(`Student qualifies for ${qualifyingBadges.length} out of ${allBadges.length} badges`);
    
    // 5. Get the badges the student already has
    console.log("Fetching student's current badges...");
    let earnedBadges = [];
    let earnedIds = [];
    
    try {
      const earnedRes = await badgeServices.getAllUserBadges(studentId);
      console.log("Student badges response:", earnedRes);
      
      if (earnedRes?.data && Array.isArray(earnedRes.data)) {
        earnedBadges = earnedRes.data;
      } else if (Array.isArray(earnedRes)) {
        earnedBadges = earnedRes;
      }
      
      earnedIds = earnedBadges.map(badge => badge?.id).filter(id => id);
      console.log("Earned badge IDs:", earnedIds);
    } catch (err) {
      console.error("Error fetching student badges:", err);
      earnedBadges = [];
      earnedIds = [];
    }
    
    console.log(`Student has earned ${earnedBadges.length} badges`);
    
    // 6. Determine which qualifying badges need to be awarded
    const newQualifyingBadges = qualifyingBadges.filter(badge => 
      badge.id && !earnedIds.includes(badge.id)
    );
    
    console.log(`New qualifying badges to award: ${newQualifyingBadges.length}`);
    console.log("New qualifying badges:", newQualifyingBadges);
    
    // 7. Award new qualifying badges
    let badgesChanged = false;
    
    for (const badge of newQualifyingBadges) {
      if (!badge.id) continue;
      
      try {
        console.log(`Awarding badge ${badge.id} - ${badge.name} (${badge.points} points)`);
        await badgeServices.awardBadge({ studentId: studentId, badgeId: badge.id });
        badgesChanged = true;
      } catch (err) {
        console.error(`Error awarding badge ${badge.id}:`, err);
      }
    }
    
    // 8. Get the final, updated list of badges
    if (badgesChanged) {
      try {
        console.log("Getting updated badge list after changes...");
        const updatedRes = await badgeServices.getAllUserBadges(studentId);
        
        if (updatedRes?.data && Array.isArray(updatedRes.data)) {
          badges.value = updatedRes.data;
        } else if (Array.isArray(updatedRes)) {
          badges.value = updatedRes;
        } else {
          badges.value = earnedBadges;
        }
      } catch (err) {
        console.error("Error fetching updated badges:", err);
        badges.value = earnedBadges;
      }
    } else {
      // If no changes were needed, use what we have
      badges.value = earnedBadges;
    }
    
    console.log("Final badges to display:", badges.value);
    
    // If there are still no badges to display, show all qualifying badges instead
    if (badges.value.length === 0 && qualifyingBadges.length > 0) {
      console.log("No badges earned, showing qualifying badges instead");
      badges.value = qualifyingBadges;
    }

    if (badges.value.length === 0) {
      message.value = 'No badges found for this user.';
    }
  } catch (error) {
    console.error('Error:', error);
    message.value = 'Something went wrong while loading badges.';
    badges.value = [];
  } finally {
    loading.value = false;
  }
};

const manualRefresh = () => {
  console.log("Manual refresh triggered");
  fetchBadges();
};

onMounted(fetchBadges);

const formatDate = (str) => new Date(str).toLocaleDateString();

// Improved URL detection regex - without console logs
const hasImageUrl = (desc) => {
  if (!desc) return false;
  
  // Try various common patterns for image URLs
  const patterns = [
    /https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp|svg|bmp)/i,
    /https?:\/\/[^\s"']+\/image/i,
    /https?:\/\/[^\s"']+\/badge/i
  ];
  
  for (const pattern of patterns) {
    if (pattern.test(desc)) {
      return true;
    }
  }
  
  return false;
};

const extractImageUrl = (desc) => {
  if (!desc) return '';
  
  // Try all patterns and use the first match
  const patterns = [
    /https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp|svg|bmp)/i,
    /https?:\/\/[^\s"']+\/image[^\s"']*/i,
    /https?:\/\/[^\s"']+\/badge[^\s"']*/i
  ];
  
  for (const pattern of patterns) {
    const match = desc.match(pattern);
    if (match && match[0]) {
      return match[0];
    }
  }
  
  // If we get here, try a more general approach - extract any URL
  const generalMatch = desc.match(/https?:\/\/[^\s"']+/i);
  if (generalMatch && generalMatch[0]) {
    return generalMatch[0];
  }
  
  return '';
};

const getDescriptionWithoutImageUrl = (desc) => {
  if (!desc) return '';
  const url = extractImageUrl(desc);
  if (!url) return desc;
  
  // Remove the URL from the description
  return desc.replace(url, '').trim();
};

// Improved image handling without console logs
const onImageLoad = e => {
  e.target.style.opacity = 1;
  e.target.classList.add('loaded');
};

const handleImageError = e => {
  // Try a different placeholder service
  e.target.src = 'https://via.placeholder.com/80x80?text=Badge';
  e.target.style.opacity = 1;
};

const forceRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    fetchBadges();
  }, 500);
};

// Remove the watch effect and other added code

defineExpose({
  refreshBadges: forceRefresh
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
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}
.filter-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.filter-tab {
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  background: #f2f2f2;
  border-radius: 5px;
}
.filter-tab.active {
  background-color: #800000;
  color: #fff;
}
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
.badge-card {
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}
.badge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.badge-image-container {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid #eaeaea;
}
.badge-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s;
}
.badge-image.loaded {
  opacity: 1;
}
.badge-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #c8a45e;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
  color: white;
}
.badge-icon.career {
  background: #5e81c8;
}
.badge-icon.achievement {
  background: #c85e5e;
}
.badge-title {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
}
.badge-date {
  color: #666;
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 0.5rem;
}
.badge-description {
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}
.badge-description a {
  color: #0066cc;
  text-decoration: none;
}
.badge-description a:hover {
  text-decoration: underline;
}
.badge-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.loading-container,
.error-container,
.no-badges {
  text-align: center;
  padding: 2rem;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #eee;
  border-top: 4px solid #800000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.debug-panel, .debug-link {
  display: none;
}
.refresh-button {
  margin-left: auto;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-button:hover {
  background-color: #388e3c;
}

.refresh-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
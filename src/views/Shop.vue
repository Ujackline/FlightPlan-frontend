<template>
  <div>
    <div class="shop-container">
      <h1>Eagle Shop</h1>
      <p class="shop-description">Browse and redeem rewards with your Eagle points!</p>
      
      <div class="awards-grid">
        <div v-for="award in awards" :key="award.AwardID" class="award-card">
          <img :src="award.description" :alt="award.name" class="award-image" />
          <div class="award-details">
            <h2>{{ award.name }}</h2>
            <p class="points-cost">{{ award.points }} points</p>
            <p class="redemption-type">Type: {{ formatRedemptionType(award.redemption_type) }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading awards...</p>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import awardServices from "../services/awardServices";

const awards = ref([]);
const loading = ref(true);
const error = ref(null);

const formatRedemptionType = (type) => {
  if (!type) return "General";
  
  // Capitalize first letter and replace underscores with spaces
  return type.charAt(0).toUpperCase() + 
         type.slice(1).replace(/_/g, ' ');
};

onMounted(async () => {
  try {
    loading.value = true;
    awards.value = await awardServices.getAwards();
    console.log("Fetched awards:", awards.value);
  } catch (err) {
    console.error("Error fetching awards:", err);
    error.value = "Failed to load awards. Please try again later.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.shop-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

h1 {
  font-size: 2.5rem;
  color: #263238;
  margin-bottom: 0.5rem;
  text-align: center;
}

.shop-description {
  text-align: center;
  font-size: 1.1rem;
  color: #546e7a;
  margin-bottom: 2rem;
}

.awards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.award-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.award-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.award-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.award-details {
  padding: 1.5rem;
}

.award-details h2 {
  margin-top: 0;
  margin-bottom: 0.8rem;
  font-size: 1.5rem;
  color: #1976d2;
}

.points-cost {
  font-size: 1.25rem;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 0.5rem;
}

.redemption-type {
  font-size: 0.9rem;
  color: #78909c;
  text-transform: capitalize;
}

.loading-container {
  text-align: center;
  padding: 3rem 0;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #1976d2;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  color: #f44336;
  padding: 1rem;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 8px;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .awards-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style> 
<template>
  <div class="circular-gauge-container">
    <svg width="140" height="140" viewBox="0 0 140 140">
      <!-- Background circle -->
      <circle
        cx="70"
        cy="70"
        r="60"
        stroke="#e0e0e0"
        stroke-width="12"
        fill="none"
      />
      
      <!-- Progress circle -->
      <circle
        cx="70"
        cy="70"
        r="60"
        stroke="#4CD4CC"
        stroke-width="12"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 70 70)"
        stroke-linecap="round"
      />
    </svg>
    
    <!-- Points display -->
    <div class="points-display">
      <div class="points-value">{{ points }}</div>
      <div class="points-label">points</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CircularPointsGauge',
  props: {
    points: {
      type: Number,
      default: 63
    },
    maxPoints: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      progress: 0
    };
  },
  computed: {
    circumference() {
      return 2 * Math.PI * 60;
    },
    dashOffset() {
      const percentage = (this.progress / 100);
      return this.circumference * (1 - percentage);
    }
  },
  mounted() {
    // Animate progress on component mount
    setTimeout(() => {
      this.progress = (this.points / this.maxPoints) * 100;
    }, 100);
  },
  watch: {
    points(newValue) {
      this.progress = (newValue / this.maxPoints) * 100;
    }
  }
}
</script>

<style scoped>
.circular-gauge-container {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto;
}

.points-display {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.points-value {
  font-size: 36px;
  font-weight: bold;
  line-height: 1;
  color: #333;
}

.points-label {
  font-size: 16px;
  color: #666;
  margin-top: 4px;
}

circle {
  transition: stroke-dashoffset 1s ease-in-out;
}
</style>
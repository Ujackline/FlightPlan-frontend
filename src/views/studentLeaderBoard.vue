<!-- <template>
    <div class="leaderboard">
      <h2>🏆 Student Leaderboard</h2>
      <ul>
        <li v-for="(student, index) in leaderboard" :key="student.id">
          <strong>#{{ index + 1 }}</strong> - {{ student.fName }} {{ student.lName }} ({{ student.points }} pts)
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import studentServices from "../services/studentServices";
  
  export default {
    data() {
      return {
        leaderboard: [],
      };
    },
    async mounted() {
      try {
        const response = await studentServices.getLeaderboard();
        this.leaderboard = response;
      } catch (error) {
        console.error("❌ Error loading leaderboard:", error);
      }
    }
  };
  </script>
  
  <style>
  .leaderboard {
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 12px;
  }
  .leaderboard li {
    margin: 0.5rem 0;
  }
  </style>
   -->
   <template>
    <div class="leaderboard-container">
      <div class="leaderboard-header">
        <div class="trophy-wrapper">
          <span class="trophy">🏆</span>
        </div>
        <h2 class="title">Student Leaderboard</h2>
        <div class="trophy-wrapper">
          <span class="trophy">🏆</span>
        </div>
      </div>
      
      <div v-if="leaderboard.length" class="leaderboard-content">
        <ul class="student-list">
          <li v-for="(student, index) in leaderboard" :key="student.id" class="student-item" :class="{'top-three': index < 3}">
            <div class="rank-badge" :class="`rank-${index + 1}`">
              {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}` }}
            </div>
            <div class="student-info">
              <span class="student-name">{{ student.fName }} {{ student.lName }}</span>
              <span class="student-points">{{ student.points }} points</span>
            </div>
            <div class="star-container">
              <span v-if="index === 0" class="stars">⭐⭐⭐</span>
              <span v-else-if="index === 1" class="stars">⭐⭐</span>
              <span v-else-if="index === 2" class="stars">⭐</span>
            </div>
          </li>
        </ul>
      </div>
      
      <div v-else class="loading-state">
        <p>Loading amazing students... ✨</p>
      </div>
    </div>
  </template>
  
  <script>
  import studentServices from "../services/studentServices";
  
  export default {
    data() {
      return {
        leaderboard: [],
      };
    },
    async mounted() {
      try {
        const response = await studentServices.getLeaderboard();
        this.leaderboard = response;
      } catch (error) {
        console.error("❌ Error loading leaderboard:", error);
      }
    }
  };
  </script>
  
  <style>
  .leaderboard-container {
    padding: 1.5rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(128, 0, 32, 0.15);
    max-width: 600px;
    margin: 15vh auto; /* Centers vertically at roughly 15% from the top */
    border: 2px solid #800020;
    position: relative;
  }
  
  .leaderboard-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid rgba(128, 0, 32, 0.2);
  }
  
  .trophy-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
  }
  
  .trophy {
    font-size: 2rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    margin: 0 1rem;
    font-size: 1.6rem;
    color: #800020; /* Maroon color */
    font-weight: bold;
    text-align: center;
    letter-spacing: 0.5px;
  }
  
  .student-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .student-item {
    display: flex;
    align-items: center;
    margin: 0.8rem 0;
    padding: 0.8rem 1rem;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 3px 10px rgba(128, 0, 32, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-left: 2px solid transparent;
  }
  
  .student-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(128, 0, 32, 0.12);
  }
  
  .top-three {
    border-left: 4px solid #800020;
  }
  
  .rank-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font-weight: bold;
    font-size: 1rem;
    margin-right: 1rem;
    color: white;
  }
  
  .rank-1 {
    background: #800020; /* Solid maroon for first place */
    font-size: 1.2rem;
  }
  
  .rank-2 {
    background: linear-gradient(to bottom right, #800020, #b30030);
    font-size: 1.2rem;
  }
  
  .rank-3 {
    background: linear-gradient(to bottom right, #b30030, #cc0033);
    font-size: 1.2rem;
  }
  
  .rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
    background: rgba(128, 0, 32, 0.7);
    font-size: 0.9rem;
  }
  
  .student-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .student-name {
    font-weight: bold;
    color: #333;
    font-size: 1.1rem;
  }
  
  .student-points {
    color: #800020;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    font-weight: 500;
  }
  
  .star-container {
    margin-left: auto;
  }
  
  .stars {
    font-size: 1.2rem;
    color: #800020;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .loading-state {
    text-align: center;
    padding: 2rem 0;
    color: #800020;
    font-style: italic;
  }
  
  @media (max-width: 500px) {
    .leaderboard-container {
      padding: 1rem;
      margin: 10vh auto; /* Less vertical centering on mobile */
    }
    
    .title {
      font-size: 1.3rem;
    }
    
    .trophy {
      font-size: 1.5rem;
    }
    
    .student-name {
      font-size: 0.95rem;
    }
  }
  </style>
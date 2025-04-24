<template>
  <div class="career-resources-container">
    <div class="card-header">
      <h2 class="card-title">Career Resources</h2>
    </div>
    
    <div class="resources-grid">
      <!-- Resume.co resource -->
      <a href="https://resume.co" target="_blank" rel="noopener noreferrer" class="resource-card">
        <div class="resource-icon resume-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M16,11V18H8V11H16M10,12V17H14V12H10Z" />
          </svg>
        </div>
        <div class="resource-content">
          <h3>Resume.co</h3>
          <p>Create professional resumes with AI assistance. Get templates, tips, and tools.</p>
        </div>
      </a>

      <!-- Handshake resource -->
      <a href="https://joinhandshake.com" target="_blank" rel="noopener noreferrer" class="resource-card">
        <div class="resource-icon handshake-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
            <path d="M11,6H14L17.29,2.7A1,1 0 0,1 18.71,2.7L21.29,5.29A1,1 0 0,1 21.29,6.7L19,9H11V11A1,1 0 0,1 10,12A1,1 0 0,1 9,11V8A2,2 0 0,1 11,6M5,11V15L2.71,17.29A1,1 0 0,0 2.71,18.7L5.29,21.29A1,1 0 0,0 6.71,21.29L11,17H15A1,1 0 0,0 16,16V15H17A1,1 0 0,0 18,14V13H19A1,1 0 0,0 20,12V11H13V12A2,2 0 0,1 11,14H9A2,2 0 0,1 7,12V9Z" />
          </svg>
        </div>
        <div class="resource-content">
          <h3>Handshake</h3>
          <p>Connect with employers, find jobs and internships specifically for college students.</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CareerResources'
}
</script>

<style scoped>
.career-resources-container {
  background-color: #eff6ff;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
}

.resources-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.resource-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}

.resource-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.resource-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.resume-icon {
  background-color: #3182ce;
  color: white;
}

.handshake-icon {
  background-color: #660000;
  color: white;
}

.resource-content {
  flex-grow: 1;
}

.resource-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}

.resource-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .resources-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
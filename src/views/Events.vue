<template>
  <div>
    <!-- Section to display available events -->
    <div v-if="!showMyEvents">
      <h2>Available Career Events</h2>
      <ul>
        <li v-for="event in events" :key="event.id">
          <h3>{{ event.name }}</h3>
          <p>{{ event.description }}</p>
          <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
          <p><strong>Start Time:</strong> {{ formatTime(event.start_time) }}</p>
          <p><strong>End Time:</strong> {{ formatTime(event.end_time) }}</p>
          <p><strong>Location:</strong> {{ event.location }}</p>
          <p><strong>Major:</strong> {{ event.major }}</p>
          <button @click="registerForEvent(event.id)" :disabled="isRegistered(event.id)">
            {{ isRegistered(event.id) ? 'Registered' : 'Register' }}
          </button>
        </li>
      </ul>
      <button @click="showMyEvents = true">View My Events</button>
    </div>

    <!-- Section to display registered events -->
    <div v-else>
      <h2>Registered Events</h2>
      <ul>
        <li v-for="event in registeredEvents" :key="event.id">
          <h3>{{ event.name }}</h3>
          <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
          <p><strong>Start Time:</strong> {{ formatTime(event.start_time) }}</p>
          <p><strong>End Time:</strong> {{ formatTime(event.end_time) }}</p>
          <p><strong>Location:</strong> {{ event.location }}</p>
          <p><strong>Major:</strong> {{ event.major }}</p>
          <button @click="cancelRegistration(event.id)">Cancel Registration</button>
        </li>
      </ul>
      <button @click="showMyEvents = false">Back to All Events</button>
    </div>

    <!-- Confirmation or error message -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script>
import eventServices from '../services/eventServices';

export default {
  data() {
    return {
      events: [], 
      registeredEvents: [], 
      showMyEvents: false, 
      message: '', 
      messageType: 'success', 
    };
  },
  async created() {
    
    await this.fetchEvents();
    await this.fetchRegisteredEvents();
  },
  methods: {
    
    async fetchEvents() {
      try {
        const response = await eventServices.getAll();
        this.events = response.data;
      } catch (error) {
        this.showMessage('Failed to fetch events.', 'error');
      }
    },
   
    async fetchRegisteredEvents() {
      try {
        const userId = this.$store.state.user.id; 
        const response = await this.$axios.get(`/flight-plan-t9/event/user/${userId}`);
        this.registeredEvents = response.data;
      } catch (error) {
        this.showMessage('Failed to fetch registered events.', 'error');
      }
    },
    
    // Register for an event
    async registerForEvent(eventId) {
      try {
        const userId = this.$store.state.user.id; 
        await this.$axios.post('/flight-plan-t9/event/register', { eventId, userId });
        this.showMessage('Registration successful!', 'success');
        await this.fetchEvents(); //
        await this.fetchRegisteredEvents(); 
      } catch (error) {
        this.showMessage('Failed to register for the event.', 'error');
      }
    },
    // Cancel registration for an event
    async cancelRegistration(eventId) {
      try {
        const userId = this.$store.state.user.id; 
        await this.$axios.post('/flight-plan-t9/event/cancel', { eventId, userId });
        this.showMessage('Registration canceled.', 'success');
        await this.fetchEvents(); 
        await this.fetchRegisteredEvents(); 
      } catch (error) {
        this.showMessage('Failed to cancel registration.', 'error');
      }
    },
    // Check if an event is registered by the student
    isRegistered(eventId) {
      return this.registeredEvents.some(event => event.id === eventId);
    },
    // Format date for display
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    // Format time for display
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString();
    },
    // Show a message (success or error)
    showMessage(message, type = 'success') {
      this.message = message;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    },
  },
};
</script>

<style scoped>
.message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
}
.success {
  background-color: #d4edda;
  color: #155724;
}
.error {
  background-color: #f8d7da;
  color: #721c24;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
button {
  margin-top: 5px;
}
</style>
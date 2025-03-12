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
        <h2>My Registered Events</h2>
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
  
      <!-- Confirmation message -->
      <div v-if="message" class="message">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        events: [], // List of all available events
        registeredEvents: [], // List of events the student has registered for
        showMyEvents: false, // Toggle between available events and registered events
        message: '', // Confirmation or error messages
      };
    },
    async created() {
      // Fetch all available events and the student's registered events when the component is created
      await this.fetchEvents();
      await this.fetchRegisteredEvents();
    },
    methods: {
      // Fetch all available events from the backend
      async fetchEvents() {
        try {
          const response = await this.$axios.get('/flight-plan-t9/event');
          this.events = response.data;
        } catch (error) {
          this.message = 'Failed to fetch events.';
        }
      },
      // Fetch the student's registered events from the backend
      async fetchRegisteredEvents() {
        try {
          const userId = this.$store.state.user.id; // Assuming user ID is stored in Vuex store
          const response = await this.$axios.get(`/flight-plan-t9/event/user/${userId}`);
          this.registeredEvents = response.data;
        } catch (error) {
          this.message = 'Failed to fetch registered events.';
        }
      },
      // Register for an event
      async registerForEvent(eventId) {
        try {
          const userId = this.$store.state.user.id; // Assuming user ID is stored in Vuex store
          await this.$axios.post('/flight-plan-t9/event/register', { eventId, userId });
          this.message = 'Registration successful!';
          await this.fetchEvents(); // Refresh the list of events
          await this.fetchRegisteredEvents(); // Refresh the list of registered events
        } catch (error) {
          this.message = 'Failed to register for the event.';
        }
      },
      // Cancel registration for an event
      async cancelRegistration(eventId) {
        try {
          const userId = this.$store.state.user.id; // Assuming user ID is stored in Vuex store
          await this.$axios.post('/flight-plan-t9/event/cancel', { eventId, userId });
          this.message = 'Registration canceled.';
          await this.fetchEvents(); // Refresh the list of events
          await this.fetchRegisteredEvents(); // Refresh the list of registered events
        } catch (error) {
          this.message = 'Failed to cancel registration.';
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
    },
  };
  </script>
  
  <style scoped>
  .message {
    color: green;
    margin-top: 10px;
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
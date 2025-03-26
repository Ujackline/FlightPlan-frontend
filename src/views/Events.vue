<template>
  <div>
    <!-- Section to display available events -->
    <div v-if="!showMyEvents">
      <h2>Available Career Events</h2>
      <ul>
        <li v-for="event in events" :key="event.id">
          <h3>{{ event.name }}</h3>
          <p>{{ event.description }}</p>
          <p>Date: {{ formatDate(event.date) }}</p>
          <p>Start Time: {{ formatTime(event.start_time) }}</p>
          <p>End Time: {{ formatTime(event.end_time) }}</p>
          <p>Location: {{ event.location }}</p>
          <p>Major: {{ event.major }}</p>
          <button 
            @click="registerForEvent(event.id)" 
            :disabled="isRegistered(event.id)"
            :class="isRegistered(event.id) ? 'registered-button' : 'register-button'"
          >
            {{ isRegistered(event.id) ? 'Registered' : 'Register' }}
          </button>
        </li>
      </ul>
      <button @click="showMyEvents = true">View My Events</button>
    </div>

    <!-- Section to display registered events -->
    <div v-else>
      <h2>Registered Events</h2>
      <p v-if="registeredEvents.length === 0">You haven't registered for any events yet.</p>
      <ul v-else>
        <li v-for="event in registeredEvents" :key="event.id">
          <h3>{{ event.name }}</h3>
          <p>Date: {{ formatDate(event.date) }}</p>
          <p>Start Time: {{ formatTime(event.start_time) }}</p>
          <p>End Time: {{ formatTime(event.end_time) }}</p>
          <p>Location: {{ event.location }}</p>
          <p>Major: {{ event.major }}</p>
          <div class="button-group">
            <button @click="cancelRegistration(event.id)" class="cancel-button">
              Cancel Registration
            </button>
            <button @click="addToGoogleCalendar(event)" class="calendar-button">
              Add to Google Calendar
            </button>
            <button @click="setNotification(event)" class="notification-button">
              Set Reminder
            </button>
          </div>
        </li>
      </ul>
      <button @click="showMyEvents = false">Back to All Events</button>
    </div>

    <!-- Notification Settings Modal -->
    <div v-if="showNotificationModal" class="modal-overlay">
      <div class="modal">
        <h3>Set Reminder for {{ selectedEvent.name }}</h3>
        <div class="form-group">
          <label for="notification-time">Reminder Time:</label>
          <select id="notification-time" v-model="notificationTime">
            <option value="15">15 minutes before</option>
            <option value="30">30 minutes before</option>
            <option value="60">1 hour before</option>
            <option value="120">2 hours before</option>
            <option value="1440">1 day before</option>
          </select>
        </div>
        <div class="form-group">
          <label for="notification-type">Notification Type:</label>
          <select id="notification-type" v-model="notificationType">
            <option value="email">Email</option>
            <option value="popup">Browser Popup</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div class="button-group">
          <button @click="closeNotificationModal" class="cancel-button">Cancel</button>
          <button @click="saveNotification" class="save-button">Save Reminder</button>
        </div>
      </div>
    </div>

    <!-- Confirmation or error message -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script>
import eventServices from '../services/eventServices.js';

export default {
  data() {
    return {
      events: [], 
      registeredEvents: [], 
      showMyEvents: false, 
      message: '', 
      messageType: 'success', 
      localRegistrations: [],
      showNotificationModal: false,
      selectedEvent: null,
      notificationTime: '60',  // Default: 1 hour before
      notificationType: 'email',
      eventNotifications: [],  // Stores user's notification preferences
    };
  },
  async created() {
    this.loadLocalRegistrations();
    this.loadNotificationPreferences();
    
    console.log("User from Vuex store:", this.$store.state.user); 
    
    await this.fetchEvents();
    try {
      await this.fetchRegisteredEvents();
    } catch (error) {
      console.log("Not logged in or couldn't fetch registered events. Using local storage.");
    }

    // Check if we need to request notification permissions
    if (this.isNotificationSupported()) {
      this.requestNotificationPermission();
    }
  },
  methods: {
    // Fetch all available events
    async fetchEvents() {
      try {
        const response = await eventServices.getAll();
        this.events = response.data;
      } catch (error) {
        this.showMessage('Failed to fetch events.', 'error');
      }
    },

    // Load registrations from localStorage
    loadLocalRegistrations() {
      const stored = localStorage.getItem('eventRegistrations');
      if (stored) {
        this.localRegistrations = JSON.parse(stored);
      }
    },

    // Save registrations to localStorage
    saveLocalRegistrations() {
      localStorage.setItem('eventRegistrations', JSON.stringify(this.localRegistrations));
    },

    // Load notification preferences
    loadNotificationPreferences() {
      const stored = localStorage.getItem('eventNotifications');
      if (stored) {
        this.eventNotifications = JSON.parse(stored);
      }
    },

    // Save notification preferences
    saveNotificationPreferences() {
      localStorage.setItem('eventNotifications', JSON.stringify(this.eventNotifications));
    },

    // Fetch events registered by the user
    async fetchRegisteredEvents() {
      try {
        const userId = this.$store.state.user?.id; 
        if (userId) {
          const response = await this.$axios.get(`/flight-plan-t9/event/user/${userId}`);
          this.registeredEvents = response.data;
        } else {
          this.registeredEvents = this.events.filter(event => 
            this.localRegistrations.includes(event.id)
          );
        }
      } catch (error) {
        this.registeredEvents = this.events.filter(event => 
          this.localRegistrations.includes(event.id)
        );
      }
    },

    async registerForEvent(eventId) {
      try {
        const userId = this.$store.state.user?.id; 
        
        if (userId) {
          await eventServices.register(eventId, userId);
        } else {
          if (!this.localRegistrations.includes(eventId)) {
            this.localRegistrations.push(eventId);
            this.saveLocalRegistrations();
          }
        }

        this.showMessage("Registration successful!", "success");
        if (!this.registeredEvents.some(event => event.id === eventId)) {
          const event = this.events.find(e => e.id === eventId);
          if (event) {
            this.registeredEvents.push(event);
          }
        }
      } catch (error) {
        console.error("Error registering for event:", error);
        this.showMessage("Failed to register for the event.", "error");
      }
    },

    // Cancel registration for an event
    async cancelRegistration(eventId) {
      try {
        const userId = this.$store.state.user?.id;
        
        if (userId) {
          await eventServices.cancelRegistration(eventId, userId);
        } else {
          this.localRegistrations = this.localRegistrations.filter(id => id !== eventId);
          this.saveLocalRegistrations();
        }

        // Also remove any notification preferences for this event
        this.eventNotifications = this.eventNotifications.filter(notif => notif.eventId !== eventId);
        this.saveNotificationPreferences();

        this.showMessage('Registration canceled.', 'success');
        this.registeredEvents = this.registeredEvents.filter(event => event.id !== eventId);
      } catch (error) {
        console.error('Error canceling registration:', error);
        this.showMessage('Failed to cancel registration.', 'error');
      }
    },

    // Check if the user is already registered for an event
    isRegistered(eventId) {
      if (this.registeredEvents.some(event => event.id === eventId)) {
        return true;
      }
      return this.localRegistrations.includes(eventId);
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString();
    },

    // Format date and time for Google Calendar
    formatGoogleCalendarDate(dateStr, timeStr) {
      const date = new Date(dateStr);
      const time = new Date(timeStr);
      
      date.setHours(time.getHours());
      date.setMinutes(time.getMinutes());
      
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    },

    // Add event to Google Calendar
    addToGoogleCalendar(event) {
      const startDate = this.formatGoogleCalendarDate(event.date, event.start_time);
      const endDate = this.formatGoogleCalendarDate(event.date, event.end_time);
      
      // Prepare event details
      const title = encodeURIComponent(event.name);
      const details = encodeURIComponent(event.description);
      const location = encodeURIComponent(event.location);
      
      // Create Google Calendar URL
      const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}&sf=true&output=xml`;
      
      // Open Google Calendar in a new tab
      window.open(googleCalendarUrl, '_blank');
      
      this.showMessage('Event added to Google Calendar', 'success');
    },

    // Open notification settings modal
    setNotification(event) {
      this.selectedEvent = event;
      
      // Check if there's an existing notification for this event
      const existingNotification = this.eventNotifications.find(n => n.eventId === event.id);
      if (existingNotification) {
        this.notificationTime = existingNotification.time;
        this.notificationType = existingNotification.type;
      } else {
        // Reset to defaults
        this.notificationTime = '60';
        this.notificationType = 'email';
      }
      
      this.showNotificationModal = true;
    },

    // Close notification modal
    closeNotificationModal() {
      this.showNotificationModal = false;
      this.selectedEvent = null;
    },

    // Save notification preferences
    saveNotification() {
      if (!this.selectedEvent) return;
      
      // Remove any existing notification for this event
      this.eventNotifications = this.eventNotifications.filter(
        notif => notif.eventId !== this.selectedEvent.id
      );
      
      // Add the new notification preference
      this.eventNotifications.push({
        eventId: this.selectedEvent.id,
        eventName: this.selectedEvent.name,
        date: this.selectedEvent.date,
        startTime: this.selectedEvent.start_time,
        time: this.notificationTime,
        type: this.notificationType
      });
      
      // Save to localStorage
      this.saveNotificationPreferences();
      
      // Schedule the notification
      this.scheduleNotification(this.selectedEvent, parseInt(this.notificationTime));
      
      this.showMessage('Reminder set successfully', 'success');
      this.closeNotificationModal();
    },

    // Check if browser notifications are supported
    isNotificationSupported() {
      return 'Notification' in window;
    },

    // Request permission for browser notifications
    requestNotificationPermission() {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    },

    // Schedule a notification
    scheduleNotification(event, minutesBefore) {
      // Parse event date and time
      const eventDate = new Date(event.date);
      const startTime = new Date(event.start_time);
      
      eventDate.setHours(startTime.getHours());
      eventDate.setMinutes(startTime.getMinutes());
      
      // Calculate notification time
      const notificationTime = new Date(eventDate.getTime() - minutesBefore * 60000);
      
      // Check if notification time is in the future
      if (notificationTime > new Date()) {
        const timeUntilNotification = notificationTime.getTime() - new Date().getTime();
        
        // Set a timeout for the notification
        setTimeout(() => {
          this.triggerNotification(event);
        }, timeUntilNotification);
        
        console.log(`Notification scheduled for ${event.name} at ${notificationTime.toLocaleString()}`);
      }
    },

    // Trigger a notification
    triggerNotification(event) {
      const notificationConfig = this.eventNotifications.find(n => n.eventId === event.id);
      if (!notificationConfig) return;
      
      // If email notification is selected
      if (notificationConfig.type === 'email' || notificationConfig.type === 'both') {
        // In a real app, this would call an API to send an email
        console.log(`Email notification would be sent for ${event.name}`);
      }
      
      // If browser notification is selected
      if ((notificationConfig.type === 'popup' || notificationConfig.type === 'both') 
          && this.isNotificationSupported() 
          && Notification.permission === 'granted') {
        
        const notification = new Notification(`Reminder: ${event.name}`, {
          body: `Your event starts in ${notificationConfig.time} minutes at ${this.formatTime(event.start_time)}`,
          icon: '/favicon.ico' // Use your app's icon
        });
        
        // Optional: Close notification after 10 seconds
        setTimeout(() => {
          notification.close();
        }, 10000);
        
        // Optional: Add a click handler to open your app
        notification.onclick = () => {
          window.focus();
          this.showMyEvents = true;
        };
      }
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
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ccc;
  font-weight: bold;
}
/* Button group styling */
.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}
/* Green register button */
.register-button {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
  transition: background-color 0.2s;
}
.register-button:hover {
  background-color: #218838;
}
/* Maroon registered button */
.registered-button {
  background-color: #800000;
  color: white;
  border-color: #800000;
  cursor: not-allowed;
}
/* Cancel button styling */
.cancel-button {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}
.cancel-button:hover {
  background-color: #c82333;
}
/* Calendar button styling */
.calendar-button {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
.calendar-button:hover {
  background-color: #0069d9;
}
/* Notification button styling */
.notification-button {
  background-color: #6f42c1;
  color: white;
  border-color: #6f42c1;
}
.notification-button:hover {
  background-color: #5e35b1;
}
/* Save button styling */
.save-button {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}
.save-button:hover {
  background-color: #218838;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
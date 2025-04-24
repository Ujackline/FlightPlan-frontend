<template>
  <div class="events-container">
    <!-- Section to display available events -->
    <div v-if="!showMyEvents && !showCompletedEvents">
      <h2 class="section-title">Available Career Events</h2>
      <ul class="event-list">
        <li v-for="event in events" :key="event.id" class="event-card">
          <h3 class="event-title">{{ event.name }}</h3>
          <p class="event-description">{{ event.description }}</p>
          <div class="event-details">
            <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
            <p><strong>Time:</strong> {{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }}</p>
            <p><strong>Location:</strong> {{ event.location }}</p>
            <p><strong>Major:</strong> {{ event.major }}</p>
          </div>
          <p v-if="event.status === 'completed' || event.status === 'attended' || isEventComplete(event.id)" class="completed-tag">✓ Completed</p>
          <div class="action-container">
            <button 
              @click="registerForEvent(event.id)" 
              :disabled="isRegistered(event.id)"
              class="register-button"
            >
              {{ isRegistered(event.id) ? 'Registered' : 'Register' }}
            </button>
          </div>
        </li>
      </ul>
      <div class="button-group main-buttons">
        <button @click="showMyEvents = true" class="primary-button">View Registered Events</button>
        <button @click="showCompletedEvents = true" class="secondary-button">View Completed Events</button>
      </div>
    </div>

    <!-- Section to display registered events -->
    <div v-else-if="showMyEvents && !showCompletedEvents">
      <h2 class="section-title">Registered Events</h2>
      <p v-if="registeredEvents.length === 0" class="empty-message">You haven't registered for any events yet.</p>
      <ul v-else class="event-list">
        <li v-for="event in registeredEvents" :key="event.id" class="event-card">
          <h3 class="event-title">{{ event.name }}</h3>
          <div class="event-details">
            <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
            <p><strong>Time:</strong> {{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }}</p>
            <p><strong>Location:</strong> {{ event.location }}</p>
            <p><strong>Major:</strong> {{ event.major }}</p>
          </div>
          
          <!-- Status tags - with simpler styling -->
          <p v-if="event.status === 'pending'" class="pending-tag">⏳ Pending Approval</p>
          <p v-else-if="event.status === 'completed' || event.status === 'attended' || isEventComplete(event.id)" class="completed-tag">✓ Completed</p>
          
          <div class="button-group">
            <!-- Enter Attendance Code button only shows when event is not pending or completed -->
            <button 
              v-if="!isEventComplete(event.id) && event.status !== 'pending' && event.status !== 'completed' && event.status !== 'attended'" 
              @click="markAsAttended(event)" 
              class="verify-button">
              Enter Attendance Code
            </button>
            
            <button 
              v-if="!isEventComplete(event.id) && event.status !== 'completed' && event.status !== 'attended'" 
              @click="cancelRegistration(event.id)" 
              class="cancel-button">
              Cancel Registration
            </button>
            
            <!-- Only show Google Calendar and Reminder buttons for events that aren't completed -->
            <button 
              v-if="event.status !== 'completed' && event.status !== 'attended' && !isEventComplete(event.id)"
              @click="addToGoogleCalendar(event)" 
              class="calendar-button">
              Add to Google Calendar
            </button>
            
            <button 
              v-if="!isEventInPast(event) && event.status !== 'completed' && event.status !== 'attended' && !isEventComplete(event.id)" 
              @click="setNotification(event)" 
              class="notification-button">
              Set Reminder
            </button>
          </div>
        </li>
      </ul>
      <div class="button-group main-buttons">
        <button @click="showMyEvents = false" class="primary-button">Back to All Events</button>
        <button @click="showCompletedEvents = true; showMyEvents = false" class="secondary-button">View Completed Events</button>
      </div>
    </div>
    
    <!-- Modified section for the completed events view -->
    <div v-else>
      <h2 class="section-title">Completed Events</h2>
      <p v-if="completedEvents.length === 0" class="empty-message">You haven't completed any events yet.</p>
      <ul v-else class="event-list">
        <li v-for="event in completedEvents" :key="event.id" class="event-card">
          <h3 class="event-title">{{ event.name }}</h3>
          <div class="event-details">
            <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
            <p><strong>Time:</strong> {{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }}</p>
            <p><strong>Location:</strong> {{ event.location }}</p>
            <p><strong>Major:</strong> {{ event.major }}</p>
          </div>
          <p class="completed-tag">✓ Completed</p>
          <!-- Added reset button with simplified styling -->
          <div class="button-group">
            <button @click="resetEventCompletion(event.id)" class="reset-button">
              Reset Completion Status
            </button>
          </div>
        </li>
      </ul>
      <div class="button-group main-buttons">
        <button @click="showCompletedEvents = false" class="primary-button">Back to All Events</button>
        <button v-if="!showMyEvents" @click="showMyEvents = true; showCompletedEvents = false" class="secondary-button">View Registered Events</button>
      </div>
    </div>

    <!-- Notification Settings Modal -->
    <div v-if="showNotificationModal" class="modal-overlay">
      <div class="modal">
        <h3 class="modal-title">Set Reminder for {{ selectedEvent.name }}</h3>
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
    
    <!-- Attendance verification modal -->
    <div v-if="showAttendanceModal" class="modal-overlay">
      <div class="modal">
        <h3 class="modal-title">Verify Event Attendance</h3>
        <p>Enter the attendance code provided at the event:</p>
        <div class="form-group">
          <input type="text" v-model="attendanceCode" placeholder="Attendance Code" class="attendance-input" />
        </div>
        <p class="small-text">If you don't have an attendance code, ask the event coordinator for verification.</p>
        <div class="button-group">
          <button @click="closeAttendanceModal" class="cancel-button">Cancel</button>
          <button @click="verifyAttendance" class="save-button">Verify Attendance</button>
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
      showCompletedEvents: false,
      message: '',
      messageType: 'success',
      showNotificationModal: false,
      showAttendanceModal: false,
      selectedEvent: null,
      notificationTime: '60',
      notificationType: 'email',
      eventNotifications: [],
      completedEvents: [],
      eventCompletions: [],
      attendanceCode: '',
      statusCheckInterval: null,
    };
  },
  async created() {
    this.loadNotificationPreferences();
    this.loadEventCompletions();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      console.log("No user found in localStorage");
      this.showMessage("You need to log in to register for events", "error");
    } else {
      console.log("User from localStorage:", user);
    }

    // Initial fetch
    await this.fetchEvents();
    try {
      await this.fetchRegisteredEvents();
    } catch (error) {
      console.log("Not logged in or couldn't fetch registered events.");
    }

    // Set up polling for status updates every 30 seconds
    this.statusCheckInterval = setInterval(() => {
      if (this.showMyEvents) {
        this.fetchRegisteredEvents();
      }
    }, 30000);

    if (this.isNotificationSupported()) {
      this.requestNotificationPermission();
    }

    this.updateCompletedEventsList();
  },
  beforeDestroy() {
    // Clear the interval when component is destroyed
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  },
  methods: {
    // Add the missing formatDate function
    formatDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    // Add the missing formatTime function
    formatTime(time) {
      if (!time) return '';
      
      // Convert 24-hour time format (HH:MM:SS) to 12-hour format with AM/PM
      try {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
        
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      } catch (error) {
        console.error('Error formatting time:', error);
        return time; // Return original time if parsing fails
      }
    },
    // Add the missing isEventComplete function
    isEventComplete(eventId) {
      return this.eventCompletions.some(completion => completion.eventId === eventId);
    },
    // Add the missing isRegistered function
    isRegistered(eventId) {
      return this.registeredEvents.some(event => event.id === eventId);
    },
    // Add the missing isEventInPast function
    isEventInPast(event) {
      const today = new Date();
      const eventDate = new Date(event.date);
      
      if (eventDate < today) {
        return true;
      }
      
      if (eventDate.getDate() === today.getDate() && 
          eventDate.getMonth() === today.getMonth() && 
          eventDate.getFullYear() === today.getFullYear()) {
        
        // Event is today, check if it's over
        if (event.end_time) {
          const [hours, minutes] = event.end_time.split(':');
          const eventEndTime = new Date();
          eventEndTime.setHours(parseInt(hours, 10));
          eventEndTime.setMinutes(parseInt(minutes, 10));
          
          return today > eventEndTime;
        }
      }
      
      return false;
    },
    // Add the missing getCompletionDate function
    getCompletionDate(eventId) {
      const completion = this.eventCompletions.find(c => c.eventId === eventId);
      return completion ? completion.completionDate : '';
    },
    // Add the missing setNotification function
    setNotification(event) {
      this.selectedEvent = event;
      this.showNotificationModal = true;
    },
    // Add the missing closeNotificationModal function
    closeNotificationModal() {
      this.showNotificationModal = false;
      this.selectedEvent = null;
    },
    // Add the missing saveNotification function
    saveNotification() {
      if (!this.selectedEvent) return;
      
      const notification = {
        eventId: this.selectedEvent.id,
        time: parseInt(this.notificationTime, 10),
        type: this.notificationType
      };
      
      // Remove any existing notification for this event
      this.eventNotifications = this.eventNotifications.filter(
        n => n.eventId !== this.selectedEvent.id
      );
      
      // Add the new notification
      this.eventNotifications.push(notification);
      this.saveNotificationPreferences();
      
      this.showMessage(`Reminder set for ${this.notificationTime} minutes before the event`, 'success');
      this.closeNotificationModal();
    },
    goToMyEvents() {
      this.showMyEvents = true;
      this.showCompletedEvents = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async fetchEvents() {
      try {
        const response = await eventServices.getAll();
        this.events = response.data;
      } catch (error) {
        this.showMessage('Failed to fetch events.', 'error');
      }
    },
    loadNotificationPreferences() {
      const stored = localStorage.getItem('eventNotifications');
      if (stored) {
        this.eventNotifications = JSON.parse(stored);
      }
    },
    saveNotificationPreferences() {
      localStorage.setItem('eventNotifications', JSON.stringify(this.eventNotifications));
    },
    loadEventCompletions() {
      const stored = localStorage.getItem('eventCompletions');
      if (stored) {
        this.eventCompletions = JSON.parse(stored);
      }
    },
    saveEventCompletions() {
      localStorage.setItem('eventCompletions', JSON.stringify(this.eventCompletions));
    },
    updateCompletedEventsList() {
      const completedIds = this.eventCompletions.map(completion => completion.eventId);
      this.completedEvents = this.events.filter(event => completedIds.includes(event.id));
    },
    resetEventCompletion(eventId) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
        if (userId) {
          console.log(`Reset attendance for event ID ${eventId} on server`);
        }
        this.eventCompletions = this.eventCompletions.filter(
          completion => completion.eventId !== eventId
        );
        this.saveEventCompletions();
        this.updateCompletedEventsList();
        this.showMessage('Event completion status has been reset', 'success');

        if (this.showCompletedEvents && this.completedEvents.length === 0) {
          setTimeout(() => {
            this.showCompletedEvents = false;
          }, 500);
        }
      } catch (error) {
        console.error('Error resetting event completion:', error);
        this.showMessage('Failed to reset event completion status.', 'error');
      }
    },
    // Improved fetchRegisteredEvents to update local event completions
    async fetchRegisteredEvents() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;

        console.log(`Fetching registered events for user ${user.id}`);
        const response = await eventServices.getStudentEvents(user.id);
        this.registeredEvents = response.data.map(event => ({
          ...event,
          status: event.status || 'registered',
          pointsEarned: event.pointsEarned || 0
        }));
        
        // Update local event completions based on server data
        this.registeredEvents.forEach(event => {
          if (event.status === 'completed' || event.status === 'attended') {
            // Add to completions if not already there
            if (!this.eventCompletions.some(completion => completion.eventId === event.id)) {
              this.eventCompletions.push({ 
                eventId: event.id, 
                completionDate: new Date().toISOString() 
              });
            }
          }
        });
        
        // Save updated completions to local storage
        this.saveEventCompletions();
        this.updateCompletedEventsList();
      } catch (error) {
        console.error("Fetch error details:", {
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack
        });
        this.showMessage("Failed to load registered events", "error");
      }
    },
    async registerForEvent(eventId) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
        if (!userId) {
          this.showMessage("You need to be logged in to register for events.", "error");
          return;
        }
        console.log(`Registering user ${userId} for event ${eventId}`);
        await eventServices.registerStudent(eventId, userId);
        await this.fetchRegisteredEvents();
        this.showMessage("Registration successful!", "success");
        setTimeout(() => {
          this.showMyEvents = true;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
      } catch (error) {
        console.error("Error registering for event:", error);
        this.showMessage("Failed to register for the event.", "error");
      }
    },
    async cancelRegistration(eventId) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
        if (!userId) {
          this.showMessage("You need to be logged in to cancel registrations.", "error");
          return;
        }
        await eventServices.cancelRegistration(eventId, userId);
        await this.fetchRegisteredEvents();
        this.eventNotifications = this.eventNotifications.filter(notif => notif.eventId !== eventId);
        this.saveNotificationPreferences();
        this.showMessage('Registration canceled.', 'success');
      } catch (error) {
        console.error('Error canceling registration:', error);
        this.showMessage('Failed to cancel registration.', 'error');
      }
    },
    markAsAttended(event) {
      this.selectedEvent = event;
      this.attendanceCode = '';
      this.showAttendanceModal = true;
    },
    closeAttendanceModal() {
      this.showAttendanceModal = false;
      this.selectedEvent = null;
      this.attendanceCode = '';
    },
    // Updated verifyAttendance method for event.vue (student view)
    async verifyAttendance() {
      if (!this.selectedEvent) return;
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
        const eventId = this.selectedEvent.id;

        if (!userId) {
          this.showMessage("You need to be logged in to verify attendance.", "error");
          return;
        }

        // Clean attendance code
        const cleanCode = this.attendanceCode.trim();

        if (cleanCode === '') {
          this.showMessage('Please enter a valid attendance code', 'error');
          return;
        }

        console.log("Verifying attendance for event:", {
          eventId,
          eventName: this.selectedEvent.name,
          userId,
          code: cleanCode
        });

        // Check if the event has an attendance code set
        try {
          const eventResponse = await eventServices.getById(eventId);
          const eventData = eventResponse.data;
          
          console.log("Event data:", eventData);
          
          // If the event doesn't have an attendance code set
          if (!eventData.attendanceCode) {
            console.log("Event has no attendance code set. Attempting to generate one.");
            
            try {
              // For testing, generate and set a code
              const codeResponse = await eventServices.generateAttendanceCode(eventId);
              console.log("Code generation response:", codeResponse);
              
              const generatedCode = codeResponse.data?.code || codeResponse.data?.attendanceCode;
              
              if (generatedCode) {
                this.showMessage(`Event attendance code has been set to: ${generatedCode}. Please use this code.`, "info");
              } else {
                this.showMessage("An attendance code has been set for this event. Please ask the event organizer for the code.", "info");
              }
              
              // Close the modal to allow them to re-try with the new code
              this.closeAttendanceModal();
              return;
            } catch (codeError) {
              console.error("Failed to generate attendance code:", codeError);
              this.showMessage("Could not set an attendance code for this event. Please contact the event organizer.", "error");
              this.closeAttendanceModal();
              return;
            }
          }
          
          // Modified verification flow - change this section
          try {
            // If the code matches the event's code, mark as PENDING instead of completed
            if (eventData.attendanceCode && cleanCode === eventData.attendanceCode) {
              console.log("Code matches! Marking event as PENDING for admin approval");
              
              // Send verification to server
              try {
                await eventServices.verifyAttendance(eventId, userId, cleanCode);
                console.log("Server verification successful, awaiting admin approval");
              } catch (serverError) {
                console.log("Server verification failed:", serverError);
                // Continue with local pending state even if server fails
              }
              
              // Update local status to pending
              if (this.registeredEvents) {
                const registeredEvent = this.registeredEvents.find(e => e.id === eventId);
                if (registeredEvent) {
                  registeredEvent.status = 'pending';
                }
              }
              
              await this.fetchRegisteredEvents();
              this.closeAttendanceModal();
              this.showMessage('Attendance code accepted! Awaiting instructor approval for points.', 'success');
              return;
            }
            
            // Regular verification flow
            const response = await eventServices.verifyAttendance(eventId, userId, cleanCode);
            console.log("Verification response:", response);

            if (response && (response.success || response.data?.success)) {
              // Update to pending status instead of completed
              if (this.registeredEvents) {
                const registeredEvent = this.registeredEvents.find(e => e.id === eventId);
                if (registeredEvent) {
                  registeredEvent.status = 'pending';
                }
              }
              
              await this.fetchRegisteredEvents();
              this.closeAttendanceModal();
              this.showMessage('Attendance verification submitted and awaiting approval', 'success');
            } else {
              this.showMessage(response.message || 'Invalid attendance code', 'error');
            }
          } catch (verifyError) {
            console.error('Error verifying attendance:', verifyError);
            console.error("Verification error response:", verifyError.response?.data);
            
            // If verification failed but the code matches, still move to pending
            if (eventData.attendanceCode && cleanCode === eventData.attendanceCode) {
              console.log("Server verification failed but code matches. Marking as pending.");
              
              // Update to pending only, not completed
              if (this.registeredEvents) {
                const registeredEvent = this.registeredEvents.find(e => e.id === eventId);
                if (registeredEvent) {
                  registeredEvent.status = 'pending';
                }
              }
              
              await this.fetchRegisteredEvents();
              this.closeAttendanceModal();
              this.showMessage('Attendance code accepted! Awaiting instructor approval for points.', 'success');
              return;
            }
            
            if (verifyError.response?.status === 400) {
              // Try to extract the specific error message
              const errorMessage = verifyError.response?.data?.message || '';
              this.showMessage(errorMessage || 'Invalid attendance code. Please try again.', 'error');
            } else {
              this.showMessage('Error verifying attendance. Please try again later.', 'error');
            }
          }
        } catch (eventError) {
          console.error('Error fetching event details:', eventError);
          this.showMessage('Could not verify attendance due to an error fetching event details.', 'error');
          this.closeAttendanceModal();
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        this.showMessage('An unexpected error occurred. Please try again.', 'error');
        this.closeAttendanceModal();
      }
    },
    // Add this to the methods in event.vue
    updateEventStatus(eventId, newStatus) {
      // Update in registered events
      if (this.registeredEvents) {
        const event = this.registeredEvents.find(e => e.id === eventId);
        if (event) {
          event.status = newStatus;
        }
      }
      
      // If the event was already in completed events, remove it if status is not 'completed'
      if (newStatus !== 'completed' && this.completedEvents) {
        this.completedEvents = this.completedEvents.filter(e => e.id !== eventId);
      }
      
      // Handle the event completions local storage
      if (newStatus === 'completed') {
        // Add to completions if not already there
        if (!this.eventCompletions.some(completion => completion.eventId === eventId)) {
          this.eventCompletions.push({ 
            eventId, 
            completionDate: new Date().toISOString() 
          });
          this.saveEventCompletions();
        }
      } else {
        // Remove from completions if not completed
        this.eventCompletions = this.eventCompletions.filter(
          completion => completion.eventId !== eventId
        );
        this.saveEventCompletions();
      }
      
      this.updateCompletedEventsList();
    },
    addToGoogleCalendar(event) {
      const startDate = this.formatGoogleCalendarDate(event.date, event.start_time);
      const endDate = this.formatGoogleCalendarDate(event.date, event.end_time);
      const title = encodeURIComponent(event.name);
      const details = encodeURIComponent(event.description);
      const location = encodeURIComponent(event.location);
      const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}&sf=true&output=xml`;
      window.open(googleCalendarUrl, '_blank');
    },
    formatGoogleCalendarDate(date, time) {
      const dateTime = new Date(`${date}T${time}`);
      return dateTime.toISOString().replace(/[-:]|\.\d{3}/g, '');
    },
    isNotificationSupported() {
      return 'Notification' in window;
    },
    requestNotificationPermission() {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    },
    showMessage(message, type = 'success') {
      this.message = message;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
};
</script>

<style scoped>
.events-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section-title {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  padding: 10px;
  border-radius: 0;
  color: white;
  background-color: #48111c; /* Dark maroon as requested */
}

.event-list {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.event-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-title {
  color: #333;
  font-size: 18px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.event-description {
  color: #555;
  margin-bottom: 15px;
}

.event-details {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.event-details p {
  margin: 8px 0;
}

.action-container {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.message {
  margin: 20px auto;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  max-width: 600px;
}

.success {
  background-color: #f4f4f4;
  color: #333;
  border: 1px solid #ddd;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

button {
  padding: 8px 16px;
  border-radius: 0;
  cursor: pointer;
  border: none;
  font-weight: normal;
}

/* Button group styling */
.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.main-buttons {
  justify-content: center;
  margin: 25px 0;
}

/* Primary and secondary buttons - simplified */
.primary-button {
  background-color: #48111c;
  color: white;
}

.secondary-button {
  background-color: #E9967A; /* Using a more muted color */
  color: white;
}

/* Register button styling - simplified */
.register-button {
  background-color: #48111c;
  color: white;
  width: 100%;
}

/* Keep original colors for these specific buttons */
.cancel-button {
  background-color: #dc3545;
  color: white;
}

.verify-button {
  background-color: #28a745; /* Green for Enter Attendance Code */
  color: white;
}

.calendar-button {
  background-color: #708e9a; /* Original blue-gray color */
  color: white;
}

.notification-button {
  background-color: #6f42c1; /* Original purple color */
  color: white;
}

.reset-button {
  background-color: #d5dfe7; 
  color: #48111c;
  border: 1px solid #48111c;
}

/* Button hover effects - simplified */
button:hover {
  opacity: 0.9;
}

/* Status tag styling - simplified */
.pending-tag, .completed-tag {
  display: inline-block;
  padding: 5px 10px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 0;
  margin: 10px 0;
  font-weight: normal;
}

/* Modal styling - keeping functional, simplifying appearance */
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
  border-radius: 0;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 15px;
}

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 0;
}

.small-text {
  font-size: 0.9em;
  color: #666;
}

.save-button {
  background-color: #48111c;
  color: white;
}
</style>
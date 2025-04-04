<template>
    <div class="admin-events-container">
      <h1>Event Management</h1>
      
      <!-- Event List -->
      <div class="event-list">
        <h2>All Events</h2>
        <button @click="showAddEventModal = true" class="add-button">Add New Event</button>
        
        <table v-if="events.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Major</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id">
              <td>{{ event.name }}</td>
              <td>{{ formatDate(event.date) }}</td>
              <td>{{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }}</td>
              <td>{{ event.location }}</td>
              <td>{{ event.major }}</td>
              <td>{{ event.event_type }}</td>
              <td class="actions">
                <button @click="openEditModal(event)" class="edit-button">Edit</button>
                <button @click="confirmDelete(event)" class="delete-button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No events found. Add your first event!</p>
      </div>
      
      <!-- Add/Edit Event Modal -->
      <div v-if="showAddEventModal || showEditEventModal" class="modal-overlay">
        <div class="modal">
          <h3>{{ showEditEventModal ? 'Edit Event' : 'Add New Event' }}</h3>
          <form @submit.prevent="showEditEventModal ? updateEvent() : addEvent()">
            <div class="form-group">
              <label for="event-name">Event Name*</label>
              <input 
                id="event-name" 
                v-model="eventForm.name" 
                type="text" 
                required
                placeholder="Enter event name"
              >
            </div>
            
            <div class="form-group">
              <label for="event-description">Description*</label>
              <textarea 
                id="event-description" 
                v-model="eventForm.description" 
                required
                placeholder="Enter event description"
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group form-group-half">
                <label for="event-date">Date*</label>
                <input 
                  id="event-date" 
                  v-model="eventForm.date" 
                  type="date" 
                  required
                >
              </div>
              
              <div class="form-group form-group-half">
                <label for="event-major">Major*</label>
                <input 
                  id="event-major" 
                  v-model="eventForm.major" 
                  type="text"
                  required
                  placeholder="Major/Department"
                >
              </div>


              <div class="form-group form-group-half">
                <label for="event-semester">Semester*</label>
                <input 
                  id="event-semester" 
                  v-model="eventForm.semester" 
                  type="text"
                  required
                  placeholder="Semester"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group form-group-half">
                <label for="event-start-time">Start Time*</label>
                <input 
                  id="event-start-time" 
                  v-model="eventForm.start_time" 
                  type="time" 
                  required
                >
              </div>
              
              <div class="form-group form-group-half">
                <label for="event-end-time">End Time*</label>
                <input 
                  id="event-end-time" 
                  v-model="eventForm.end_time" 
                  type="time" 
                  required
                >
              </div>
            </div>
            
            <div class="form-group">
              <label for="event-location">Location</label>
              <input 
                id="event-location" 
                v-model="eventForm.location" 
                type="text"
                placeholder="Event location"
              >
            </div>
            
            <div class="form-group">
              <label for="event-type">Event Type</label>
              <input 
                id="event-type" 
                v-model="eventForm.event_type" 
                type="text"
                placeholder="Type of event"
              >
            </div>
            
            <div class="button-group">
              <button 
                type="button" 
                @click="closeModal()" 
                class="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" class="save-button">
                {{ showEditEventModal ? 'Save Changes' : 'Add Event' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal delete-modal">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete the event <strong>"{{ eventToDelete?.name }}"</strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
          
          <div class="button-group">
            <button @click="showDeleteModal = false" class="cancel-button">Cancel</button>
            <button @click="deleteEvent()" class="delete-button">Delete Event</button>
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
  import eventServices from '../services/eventServices';
  import Utils from '../config/utils';
  
  export default {
    data() {
      return {
        events: [],
        showAddEventModal: false,
        showEditEventModal: false,
        showDeleteModal: false,
        eventToDelete: null,
        message: '',
        messageType: 'success',
        eventForm: {
          name: '',
          description: '',
          date: '',
          start_time: '',
          end_time: '',
          location: '',
          major: '',
          semester: '',
          event_type: ''
        }
      };
    },
    
    created() {
      // Check if user has admin rights
      if (!this.isAdmin()) {
        this.$router.push('/');
        return;
      }
      
      this.fetchEvents();
    },
    
    methods: {
      // Check if current user is admin
      isAdmin() {
        const user = Utils.getStore("user");
        return user && user.role === 'admin';
      },
      
      // Close any open modal
      closeModal() {
        this.showAddEventModal = false;
        this.showEditEventModal = false;
        this.resetForm();
      },
      
      // Fetch all events
      async fetchEvents() {
        try {
          const response = await eventServices.getAll();
          this.events = response.data;
        } catch (error) {
          console.error('Failed to fetch events', error);
          this.showMessage('Failed to load events.', 'error');
        }
      },
      
      // Open the edit modal with event data
      openEditModal(event) {
        this.eventForm = {
          id: event.id,
          name: event.name,
          description: event.description || '',
          date: this.formatDateForInput(event.date),
          start_time: this.formatTimeForInput(event.start_time),
          end_time: this.formatTimeForInput(event.end_time),
          location: event.location || '',
          major: event.major,
          semester: event.semester,
          event_type: event.event_type || ''
        };
        this.showEditEventModal = true;
      },
      
      // Prepare delete confirmation
      confirmDelete(event) {
        this.eventToDelete = event;
        this.showDeleteModal = true;
      },
      
      // Add a new event
      async addEvent() {
        try {
          // Format dates and times for API
          const formattedEvent = this.prepareEventData();
          
          const response = await eventServices.create(formattedEvent);
          this.events.push(response.data);
          this.showAddEventModal = false;
          this.resetForm();
          this.showMessage('Event created successfully!', 'success');
        } catch (error) {
          console.error('Failed to create event', error);
          this.showMessage('Failed to create event.', 'error');
        }
      },
      
      // Update an existing event
      async updateEvent() {
        try {
          // Format dates and times for API
          const formattedEvent = this.prepareEventData();
          
          await eventServices.update(this.eventForm.id, formattedEvent);
          
          // Update local events array with edited event
          const index = this.events.findIndex(e => e.id === this.eventForm.id);
          if (index !== -1) {
            // Use the response data or create a merged object
            await this.fetchEvents(); // Refresh events from server
          }
          
          this.showEditEventModal = false;
          this.resetForm();
          this.showMessage('Event updated successfully!', 'success');
        } catch (error) {
          console.error('Failed to update event', error);
          this.showMessage('Failed to update event.', 'error');
        }
      },
      
      // Delete an event
      async deleteEvent() {
        if (!this.eventToDelete?.id) return;
        
        try {
          await eventServices.delete(this.eventToDelete.id);
          
          // Remove from local events array
          this.events = this.events.filter(e => e.id !== this.eventToDelete.id);
          
          this.showDeleteModal = false;
          this.eventToDelete = null;
          this.showMessage('Event deleted successfully.', 'success');
        } catch (error) {
          console.error('Failed to delete event', error);
          this.showMessage('Failed to delete event.', 'error');
        }
      },
      
      // Prepare event data for API
      prepareEventData() {
        // Create a date object for start time
        const startDate = new Date(this.eventForm.date);
        const [startHours, startMinutes] = this.eventForm.start_time.split(':');
        startDate.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10));
        
        // Create a date object for end time
        const endDate = new Date(this.eventForm.date);
        const [endHours, endMinutes] = this.eventForm.end_time.split(':');
        endDate.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));
        
        return {
          name: this.eventForm.name,
          description: this.eventForm.description,
          date: new Date(this.eventForm.date).toISOString().split('T')[0],
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          location: this.eventForm.location,
          major: this.eventForm.major,
          semester: this.eventForm.semester,
          event_type: this.eventForm.event_type
        };
      },
      
      // Reset the form
      resetForm() {
        this.eventForm = {
          name: '',
          description: '',
          date: '',
          start_time: '',
          end_time: '',
          location: '',
          major: '',
          event_type: ''
        };
      },
      
      // Format date for display
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
      
      // Format time for display
      formatTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      },
      
      // Format date for input field (YYYY-MM-DD)
      formatDateForInput(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      },
      
      // Format time for input field (HH:MM)
      formatTimeForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toTimeString().slice(0, 5);
      },
      
      // Show a message (success or error)
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
  .admin-events-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1, h2, h3 {
    color: #333;
  }
  
  .event-list {
    margin-top: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f1f1f1;
  }
  
  .actions {
    white-space: nowrap;
    width: 150px;
  }
  
  .add-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    float: right;
  }
  
  .edit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }
  
  .delete-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
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
    padding: 25px;
    border-radius: 5px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .delete-modal {
    max-width: 400px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
  }
  
  .form-group-half {
    width: 50%;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cancel-button {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .save-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .warning-text {
    color: #dc3545;
    font-weight: bold;
  }
  
  /* Message styling */
  .message {
    margin-top: 20px;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
  }
  
  .success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
  }
  </style>
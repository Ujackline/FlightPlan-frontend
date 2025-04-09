<template>
    <div class="admin-events-container">
      <h1>Event Management</h1>
      
      <!-- Event List -->
      <div class="event-list">
        <div class="list-header">
          <h2>All Events</h2>
          <button @click="showAddEventModal = true" class="add-button">
            <span class="button-icon">+</span> Add New Event
          </button>
        </div>
        
        <table v-if="events.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Major</th>
              <th>Type</th>
              <th>Attendance Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id">
              <td><span class="event-name">{{ event.name }}</span></td>
              <td>{{ formatDate(event.date) }}</td>
              <td>{{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }}</td>
              <td>{{ event.location }}</td>
              <td>{{ event.major }}</td>
              <td>{{ event.event_type }}</td>
              <td>
                <span v-if="event.attendance_code" class="attendance-code">{{ event.attendance_code }}</span>
                <button v-else @click="generateAttendanceCode(event)" class="code-button">Generate Code</button>
              </td>
              <td class="actions">
                <button v-if="event.attendance_code" @click="sendAttendanceCode(event)" class="send-button">Send Code</button>
                <button @click="openEditModal(event)" class="edit-button">Edit</button>
                <button @click="confirmDelete(event)" class="delete-button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <div class="empty-icon">📋</div>
          <p>No events found. Add your first event!</p>
        </div>
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
            </div>
            
            <div class="form-row">
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
              
              <div class="form-group form-group-half">
                <label for="event-type">Event Type</label>
                <input 
                  id="event-type" 
                  v-model="eventForm.event_type" 
                  type="text"
                  placeholder="Type of event"
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
              <label for="event-location">Location*</label>
              <input 
                id="event-location" 
                v-model="eventForm.location" 
                type="text"
                required
                placeholder="Event location"
              >
            </div>
            
            <div class="form-group" v-if="showEditEventModal">
              <label for="attendance-code">Attendance Code</label>
              <div class="code-input-container">
                <input 
                  id="attendance-code" 
                  v-model="eventForm.attendance_code" 
                  type="text"
                  placeholder="Leave blank to generate automatically"
                >
                <button type="button" @click="generateNewCode()" class="code-button">Generate Code</button>
              </div>
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
      
      <!-- Send Attendance Code Modal -->
      <div v-if="showSendCodeModal" class="modal-overlay">
        <div class="modal">
          <h3>Send Attendance Code</h3>
          
          <div class="event-info">
            <div class="info-row">
              <span class="info-label">Event:</span>
              <span class="info-value">{{ selectedEvent?.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Code:</span>
              <span class="info-value code-display">{{ selectedEvent?.attendance_code }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="send-method">Distribution Method</label>
            <select id="send-method" v-model="sendMethod">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          
          <div class="form-group" v-if="sendMethod === 'email'">
            <label for="email-recipients">Email Recipients</label>
            <textarea 
              id="email-recipients" 
              v-model="emailRecipients" 
              placeholder="Enter email addresses, separated by commas"
            ></textarea>
            <div class="checkbox-container">
              <input type="checkbox" id="all-registered" v-model="sendToAllRegistered">
              <label for="all-registered" class="checkbox-label">Send to all registered students</label>
            </div>
          </div>
          
          <div class="form-group" v-if="sendMethod === 'sms'">
            <label for="sms-recipients">Phone Numbers</label>
            <textarea 
              id="sms-recipients" 
              v-model="smsRecipients" 
              placeholder="Enter phone numbers, separated by commas"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="message-template">Message Template</label>
            <textarea 
              id="message-template" 
              v-model="messageTemplate" 
              placeholder="Enter message to send with the attendance code"
            ></textarea>
            <p class="helper-text">Use {CODE} to include the attendance code in your message.</p>
          </div>
          
          <div class="button-group">
            <button @click="closeSendCodeModal()" class="cancel-button">Cancel</button>
            <button @click="submitSendCode()" class="send-button">Send Code</button>
          </div>
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
      <!-- Attendance & Registration Modal -->
  <div v-if="showAttendanceModal" class="modal-overlay">
    <div class="modal attendance-modal">
      <h3>Event Registrations & Attendance</h3>
      
      <div class="event-info">
        <div class="info-row">
          <span class="info-label">Event:</span>
          <span class="info-value">{{ selectedEvent?.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date:</span>
          <span class="info-value">{{ formatDate(selectedEvent?.date) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Code:</span>
          <span v-if="selectedEvent?.attendance_code" class="info-value code-display">{{ selectedEvent?.attendance_code }}</span>
          <button v-else @click="generateAttendanceCodeForEvent()" class="code-button">Generate Code</button>
        </div>
      </div>
      
      <div class="attendance-stats">
        <div class="stat-box">
          <span class="stat-value">{{ registrations.length }}</span>
          <span class="stat-label">Registered</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ attendedCount }}</span>
          <span class="stat-label">Attended</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ attendanceRate }}%</span>
          <span class="stat-label">Attendance Rate</span>
        </div>
      </div>
      
      <div class="filter-tools">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by name or email..." 
            class="search-input"
          >
        </div>
        <div class="filter-buttons">
          <button 
            @click="attendanceFilter = 'all'" 
            :class="['filter-button', attendanceFilter === 'all' ? 'active' : '']"
          >
            All
          </button>
          <button 
            @click="attendanceFilter = 'attended'" 
            :class="['filter-button', attendanceFilter === 'attended' ? 'active' : '']"
          >
            Attended
          </button>
          <button 
            @click="attendanceFilter = 'pending'" 
            :class="['filter-button', attendanceFilter === 'pending' ? 'active' : '']"
          >
            Not Attended
          </button>
        </div>
      </div>
      
      <div v-if="filteredRegistrations.length === 0" class="empty-registrations">
        <p v-if="registrations.length === 0">No students have registered for this event yet.</p>
        <p v-else>No students match your current filters.</p>
      </div>
      
      <table v-else class="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Student ID</th>
            <th>Registration Date</th>
            <th>Attendance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="registration in filteredRegistrations" :key="registration.id" :class="{'attended-row': registration.attended}">
            <td>{{ registration.student.name }}</td>
            <td>{{ registration.student.email }}</td>
            <td>{{ registration.student.studentId }}</td>
            <td>{{ formatDate(registration.registrationDate) }}</td>
            <td>
              <span v-if="registration.attended" class="status-badge attended">
                ✓ Attended
              </span>
              <span v-else class="status-badge pending">
                Pending
              </span>
            </td>
            <td>
              <button 
                @click="toggleAttendance(registration)" 
                :class="registration.attended ? 'undo-button' : 'mark-button'"
              >
                {{ registration.attended ? 'Mark as Not Attended' : 'Mark as Attended' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="export-section">
        <button @click="exportAttendanceData()" class="export-button">
          Export to CSV
        </button>
      </div>
      
      <div class="button-group">
        <button @click="closeAttendanceModal()" class="close-button">Close</button>
      </div>
    </div>
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
        showSendCodeModal: false,
        eventToDelete: null,
        selectedEvent: null,
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
          event_type: '',
          attendance_code: ''
        },
        sendMethod: 'email',
        emailRecipients: '',
        smsRecipients: '',
        sendToAllRegistered: true,
        messageTemplate: 'Your attendance code for {EVENT} is {CODE}. Please enter this code at the event to confirm your attendance.'
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
      
      // Generate a random attendance code
      generateRandomCode() {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters like O, 0, 1, I
        let code = '';
        
        for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }
        
        return code;
      },
      
      // Generate a new code for the form
      generateNewCode() {
        this.eventForm.attendance_code = this.generateRandomCode();
      },
      
      // Generate attendance code for an event
      async generateAttendanceCode(event) {
        try {
          const code = this.generateRandomCode();
          
          // In a real app, this would be an API call to update the event
          // await eventServices.updateAttendanceCode(event.id, code);
          
          // For now, let's just update it locally
          event.attendance_code = code;
          
          this.showMessage(`Attendance code generated for "${event.name}".`, 'success');
        } catch (error) {
          console.error('Failed to generate attendance code', error);
          this.showMessage('Failed to generate attendance code.', 'error');
        }
      },
      
      // Open the send code modal
      sendAttendanceCode(event) {
        this.selectedEvent = event;
        this.sendMethod = 'email';
        this.emailRecipients = '';
        this.smsRecipients = '';
        this.sendToAllRegistered = true;
        this.messageTemplate = `Your attendance code for ${event.name} is {CODE}. Please enter this code at the event to confirm your attendance.`;
        this.showSendCodeModal = true;
      },
      
      // Close the send code modal
      closeSendCodeModal() {
        this.showSendCodeModal = false;
        this.selectedEvent = null;
      },
      
      // Send the attendance code to recipients
      async submitSendCode() {
        if (!this.selectedEvent) return;
        
        try {
          const message = this.messageTemplate
            .replace('{CODE}', this.selectedEvent.attendance_code)
            .replace('{EVENT}', this.selectedEvent.name);
            
          let recipients = [];
          
          if (this.sendMethod === 'email') {
            if (this.sendToAllRegistered) {
              // In a real app, fetch all registered students' emails
              recipients = ['student1@example.com', 'student2@example.com']; // Placeholder
            } else {
              recipients = this.emailRecipients.split(',').map(email => email.trim()).filter(Boolean);
            }
            
            // Send emails (in a real app, this would be an API call)
            // await this.$axios.post('/api/notifications/email', {
            //   recipients,
            //   subject: `Attendance Code for ${this.selectedEvent.name}`,
            //   message
            // });
            
            console.log(`Sending email to ${recipients.length} recipients:`, message);
          } else if (this.sendMethod === 'sms') {
            recipients = this.smsRecipients.split(',').map(phone => phone.trim()).filter(Boolean);
            
            // Send SMS (in a real app, this would be an API call)
            // await this.$axios.post('/api/notifications/sms', {
            //   recipients,
            //   message
            // });
            
            console.log(`Sending SMS to ${recipients.length} recipients:`, message);
          }
          
          this.closeSendCodeModal();
          this.showMessage(`Attendance code sent to ${recipients.length} recipients.`, 'success');
        } catch (error) {
          console.error('Failed to send attendance code', error);
          this.showMessage('Failed to send attendance code.', 'error');
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
          semester: event.semester || '',
          event_type: event.event_type || '',
          attendance_code: event.attendance_code || ''
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
          
          // If no attendance code was provided, generate one
          if (!formattedEvent.attendance_code) {
            formattedEvent.attendance_code = this.generateRandomCode();
          }
          
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
          event_type: this.eventForm.event_type,
          attendance_code: this.eventForm.attendance_code
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
          semester: '',
          event_type: '',
          attendance_code: ''
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
    padding: 25px;
    font-family: 'Inter', 'Segoe UI', Roboto, -apple-system, sans-serif;
    color: #333;
  }
  
  h1 {
    color: #48111c;
    font-size: 32px;
    margin-bottom: 20px;
    font-weight: 600;
    border-bottom: 3px solid #f9c634;
    padding-bottom: 12px;
    width: fit-content;
  }
  
  h2 {
    color: #48111c;
    font-size: 24px;
    margin-bottom: 15px;
    font-weight: 500;
  }
  
  h3 {
    color: #48111c;
    font-size: 20px;
    margin-bottom: 20px;
    font-weight: 500;
  }
  
  .event-list {
    margin-top: 25px;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  th, td {
    border: none;
    padding: 14px 16px;
    text-align: left;
  }
  
  th {
    background-color: #d5dfe7;
    color: #48111c;
    font-weight: 600;
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  tr {
    border-bottom: 1px solid #eee;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f0f6ff;
  }
  
  tr:last-child {
    border-bottom: none;
  }
  
  .actions {
    white-space: nowrap;
    width: 200px;
  }
  
  .add-button {
    background-color: #f9c634;
    color: #333;
    border: none;
    padding: 10px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    float: right;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(249, 198, 52, 0.3);
  }
  
  .add-button:hover {
    background-color: #edbb2d;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(249, 198, 52, 0.4);
  }
  
  .edit-button {
    background-color: #708e9a;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 6px;
    transition: all 0.2s ease;
    font-weight: 500;
  }
  
  .edit-button:hover {
    background-color: #5a7985;
    transform: translateY(-1px);
  }
  
  .delete-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }
  
  .delete-button:hover {
    background-color: #c82333;
    transform: translateY(-1px);
  }
  
  .code-button {
    background-color: #f4ecd0;
    color: #48111c;
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }
  
  .code-button:hover {
    background-color: #eee0b9;
    transform: translateY(-1px);
  }
  
  .send-button {
    background-color: #f68d76;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 6px;
    transition: all 0.2s ease;
    font-weight: 500;
  }
  
  .send-button:hover {
    background-color: #f57a5f;
    transform: translateY(-1px);
  }
  
  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .delete-modal {
    max-width: 450px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .form-group-half {
    flex: 1;
    min-width: 200px;
  }
  
  .code-input-container {
    display: flex;
    gap: 10px;
  }
  
  .code-input-container input {
    flex-grow: 1;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #48111c;
    font-size: 14px;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 12px;
    border: 2px solid #d5dfe7;
    border-radius: 6px;
    font-size: 15px;
    transition: border-color 0.3s, box-shadow 0.3s;
    background-color: #f9fafb;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #708e9a;
    box-shadow: 0 0 0 3px rgba(112, 142, 154, 0.2);
    background-color: white;
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
    line-height: 1.5;
  }
  
  .checkbox-container {
    margin-top: 10px;
    background-color: #f0f5f9;
    padding: 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
  }
  
  .checkbox-container input {
    width: auto;
    margin-right: 8px;
  }
  
  .helper-text {
    font-size: 13px;
    color: #708e9a;
    margin-top: 6px;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 25px;
  }
  
  .cancel-button {
    background-color: #d5dfe7;
    color: #333;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .cancel-button:hover {
    background-color: #c4cfd8;
  }
  
  .save-button {
    background-color: #f9c634;
    color: #333;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(249, 198, 52, 0.3);
  }
  
  .save-button:hover {
    background-color: #edbb2d;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(249, 198, 52, 0.4);
  }
  
  .warning-text {
    color: #dc3545;
    font-weight: bold;
    background-color: rgba(220, 53, 69, 0.1);
    padding: 10px;
    border-radius: 5px;
    margin: 15px 0;
  }
  
  /* Message styling */
  .message {
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
    animation: fadeInUp 0.4s ease;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    position: fixed;
    bottom: 20px;
    right: 20px;
    max-width: 350px;
    z-index: 1000;
  }
  
  @keyframes fadeInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .success {
    background-color: #d5dfe7;
    color: #48111c;
    border-left: 5px solid #f9c634;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    border-left: 5px solid #dc3545;
  
  }
  /* Additional styles to complete the professional look */
  
  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
  }
  
  .button-icon {
    margin-right: 5px;
    font-weight: bold;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    background-color: #f9f9fb;
    border-radius: 10px;
    margin: 20px 0;
    border: 2px dashed #d5dfe7;
  }
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 15px;
    color: #708e9a;
  }
  
  .event-name {
    font-weight: 500;
    color: #48111c;
  }
  
  .attendance-code {
    background-color: #f4ecd0;
    padding: 6px 10px;
    border-radius: 4px;
    font-family: monospace;
    letter-spacing: 1px;
    color: #48111c;
    font-weight: bold;
    font-size: 14px;
    display: inline-block;
  }
  
  .event-info {
    background-color: #f0f5f9;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #f9c634;
  }
  
  .info-row {
    display: flex;
    margin-bottom: 8px;
  }
  
  .info-row:last-child {
    margin-bottom: 0;
  }
  
  .info-label {
    font-weight: 600;
    width: 80px;
    color: #48111c;
  }
  
  .info-value {
    flex-grow: 1;
  }
  
  .code-display {
    background-color: #f4ecd0;
    padding: 5px 10px;
    border-radius: 4px;
    font-family: monospace;
    letter-spacing: 1px;
    font-weight: bold;
    color: #48111c;
  }
  
  .checkbox-label {
    display: inline;
    margin-bottom: 0;
    font-weight: normal;
    /* Attendance modal specific styles */
  .attendance-modal {
    max-width: 900px;
    width: 95%;
  }
  
  .attendance-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 25px;
  }
  
  .stat-box {
    flex: 1;
    background-color: #f4ecd0;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .stat-value {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: #48111c;
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #708e9a;
    font-weight: 500;
  }
  
  .filter-tools {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .search-box {
    flex: 1;
    min-width: 250px;
  }
  
  .search-input {
    padding: 10px 15px;
    border-radius: 6px;
    border: 2px solid #d5dfe7;
    width: 100%;
    font-size: 14px;
  }
  
  .filter-buttons {
    display: flex;
    gap: 10px;
  }
  
  .filter-button {
    background-color: #d5dfe7;
    border: none;
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    color: #333;
    transition: all 0.2s;
  }
  
  .filter-button.active {
    background-color: #708e9a;
    color: white;
  }
  
  .attendance-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    font-size: 14px;
  }
  
  .attendance-table th {
    background-color: #d5dfe7;
    padding: 12px;
    text-align: left;
    font-weight: 600;
  }
  
  .attendance-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }
  
  .attended-row {
    background-color: rgba(244, 236, 208, 0.2);
  }
  
  .status-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .status-badge.attended {
    background-color: #f4ecd0;
    color: #48111c;
  }
  
  .status-badge.pending {
    background-color: #d5dfe7;
    color: #708e9a;
  }
  
  .mark-button, .undo-button {
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }
  
  .mark-button {
    background-color: #f68d76;
    color: white;
  }
  
  .undo-button {
    background-color: #708e9a;
    color: white;
  }
  
  .empty-registrations {
    padding: 30px;
    text-align: center;
    background-color: #f9f9fb;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px dashed #d5dfe7;
    color: #708e9a;
  }
  
  .export-section {
    margin-top: 15px;
    margin-bottom: 20px;
    text-align: right;
  }
  
  .export-button {
    background-color: #48111c;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  
  .close-button {
    background-color: #d5dfe7;
    color: #48111c;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }
  
  .attendance-button {
    background-color: #48111c;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 6px;
    transition: all 0.2s ease;
    font-weight: 500;
  }
  
  .attendance-button:hover {
    background-color: #5e1a27;
    transform: translateY(-1px);
  }
  }
  </style>
<template>
  <div class="admin-events-container">
    <h1>Event Management</h1>
    
   <!-- Form -->
<section v-if="showForm" class="event-list">
  <h3>{{ editing ? "Edit Event" : "Add New Event" }}</h3>
  <form @submit.prevent="editing ? updateEvent() : addEvent()">
    <div class="form-row">
      <div class="form-group form-group-half" v-for="field in fields" :key="field.name">
        <label :for="field.name">{{ field.label }}</label>
        <input v-if="field.type !== 'textarea' && field.type !== 'checkbox' && field.type !== 'time'" :type="field.type" :id="field.name" v-model="event[field.name]" />
        <input v-else-if="field.type === 'time'" :type="field.type" :id="field.name" v-model="event[field.name]" />
        <textarea v-else-if="field.type === 'textarea'" :id="field.name" v-model="event[field.name]"></textarea>
        <div v-else-if="field.type === 'checkbox'" class="checkbox-container">
          <input type="checkbox" :id="field.name" v-model="event[field.name]" />
          <label :for="field.name" class="checkbox-label">{{ field.label }}</label>
        </div>
      </div>
    </div>
    <div class="button-group">
      <button type="button" class="cancel-button" @click="resetForm">Cancel</button>
      <button type="submit" class="save-button">{{ editing ? "Update" : "Add" }} Event</button>
    </div>
  </form>
</section>

<!-- Add Button -->
<div class="list-header" v-if="!showForm">
  <h2>All Events</h2>
  <div class="action-buttons">
    <button @click="navigateToAttendanceTracking" class="tracking-button">
      <span class="button-icon">👥</span> Track Attendance
    </button>
    <button v-if="isAdmin" @click="toggleForm" class="add-button">
      <span class="button-icon">+</span> Add New Event
    </button>
  </div>
</div>

<!-- Pending Approvals Section -->
<div v-if="isAdmin && pendingApprovals.length > 0" class="approval-section">
  <h3>Pending Attendance Approvals</h3>
  <div v-for="approval in pendingApprovals" :key="`${approval.eventId}-${approval.studentId}`" class="approval-item">
    <div class="approval-info">
      <div class="student-name">{{ approval.studentName }}</div>
      <div class="event-name">{{ approval.eventName }}</div>
      <div class="verification-date">{{ formatDate(approval.verificationDate) }}</div>
    </div>
    <div class="points-input">
      <label for="points">Points:</label>
      <input type="number" v-model="approval.points" min="0" max="100" />
    </div>
    <div class="approval-actions">
      <button @click="approveAttendance(approval)" class="approve-button">Approve</button>
      <button @click="rejectAttendance(approval)" class="reject-button">Reject</button>
    </div>
  </div>
</div>

<!-- Event Cards -->
<section v-if="events.length > 0" class="event-list">
  <div v-for="evt in events" :key="evt.id" class="experience-item-row">
    <!-- Name and Info -->
    <div class="event-info-col">
      <span class="event-name">{{ evt.name }}</span>
      <div class="event-details">
        <span class="event-date">{{ formatDate(evt.date) }}</span>
        <span class="event-time">{{ formatTime(evt.start_time) }} - {{ formatTime(evt.end_time) }}</span>
      </div>
    </div>

    <!-- Status (only for students) -->
    <div v-if="!isAdmin" class="event-status">
      <span class="status-label" :class="evt.status?.toLowerCase()">
        {{ evt.status }}
      </span>
    </div>

    <!-- Attendance Code -->
    <div class="event-code-col">
      <span v-if="evt.attendance_code && isAdmin" class="attendance-code">{{ evt.attendance_code }}</span>
      <button v-else-if="isAdmin" @click="generateAttendanceCode(evt)" class="code-button">Generate Code</button>
    </div>

    <!-- For students to mark attendance with a code -->
    <div v-if="!isAdmin && evt.status !== 'attended' && evt.status !== 'pending'" class="enter-code-container">
      <input 
        type="text" 
        v-model="attendanceCode" 
        placeholder="Enter attendance code" 
        class="attendance-code-input"
      />
      <button 
        @click="verifyAttendance(evt)" 
        class="verify-button"
      >
        Verify Attendance
      </button>
    </div>

    <!-- Actions -->
    <div class="event-actions">
      <button class="view-button" @click="viewEvent(evt)">View</button>
      <button 
        v-if="isAdmin && evt.attendance_code" 
        @click="sendAttendanceCode(evt)" 
        class="send-button"
      >
        Send Code
      </button>
      <button
        v-if="!isAdmin && evt.status !== 'attended' && evt.status !== 'pending'"
        class="mark-button"
        @click="markAsAttended(evt)"
      >
        Mark Attended
      </button>
      <button v-if="isAdmin" class="edit-button" @click="editEvent(evt)">Edit</button>
      <button v-if="isAdmin" class="delete-button" @click="confirmDelete(evt)">Delete</button>
    </div>
  </div>
</section>

<!-- No Events -->
<div v-else class="empty-state">
  <div class="empty-icon">📋</div>
  <p>No events found. Add your first event!</p>
</div>

<!-- Event Details Modal -->
<div v-if="selectedEvent" class="modal-overlay">
  <div class="modal">
    <h3>{{ selectedEvent.name }}</h3>
    <p><strong>Description:</strong> {{ selectedEvent.description }}</p>
    <p><strong>Date:</strong> {{ formatDate(selectedEvent.date) }}</p>
    <p><strong>Time:</strong> {{ formatTime(selectedEvent.start_time) }} - {{ formatTime(selectedEvent.end_time) }}</p>
    <p><strong>Location:</strong> {{ selectedEvent.location }}</p>
    <p><strong>Type:</strong> {{ selectedEvent.event_type }}</p>
    <p><strong>Major:</strong> {{ selectedEvent.major }}</p>
    <p><strong>Semester:</strong> {{ selectedEvent.semester }}</p>
    <p v-if="selectedEvent.attendance_code && isAdmin"><strong>Attendance Code:</strong> <span class="code-display">{{ selectedEvent.attendance_code }}</span></p>
    <p v-if="!isAdmin"><strong>Status:</strong> <span :class="['status-label', selectedEvent.status?.toLowerCase()]">{{ selectedEvent.status }}</span></p>
    <p v-if="!isAdmin && selectedEvent.pointsEarned"><strong>Points Earned:</strong> {{ selectedEvent.pointsEarned }}</p>
    <p v-if="!isAdmin && selectedEvent.attendanceDate"><strong>Attendance Date:</strong> {{ formatDate(selectedEvent.attendanceDate) }}</p>
    
    <!-- Admin-specific actions -->
    <div v-if="isAdmin && selectedEvent.status === 'registered'">
      <h4>Student Actions</h4>
      <button class="attendance-button" @click="approveAttendance(selectedEvent)">Approve Attendance</button>
      <button class="delete-button" @click="rejectAttendance(selectedEvent)">Reject Attendance</button>
    </div>
    
    <!-- Student reflection section (if event is attended) -->
    <div v-if="!isAdmin && selectedEvent.status === 'attended' && !selectedEvent.reflectionText">
      <h4>Event Reflection</h4>
      <textarea 
        v-model="reflectionText" 
        placeholder="Share your thoughts and reflections about this event..." 
        class="reflection-textarea"
      ></textarea>
      <button class="save-button" @click="submitReflection(selectedEvent)">Submit Reflection</button>
    </div>
    
    <!-- View reflection if present -->
    <div v-if="selectedEvent.reflectionText">
      <h4>Your Reflection</h4>
      <p>{{ selectedEvent.reflectionText }}</p>
    </div>
    
    <button class="close-button" @click="selectedEvent = null">Close</button>
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
      </select>
    </div>
    
    <div class="form-group" v-if="sendMethod === 'email'">
      <div class="checkbox-container">
        <input type="checkbox" id="all-registered" v-model="sendToAllRegistered">
        <label for="all-registered" class="checkbox-label">Send to all registered students</label>
      </div>
      
      <div v-if="!sendToAllRegistered">
        <label for="email-recipients">Email Recipients</label>
        <textarea 
          id="email-recipients" 
          v-model="emailRecipients" 
          placeholder="Enter email addresses, separated by commas"
        ></textarea>
      </div>
      
      <div v-else>
        <p class="helper-text">The attendance code will be sent to all students registered for this event.</p>
      </div>
    </div>
    
    <div class="form-group">
      <label for="message-template">Message Template</label>
      <textarea 
        id="message-template" 
        v-model="messageTemplate" 
        placeholder="Enter message to send with the attendance code"
      ></textarea>
      <p class="helper-text">Use {CODE} to include the attendance code and {EVENT} for the event name in your message.</p>
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
    <div class="warning-text">This action cannot be undone.</div>
    
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
import studentServices from '../services/studentServices';

export default {
  data() {
    return {
      events: [],
      event: {
        id: null,
        name: "",
        description: "",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
        event_type: "",
        major: "",
        semester: "",
        attendance_code: ""
      },
      editing: false,
      selectedEvent: null,
      eventToDelete: null,
      showForm: false,
      showDeleteModal: false,
      showSendCodeModal: false,
      isAdmin: false,
      isStudent: false,
      message: '',
      messageType: 'success',
      sendMethod: 'email',
      emailRecipients: '',
      sendToAllRegistered: true,
      messageTemplate: 'Your attendance code for {EVENT} is {CODE}. Please enter this code at the event to confirm your attendance.',
      reflectionText: '',
      pendingApprovals: [], // Array to store pending attendance approvals
      attendanceCode: '', // For input field
      fields: [
        { name: "name", label: "Event Name", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "date", label: "Date", type: "date" },
        { name: "start_time", label: "Start Time", type: "time" },
        { name: "end_time", label: "End Time", type: "time" },
        { name: "location", label: "Location", type: "text" },
        { name: "event_type", label: "Event Type", type: "text" },
        { name: "major", label: "Major", type: "text" },
        { name: "semester", label: "Semester", type: "text" },
        { name: "points", label: "Points", type: "number" }
      ],
    };
  },
  async mounted() {
    this.checkUserRole();
    await this.fetchEvents();
    
    // If user is admin, fetch pending approvals
    if (this.isAdmin) {
      await this.fetchPendingApprovals();
    }
  },
  methods: {
    checkUserRole() {
      // Determine if user is admin or student
      const user = JSON.parse(localStorage.getItem("user"));
      this.isAdmin = user && user.role === "admin";
      this.isStudent = user && user.role === "student";
    },
    
    async fetchEvents() {
      try {
        if (this.isAdmin) {
          // Admins: Get all events
          const response = await eventServices.getAll();
          this.events = response.data || response;
          return;
        }

        // Students: Get user from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const studentId = storedUser?.id;
        if (!studentId) {
          console.warn("No student ID found.");
          return;
        }

        // Get student info (to fetch semester)
        const student = await studentServices.getStudentById(studentId);
        const semester = student.semester || student.grad_semester;
        if (!semester) {
          console.warn("Student record is missing semester info.");
          return;
        }

        // Get all events for this semester
        const all = await eventServices.getEventsBySemester(semester);
        const allEvents = all.data || all;

        // Get student-specific progress
        const studentEvents = await eventServices.getStudentEvents(studentId);
        const studentEventData = studentEvents.data || studentEvents || [];

        // Merge student progress into events
        const merged = allEvents.map(evt => {
          const match = studentEventData.find(se => 
            se.eventId === evt.id || se.event?.id === evt.id
          );

          return {
            ...evt,
            status: match?.status || 'Not Registered',
            attendanceDate: match?.attendanceDate || null,
            pointsEarned: match?.pointsEarned || 0,
            reflectionText: match?.reflectionText || null,
            studentEventId: match?.id || null
          };
        });

        this.events = merged;
      } catch (error) {
        console.error("Error fetching events:", error);
        this.showMessage("Failed to load events", "error");
      }
    },

    async fetchPendingApprovals() {
      try {
        // Fetch pending approvals from the server
        const response = await eventServices.getPendingApprovals();
        console.log("Pending approvals:", response.data);
        
        // Make sure we have an array
        this.pendingApprovals = (response.data || []).map(approval => ({
          ...approval,
          points: approval.event?.points || 50 // Default to 50 points
        }));
        
        console.log("Processed pending approvals:", this.pendingApprovals);
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
        this.showMessage("Failed to load pending approvals", "error");
      }
    },

    async addEvent() {
      try {
        console.log("Form data being submitted:", this.event);
        
        // Validate all required fields
        if (!this.event.name || !this.event.date || 
            !this.event.major || !this.event.semester) {
          this.showMessage('Please fill in all required fields', 'error');
          return;
        }
        
        // Prepare form data for submission
        const eventData = { ...this.event };
        
        // Get date part from the date field
        const dateString = eventData.date; // Format: "2025-04-24"
        
        // Handle start time - combine with date for a full datetime
        if (eventData.start_time) {
          // Convert time like "14:51" to a valid datetime
          try {
            const [hours, minutes] = eventData.start_time.split(':');
            const startDateTime = new Date(dateString);
            startDateTime.setHours(parseInt(hours, 10));
            startDateTime.setMinutes(parseInt(minutes, 10));
            startDateTime.setSeconds(0);
            eventData.start_time = startDateTime.toISOString();
            console.log("Formatted start_time:", eventData.start_time);
          } catch (e) {
            console.error("Error formatting start time:", e);
            eventData.start_time = null;
          }
        }
        
        // Handle end time - combine with date for a full datetime
        if (eventData.end_time) {
          // Convert time like "16:15" to a valid datetime
          try {
            const [hours, minutes] = eventData.end_time.split(':');
            const endDateTime = new Date(dateString);
            endDateTime.setHours(parseInt(hours, 10));
            endDateTime.setMinutes(parseInt(minutes, 10));
            endDateTime.setSeconds(0);
            eventData.end_time = endDateTime.toISOString();
            console.log("Formatted end_time:", eventData.end_time);
          } catch (e) {
            console.error("Error formatting end time:", e);
            eventData.end_time = null;
          }
        }
        
        // Make sure the date is also properly formatted
        try {
          const dateObj = new Date(eventData.date);
          eventData.date = dateObj.toISOString();
        } catch (e) {
          console.error("Error formatting date:", e);
        }
        
        console.log("Sending event data:", eventData);
        
        const response = await eventServices.create(eventData);
        console.log("Event created successfully:", response.data);
        this.events.push(response.data);
        this.showMessage('Event created successfully', 'success');
        this.resetForm();
      } catch (error) {
        console.error("Error adding event:", error);
        
        // Extract error message from the response if available
        let errorMessage = 'Failed to create event. Please try again.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.showMessage(errorMessage, 'error');
      }
    },

    viewEvent(evt) {
      this.selectedEvent = evt;
    },
    
    toggleForm() {
      this.showForm = !this.showForm;
      if (!this.showForm) this.resetForm();
    },
    
    resetForm() {
      this.event = { 
        id: null, 
        name: "", 
        description: "", 
        date: "", 
        start_time: "", 
        end_time: "", 
        location: "", 
        event_type: "", 
        major: "",
        semester: "",
        points: 50
      };
      this.editing = false;
      this.showForm = false;
    },

    editEvent(evt) {
      // Format date and time for form inputs
      const eventDate = new Date(evt.date);
      const formattedDate = eventDate.toISOString().split('T')[0];
      
      let startTime = "";
      if (evt.start_time) {
        const startDate = new Date(evt.start_time);
        startTime = startDate.toTimeString().slice(0, 5);
      }
      
      let endTime = "";
      if (evt.end_time) {
        const endDate = new Date(evt.end_time);
        endTime = endDate.toTimeString().slice(0, 5);
      }
      
      this.event = { 
        ...evt,
        date: formattedDate,
        start_time: startTime,
        end_time: endTime
      };
      
      this.editing = true;
      this.showForm = true;
    },
    
    async updateEvent() {
      try {
        // Format the dates/times like in addEvent
        const eventData = { ...this.event };
        const dateString = eventData.date;
        
        if (eventData.start_time) {
          try {
            const [hours, minutes] = eventData.start_time.split(':');
            const startDateTime = new Date(dateString);
            startDateTime.setHours(parseInt(hours, 10));
            startDateTime.setMinutes(parseInt(minutes, 10));
            startDateTime.setSeconds(0);
            eventData.start_time = startDateTime.toISOString();
          } catch (e) {
            console.error("Error formatting start time:", e);
          }
        }
        
        if (eventData.end_time) {
          try {
            const [hours, minutes] = eventData.end_time.split(':');
            const endDateTime = new Date(dateString);
            endDateTime.setHours(parseInt(hours, 10));
            endDateTime.setMinutes(parseInt(minutes, 10));
            endDateTime.setSeconds(0);
            eventData.end_time = endDateTime.toISOString();
          } catch (e) {
            console.error("Error formatting end time:", e);
          }
        }
        
        try {
          const dateObj = new Date(eventData.date);
          eventData.date = dateObj.toISOString();
        } catch (e) {
          console.error("Error formatting date:", e);
        }
        
        await eventServices.update(this.event.id, eventData);
        this.fetchEvents();
        this.resetForm();
        this.showMessage('Event updated successfully', 'success');
      } catch (error) {
        console.error("Error updating event:", error);
        this.showMessage('Failed to update event', 'error');
      }
    },
    
    confirmDelete(evt) {
      this.eventToDelete = evt;
      this.showDeleteModal = true;
    },
    
    async deleteEvent() {
      try {
        await eventServices.delete(this.eventToDelete.id);
        this.events = this.events.filter(e => e.id !== this.eventToDelete.id);
        this.showDeleteModal = false;
        this.eventToDelete = null;
        this.showMessage('Event deleted successfully', 'success');
      } catch (error) {
        console.error("Error deleting event:", error);
        this.showMessage('Failed to delete event', 'error');
      }
    },
    
    async generateAttendanceCode(evt) {
      try {
        const response = await eventServices.generateAttendanceCode(evt.id);
        if (response && response.data && response.data.code) {
          evt.attendance_code = response.data.code;
          this.showMessage(`Attendance code generated: ${response.data.code}`, 'success');
        } else {
          // Fallback if API doesn't return a code
          const code = this.generateRandomCode();
          evt.attendance_code = code;
          this.showMessage(`Attendance code generated: ${code}`, 'success');
        }
      } catch (error) {
        console.error("Error generating attendance code:", error);
        this.showMessage('Failed to generate attendance code', 'error');
      }
    },
    
    generateRandomCode() {
      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      return Array.from({length: 6}, () => 
        characters[Math.floor(Math.random() * characters.length)]
      ).join('');
    },
    
    navigateToAttendanceTracking() {
      this.$router.push({ name: 'attendance-tracking' });
    },
    
    sendAttendanceCode(evt) {
      this.selectedEvent = evt;
      this.showSendCodeModal = true;
    },
    
    closeSendCodeModal() {
      this.showSendCodeModal = false;
      this.selectedEvent = null;
    },
    
    async submitSendCode() {
      try {
        const eventName = this.selectedEvent.name;
        const code = this.selectedEvent.attendance_code;
        
        if (!code) {
          this.showMessage('No attendance code available', 'error');
          return;
        }
        
        let recipients = [];
        if (this.sendToAllRegistered) {
          // Get all registered students
          const registrations = await eventServices.getEventRegistrations(this.selectedEvent.id);
          if (registrations && registrations.registrations) {
            recipients = registrations.registrations
              .filter(r => r.student && r.student.email)
              .map(r => r.student.email);
          }
        } else {
          // Use manually entered recipients
          recipients = this.emailRecipients.split(',').map(email => email.trim());
        }
        
        if (recipients.length === 0) {
          this.showMessage('No recipients specified', 'error');
          return;
        }
        
        // Replace placeholders in template
        const message = this.messageTemplate
          .replace(/{CODE}/g, code)
          .replace(/{EVENT}/g, eventName);
        
        // Send the email through your service
        await eventServices.sendAttendanceCode({
          eventId: this.selectedEvent.id,
          recipients: recipients,
          message: message
        });
        
        this.showMessage(`Attendance code sent to ${recipients.length} recipients`, 'success');
        this.closeSendCodeModal();
      } catch (error) {
        console.error("Error sending attendance code:", error);
        this.showMessage('Failed to send attendance code', 'error');
      }
    },
    
    async markAsAttended(evt) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await eventServices.markAttendance(evt.id, user.id);
        
        // Update status to pending instead of directly to attended
        evt.status = 'pending';
        evt.attendanceDate = new Date();
        
        this.showMessage('Attendance verification submitted and awaiting approval', 'success');
      } catch (error) {
        console.error("Error marking attendance:", error);
        this.showMessage('Failed to mark attendance', 'error');
      }
    },
    
    async approveAttendance(approval) {
      try {
        // Extract the correct IDs based on whether it's from pending approvals or an event modal
        const eventId = approval.eventId || approval.id;
        const studentId = approval.studentId || (approval.student && approval.student.id);
        
        if (!studentId || !eventId) {
          console.error("Missing student or event ID:", { approval });
          this.showMessage('Student or event information not found', 'error');
          return;
        }
        
        // Default points value from event, or 50 if not specified
        const points = approval.points || 50;
        
        console.log(`Approving attendance: eventId=${eventId}, studentId=${studentId}, points=${points}`);
        
        await eventServices.approveAttendance(eventId, studentId, {
          points: points
        });
        
        // If this came from the pending approvals list, remove it
        if (this.pendingApprovals) {
          this.pendingApprovals = this.pendingApprovals.filter(
            a => !(a.eventId === eventId && a.studentId === studentId)
          );
        }
        
        // Update the event status if applicable
        if (approval.hasOwnProperty('status')) {
          approval.status = 'attended';
          approval.pointsEarned = points;
        }
        
        this.showMessage('Attendance approved and points awarded', 'success');
        
        // Close the modal if this was from the event detail view
        if (this.selectedEvent && this.selectedEvent.id === eventId) {
          this.selectedEvent = null;
        }
        
        // Refresh events to show updated statuses
        this.fetchEvents();
      } catch (error) {
        console.error("Error approving attendance:", error);
        this.showMessage('Failed to approve attendance', 'error');
      }
    },
    
    async rejectAttendance(approval) {
      try {
        // Extract the correct IDs based on whether it's from pending approvals or an event modal
        const eventId = approval.eventId || approval.id;
        const studentId = approval.studentId || (approval.student && approval.student.id);
        
        if (!studentId || !eventId) {
          console.error("Missing student or event ID:", { approval });
          this.showMessage('Student or event information not found', 'error');
          return;
        }
        
        console.log(`Rejecting attendance: eventId=${eventId}, studentId=${studentId}`);
        
        await eventServices.rejectAttendance(eventId, studentId);
        
        // If this came from the pending approvals list, remove it
        if (this.pendingApprovals) {
          this.pendingApprovals = this.pendingApprovals.filter(
            a => !(a.eventId === eventId && a.studentId === studentId)
          );
        }
        
        // Update the event status if applicable
        if (approval.hasOwnProperty('status')) {
          approval.status = 'rejected';
        }
        
        this.showMessage('Attendance request rejected', 'success');
        
        // Close the modal if this was from the event detail view
        if (this.selectedEvent && this.selectedEvent.id === eventId) {
          this.selectedEvent = null;
        }
        
        // Refresh events to show updated statuses
        this.fetchEvents();
      } catch (error) {
        console.error("Error rejecting attendance:", error);
        this.showMessage('Failed to reject attendance', 'error');
      }
    },
    
    async submitReflection(evt) {
      try {
        if (!this.reflectionText.trim()) {
          this.showMessage('Please enter your reflection', 'error');
          return;
        }
        
        const user = JSON.parse(localStorage.getItem("user"));
        await eventServices.addReflection(evt.id, user.id, this.reflectionText);
        
        evt.reflectionText = this.reflectionText;
        this.reflectionText = '';
        
        this.showMessage('Reflection submitted successfully', 'success');
      } catch (error) {
        console.error("Error submitting reflection:", error);
        this.showMessage('Failed to submit reflection', 'error');
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short', 
          day: 'numeric', 
          year: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    },

    formatTime(timeString) {
      if (!timeString) return 'N/A';
      try {
        if (typeof timeString === 'string' && timeString.includes(':')) {
          // It's already in the format "14:30"
          const timeParts = timeString.split(':');
          const hours = parseInt(timeParts[0], 10);
          const minutes = timeParts[1];
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
          return `${displayHours}:${minutes} ${ampm}`;
        }
        
        // It's a date string
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch (e) {
        return timeString;
      }
    },
    
    async verifyAttendance(evt) {
      if (!this.attendanceCode) {
        this.showMessage('Please enter the attendance code', 'error');
        return;
      }
      
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await eventServices.verifyAttendance(evt.id, user.id, this.attendanceCode);
        
        if (response.success) {
          // Update status to pending instead of attended
          evt.status = 'pending';
          evt.attendanceDate = new Date();
          
          this.showMessage('Attendance verification submitted and awaiting approval', 'success');
          this.attendanceCode = '';
        } else {
          this.showMessage('Invalid attendance code', 'error');
        }
      } catch (error) {
        console.error("Error verifying attendance:", error);
        this.showMessage('Failed to verify attendance', 'error');
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
//
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

h4 {
  color: #48111c;
  font-size: 18px;
  margin-top: 25px;
  margin-bottom: 15px;
  font-weight: 500;
}

.event-list {
  margin-top: 25px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.experience-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 12px;
  transition: box-shadow 0.3s ease;
}

.experience-item-row:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.event-info-col {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.event-code-col {
  flex: 1;
  text-align: center;
}

.event-actions {
  flex: 2;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.event-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #48111c;
}

.event-details {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #666;
}

.event-date, .event-time {
  display: flex;
  align-items: center;
}

.event-date::before {
  content: "📅";
  margin-right: 5px;
}

.event-time::before {
  content: "🕒";
  margin-right: 5px;
}

.event-status {
  flex: 1;
  text-align: center;
}

.status-label {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
}

/* Status-specific colors */
.attended, .approved {
  background-color: #d4edda;
  color: #155724;
}

.registered, .pending {
  background-color: #fff3cd;
  color: #856404;
}

.not.registered {
  background-color: #f8d7da;
  color: #721c24;
}

.rejected {
  background-color: #f5c6cb;
  color: #842029;
}

.view-button, .mark-button, .edit-button, .delete-button, .send-button, .code-button {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.view-button {
  background-color: #2196f3;
  color: white;
}

.view-button:hover {
  background-color: #1976d2;
  transform: translateY(-2px);
}

.mark-button {
  background-color: #4caf50;
  color: white;
}

.mark-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.add-button {
  background-color: #f9c634;
  color: #333;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
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

.reflection-textarea {
  height: 150px;
  margin-bottom: 15px;
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

.action-buttons {
  display: flex;
  gap: 10px;
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
}

.close-button {
  background-color: #d5dfe7;
  color: #48111c;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: block;
  margin-top: 25px;
}

.attendance-button {
  background-color: #48111c;
  color: white;
  border: none;
  padding: 8px 15px;
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

.tracking-button {
  background-color: #708e9a;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(112, 142, 154, 0.3);
}
.approval-section {
  margin: 25px 0;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.approval-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.approval-info {
  flex: 2;
  min-width: 200px;
}

.student-name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
  color: #48111c;
}

.event-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.verification-date {
  font-size: 13px;
  color: #888;
}

.points-input {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.points-input label {
  margin-right: 10px;
  margin-bottom: 0;
  white-space: nowrap;
}

.points-input input {
  width: 80px;
  padding: 8px;
}

.approval-actions {
  flex: 1;
  min-width: 180px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.approve-button, .reject-button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
}

.approve-button {
  background-color: #48111c;
  color: white;
}

.approve-button:hover {
  background-color: #5d1625;
}

.reject-button {
  background-color: #dc3545;
  color: white;
}

.reject-button:hover {
  background-color: #c82333;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .approval-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .approval-info, .points-input, .approval-actions {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .points-input {
    padding: 10px 0;
  }
  
  .approval-actions {
    justify-content: space-between;
  }
}
.tracking-button:hover {
  background-color: #5a7985;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(112, 142, 154, 0.4);
}
</style>
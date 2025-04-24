// src/services/eventServices.js
import apiClient from "./services";

// Change from singular "event" to plural "events" to match your router
const API_BASE_URL = "http://localhost:3029/flight-plan-t9/events";

// Helper to ensure time format is correct
const formatTimeValue = (timeValue) => {
  if (!timeValue) return null;
  
  // If it's already a valid time string in HH:MM format, return it
  if (typeof timeValue === 'string' && timeValue.includes(':')) {
    return timeValue;
  }
  
  // Otherwise try to convert to a proper time format
  try {
    const timeObj = new Date(timeValue);
    if (!isNaN(timeObj.getTime())) {
      return timeObj.toISOString();
    }
  } catch (e) {
    console.error("Time format error:", e);
  }
  
  return timeValue; // Return original if we can't format it
};

export default {
  // Basic CRUD Operations
  async getAll() {
    const response = await apiClient.get(API_BASE_URL);
    return response;
  },

  async getById(id) {
    const response = await apiClient.get(`${API_BASE_URL}/${id}`);
    return response;
  },

  async create(eventData) {
    try {
      // Ensure date is a valid date string
      let formattedData = { ...eventData };
      
      // Format date if it's not already a valid date string
      if (formattedData.date) {
        try {
          const dateObj = new Date(formattedData.date);
          if (!isNaN(dateObj.getTime())) {
            formattedData.date = dateObj.toISOString();
          }
        } catch (e) {
          console.error("Date format error:", e);
        }
      }
      
      // Ensure time values are properly formatted
      if (formattedData.start_time) {
        formattedData.start_time = formatTimeValue(formattedData.start_time);
      }
      
      if (formattedData.end_time) {
        formattedData.end_time = formatTimeValue(formattedData.end_time);
      }
      
      console.log("Sending event data to backend:", formattedData);
      const response = await apiClient.post(API_BASE_URL, formattedData);
      console.log("Response from backend:", response.data);
      return response;
    } catch (error) {
      console.error("Error in create event service:", error);
      if (error.response) {
        console.error("Response error data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  },

  async update(id, updatedData) {
    try {
      let formattedData = { ...updatedData };
      
      // Format date if needed
      if (formattedData.date) {
        try {
          const dateObj = new Date(formattedData.date);
          if (!isNaN(dateObj.getTime())) {
            formattedData.date = dateObj.toISOString();
          }
        } catch (e) {
          console.error("Date format error:", e);
        }
      }
      
      // Format time values
      if (formattedData.start_time) {
        formattedData.start_time = formatTimeValue(formattedData.start_time);
      }
      
      if (formattedData.end_time) {
        formattedData.end_time = formatTimeValue(formattedData.end_time);
      }
      
      const response = await apiClient.put(`${API_BASE_URL}/${id}`, formattedData);
      return response;
    } catch (error) {
      console.error("Error in update event service:", error);
      throw error;
    }
  },

  async delete(id) {
    const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
    return response;
  },

  // Event-Specific Methods
  async generateAttendanceCode(eventId) {
    try {
      const code = this.generateRandomCode();
      const response = await apiClient.post(
        `${API_BASE_URL}/${eventId}/code`,
        { code }
      );
      return response;
    } catch (error) {
      console.error("Error generating attendance code:", error);
      throw error;
    }
  },

  async registerStudent(eventId, studentId, registrationData = {}) {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/${eventId}/register/${studentId}`,
        registrationData
      );
      return response.data;
    } catch (error) {
      console.error("Error registering for event:", error);
      throw error;
    }
  },

  async markAttendance(eventId, studentId) {
    const response = await apiClient.post(
      `${API_BASE_URL}/${eventId}/attend/${studentId}`
    );
    return response.data;
  },

  async getEventRegistrations(eventId) {
    const response = await apiClient.get(
      `${API_BASE_URL}/${eventId}/registrations`
    );
    return response.data;
  },

  async getEventsBySemester(semester) {
    const response = await apiClient.get(
      `${API_BASE_URL}/semester/${semester}`
    );
    return response.data;
  },

  async verifyAttendance(eventId, studentId, code) {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/${eventId}/verify/${studentId}`,
        { code }
      );
      return response.data;
    } catch (error) {
      console.error("Error verifying attendance:", error);
      throw error;
    }
  },

  // Helper method to generate a code
  generateRandomCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({length: 6}, () => 
      characters[Math.floor(Math.random() * characters.length)]
    ).join('');
  },
  
  // Change this function in eventServices.js
async getStudentEvents(studentId) {
  try {
    // Change from "/student-events/${studentId}" to "/user/${studentId}"
    const response = await apiClient.get(`${API_BASE_URL}/user/${studentId}`);
    return response;
  } catch (error) {
    console.error("Error fetching student events:", error);
    throw error;
  }
},
  
  // Cancel a student's registration for an event
  async cancelRegistration(eventId, studentId) {
    try {
      const response = await apiClient.delete(
        `${API_BASE_URL}/${eventId}/register/${studentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error canceling registration:", error);
      throw error;
    }
  },
  // Add this method to your eventServices.js file
async setAttendanceCode(eventId, code = null) {
  try {
    // If no code is provided, generate a random one
    const attendanceCode = code || this.generateRandomCode();
    
    const response = await apiClient.post(
      `${API_BASE_URL}/${eventId}/code`,
      { code: attendanceCode }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error setting attendance code:", error);
    throw error;
  }
},
getPendingApprovals() {
  return apiClient.get(`${API_BASE_URL}/approvals/pending`);
},

approveAttendance(eventId, studentId, data) {
  return apiClient.post(`${API_BASE_URL}/${eventId}/students/${studentId}/approve`, data);
},
// Add this to your eventServices.js file
// Only implement the method to get a single student
async getStudent(id) {
  try {
    // Use the endpoint for a single student
    const response = await apiClient.get(`/student/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    return { data: null }; // Return null data on error
  }
},
rejectAttendance(eventId, studentId) {
  return apiClient.post(`${API_BASE_URL}/${eventId}/students/${studentId}/reject`);
},
  // Alias for registerStudent for backward compatibility
  async register(eventId, studentId) {
    return this.registerStudent(eventId, studentId);
  }
};



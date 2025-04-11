// studentServices.js - merged version
import apiClient from "../services/services";

const API_BASE_URL = "http://localhost:3029/flight-plan-t9/student";

export default {
  async getStudentById(studentId) {
    try {
      // If no studentId is provided, get the current logged-in student
      const endpoint = studentId ? `${API_BASE_URL}/${studentId}` : `${API_BASE_URL}/current`;
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching student data:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to fetch student data";
      throw new Error(errorMessage);
    }
  },

  async getStudents() {
    try {
      const response = await apiClient.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      // Enhanced error logging
      console.error("❌ Error fetching students. Details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers ? {
            Authorization: error.config.headers.Authorization ? "Bearer ..." + error.config.headers.Authorization.slice(-10) : "Not set",
            ContentType: error.config.headers["Content-Type"] || "Not set"
          } : "No headers"
        }
      });
      
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error("Student data not found - endpoint may have changed");
        } else if (error.response.status === 401) {
          throw new Error("Session expired - please log in again");
        } else if (error.response.status === 403) {
          throw new Error("Access denied - insufficient permissions");
        } else if (error.response.status >= 500) {
          throw new Error(`Server error (${error.response.status}) - the service may be down`);
        }
      } else if (error.request) {
        throw new Error("No response from server - please check your connection");
      }
      
      throw new Error(`Failed to fetch student data: ${error.message}`);
    }
  },
};

import apiClient from "../config/apiClient.js"; // Fix import path

const API_ENDPOINT = "student";

export default {
  async getStudentById(studentId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINT}/${studentId}`);
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
      // Log the request attempt
      console.log("🔍 Attempting to fetch students from:", `${apiClient.defaults.baseURL}/${API_ENDPOINT}`);
      
      // Log headers being sent
      const headers = apiClient.defaults.headers;
      console.log("📨 Request headers:", {
        Authorization: headers.Authorization ? "Bearer ..." + headers.Authorization.slice(-10) : "Not set",
        ContentType: headers["Content-Type"] || "Not set"
      });

      const response = await apiClient.get(API_ENDPOINT);
      console.log("✅ Raw student response:", response);
      
      // Validate and transform response
      if (response?.data) {
        if (Array.isArray(response.data)) {
          console.log(`✅ Received ${response.data.length} students`);
          return response.data;
        } else if (response.data.students && Array.isArray(response.data.students)) {
          console.log(`✅ Received ${response.data.students.length} students from nested data`);
          return response.data.students;
        } else if (typeof response.data === 'object') {
          console.log("ℹ️ Received single student object, converting to array");
          return [response.data];
        }
      }
      
      console.error("❌ Unexpected response format:", response);
      throw new Error("Invalid response format from server");
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

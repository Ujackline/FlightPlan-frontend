import apiClient from "./services";

const API_BASE_URL = "/student";

export default {
  async getStudentByUserId(userId) {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching student by userId:", error);
      throw error;
    }
  },

  async getStudents() {
    try {
      const response = await apiClient.get(API_BASE_URL);
      return response.data;
    } catch (error) {
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

  async searchStudentByEmail(email) {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error searching student by email (${email}):`, error.response?.data || error.message);
      if (error.response?.status === 404) {
        throw new Error("No student found with that email address");
      }
      throw new Error("Failed to search for student by email");
    }
  },

  async createStudentProfile(profileData) {
    try {
      console.log("Sending student profile data:", JSON.stringify(profileData, null, 2));
      const response = await apiClient.post(`${API_BASE_URL}`, profileData);
      return response.data;
    } catch (error) {
      console.error("Detailed error creating student profile:", {
        message: error.message,
        response: error.response ? JSON.stringify(error.response.data, null, 2) : 'No response',
        status: error.response ? error.response.status : 'No status'
      });
      
      // More comprehensive error handling
      if (error.response) {
        // If server responded with an error
        const errorMessage = error.response.data.message || 
                             error.response.data.error || 
                             'Failed to create student profile';
        
        throw new Error(errorMessage);
      }
      
      // Network error or other issues
      throw new Error('Network error or unexpected issue creating student profile');
    }
  },
  

  async updateStudentPoints(studentId, newPointsTotal) {
    try {
      const response = await apiClient.patch(`${API_BASE_URL}/${studentId}/points`, {
        points: newPointsTotal
      });
      return response;
    } catch (error) {
      console.error('Error updating student points:', error);
      throw error;
    }
  }
};
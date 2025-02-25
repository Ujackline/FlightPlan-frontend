import apiClient from "./services.js";

export default {
  loginUser(user) {
    return apiClient.post("login", user)
      .catch(error => {
        if (error.response) {
          // The server responded with a status code outside of 2xx
          console.error("Server error response:", {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Request setup error:", error.message);
        }
        throw error;
      });
  },
  authorizeUser(code) {
    return apiClient.post("authorize/user", code);
  },
  logoutUser(token) {
    return apiClient.post("logout", token);
  },
};


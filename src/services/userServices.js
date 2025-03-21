import apiClient from "./services";
var baseURL = "/user";

export default{
    getAll(){
        return apiClient.get(baseURL);
    },
    getOne(userId) {
        console.log(` Fetching user with ID: ${userId}`); // Debugging
        return apiClient.get(`${baseURL}/${userId}`) //  Correct URL format
          .then(response => {
            console.log("User fetched successfully:", response.data);
            return response.data;
          })
          .catch(error => {
            console.error("Error fetching user:", error.response?.data || error.message);
            throw error;
          });
    },
    
    getEmail(email){
        return apiClient.get(baseURL+`email/${email}`);
    },
    create(data){
        return apiClient.post(baseURL, data);
    },
    update(userId, data){
        return apiClient.put(baseURL+`${userId}`, data);
    },
    delete(userId){
        return apiClient.delete(baseURL + `${userId}`);
    }
};
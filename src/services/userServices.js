import apiClient from "./services";
var baseURL = "/user";

export default{
    getAll(){
        return apiClient.get(baseURL);
    },
    async getOne(id) {
        console.log("Fetching user with ID:", id);
        const response = await apiClient.get(`${baseURL}/${id}`);
        console.log("User fetched successfully:", response.data);
        return response.data; 
      },
          
    getEmail(email){
        return apiClient.get(baseURL+`email/${email}`);
    },
    create(data){
        return apiClient.post(baseURL, data);
    },
    async update(id, userData) {
        const response = await apiClient.put(`${baseURL}/${id}`, userData);
        return response.data;
      },
      
    delete(userId){
        return apiClient.delete(baseURL + `${userId}`);
    }
};
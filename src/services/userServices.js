import apiClient from "./services";
var baseURL = "/users/";

export default{
    getAll(){
        return apiClient.get(baseURL);
    },
    getOne(userId){
        return apiClient.get(baseURL+`id/${userId}`);
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
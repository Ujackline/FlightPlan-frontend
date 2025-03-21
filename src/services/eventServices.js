import apiClient from "./services";
var baseURL = "/event";

export default{
    getAll(){
        return apiClient.get(baseURL);
    },
    getOne(eventId){
        return apiClient.get('${baseURL}user/ ${userId}');
    },
  
    create(data){
        return apiClient.post(baseURL, data);
    },
    update(eventId, data){
        return apiClient.put(baseURL+`${eventId}`, data);
    },
    delete(eventId){
        return apiClient.delete(baseURL + `${eventId}`);
    },
    deleteAll(){
        return apiClient.delete(baseURL);
    }
};
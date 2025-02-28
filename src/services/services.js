import axios from 'axios'
import Utils from '../config/utils.js'
import Router from '../router/router.js'

var baseurl = ''
if (import.meta.env.DEV) {
  baseurl = "http://localhost:3029/EaglesFlightPlan";

} else {
  baseurl = "/EaglesFlightPlan/";
}
const apiClient = axios.create({
  baseURL: baseurl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
    crossDomain: true,
  },
  // Intercept the request to add the token if it exists
  transformRequest: (data, headers) => {
    let user = Utils.getStore('user')
    if (user != null) {
      let token = user.token
      let authHeader = ''
      if (token != null && token != '') authHeader = 'Bearer ' + token
      headers['Authorization'] = authHeader
    }
    return JSON.stringify(data)
  },
  // Handle response data and errors
  transformResponse: function (data) {
    data = JSON.parse(data)
    // if (!data.success && data.code == "expired-session") {
    //   localStorage.deleteItem("user");
    // }
    if (data.message !== undefined && data.message.includes('Unauthorized')) {
      AuthServices.logoutUser(Utils.getStore('user'))
        .then(response => {
          console.log(response)
          Utils.removeItem('user')
          Router.push({ name: 'login' })
        })
        .catch(error => {
          console.log('error', error)
        })
      // Utils.removeItem("user")
    }
    // console.log(Utils.getStore("user"))
    return data
  },
})
export default apiClient

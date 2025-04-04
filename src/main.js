import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import vuetify from "./plugins/vuetify.js";
import store from "./store/store.js";
import "./assets/main.css"; // ✅ Import the global styles
import '@fortawesome/fontawesome-free/css/all.css'

// App.use(store); //added the store to help us access our store globally
createApp(App)
  .use(vuetify)
  .use(router)
  .use(store)
  .mount("#app");

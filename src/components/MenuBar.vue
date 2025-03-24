<template>
  <div>
 
    <v-app-bar app>
      <router-link :to="{ name: 'login' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link>

      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

    
      <v-btn 
        v-if="user" 
        icon 
        @click="toggleSideNav" 
        class="mr-2"
      >
        <v-icon>{{ isSideNavOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>

     
      <div v-if="user">
        <v-menu bottom min-width="200px" rounded offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon>
              <v-avatar color="secondary">
                <span class="text-white">{{ initials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="secondary">
                  <span class="text-white">{{ initials }}</span>
                </v-avatar>
                <h3>{{ name }}</h3>
                <p class="text-caption mt-1">
                  {{ user.email }}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text @click="logout">
                  Logout
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn class="mx-2" @click="navigateTo('manageusers')">
                  Manage User
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Right Side Navigation Panel -->
    <div 
      class="side-nav-panel" 
      :class="{'side-nav-open': isSideNavOpen}"
      v-if="user"
    >
      <div class="nav-panel-header">
        <h3>Menu</h3>
      </div>
      
      <!-- Navigation Items -->
      <div class="nav-items">
        <v-list nav>
          <v-list-item 
            @click="navigateTo('home')"
            :class="{ 'active-route': currentRoute === 'home' }"
          >
            <template v-slot:prepend>
              <v-icon>mdi-home</v-icon>
            </template>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          
          <v-list-item 
            @click="navigateTo('studentDashboard')"
            :class="{ 'active-route': currentRoute === 'studentDashboard' }"
          >
            <template v-slot:prepend>
              <v-icon>mdi-view-dashboard</v-icon>
            </template>
            <v-list-item-title>Student Dashboard</v-list-item-title>
          </v-list-item>
          
          <v-list-item 
            @click="navigateTo('afterNest')"
            :class="{ 'active-route': currentRoute === 'afterNest' }"
          >
            <template v-slot:prepend>
              <v-icon>mdi-paper-plane</v-icon>
            </template>
            <v-list-item-title>Life After Nest</v-list-item-title>
          </v-list-item>
         
        </v-list>
      </div>
    </div>
    
    <!-- Overlay when sidebar is open on mobile -->
    <div 
      class="nav-overlay" 
      v-if="isSideNavOpen" 
      @click="toggleSideNav"
    ></div>
  </div>
</template>

<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted, computed, watch } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter, useRoute } from "vue-router";
import Admin from "../views/AdminDashboard.vue";
//import adminService from "../services/adminServices";

const router = useRouter();
const route = useRoute();
const user = ref(null);
const title = ref("Career Services");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const isSideNavOpen = ref(false);

// Track current route for highlighting active menu item
const currentRoute = computed(() => {
  return route.name;
});

// Toggle side navigation
const toggleSideNav = () => {
  isSideNavOpen.value = !isSideNavOpen.value;
};

// Close side nav when route changes (especially on mobile)
watch(() => route.path, () => {
  if (window.innerWidth < 960) {
    isSideNavOpen.value = false;
  }
});

const resetMenu = () => {
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
  }
};

const logout = async () => {
  try {
    await AuthServices.logoutUser(user.value);
    Utils.removeItem("user");
    localStorage.removeItem('user');
    router.push({ name: "login" });
  } catch (error) {
    console.error("Logout error:", error);
  }
};


const navigateTo = (routeName) => {
  router.push({ name: routeName }).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err);
    }
  });
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();
  
  // Add event listener for storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
      resetMenu();
    }
  });
  
  // Close side nav when clicking outside on mobile
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      // Optionally keep sidebar open on larger screens
      // isSideNavOpen.value = true;
    }
  });
});
</script>

<style scoped>
.v-btn {
  text-transform: none;
}

.title {
  margin-left: 12px;
  font-weight: 500;
}

.v-avatar {
  cursor: pointer;
}

/* Side Navigation Panel Styles */
.side-nav-panel {
  position: fixed;
  top: 64px; /* Height of app bar */
  right: -300px; /* Start offscreen */
  width: 300px;
  height: calc(100vh - 64px);
  background-color: white;
  z-index: 100;
  box-shadow: -2px 0 10px rgba(215, 70, 70, 0.1);
  transition: right 0.3s ease;
  overflow-y: auto;
}

.side-nav-open {
  right: 0;
}

.nav-panel-header {
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
}

.nav-items {
  padding: 10px 0;
}

.active-route {
  background-color: rgba(0, 0, 0, 0.05);
  border-right: 3px solid #1976d2;
}

.nav-overlay {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: none;
}

/* Show overlay on mobile only */
@media (max-width: 960px) {
  .nav-overlay {
    display: block;
  }
}

/* Adjust for mobile screens */
@media (max-width: 600px) {
  .side-nav-panel {
    width: 250px;
    right: -250px;
  }
}
</style>
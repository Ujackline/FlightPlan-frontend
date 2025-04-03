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

    
      <div v-if="user" class="d-none d-sm-flex">
       
      
        <v-btn 
          text 
          @click="navigateTo('studentDashboard')"
          :class="{ 'active-route': currentRoute === 'studentDashboard' }"
          class="mx-1"
        >
          
          Student Dashboard
        </v-btn>
        
        
       
      </div>

      <!-- Mobile menu button - only shows on small screens -->
      <v-btn 
        v-if="user" 
        icon 
        @click="toggleMobileMenu" 
        class="d-sm-none mr-2"
      >
        <v-icon>{{ isMobileMenuOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>

      <!-- User Profile Menu -->
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
                
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Mobile Menu - Dropdown for small screens -->
    <v-expand-transition>
      <div 
        v-if="isMobileMenuOpen && user" 
        class="mobile-menu"
      >
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
    </v-expand-transition>
    
    <!-- Overlay for mobile menu -->
    <div 
      class="nav-overlay" 
      v-if="isMobileMenuOpen" 
      @click="toggleMobileMenu"
    ></div>
  </div>
</template>

<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted, computed, watch } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter, useRoute } from "vue-router";
//import Admin from "../views/AdminDashboard.vue";
//import adminService from "../services/adminServices";

const router = useRouter();
const route = useRoute();
const user = ref(null);
const title = ref("Eagle Flight Plan");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const isMobileMenuOpen = ref(false);

// Track current route for highlighting active menu item
const currentRoute = computed(() => {
  return route.name;
});

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Close mobile menu when route changes
watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
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
  // Close mobile menu after navigation on mobile
  if (window.innerWidth < 600) {
    isMobileMenuOpen.value = false;
  }
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
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) {
      isMobileMenuOpen.value = false;
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

/* Active route styling */
.active-route {
  background-color: rgba(0, 0, 0, 0.05);
  border-bottom: 3px solid #1976d2;
}

/* Mobile menu styling */
.mobile-menu {
  position: absolute;
  top: 64px; /* Height of app bar */
  left: 0;
  right: 0;
  background-color: white;
  z-index: 100;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.nav-overlay {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

/* Mobile menu active route styling */
.mobile-menu .active-route {
  background-color: rgba(0, 0, 0, 0.05);
  border-left: 3px solid #1976d2;
  border-bottom: none;
}

/* Adjust for mobile screens */
@media (max-width: 600px) {
  .nav-items {
    display: none;
  }
}
</style>

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

        <v-btn 
          text 
          @click="navigateTo('shop')"
          :class="{ 'active-route': currentRoute === 'shop' }"
          class="mx-1"
        >
          <v-icon class="mr-1">mdi-store</v-icon>
          Shop
        </v-btn>

        <v-btn 
          text 
          @click="navigateTo('documents')"
          :class="{ 'active-route': currentRoute === 'documents' }"
          class="mx-1"
        >
          <v-icon class="mr-1">mdi-file-document</v-icon>
          Documents
        </v-btn>

        <v-btn 
          v-if="isAdmin"
          text 
          @click="navigateTo('adminDashboard')"
          :class="{ 'active-route': currentRoute === 'adminDashboard' || currentRoute === 'adminDocuments' }"
          class="mx-1"
        >
          <v-icon class="mr-1">mdi-view-dashboard</v-icon>
          Admin Dashboard
        </v-btn>
      </div>

      <v-btn 
        v-if="user" 
        icon 
        @click="toggleMobileMenu" 
        class="d-sm-none mr-2"
      >
        <v-icon>{{ isMobileMenuOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
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
                <themeToggle @toggle-theme="$emit('toggle-theme')" />
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

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
            @click="navigateTo('shop')"
            :class="{ 'active-route': currentRoute === 'shop' }"
          >
            <template v-slot:prepend>
              <v-icon>mdi-store</v-icon>
            </template>
            <v-list-item-title>Shop</v-list-item-title>
          </v-list-item>

          <v-list-item 
            @click="navigateTo('documents')"
            :class="{ 'active-route': currentRoute === 'documents' }"
          >
            <template v-slot:prepend>
              <v-icon>mdi-file-document</v-icon>
            </template>
            <v-list-item-title>Documents</v-list-item-title>
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

          <v-list-item 
            v-if="isAdmin"
            @click="navigateTo('adminDashboard')"
            :class="{ 'active-route': currentRoute === 'adminDashboard' || currentRoute === 'adminDocuments' }"
          >
            <template v-slot:prepend>
              <v-icon>mdi-view-dashboard</v-icon>
            </template>
            <v-list-item-title>Admin Dashboard</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>

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

const router = useRouter();
const route = useRoute();
const user = ref(null);
const title = ref("Eagle Flight Plan");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const isMobileMenuOpen = ref(false);

const currentRoute = computed(() => route.name);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

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
    localStorage.removeItem("user");
    router.push({ name: "login" });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

const navigateTo = (routeName) => {
  router.push({ name: routeName }).catch((err) => {
    if (err.name !== "NavigationDuplicated") {
      console.error("Navigation error:", err);
    }
  });
  if (window.innerWidth < 600) {
    isMobileMenuOpen.value = false;
  }
};

const isAdmin = computed(() => {
  return user.value && user.value.role === "admin";
});

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();

  window.addEventListener("storage", (e) => {
    if (e.key === "user") {
      resetMenu();
    }
  });

  window.addEventListener("resize", () => {
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

.active-route {
  background-color: rgba(0, 0, 0, 0.05);
  border-bottom: 3px solid #1976d2;
}

.mobile-menu {
  position: absolute;
  top: 64px;
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

.mobile-menu .active-route {
  background-color: rgba(0, 0, 0, 0.05);
  border-left: 3px solid #1976d2;
  border-bottom: none;
}

@media (max-width: 600px) {
  .nav-items {
    display: none;
  }
}
</style>

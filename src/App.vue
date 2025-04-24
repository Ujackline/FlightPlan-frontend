<script setup>
import MenuBar from "./components/MenuBar.vue";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "vuetify"; // Vuetify theme control

const route = useRoute();
const showMenuBar = computed(() => route.name !== "login");

// Theme state (persistent across sessions)
const theme = ref(localStorage.getItem("theme") || "light");
const vuetifyTheme = useTheme();

//Apply theme to Vuetify and body class
const applyTheme = () => {
  document.body.classList.remove("light-mode", "dark-mode");
  document.body.classList.add(theme.value === "dark" ? "dark-mode" : "light-mode");

  vuetifyTheme.global.name.value =
    theme.value === "dark" ? "myCustomDarkTheme" : "myCustomLightTheme";
};

// Toggle and save theme preference
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  localStorage.setItem("theme", theme.value);
  applyTheme();
};

// Apply saved theme on mount
onMounted(() => {
  applyTheme();
});
</script>

<template>
  <v-app>
    <!-- Top Navigation -->
    <MenuBar 
      v-if="showMenuBar" 
      :theme="theme" 
      @toggle-theme="toggleTheme" 
    />

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="footer" app>
      <span>&copy; {{ new Date().getFullYear() }} Eagle Flight Plan</span>
    </v-footer>
  </v-app>
</template>

<style>
/* Optional: Your own light/dark visual styles */

.light-mode {
  --background-color: #ffffff;
  --text-color: #222222;
}

.dark-mode {
  --background-color: #121212;
  --text-color: #eeeeee;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>

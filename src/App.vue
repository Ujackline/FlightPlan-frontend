<script setup>
import MenuBar from "./components/MenuBar.vue";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";


const route = useRoute();
const showMenuBar = computed(() => route.name !== "login");

// 🌗 Theme State (Light/Dark)
const theme = ref(localStorage.getItem("theme") || "light");

// 🌗 Apply Theme to Body
const applyTheme = () => {
  document.body.classList.remove("light-mode", "dark-mode");
  document.body.classList.add(theme.value === "dark" ? "dark-mode" : "light-mode");
};

// 🌗 Toggle Theme Function
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  localStorage.setItem("theme", theme.value);
  applyTheme();
};

// 🌗 Apply Theme on Page Load
onMounted(() => {
  applyTheme();
});
</script>

<template>
  <v-app :class="theme">
    <MenuBar 
      v-if="showMenuBar" 
      :theme="theme"  
      @toggle-theme="toggleTheme"  
    />
    
    <v-main class="main-content">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer class="footer" app>
      <span>&copy; {{ new Date().getFullYear() }} Eagle Flight Plan</span>
    </v-footer>
  </v-app>
</template>

<style>
/* Light Mode */
.light-mode {
  --background-color: #ffffff;
  --text-color: #676262;
}

/* Dark Mode */
.dark-mode {
  --background-color: #111010;
  --text-color: #ffffff;
}

/* Apply Theme Globally */
body {
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}
</style>

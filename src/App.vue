<script setup>
import MenuBar from "./components/MenuBar.vue";
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showMenuBar = computed(() => {
 
  return route.name !== 'login';
});
</script>

<template>
  <v-app>
    <MenuBar v-if="showMenuBar" :key="$route.fullPath" />
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
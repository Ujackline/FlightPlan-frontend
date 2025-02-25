<script setup>
import MenuBar from "../components/MenuBar.vue";
import SocialLogin from "../components/SocialLogin.vue";
import { ref } from "vue";

const logoURL = "/oc-logo-white.png";
</script>

<template>
  <!-- Use MenuBar component for navigation -->
  <MenuBar />

  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="6" lg="4">
      <v-card class="login-card elevation-12">
        <v-card-title class="text-center">
          <h1 class="text-h5 mb-2">Eagle Flight Plan</h1>
        </v-card-title>

        <v-card-text class="text-center">
          <SocialLogin />
        </v-card-text>

        <v-card-text class="text-center pt-0">
          <v-divider class="my-4">
            <span class="text-overline text-medium-emphasis">OR</span>
          </v-divider>

          <p class="text-body-2 text-medium-emphasis mb-0">
            Don't have an account? Sign up with Google to get started.
          </p>
        </v-card-text>

        <v-card-text class="text-center text-caption text-medium-emphasis">
          By continuing, you agree to our
          <a href="#" class="text-decoration-none">Terms of Service</a> and
          <a href="#" class="text-decoration-none">Privacy Policy</a>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.login-container {
  background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-secondary-base) 100%);
  min-height: 90vh;
}

.login-card {
  border-radius: 20px;
  padding: 5rem 3rem;
}

.v-divider {
  position: relative;
}

.v-divider span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 0 1rem;
}

a {
  color: var(--v-primary-base);
}

a:hover {
  color: var(--v-secondary-base);
}

/* Burgundy Navbar */
.v-app-bar {
  background-color: #800020 !important; /* Burgundy color */
}
</style>

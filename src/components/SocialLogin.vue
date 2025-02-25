<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";

const router = useRouter();
const fName = ref("");
const lName = ref("");
const user = ref({});

const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  console.log(client);
  window.google.accounts.id.initialize({
    client_id: client,
    cancel_on_tap_outside: false,
    auto_select: false,
    callback: window.handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(document.getElementById("parent_id"), {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    width: 400,
  });
};

const handleCredentialResponse = async (response) => {
  try {
    let token = {
      credential: response.credential,
    };
    const loginResponse = await AuthServices.loginUser(token);
    
    // Store user data with only essential information
    user.value = {
      ...loginResponse.data,
      role: 'student' // Default role set to student
    };

    Utils.setStore("user", user.value);
    fName.value = user.value.fName;
    lName.value = user.value.lName;

    console.log("Login successful:", user.value);
    
    // Simple redirect to home for all users
    router.push({ name: "home" });
  } catch (error) {
    console.log("error", error);
  }
};

onMounted(() => {
  loginWithGoogle();
});
</script>

<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>
  </div>
</template>
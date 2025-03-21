<template>
    <div class="toggle-container">
      <span>Light</span>
      <label class="toggle-switch">
        <input type="checkbox" v-model="isDarkMode" @change="emitThemeToggle">
        <span class="slider"></span>
      </label>
      <span>Dark</span>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineEmits } from "vue";
  
  const emits = defineEmits(["toggle-theme"]);
  const isDarkMode = ref(localStorage.getItem("theme") === "dark");
  
  // Emit event when toggling theme
  const emitThemeToggle = () => {
    isDarkMode.value = !isDarkMode.value;
    emits("toggle-theme"); // 🔥 Notify parent component
  };
  
  // Apply stored theme on mount
  onMounted(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode.value);
  });
  </script>
  
  <style scoped>
  .toggle-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #0a0a0a;
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
  </style>
  
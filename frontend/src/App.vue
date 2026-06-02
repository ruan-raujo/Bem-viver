<script setup>
import { useHealthData } from './composables/useHealthData';
const { toastMessage, callScenario, endCall } = useHealthData();
</script>

<template>
  <div v-if="toastMessage" class="toast-container">
    <span class="material-symbols-outlined text-[#7AA382]">info</span>
    <span>{{ toastMessage }}</span>
  </div>

  <router-view />

  </template>
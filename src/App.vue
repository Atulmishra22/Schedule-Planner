<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useTasksStore } from './stores/tasks';
import AppHeader from './components/layout/AppHeader.vue';

const tasksStore = useTasksStore();

// Set up periodic rollover check
onMounted(() => {
  // Check every hour for date change
  setInterval(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastRollover = localStorage.getItem('lastRollover');
    
    if (lastRollover !== today) {
      tasksStore.rolloverTasks();
      localStorage.setItem('lastRollover', today);
    }
  }, 3600000); // Check every hour
});
</script>

<template>
  <div class="min-h-screen bg-primary-900">
    <AppHeader />
    <RouterView />
  </div>
</template>

<style scoped>
</style>

<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useTasksStore } from './stores/tasks';
import { useTimeTrackingStore } from './stores/timeTracking';
import AppHeader from './components/layout/AppHeader.vue';

const tasksStore = useTasksStore();
const timeStore = useTimeTrackingStore();

onMounted(() => {
  // Load data from localStorage
  tasksStore.loadTasks();
  timeStore.loadEntries();
  
  // Check for rollover daily
  checkDailyRollover();
});

const checkDailyRollover = () => {
  const today = new Date().toISOString().slice(0, 10);
  const lastRollover = localStorage.getItem('lastRollover');
  
  if (lastRollover !== today) {
    tasksStore.rolloverTasks();
    localStorage.setItem('lastRollover', today);
  }
  
  // Check every hour
  setInterval(() => {
    const newToday = new Date().toISOString().slice(0, 10);
    const newLastRollover = localStorage.getItem('lastRollover');
    
    if (newLastRollover !== newToday) {
      tasksStore.rolloverTasks();
      localStorage.setItem('lastRollover', newToday);
    }
  }, 3600000); // Check every hour
};
</script>

<template>
  <div class="min-h-screen bg-primary-900">
    <AppHeader />
    <RouterView />
  </div>
</template>

<style scoped>
</style>

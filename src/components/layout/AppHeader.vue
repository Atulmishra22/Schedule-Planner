<template>
  <header class="bg-primary-800 border-b border-primary-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo & App Name -->
        <div class="flex items-center gap-8">
          <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div class="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <span class="text-white text-lg font-bold">S</span>
            </div>
            <span class="text-neutral-100 text-lg font-semibold hidden sm:block">
              Schedule Planner
            </span>
          </router-link>
          
          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-1">
            <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              :class="isActive(link.path) 
                ? 'bg-primary-700 text-accent-400' 
                : 'text-neutral-400 hover:text-neutral-100 hover:bg-primary-700/50'"
            >
              <span class="mr-2">{{ link.icon }}</span>
              {{ link.name }}
            </router-link>
          </nav>
        </div>
        
        <!-- Right Actions -->
        <div class="flex items-center gap-2">
          <button 
            @click="toggleNotifications"
            class="p-2 hover:bg-primary-700 rounded-md transition-colors relative"
            title="Notifications"
          >
            <span class="text-neutral-300 text-xl">🔔</span>
            <span 
              v-if="unreadCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>
          <button 
            @click="$router.push('/settings')"
            class="p-2 hover:bg-primary-700 rounded-md transition-colors"
            title="Settings"
          >
            <span class="text-neutral-300 text-xl">⚙</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Notification Panel -->
    <NotificationPanel 
      :isOpen="showNotifications" 
      @close="showNotifications = false"
    />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useNotificationsStore } from '../../stores/notifications';
import NotificationPanel from './NotificationPanel.vue';

const route = useRoute();
const notificationsStore = useNotificationsStore();

const showNotifications = ref(false);

const unreadCount = computed(() => notificationsStore.unreadCount);

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const navLinks = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Analytics', path: '/analytics', icon: '📈' },
  { name: 'Schedule', path: '/schedule', icon: '📅' },
];

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};
</script>

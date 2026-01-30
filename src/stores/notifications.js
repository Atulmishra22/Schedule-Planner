// stores/notifications.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getTodayLocal } from '../utils/dateHelpers';

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([]);
  
  // Getters
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length;
  });
  
  const todayNotifications = computed(() => {
    const today = getTodayLocal();
    return notifications.value.filter(n => n.date === today);
  });
  
  const sortedNotifications = computed(() => {
    return [...notifications.value].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  });
  
  // Actions
  const addNotification = (notification) => {
    const newNotification = {
      id: generateId(),
      ...notification,
      timestamp: new Date().toISOString(),
      date: getTodayLocal(),
      read: false
    };
    
    notifications.value.unshift(newNotification);
    saveNotifications();
    return newNotification;
  };
  
  const markAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      saveNotifications();
    }
  };
  
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true);
    saveNotifications();
  };
  
  const deleteNotification = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications.value.splice(index, 1);
      saveNotifications();
    }
  };
  
  const clearAll = () => {
    notifications.value = [];
    saveNotifications();
  };
  
  const clearOld = () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    notifications.value = notifications.value.filter(n => 
      new Date(n.timestamp) > threeDaysAgo
    );
    saveNotifications();
  };
  
  // Helpers
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  const saveNotifications = () => {
    localStorage.setItem('notifications', JSON.stringify(notifications.value));
  };
  
  const loadNotifications = () => {
    const data = localStorage.getItem('notifications');
    if (data) {
      try {
        notifications.value = JSON.parse(data);
        // Auto-clear old notifications on load
        clearOld();
      } catch (e) {
        console.error('Failed to load notifications:', e);
        notifications.value = [];
      }
    }
  };
  
  return {
    notifications,
    unreadCount,
    todayNotifications,
    sortedNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    clearOld,
    loadNotifications
  };
});

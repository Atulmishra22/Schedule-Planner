<template>
  <div class="notification-panel" v-if="isOpen">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 z-40"
      @click="close"
    ></div>
    
    <!-- Panel -->
    <div class="panel-content">
      <!-- Header -->
      <div class="panel-header">
        <h3 class="text-lg font-semibold text-neutral-100">
          Notifications
          <span v-if="unreadCount > 0" class="ml-2 text-sm text-accent-400">
            ({{ unreadCount }} new)
          </span>
        </h3>
        <div class="flex items-center gap-2">
          <button 
            v-if="sortedNotifications.length > 0"
            @click="markAllAsRead"
            class="text-xs text-neutral-400 hover:text-accent-400 transition-colors"
          >
            Mark all read
          </button>
          <button 
            v-if="sortedNotifications.length > 0"
            @click="clearAll"
            class="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>
      
      <!-- Notifications List -->
      <div class="notifications-list">
        <div 
          v-if="sortedNotifications.length === 0" 
          class="empty-state"
        >
          <span class="text-4xl">🔕</span>
          <p class="text-neutral-400 mt-2">No notifications yet</p>
        </div>
        
        <div
          v-for="notification in sortedNotifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon">
            <span class="text-2xl">{{ getIcon(notification.type) }}</span>
          </div>
          
          <div class="notification-content">
            <div class="notification-title">{{ notification.title || 'Notification' }}</div>
            <div class="notification-body">{{ notification.body || 'No details available' }}</div>
            <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
          </div>
          
          <button
            @click.stop="deleteNotification(notification.id)"
            class="delete-btn"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNotificationsStore } from '../../stores/notifications';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const notificationsStore = useNotificationsStore();

const sortedNotifications = computed(() => notificationsStore.sortedNotifications);
const unreadCount = computed(() => notificationsStore.unreadCount);

const close = () => {
  emit('close');
};

const markAsRead = (id) => {
  notificationsStore.markAsRead(id);
};

const markAllAsRead = () => {
  notificationsStore.markAllAsRead();
};

const deleteNotification = (id) => {
  notificationsStore.deleteNotification(id);
};

const clearAll = () => {
  if (confirm('Clear all notifications?')) {
    notificationsStore.clearAll();
  }
};

const getIcon = (type) => {
  const icons = {
    task_complete: '✅',
    task_started: '▶️',
    pomodoro_complete: '🎯',
    break_complete: '☕',
    daily_rollover: '📅',
    reminder: '⏰',
    warning: '⚠️',
    success: '🎉',
    info: 'ℹ️'
  };
  return icons[type] || '🔔';
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
</script>

<style scoped>
.notification-panel {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.panel-content {
  position: fixed;
  top: 64px;
  right: 16px;
  width: 400px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 96px);
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 50;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #0f172a;
  border: 1px solid #1e293b;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.notification-item:hover {
  background: #1e293b;
  border-color: #334155;
}

.notification-item.unread {
  background: #1e3a5f;
  border-color: #3b82f6;
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: #3b82f6;
  border-radius: 0 4px 4px 0;
}

.notification-icon {
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 4px;
}

.notification-body {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 11px;
  color: #64748b;
}

.delete-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  background: transparent;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
}
</style>

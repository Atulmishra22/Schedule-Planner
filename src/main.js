import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useTasksStore } from './stores/tasks'
import { useTimeTrackingStore } from './stores/timeTracking'
import { useNotificationsStore } from './stores/notifications'
import { setupExtensionSync } from './utils/extensionSync'
import { getTodayLocal } from './utils/dateHelpers'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize stores and load data before mounting
const tasksStore = useTasksStore()
const timeStore = useTimeTrackingStore()
const notificationsStore = useNotificationsStore()

// Load data from localStorage
tasksStore.loadTasks()
timeStore.loadEntries()
notificationsStore.loadNotifications()

// Check for daily rollover
const checkDailyRollover = () => {
  const today = getTodayLocal()
  const lastRollover = localStorage.getItem('lastRollover')
  
  if (lastRollover !== today) {
    console.log(`Day changed: ${lastRollover} → ${today}. Rolling over tasks...`)
    tasksStore.rolloverTasks()
    localStorage.setItem('lastRollover', today)
    
    // Add notification for new day
    notificationsStore.addNotification({
      type: 'daily_rollover',
      title: 'New Day Started! 🌅',
      body: `Recurring tasks have been added for ${today}`
    })
  }
}

// Initial rollover check
checkDailyRollover()

// Midnight detection - check for day changes every minute
setInterval(() => {
  checkDailyRollover()
}, 60000) // Check every 60 seconds

// Setup extension storage sync if in Chrome extension context
setupExtensionSync()

// Mount the app after data is loaded
app.mount('#app')


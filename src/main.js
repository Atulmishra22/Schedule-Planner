import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useTasksStore } from './stores/tasks'
import { useTimeTrackingStore } from './stores/timeTracking'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize stores and load data before mounting
const tasksStore = useTasksStore()
const timeStore = useTimeTrackingStore()

// Load data from localStorage
tasksStore.loadTasks()
timeStore.loadEntries()

// Check for daily rollover
const checkDailyRollover = () => {
  const today = new Date().toISOString().slice(0, 10)
  const lastRollover = localStorage.getItem('lastRollover')
  
  if (lastRollover !== today) {
    tasksStore.rolloverTasks()
    localStorage.setItem('lastRollover', today)
  }
}

checkDailyRollover()

// Mount the app after data is loaded
app.mount('#app')


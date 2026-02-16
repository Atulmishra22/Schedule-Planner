// stores/timeTracking.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useTasksStore } from './tasks';

export const useTimeTrackingStore = defineStore('timeTracking', () => {
  // State
  const timeEntries = ref([]);
  const currentEntry = ref(null);
  const intervalId = ref(null);
  
  // Getters
  const todayEntries = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return timeEntries.value.filter(entry => entry.date === today);
  });
  
  const totalTimeToday = computed(() => {
    let total = todayEntries.value.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    
    // Add current entry time if tracking today
    if (currentEntry.value && currentEntry.value.date === new Date().toISOString().slice(0, 10)) {
      total += (currentEntry.value.duration || 0);
    }
    
    return total;
  });
  
  const isTracking = computed(() => currentEntry.value !== null);
  
  // Actions
  const startTracking = (taskId) => {
    if (currentEntry.value) {
      stopTracking();
    }
    
    currentEntry.value = {
      id: generateId(),
      taskId,
      startTime: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10),
      pauses: [],
      duration: 0
    };
    
    // Start interval to update duration
    intervalId.value = setInterval(() => {
      if (currentEntry.value) {
        const start = new Date(currentEntry.value.startTime);
        const now = new Date();
        const pauseTime = currentEntry.value.pauses.reduce((sum, pause) => {
          return sum + (new Date(pause.endTime || now) - new Date(pause.startTime));
        }, 0);
        
        const durationSeconds = Math.floor((now - start - pauseTime) / 1000);
        const durationMinutes = Math.floor(durationSeconds / 60);
        currentEntry.value.duration = durationMinutes;
        
        // Update the task's actualDuration in real-time (in seconds for smooth progress)
        const tasksStore = useTasksStore();
        const task = tasksStore.tasks.find(t => t.id === currentEntry.value.taskId);
        
        tasksStore.updateTask(currentEntry.value.taskId, { 
          actualDuration: durationMinutes,
          actualDurationSeconds: durationSeconds
        });
        
        // Auto-complete if actual duration reaches or exceeds planned duration
        if (task && task.duration && durationMinutes >= task.duration && task.status !== 'completed') {
          console.log(`Auto-completing task: ${task.title} (${durationMinutes}/${task.duration} minutes)`);
          stopTracking();
          tasksStore.completeTask(task.id);
        }
      }
    }, 1000);
  };
  
  const pauseTracking = (reason = '') => {
    if (!currentEntry.value) return;
    
    // Add pause record
    currentEntry.value.pauses.push({
      startTime: new Date().toISOString(),
      endTime: null,
      reason
    });
    
    // Stop the interval while paused
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  };
  
  const resumeTracking = () => {
    if (!currentEntry.value) return;
    
    const lastPause = currentEntry.value.pauses[currentEntry.value.pauses.length - 1];
    if (lastPause && !lastPause.endTime) {
      lastPause.endTime = new Date().toISOString();
      lastPause.duration = Math.floor(
        (new Date(lastPause.endTime) - new Date(lastPause.startTime)) / 60000
      );
    }
    
    // Restart the interval to continue tracking
    if (!intervalId.value) {
      intervalId.value = setInterval(() => {
        if (currentEntry.value) {
          const start = new Date(currentEntry.value.startTime);
          const now = new Date();
          const pauseTime = currentEntry.value.pauses.reduce((sum, pause) => {
            return sum + (new Date(pause.endTime || now) - new Date(pause.startTime));
          }, 0);
          
          const durationSeconds = Math.floor((now - start - pauseTime) / 1000);
          const durationMinutes = Math.floor(durationSeconds / 60);
          currentEntry.value.duration = durationMinutes;
          
          // Update the task's actualDuration in real-time
          const tasksStore = useTasksStore();
          const task = tasksStore.tasks.find(t => t.id === currentEntry.value.taskId);
          
          tasksStore.updateTask(currentEntry.value.taskId, { 
            actualDuration: durationMinutes,
            actualDurationSeconds: durationSeconds
          });
          
          // Auto-complete if actual duration reaches or exceeds planned duration
          if (task && task.duration && durationMinutes >= task.duration && task.status !== 'completed') {
            console.log(`Auto-completing task: ${task.title} (${durationMinutes}/${task.duration} minutes)`);
            stopTracking();
            tasksStore.completeTask(task.id);
          }
        }
      }, 1000);
    }
  };
  
  const stopTracking = () => {
    if (!currentEntry.value) return;
    
    // Clear the interval FIRST
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
    
    // End any active pause
    const lastPause = currentEntry.value.pauses[currentEntry.value.pauses.length - 1];
    if (lastPause && !lastPause.endTime) {
      resumeTracking();
    }
    
    currentEntry.value.endTime = new Date().toISOString();
    
    // Calculate final duration
    const start = new Date(currentEntry.value.startTime);
    const end = new Date(currentEntry.value.endTime);
    const pauseTime = currentEntry.value.pauses.reduce((sum, pause) => {
      return sum + (new Date(pause.endTime) - new Date(pause.startTime));
    }, 0);
    
    currentEntry.value.duration = Math.floor((end - start - pauseTime) / 60000);
    
    // Calculate focus score
    currentEntry.value.focusScore = calculateFocusScore(currentEntry.value);
    
    // Save entry
    timeEntries.value.push({ ...currentEntry.value });
    saveEntries();
    
    // Clear current entry
    currentEntry.value = null;
  };
  
  const calculateFocusScore = (entry) => {
    const pauseCount = entry.pauses.length;
    const totalPauseTime = entry.pauses.reduce((sum, pause) => sum + (pause.duration || 0), 0);
    const workTime = entry.duration;
    
    // Base score: time worked vs total time
    const timeScore = workTime / (workTime + totalPauseTime);
    
    // Penalty for number of pauses
    const pausePenalty = Math.max(0, 1 - (pauseCount * 0.05));
    
    return Math.round(timeScore * pausePenalty * 100);
  };
  
  const getEntriesByDateRange = (startDate, endDate) => {
    return timeEntries.value.filter(entry => {
      return entry.date >= startDate && entry.date <= endDate;
    });
  };
  
  const saveEntries = () => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries.value));
  };
  
  const loadEntries = () => {
    const stored = localStorage.getItem('timeEntries');
    if (stored) {
      timeEntries.value = JSON.parse(stored);
    }
  };
  
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  return {
    timeEntries,
    currentEntry,
    todayEntries,
    totalTimeToday,
    isTracking,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    getEntriesByDateRange,
    loadEntries
  };
});

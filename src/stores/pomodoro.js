// stores/pomodoro.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useTimeTrackingStore } from './timeTracking';

export const usePomodoroStore = defineStore('pomodoro', () => {
  const timeTrackingStore = useTimeTrackingStore();
  
  // State
  const isActive = ref(false);
  const isPaused = ref(false);
  const currentPhase = ref('focus'); // 'focus', 'shortBreak', 'longBreak'
  const timeRemaining = ref(0); // in seconds
  const completedPomodoros = ref(0);
  const currentTaskId = ref(null);
  const intervalId = ref(null);
  const sessionStartTime = ref(null);
  const sessionElapsedSeconds = ref(0); // Track actual elapsed time
  const sessions = ref([]); // Store completed pomodoro sessions
  
  // Settings (loaded from localStorage)
  const settings = ref({
    enabled: true,
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    intervalsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false
  });
  
  // Getters
  const isBreak = computed(() => {
    return currentPhase.value === 'shortBreak' || currentPhase.value === 'longBreak';
  });
  
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60);
    const seconds = timeRemaining.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });
  
  const progress = computed(() => {
    const total = getPhaseDuration(currentPhase.value) * 60;
    return ((total - timeRemaining.value) / total) * 100;
  });
  
  const nextBreakType = computed(() => {
    return (completedPomodoros.value + 1) % settings.value.intervalsBeforeLongBreak === 0
      ? 'longBreak'
      : 'shortBreak';
  });
  
  // Methods
  const getPhaseDuration = (phase) => {
    switch (phase) {
      case 'focus':
        return settings.value.workDuration;
      case 'shortBreak':
        return settings.value.shortBreak;
      case 'longBreak':
        return settings.value.longBreak;
      default:
        return settings.value.workDuration;
    }
  };
  
  const startPomodoro = (taskId) => {
    if (!settings.value.enabled) return false;
    
    currentTaskId.value = taskId;
    currentPhase.value = 'focus';
    timeRemaining.value = settings.value.workDuration * 60;
    isActive.value = true;
    isPaused.value = false;
    sessionStartTime.value = new Date().toISOString();
    sessionElapsedSeconds.value = 0; // Reset elapsed time
    
    startTimer();
    return true;
  };
  
  const startBreak = (breakType = null) => {
    const type = breakType || nextBreakType.value;
    currentPhase.value = type;
    timeRemaining.value = getPhaseDuration(type) * 60;
    isActive.value = true;
    isPaused.value = false;
    
    // Pause the task tracking during break
    if (currentTaskId.value && timeTrackingStore.isTracking) {
      timeTrackingStore.pauseTracking('pomodoro-break');
    }
    
    startTimer();
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Break Time! 🍅', {
        body: `Time for a ${type === 'longBreak' ? 'long' : 'short'} break`,
        icon: '/favicon.ico'
      });
    }
  };
  
  const resumeWork = () => {
    currentPhase.value = 'focus';
    timeRemaining.value = settings.value.workDuration * 60;
    isActive.value = true;
    isPaused.value = false;
    
    // Resume task tracking
    if (currentTaskId.value && timeTrackingStore.currentEntry) {
      timeTrackingStore.resumeTracking();
    }
    
    startTimer();
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Time! 🎯', {
        body: 'Time to get back to work',
        icon: '/favicon.ico'
      });
    }
  };
  
  const startTimer = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
    
    intervalId.value = setInterval(() => {
      if (isPaused.value) return;
      
      timeRemaining.value--;
      
      // Track actual elapsed time (only for focus sessions)
      if (currentPhase.value === 'focus') {
        sessionElapsedSeconds.value++;
      }
      
      if (timeRemaining.value <= 0) {
        handlePhaseComplete();
      }
    }, 1000);
  };
  
  const handlePhaseComplete = () => {
    stopTimer();
    
    // Play sound if enabled
    playNotificationSound();
    
    if (currentPhase.value === 'focus') {
      // Focus session completed
      completedPomodoros.value++;
      
      // Save the completed session with ACTUAL elapsed time
      if (sessionStartTime.value) {
        const actualMinutes = Math.round(sessionElapsedSeconds.value / 60); // Real time worked
        const session = {
          id: Date.now(),
          taskId: currentTaskId.value,
          startTime: sessionStartTime.value,
          endTime: new Date().toISOString(),
          duration: actualMinutes, // Use actual time, not preset duration
          type: 'focus',
          completed: true
        };
        sessions.value.push(session);
        saveSessions();
        sessionStartTime.value = null;
        sessionElapsedSeconds.value = 0;
      }
      
      // Pause the task
      if (currentTaskId.value && timeTrackingStore.isTracking) {
        timeTrackingStore.pauseTracking('pomodoro-complete');
      }
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete! 🍅', {
          body: `Great work! You've completed ${completedPomodoros.value} pomodoro(s)`,
          icon: '/favicon.ico'
        });
      }
      
      // Auto-start break if enabled
      if (settings.value.autoStartBreaks) {
        setTimeout(() => startBreak(), 2000);
      } else {
        isActive.value = false;
      }
    } else {
      // Break completed
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Over! 💪', {
          body: 'Ready to start your next focus session?',
          icon: '/favicon.ico'
        });
      }
      
      // Auto-start next pomodoro if enabled
      if (settings.value.autoStartPomodoros) {
        setTimeout(() => resumeWork(), 2000);
      } else {
        isActive.value = false;
      }
    }
  };
  
  const pause = () => {
    isPaused.value = true;
  };
  
  const resume = () => {
    isPaused.value = false;
  };
  
  const stop = () => {
    stopTimer();
    isActive.value = false;
    isPaused.value = false;
    timeRemaining.value = 0;
    currentTaskId.value = null;
    sessionElapsedSeconds.value = 0; // Reset actual time
  };
  
  const reset = () => {
    stop();
    completedPomodoros.value = 0;
  };
  
  const skipPhase = () => {
    handlePhaseComplete();
  };
  
  const stopTimer = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  };
  
  const playNotificationSound = () => {
    const savedSettings = JSON.parse(localStorage.getItem('app-settings') || '{}');
    if (savedSettings.notifications?.sound) {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };
  
  const loadSettings = () => {
    const savedSettings = JSON.parse(localStorage.getItem('app-settings') || '{}');
    if (savedSettings.pomodoro) {
      settings.value = { ...settings.value, ...savedSettings.pomodoro };
    }
  };
  
  const updateSettings = (newSettings) => {
    settings.value = { ...settings.value, ...newSettings };
  };
  
  const saveSessions = () => {
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions.value));
  };
  
  const loadSessions = () => {
    const saved = localStorage.getItem('pomodoro-sessions');
    if (saved) {
      sessions.value = JSON.parse(saved);
    }
  };
  
  const getSessionsForDate = (dateString) => {
    return sessions.value.filter(session => {
      const sessionDate = new Date(session.startTime).toLocaleDateString('en-CA');
      return sessionDate === dateString;
    });
  };
  
  const getTodaysFocusMinutes = () => {
    const today = new Date().toLocaleDateString('en-CA');
    const todaySessions = getSessionsForDate(today);
    let total = todaySessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    
    // Add currently active Pomodoro time in real-time
    if (isActive.value && !isBreak.value && currentPhase.value === 'focus') {
      total += Math.round(sessionElapsedSeconds.value / 60);
    }
    
    return total;
  };
  
  const getWeekFocusMinutes = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let total = sessions.value
      .filter(session => new Date(session.startTime) >= weekAgo)
      .reduce((sum, session) => sum + (session.duration || 0), 0);
    
    // Add active session if running
    if (isActive.value && !isBreak.value && currentPhase.value === 'focus') {
      total += Math.round(sessionElapsedSeconds.value / 60);
    }
    
    return total;
  };
  
  const getMonthFocusMinutes = () => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    let total = sessions.value
      .filter(session => new Date(session.startTime) >= monthAgo)
      .reduce((sum, session) => sum + (session.duration || 0), 0);
    
    // Add active session if running
    if (isActive.value && !isBreak.value && currentPhase.value === 'focus') {
      total += Math.round(sessionElapsedSeconds.value / 60);
    }
    
    return total;
  };
  
  const calculateFocusScore = () => {
    const todayMinutes = getTodaysFocusMinutes();
    const targetMinutes = 4 * settings.value.workDuration; // 4 pomodoros target
    return Math.min(100, Math.round((todayMinutes / targetMinutes) * 100));
  };
  
  // Load settings and sessions on init
  loadSettings();
  loadSessions();
  
  return {
    // State
    isActive,
    isPaused,
    currentPhase,
    timeRemaining,
    completedPomodoros,
    currentTaskId,
    settings,
    sessions,
    
    // Getters
    isBreak,
    formattedTime,
    progress,
    nextBreakType,
    
    // Actions
    startPomodoro,
    startBreak,
    resumeWork,
    pause,
    resume,
    stop,
    reset,
    skipPhase,
    loadSettings,
    updateSettings,
    saveSessions,
    loadSessions,
    getSessionsForDate,
    getTodaysFocusMinutes,
    getWeekFocusMinutes,
    getMonthFocusMinutes,
    calculateFocusScore
  };
});

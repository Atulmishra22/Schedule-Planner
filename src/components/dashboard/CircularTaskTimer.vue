<template>
  <div 
    v-if="activeTask"
    class="bg-gradient-to-br from-accent-500/10 to-purple-500/10 rounded-xl border border-accent-500/30 p-6"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-neutral-100">Active Task</h3>
        <p class="text-sm text-neutral-400">{{ activeTask.category }}</p>
      </div>
      <span 
        class="px-3 py-1 rounded-full text-xs font-medium bg-accent-500/20 text-accent-400 animate-pulse"
      >
        In Progress
      </span>
    </div>
    
    <!-- Circular Timer -->
    <div class="flex justify-center mb-6">
      <div class="relative w-64 h-64">
        <!-- Background Circle -->
        <svg class="transform -rotate-90 w-64 h-64">
          <!-- Outer glow circle -->
          <circle 
            cx="128" 
            cy="128" 
            r="110" 
            stroke="url(#gradient-glow)" 
            stroke-width="2" 
            fill="none"
            opacity="0.3"
          />
          
          <!-- Background track -->
          <circle 
            cx="128" 
            cy="128" 
            r="100" 
            stroke="currentColor" 
            class="text-primary-700" 
            stroke-width="16" 
            fill="none"
          />
          
          <!-- Progress Circle (Task Time) -->
          <circle 
            cx="128" 
            cy="128" 
            r="100" 
            stroke="url(#gradient-main)" 
            stroke-width="16" 
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="taskDashOffset"
            stroke-linecap="round"
            class="transition-all duration-1000"
          />
          
          <!-- Pomodoro Progress (if enabled) -->
          <circle 
            v-if="showPomodoroRing"
            cx="128" 
            cy="128" 
            r="85" 
            stroke="url(#gradient-pomodoro)" 
            stroke-width="8" 
            fill="none"
            :stroke-dasharray="pomodoroCircumference"
            :stroke-dashoffset="pomodoroDashOffset"
            stroke-linecap="round"
            class="transition-all duration-1000"
          />
          
          <!-- Gradients -->
          <defs>
            <linearGradient id="gradient-main" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="gradient-pomodoro" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#34D399;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="gradient-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#60A5FA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#A78BFA;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
        
        <!-- Center Content -->
        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <!-- Main Timer -->
          <div class="text-6xl font-bold font-mono text-neutral-100 mb-2">
            {{ formattedElapsed }}
          </div>
          
          <!-- Separator -->
          <div class="w-16 h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent mb-2"></div>
          
          <!-- Progress Percentage -->
          <div class="mb-2">
            <span 
              class="text-3xl font-bold"
              :class="progressColor"
            >
              {{ progressPercentage }}%
            </span>
          </div>
          
          <!-- Planned Duration -->
          <div class="text-xs text-neutral-400">
            of {{ formattedDuration }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Task Info -->
    <div class="mb-6">
      <h4 class="text-xl font-semibold text-neutral-100 mb-2 text-center">
        {{ activeTask.title }}
      </h4>
      <div v-if="activeTask.description" class="text-sm text-neutral-400 text-center">
        {{ activeTask.description }}
      </div>
    </div>
    
    <!-- Priority & Tags -->
    <div class="flex items-center justify-center gap-3 mb-6">
      <span 
        class="px-3 py-1 rounded-full text-xs font-medium"
        :class="priorityClass"
      >
        {{ activeTask.priority }}
      </span>
      <span 
        v-for="tag in activeTask.tags" 
        :key="tag"
        class="px-3 py-1 rounded-full text-xs font-medium bg-primary-700 text-neutral-300"
      >
        #{{ tag }}
      </span>
    </div>
    
    <!-- Control Buttons -->
    <div class="grid grid-cols-3 gap-3">
      <button 
        class="px-4 py-3 bg-primary-700 hover:bg-primary-600 text-neutral-100 
               rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        @click="pauseTask"
      >
        <span>⏸</span>
        <span class="hidden sm:inline">Pause</span>
      </button>
      
      <button 
        class="px-4 py-3 bg-success-500 hover:bg-success-600 text-white 
               rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        @click="completeTask"
      >
        <span>✓</span>
        <span class="hidden sm:inline">Complete</span>
      </button>
      
      <button 
        class="px-4 py-3 bg-primary-700 hover:bg-primary-600 text-neutral-100 
               rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        @click="skipTask"
      >
        <span>⏭</span>
        <span class="hidden sm:inline">Skip</span>
      </button>
    </div>
    
    <!-- Stats Bar -->
    <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary-700/50">
      <div class="text-center">
        <div class="text-xs text-neutral-500 mb-1">Elapsed</div>
        <div class="text-lg font-semibold text-accent-400">
          {{ formatMinutes(elapsedMinutes) }}
        </div>
      </div>
      <div class="text-center">
        <div class="text-xs text-neutral-500 mb-1">Remaining</div>
        <div class="text-lg font-semibold text-neutral-300">
          {{ formatMinutes(remainingMinutes) }}
        </div>
      </div>
      <div class="text-center">
        <div class="text-xs text-neutral-500 mb-1">Pauses</div>
        <div class="text-lg font-semibold text-warning-400">
          {{ pauseCount }}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Empty State -->
  <div 
    v-else
    class="bg-primary-800 rounded-xl border border-primary-700 p-6 text-center"
  >
    <div class="text-6xl mb-4">⏱️</div>
    <h3 class="text-xl font-semibold text-neutral-300 mb-2">No Active Task</h3>
    <p class="text-neutral-400 text-sm">Start a task to see the timer</p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import { useTimeTrackingStore } from '@/stores/timeTracking';
import { usePomodoroStore } from '@/stores/pomodoro';

const tasksStore = useTasksStore();
const timeStore = useTimeTrackingStore();
const pomodoroStore = usePomodoroStore();

const emit = defineEmits(['pause', 'complete', 'skip']);

// State
const elapsedSeconds = ref(0);
let intervalId = null;

// Computed
const activeTask = computed(() => tasksStore.activeTask);

const elapsedMinutes = computed(() => Math.floor(elapsedSeconds.value / 60));

const remainingMinutes = computed(() => {
  if (!activeTask.value || !activeTask.value.duration) return 0;
  return Math.max(0, (activeTask.value.duration || 0) - elapsedMinutes.value);
});

const formattedElapsed = computed(() => {
  if (!activeTask.value || !activeTask.value.duration) return '00:00';
  
  // Show countdown (remaining time)
  const totalSeconds = (activeTask.value.duration || 0) * 60;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds.value);
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

const formattedDuration = computed(() => {
  if (!activeTask.value || !activeTask.value.duration) return '0m';
  const totalMinutes = activeTask.value.duration || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

const progressPercentage = computed(() => {
  if (!activeTask.value || !activeTask.value.duration || activeTask.value.duration === 0) return 0;
  const percentage = (elapsedMinutes.value / (activeTask.value.duration || 1)) * 100;
  return Math.min(Math.round(percentage), 100);
});

const progressColor = computed(() => {
  const pct = progressPercentage.value;
  if (pct >= 100) return 'text-warning-500';
  if (pct >= 75) return 'text-success-400';
  if (pct >= 50) return 'text-accent-400';
  return 'text-neutral-400';
});

const circumference = computed(() => 2 * Math.PI * 100);

const taskDashOffset = computed(() => {
  const progress = progressPercentage.value / 100;
  return circumference.value * (1 - progress);
});

const priorityClass = computed(() => {
  if (!activeTask.value) return '';
  
  const classes = {
    urgent: 'bg-warning-500/20 text-warning-500 border border-warning-500/50',
    high: 'bg-accent-500/20 text-accent-400 border border-accent-500/50',
    medium: 'bg-neutral-500/20 text-neutral-300 border border-neutral-500/50',
    low: 'bg-neutral-700 text-neutral-400'
  };
  
  return classes[activeTask.value.priority] || classes.medium;
});

const pauseCount = computed(() => {
  if (!timeStore.currentEntry) return 0;
  return timeStore.currentEntry.pauses?.length || 0;
});

// Pomodoro integration
const showPomodoroRing = computed(() => {
  return pomodoroStore.settings.enabled && pomodoroStore.isActive && !pomodoroStore.isBreak;
});

const pomodoroCircumference = computed(() => 2 * Math.PI * 85);

const pomodoroDashOffset = computed(() => {
  if (!showPomodoroRing.value) return pomodoroCircumference.value;
  const progress = pomodoroStore.progress / 100;
  return pomodoroCircumference.value * (1 - progress);
});

const pomodoroTime = computed(() => {
  return pomodoroStore.formattedTime;
});

// Methods
const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const updateElapsed = () => {
  if (!activeTask.value || !timeStore.currentEntry) {
    elapsedSeconds.value = 0;
    return;
  }
  
  const startTime = new Date(timeStore.currentEntry.startTime);
  const now = new Date();
  
  // Calculate total pause time
  let pauseTime = 0;
  if (timeStore.currentEntry.pauses) {
    pauseTime = timeStore.currentEntry.pauses.reduce((sum, pause) => {
      const pStart = new Date(pause.startTime);
      const pEnd = pause.endTime ? new Date(pause.endTime) : now;
      return sum + (pEnd - pStart);
    }, 0);
  }
  
  // Check if currently paused
  const lastPause = timeStore.currentEntry.pauses?.[timeStore.currentEntry.pauses.length - 1];
  const isPaused = lastPause && !lastPause.endTime;
  
  if (isPaused) {
    // If paused, don't count time after last pause started
    const pauseStart = new Date(lastPause.startTime);
    elapsedSeconds.value = Math.floor((pauseStart - startTime - pauseTime + (pauseStart - pauseStart)) / 1000);
  } else {
    elapsedSeconds.value = Math.floor((now - startTime - pauseTime) / 1000);
  }
};

const pauseTask = () => {
  emit('pause', activeTask.value);
};

const completeTask = () => {
  emit('complete', activeTask.value);
};

const skipTask = () => {
  if (confirm(`Skip task: ${activeTask.value.title}?`)) {
    tasksStore.updateTask(activeTask.value.id, { status: 'skipped' });
    timeStore.stopTracking();
  }
};

// Lifecycle
onMounted(() => {
  updateElapsed();
  intervalId = setInterval(updateElapsed, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

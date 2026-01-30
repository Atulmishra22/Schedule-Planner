<template>
  <div class="bg-primary-800 rounded-xl border border-primary-700 p-6 h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-neutral-100">Current Task</h2>
      <button 
        class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white 
               rounded-md text-sm font-medium transition-colors"
        @click="$emit('add-task')"
      >
        + Add Task
      </button>
    </div>
    
    <!-- Current Task with Circular Timer -->
    <div v-if="currentTask" class="flex-1 flex flex-col items-center justify-center">
      <!-- Circular Progress -->
      <div class="relative w-60 h-60 mb-6">
        <!-- Background Circle -->
        <svg class="transform -rotate-90 w-60 h-60">
          <!-- Outer glow -->
          <circle 
            cx="120" 
            cy="120" 
            r="108" 
            stroke="url(#task-gradient-glow)" 
            stroke-width="2" 
            fill="none"
            opacity="0.2"
          />
          
          <!-- Background track -->
          <circle 
            cx="120" 
            cy="120" 
            r="100" 
            stroke="currentColor" 
            class="text-primary-700" 
            stroke-width="16" 
            fill="none"
          />
          
          <!-- Progress Circle -->
          <circle 
            cx="120" 
            cy="120" 
            r="100" 
            stroke="url(#task-gradient)" 
            stroke-width="16" 
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            stroke-linecap="round"
            class="transition-all duration-1000"
          />
          
          <!-- Gradients -->
          <defs>
            <linearGradient id="task-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :style="`stop-color:${gradientStart};stop-opacity:1`" />
              <stop offset="100%" :style="`stop-color:${gradientEnd};stop-opacity:1`" />
            </linearGradient>
            <linearGradient id="task-gradient-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :style="`stop-color:${gradientStart};stop-opacity:0.8`" />
              <stop offset="100%" :style="`stop-color:${gradientEnd};stop-opacity:0.8`" />
            </linearGradient>
          </defs>
        </svg>
        
        <!-- Center Content -->
        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <!-- Timer Display -->
          <div class="text-5xl font-bold font-mono text-neutral-100">
            {{ formattedTime }}
          </div>
        </div>
      </div>
      <!-- Task Info -->
      <div class="text-center mb-6 max-w-md">
        <h3 class="text-2xl font-semibold text-neutral-100 mb-2">
          {{ currentTask.title }}
        </h3>
        <p v-if="currentTask.description" class="text-sm text-neutral-400 mb-3">
          {{ currentTask.description }}
        </p>
        
        <!-- Meta Info -->
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-primary-700 text-neutral-300">
            🏷 {{ currentTask.category }}
          </span>
          <span 
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="priorityClass"
          >
            {{ currentTask.priority }}
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-primary-700 text-neutral-300">
            ⏱ {{ currentTask.duration }}m
          </span>
        </div>
      </div>
      
      <!-- Control Buttons -->
      <div class="grid grid-cols-4 gap-3 w-full max-w-md">
        <button 
          v-if="!isRunning"
          class="col-span-2 px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white 
                 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          @click="startTask"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          <span>Start</span>
        </button>
        
        <button 
          v-else
          class="col-span-2 px-4 py-3 bg-warning-500 hover:bg-warning-600 text-white 
                 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          @click="pauseTask"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
          </svg>
          <span>Pause</span>
        </button>
        
        <button 
          class="px-4 py-3 bg-success-500 hover:bg-success-600 text-white 
                 rounded-lg font-medium transition-colors flex items-center justify-center"
          @click="completeTask"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        <button 
          class="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 
                 rounded-lg font-medium transition-colors border border-red-500/50 
                 flex items-center justify-center"
          @click="deleteTask"
          title="Delete Task"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mt-6 w-full max-w-md">
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
          <div class="text-xs text-neutral-500 mb-1">Total</div>
          <div class="text-lg font-semibold text-neutral-400">
            {{ currentTask.duration || 0 }}m
          </div>
        </div>
      </div>
      
      <!-- Next Task Preview -->
      <div v-if="nextTask" class="mt-6 pt-6 border-t border-primary-700 w-full max-w-md">
        <div class="text-xs text-neutral-500 mb-2 text-center">Up Next</div>
        <div class="bg-primary-900 rounded-lg p-3 text-center">
          <div class="text-sm font-medium text-neutral-300">{{ nextTask.title }}</div>
          <div class="text-xs text-neutral-500 mt-1">
            {{ nextTask.timeSlot || 'No time set' }} · {{ nextTask.duration }}m
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center text-center py-12">
      <div class="text-7xl mb-4">📋</div>
      <h3 class="text-2xl font-semibold text-neutral-300 mb-2">No Tasks Scheduled</h3>
      <p class="text-neutral-400 mb-6">Click "Add Task" to get started</p>
      <button 
        class="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white 
               rounded-lg font-medium transition-colors"
        @click="$emit('add-task')"
      >
        + Add Your First Task
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import { useTimeTrackingStore } from '@/stores/timeTracking';

const tasksStore = useTasksStore();
const timeStore = useTimeTrackingStore();

const emit = defineEmits(['add-task', 'start', 'pause', 'complete', 'delete']);

// State
const elapsedSeconds = ref(0);
let intervalId = null;

// Computed
const currentTask = computed(() => {
  // First check if there's an active task
  if (tasksStore.activeTask) {
    return tasksStore.activeTask;
  }
  
  // Otherwise, get the next pending task
  const pending = tasksStore.pendingTasksToday;
  return pending.length > 0 ? pending[0] : null;
});

const nextTask = computed(() => {
  if (!currentTask.value) return null;
  
  const pending = tasksStore.pendingTasksToday;
  const currentIndex = pending.findIndex(t => t.id === currentTask.value.id);
  
  return currentIndex >= 0 && currentIndex < pending.length - 1 
    ? pending[currentIndex + 1] 
    : null;
});

const isRunning = computed(() => {
  return currentTask.value && currentTask.value.status === 'in-progress';
});

const elapsedMinutes = computed(() => Math.floor(elapsedSeconds.value / 60));

const remainingMinutes = computed(() => {
  if (!currentTask.value || !currentTask.value.duration) return 0;
  return Math.max(0, (currentTask.value.duration || 0) - elapsedMinutes.value);
});

const formattedTime = computed(() => {
  if (!currentTask.value || !currentTask.value.duration) return '00:00';
  
  // Calculate remaining time in seconds
  const totalTaskSeconds = (currentTask.value.duration || 0) * 60;
  const remainingSeconds = Math.max(0, totalTaskSeconds - elapsedSeconds.value);
  
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const progressPercentage = computed(() => {
  if (!currentTask.value || !currentTask.value.duration || currentTask.value.duration === 0) return 0;
  const percentage = (elapsedMinutes.value / currentTask.value.duration) * 100;
  return Math.min(Math.round(percentage), 100);
});

const progressColor = computed(() => {
  const pct = progressPercentage.value;
  if (pct >= 100) return 'text-warning-500';
  if (pct >= 75) return 'text-success-400';
  if (pct >= 50) return 'text-accent-400';
  return 'text-neutral-300';
});

const gradientStart = computed(() => {
  const pct = progressPercentage.value;
  if (pct >= 100) return '#F59E0B'; // warning
  if (pct >= 75) return '#10B981'; // success
  return '#3B82F6'; // accent
});

const gradientEnd = computed(() => {
  const pct = progressPercentage.value;
  if (pct >= 100) return '#D97706'; // warning dark
  if (pct >= 75) return '#059669'; // success dark
  return '#8B5CF6'; // purple
});

const circumference = computed(() => 2 * Math.PI * 100);

const dashOffset = computed(() => {
  const progress = progressPercentage.value / 100;
  return circumference.value * (1 - progress);
});

const priorityClass = computed(() => {
  if (!currentTask.value) return '';
  
  const classes = {
    urgent: 'bg-warning-500/20 text-warning-500 border border-warning-500/50',
    high: 'bg-accent-500/20 text-accent-400 border border-accent-500/50',
    medium: 'bg-neutral-500/20 text-neutral-300 border border-neutral-500/50',
    low: 'bg-neutral-700 text-neutral-400'
  };
  
  return classes[currentTask.value.priority] || classes.medium;
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
  if (!currentTask.value || !timeStore.currentEntry) {
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
  
  // Calculate elapsed time
  elapsedSeconds.value = Math.floor((now - startTime - pauseTime) / 1000);
};

const startTask = () => {
  if (currentTask.value) {
    emit('start', currentTask.value);
  }
};

const pauseTask = () => {
  if (currentTask.value) {
    emit('pause', currentTask.value);
  }
};

const completeTask = () => {
  if (currentTask.value) {
    emit('complete', currentTask.value);
  }
};

const deleteTask = () => {
  if (currentTask.value) {
    if (confirm(`Delete task: "${currentTask.value.title}"?\n\nThis cannot be undone.`)) {
      emit('delete', currentTask.value);
    }
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

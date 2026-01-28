<template>
  <div 
    v-if="pomodoroStore.settings.enabled"
    class="bg-gradient-to-br from-primary-800 to-primary-900 rounded-xl border p-6"
    :class="pomodoroStore.isActive ? (pomodoroStore.isBreak ? 'border-success-500' : 'border-accent-500') : 'border-primary-700'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl">{{ pomodoroStore.isBreak ? '☕' : '🍅' }}</span>
        <div>
          <h3 class="text-lg font-semibold text-neutral-100">
            {{ phaseTitle }}
          </h3>
          <p class="text-xs text-neutral-400">
            {{ pomodoroStore.completedPomodoros }} pomodoros completed
          </p>
        </div>
      </div>
      
      <!-- Status Badge -->
      <span 
        v-if="pomodoroStore.isActive"
        class="px-3 py-1 rounded-full text-xs font-medium"
        :class="statusBadgeClass"
      >
        {{ pomodoroStore.isPaused ? 'Paused' : 'Active' }}
      </span>
    </div>
    
    <!-- Timer Display -->
    <div class="text-center mb-6">
      <div class="text-6xl font-mono font-bold text-neutral-100 tracking-tight mb-2">
        {{ pomodoroStore.formattedTime }}
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full bg-primary-700 rounded-full h-2 overflow-hidden mb-2">
        <div 
          class="h-full rounded-full transition-all duration-1000"
          :class="pomodoroStore.isBreak ? 'bg-success-500' : 'bg-accent-500'"
          :style="{ width: pomodoroStore.progress + '%' }"
        ></div>
      </div>
      
      <p class="text-sm text-neutral-400">
        {{ phaseDescription }}
      </p>
    </div>
    
    <!-- Controls -->
    <div v-if="pomodoroStore.isActive" class="grid grid-cols-3 gap-2 mb-4">
      <button 
        class="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-neutral-100 
               rounded-lg text-sm font-medium transition-colors"
        @click="togglePause"
      >
        {{ pomodoroStore.isPaused ? '▶ Resume' : '⏸ Pause' }}
      </button>
      
      <button 
        class="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-neutral-100 
               rounded-lg text-sm font-medium transition-colors"
        @click="skipPhase"
      >
        ⏭ Skip
      </button>
      
      <button 
        class="px-4 py-2 bg-warning-500/20 hover:bg-warning-500/30 text-warning-500 
               rounded-lg text-sm font-medium transition-colors border border-warning-500/30"
        @click="stopTimer"
      >
        ⏹ Stop
      </button>
    </div>
    
    <!-- Action Buttons (when not active) -->
    <div v-else class="space-y-2">
      <button 
        v-if="!pomodoroStore.isBreak"
        class="w-full px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white 
               rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        @click="startWork"
      >
        <span>🍅</span>
        Start Focus Session
      </button>
      
      <button 
        class="w-full px-4 py-2 bg-success-500/20 hover:bg-success-500/30 text-success-400 
               rounded-lg text-sm font-medium transition-colors border border-success-500/30"
        @click="startBreak"
      >
        ☕ Take a Break
      </button>
    </div>
    
    <!-- Next Phase Info -->
    <div v-if="pomodoroStore.isActive && !pomodoroStore.isBreak" 
         class="mt-4 pt-4 border-t border-primary-700">
      <p class="text-xs text-neutral-400 text-center">
        Next: {{ nextBreakText }}
      </p>
    </div>
    
    <!-- Pomodoro Pattern Visualization -->
    <div class="mt-4 pt-4 border-t border-primary-700">
      <div class="flex items-center justify-center gap-1">
        <div 
          v-for="i in pomodoroStore.settings.intervalsBeforeLongBreak" 
          :key="i"
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all"
          :class="i <= pomodoroStore.completedPomodoros 
            ? 'bg-accent-500 text-white' 
            : 'bg-primary-700 text-neutral-500'"
        >
          {{ i <= pomodoroStore.completedPomodoros ? '✓' : i }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePomodoroStore } from '@/stores/pomodoro';

const pomodoroStore = usePomodoroStore();

const phaseTitle = computed(() => {
  switch (pomodoroStore.currentPhase) {
    case 'focus':
      return 'Focus Session';
    case 'shortBreak':
      return 'Short Break';
    case 'longBreak':
      return 'Long Break';
    default:
      return 'Pomodoro Timer';
  }
});

const phaseDescription = computed(() => {
  if (!pomodoroStore.isActive) {
    return 'Ready to start your next focus session';
  }
  
  switch (pomodoroStore.currentPhase) {
    case 'focus':
      return 'Stay focused on your task';
    case 'shortBreak':
      return 'Take a quick rest';
    case 'longBreak':
      return 'Recharge for the next round';
    default:
      return '';
  }
});

const statusBadgeClass = computed(() => {
  if (pomodoroStore.isPaused) {
    return 'bg-warning-500/20 text-warning-400';
  }
  return pomodoroStore.isBreak
    ? 'bg-success-500/20 text-success-400 animate-pulse'
    : 'bg-accent-500/20 text-accent-400 animate-pulse';
});

const nextBreakText = computed(() => {
  const remaining = pomodoroStore.settings.intervalsBeforeLongBreak - 
    (pomodoroStore.completedPomodoros % pomodoroStore.settings.intervalsBeforeLongBreak);
  
  if (remaining === 1) {
    return `${pomodoroStore.settings.longBreak} min long break`;
  }
  return `${pomodoroStore.settings.shortBreak} min break`;
});

const startWork = () => {
  if (pomodoroStore.currentTaskId) {
    pomodoroStore.resumeWork();
  } else {
    pomodoroStore.startPomodoro(null);
  }
};

const startBreak = () => {
  pomodoroStore.startBreak();
};

const togglePause = () => {
  if (pomodoroStore.isPaused) {
    pomodoroStore.resume();
  } else {
    pomodoroStore.pause();
  }
};

const skipPhase = () => {
  pomodoroStore.skipPhase();
};

const stopTimer = () => {
  if (confirm('Stop the current Pomodoro session?')) {
    pomodoroStore.stop();
  }
};
</script>

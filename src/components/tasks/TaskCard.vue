<template>
  <div 
    class="bg-primary-800 rounded-lg border border-primary-700 p-4 
           hover:border-accent-500 transition-all duration-200
           cursor-pointer group"
    :class="{ 'opacity-60': task.status === 'completed' }"
    @click="handleTaskClick"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <!-- Status Indicator -->
        <div 
          class="w-2 h-2 rounded-full transition-colors"
          :class="statusColor"
        ></div>
        
        <!-- Task Title -->
        <h3 class="text-neutral-100 font-medium group-hover:text-accent-400 
                   transition-colors"
          :class="{ 'line-through text-neutral-400': task.status === 'completed' }"
        >
          {{ task.title }}
        </h3>
        
        <!-- Status Badge -->
        <span 
          class="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
          :class="statusBadgeClass"
        >
          <span v-html="statusIcon"></span>
          {{ statusBadgeText }}
        </span>
        
        <!-- Priority Badge -->
        <span 
          v-if="task.priority === 'high' || task.priority === 'urgent'"
          class="px-2 py-0.5 rounded text-xs font-medium"
          :class="priorityClass"
        >
          {{ task.priority }}
        </span>
      </div>
      
      <!-- Time Slot -->
      <span v-if="task.timeSlot" class="text-neutral-400 text-sm font-mono">
        {{ task.timeSlot }}
      </span>
      <span v-else class="text-neutral-500 text-sm italic">
        No time set
      </span>
    </div>
    
    <!-- Category & Duration -->
    <div class="flex items-center gap-4 mb-3 text-sm text-neutral-400">
      <span class="flex items-center gap-1">
        <span class="text-accent-400">🏷</span>
        {{ task.category }}
      </span>
      <span>{{ task.duration || task.estimatedDuration || 0 }}m</span>
    </div>
    
    <!-- Progress Bar (if in progress) -->
    <div v-if="task.status === 'in-progress'" class="mt-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-neutral-400">Progress</span>
        <span class="text-xs text-neutral-400 font-mono">
          {{ formatTime(task.actualDuration || 0) }} / {{ formatTime(task.duration || task.estimatedDuration || 0) }}
        </span>
      </div>
      
      <div class="w-full bg-primary-700 rounded-full h-1.5 overflow-hidden">
        <div 
          class="bg-accent-500 h-full rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div v-if="showActions" class="mt-4 flex gap-2">
      <!-- Start Button -->
      <button 
        v-if="task.status === 'pending'"
        class="flex-1 px-3 py-2 bg-accent-500 hover:bg-accent-600 
               text-white rounded-md text-sm font-medium transition-colors
               flex items-center justify-center gap-2"
        @click.stop="startTask"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
        <span>Start</span>
      </button>
      
      <!-- Pause Button (only when in progress) -->
      <button 
        v-if="task.status === 'in-progress'"
        class="flex-1 px-3 py-2 bg-warning-500 hover:bg-warning-600 
               text-white rounded-md text-sm font-medium transition-colors
               flex items-center justify-center gap-2"
        @click.stop="pauseTask"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
        </svg>
        <span>Pause</span>
      </button>
      
      <!-- Complete Button (only when in progress) -->
      <button 
        v-if="task.status === 'in-progress'"
        class="flex-1 px-3 py-2 bg-success-500 hover:bg-success-600 
               text-white rounded-md text-sm font-medium transition-colors
               flex items-center justify-center gap-2"
        @click.stop="completeTask"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        <span>Complete</span>
      </button>
      
      <!-- Edit Button (only when not in progress and not completed) -->
      <button 
        v-if="task.status === 'pending'"
        class="px-3 py-2 bg-primary-700 hover:bg-primary-600 
               text-neutral-300 rounded-md text-sm transition-colors
               flex items-center justify-center gap-2"
        @click.stop="editTask"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>Edit</span>
      </button>
      
      <!-- Delete Button (always shown when actions are enabled) -->
      <button 
        class="px-3 py-2 bg-error-500/20 hover:bg-error-500/30 
               text-error-400 rounded-md text-sm transition-colors
               flex items-center justify-center gap-2"
        :class="{ 'flex-1': task.status === 'completed' }"
        @click.stop="deleteTask"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>Delete</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  task: Object,
  showActions: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['start', 'edit', 'click', 'pause', 'complete', 'delete']);

const statusColor = computed(() => {
  switch (props.task.status) {
    case 'completed': return 'bg-success-500';
    case 'in-progress': return 'bg-accent-500 animate-pulse';
    case 'skipped': return 'bg-neutral-600';
    default: return 'bg-neutral-400';
  }
});

const priorityClass = computed(() => {
  return props.task.priority === 'urgent' 
    ? 'bg-warning-500/20 text-warning-500'
    : 'bg-accent-500/20 text-accent-400';
});

const statusBadgeClass = computed(() => {
  switch (props.task.status) {
    case 'completed': 
      return 'bg-success-500/20 text-success-400';
    case 'in-progress': 
      return 'bg-accent-500/20 text-accent-400 animate-pulse';
    case 'pending': 
      return 'bg-neutral-500/20 text-neutral-300';
    default: 
      return 'bg-neutral-500/20 text-neutral-400';
  }
});

const statusBadgeText = computed(() => {
  switch (props.task.status) {
    case 'completed': 
      return 'Completed';
    case 'in-progress': 
      return 'In Progress';
    case 'pending': 
      return 'Pending';
    default: 
      return props.task.status;
  }
});

const statusIcon = computed(() => {
  switch (props.task.status) {
    case 'completed':
      return '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>';
    case 'in-progress':
      return '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>';
    case 'pending':
      return '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    default:
      return '';
  }
});

const progress = computed(() => {
  const seconds = props.task.actualDurationSeconds || (props.task.actualDuration * 60) || 0;
  const estimatedSeconds = (props.task.duration || props.task.estimatedDuration || 0) * 60;
  if (seconds === 0 || estimatedSeconds === 0) return 0;
  return Math.min((seconds / estimatedSeconds) * 100, 100);
});

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const handleTaskClick = () => emit('click', props.task);
const startTask = () => emit('start', props.task);
const editTask = () => emit('edit', props.task);
const pauseTask = () => emit('pause', props.task);
const completeTask = () => emit('complete', props.task);
const deleteTask = () => emit('delete', props.task);
</script>

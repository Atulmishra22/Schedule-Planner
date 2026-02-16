<template>
  <div class="bg-primary-900 p-8">
    <!-- Page Title -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-neutral-100">Today's Overview</h1>
      <p class="text-neutral-400 mt-1">{{ currentDate }}</p>
    </div>
    
    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      <!-- Left Column - Pomodoro -->
      <div class="lg:col-span-4 flex">
        <!-- Pomodoro Timer -->
        <PomodoroTimer class="flex-1" />
      </div>
      
      <!-- Middle Column - Current Task -->
      <div class="lg:col-span-5 flex">
        <!-- Current Task Circular Timer -->
        <TaskCircularTimer
          class="flex-1" 
          @add-task="showAddTask = true"
          @start="handleStartTask"
          @pause="handlePauseTask"
          @complete="handleCompleteTask"
          @delete="handleDeleteTask"
        />
      </div>
      
      <!-- Right Column - Analytics -->
      <div class="lg:col-span-3 flex">
        <FocusMeter
          class="flex-1" 
          :focus-score="focusScore" 
          :stats="focusStats"
          @view-analytics="$router.push('/analytics')"
        />
      </div>
    </div>
    
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-6 h-6 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-neutral-400 text-sm">Completed</span>
        </div>
        <p class="text-3xl font-bold text-success-400">{{ completedCount }}</p>
      </div>
      
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-6 h-6 text-accent-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.5" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          <span class="text-neutral-400 text-sm">In Progress</span>
        </div>
        <p class="text-3xl font-bold text-accent-400">{{ inProgressCount }}</p>
      </div>
      
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-neutral-400 text-sm">Pending</span>
        </div>
        <p class="text-3xl font-bold text-neutral-400">{{ pendingCount }}</p>
      </div>
      
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-6 h-6 text-warning-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.0001 17.75C11.5859 17.75 11.2501 17.4142 11.2501 17V11C11.2501 10.5858 11.5859 10.25 12.0001 10.25C12.4143 10.25 12.7501 10.5858 12.7501 11V17C12.7501 17.4142 12.4143 17.75 12.0001 17.75Z" />
            <path d="M12.0001 8.5C12.6905 8.5 13.2501 7.94036 13.2501 7.25C13.2501 6.55964 12.6905 6 12.0001 6C11.3097 6 10.7501 6.55964 10.7501 7.25C10.7501 7.94036 11.3097 8.5 12.0001 8.5Z" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.42596 3.85984C8.59096 2.2082 10.2198 1.25 12.0001 1.25C13.7804 1.25 15.4092 2.2082 16.5742 3.85984C17.7236 5.48878 18.5001 7.71898 18.5001 10C18.5001 12.281 17.7236 14.5112 16.5742 16.1402C15.4092 17.7918 13.7804 18.75 12.0001 18.75C10.2198 18.75 8.59096 17.7918 7.42596 16.1402C6.27656 14.5112 5.50012 12.281 5.50012 10C5.50012 7.71898 6.27656 5.48878 7.42596 3.85984ZM8.57425 4.64016C7.59575 6.01122 6.90625 8.03102 6.90625 10C6.90625 11.969 7.59575 13.9888 8.57425 15.3598C9.53791 16.7082 10.7177 17.25 12.0001 17.25C13.2825 17.25 14.4623 16.7082 15.4259 15.3598C16.4044 13.9888 17.0939 11.969 17.0939 10C17.0939 8.03102 16.4044 6.01122 15.4259 4.64016C14.4623 3.2918 13.2825 2.75 12.0001 2.75C10.7177 2.75 9.53791 3.2918 8.57425 4.64016Z" />
          </svg>
          <span class="text-neutral-400 text-sm">Streak</span>
        </div>
        <p class="text-3xl font-bold text-warning-500">{{ streak }} days</p>
      </div>
    </div>

    <!-- Task Modal -->
    <TaskModal 
      :is-open="showAddTask" 
      :task="editingTask"
      @close="handleCloseModal"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useTasksStore } from '../stores/tasks';
import { useTimeTrackingStore } from '../stores/timeTracking';
import { usePomodoroStore } from '../stores/pomodoro';
import { useAnalyticsStore } from '../stores/analytics';
import FocusMeter from '../components/dashboard/FocusMeter.vue';
import PomodoroTimer from '../components/dashboard/PomodoroTimer.vue';
import CircularTaskTimer from '../components/dashboard/CircularTaskTimer.vue';
import TaskCircularTimer from '../components/tasks/TaskCircularTimer.vue';
import TaskModal from '../components/tasks/TaskModal.vue';
import { getTodayLocal } from '../utils/dateHelpers';

const tasksStore = useTasksStore();
const timeStore = useTimeTrackingStore();
const pomodoroStore = usePomodoroStore();
const analyticsStore = useAnalyticsStore();

const showAddTask = ref(false);
const editingTask = ref(null);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
});

const todayTasks = computed(() => tasksStore.todayTasks);
const completedCount = computed(() => tasksStore.completedTasksToday.length);
const inProgressCount = computed(() => tasksStore.inProgressTasks.length);
const pendingCount = computed(() => tasksStore.pendingTasksToday.length);
const streak = computed(() => 0); // Will calculate from analytics

// Use the new variance-based focus score calculation
const focusScore = computed(() => {
  // Get total actual work minutes from both sources
  const pomodoroMinutes = pomodoroStore.getTodaysFocusMinutes();
  const taskTrackingMinutes = timeStore.totalTimeToday;
  const totalMinutes = pomodoroMinutes + taskTrackingMinutes;
  
  // Target: 4 hours of focused work per day (240 minutes)
  const targetMinutes = 240;
  return Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));
});

const focusStats = computed(() => {
  // Combine Pomodoro and task tracking time
  const todayPomodoro = pomodoroStore.getTodaysFocusMinutes();
  const todayTracking = timeStore.totalTimeToday;
  
  const weekPomodoro = pomodoroStore.getWeekFocusMinutes();
  const weekTracking = getWeekTrackingMinutes();
  
  const monthPomodoro = pomodoroStore.getMonthFocusMinutes();
  const monthTracking = getMonthTrackingMinutes();
  
  return {
    today: formatMinutes(todayPomodoro + todayTracking),
    week: formatMinutes(weekPomodoro + weekTracking),
    month: formatMinutes(monthPomodoro + monthTracking)
  };
});

const getWeekTrackingMinutes = () => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAgoStr = weekAgo.toISOString().slice(0, 10);
  const todayStr = now.toISOString().slice(0, 10);
  
  const entries = timeStore.getEntriesByDateRange(weekAgoStr, todayStr);
  return entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
};

const getMonthTrackingMinutes = () => {
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthAgoStr = monthAgo.toISOString().slice(0, 10);
  const todayStr = now.toISOString().slice(0, 10);
  
  const entries = timeStore.getEntriesByDateRange(monthAgoStr, todayStr);
  return entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
};

const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}m`;
};

const handleStartTask = (task) => {
  tasksStore.startTask(task.id);
  
  // Only start new tracking if not already tracking this task
  if (!timeStore.currentEntry || timeStore.currentEntry.taskId !== task.id) {
    timeStore.startTracking(task.id);
  } else {
    // Resume from pause
    timeStore.resumeTracking();
  }
  
  // Don't auto-start Pomodoro - let user control it separately
};

const handlePauseTask = (task) => {
  timeStore.pauseTracking();
  tasksStore.pauseTask(task.id);
};

const handleCompleteTask = (task) => {
  timeStore.stopTracking();
  tasksStore.completeTask(task.id);
};

const handleDeleteTask = (task) => {
  tasksStore.deleteTask(task.id);
  if (timeStore.currentEntry?.taskId === task.id) {
    timeStore.stopTracking();
  }
};

const handleEditTask = (task) => {
  editingTask.value = task;
  showAddTask.value = true;
};

const handleTaskClick = (task) => {
  console.log('Task clicked:', task);
};

const handleCloseModal = () => {
  showAddTask.value = false;
  editingTask.value = null;
};
</script>

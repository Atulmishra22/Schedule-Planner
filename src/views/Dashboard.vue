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
          <span class="text-2xl">✓</span>
          <span class="text-neutral-400 text-sm">Completed</span>
        </div>
        <p class="text-3xl font-bold text-success-400">{{ completedCount }}</p>
      </div>
      
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">→</span>
          <span class="text-neutral-400 text-sm">In Progress</span>
        </div>
        <p class="text-3xl font-bold text-accent-400">{{ inProgressCount }}</p>
      </div>
      
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">○</span>
          <span class="text-neutral-400 text-sm">Pending</span>
        </div>
        <p class="text-3xl font-bold text-neutral-400">{{ pendingCount }}</p>
      </div>
      
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">🔥</span>
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
import FocusMeter from '../components/dashboard/FocusMeter.vue';
import PomodoroTimer from '../components/dashboard/PomodoroTimer.vue';
import CircularTaskTimer from '../components/dashboard/CircularTaskTimer.vue';
import TaskCircularTimer from '../components/tasks/TaskCircularTimer.vue';
import TaskModal from '../components/tasks/TaskModal.vue';

const tasksStore = useTasksStore();
const timeStore = useTimeTrackingStore();
const pomodoroStore = usePomodoroStore();

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

const focusScore = computed(() => {
  if (timeStore.todayEntries.length === 0) return 0;
  const avgScore = timeStore.todayEntries.reduce((sum, entry) => sum + (entry.focusScore || 0), 0) / timeStore.todayEntries.length;
  return Math.round(avgScore);
});

const focusStats = computed(() => ({
  today: formatMinutes(timeStore.totalTimeToday),
  week: '0h',
  month: '0h'
}));

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

<template>
  <div class="min-h-screen bg-primary-900 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-neutral-100 mb-2">Schedule</h1>
        <p class="text-neutral-400">{{ formattedDate }}</p>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Date Navigation -->
        <div class="flex items-center gap-2 bg-primary-800 rounded-lg p-2 border border-primary-700">
          <button 
            class="p-2 hover:bg-primary-700 rounded-md transition-colors text-neutral-400 hover:text-neutral-200"
            @click="previousDay"
          >
            ←
          </button>
          <span class="text-neutral-300 font-medium min-w-[140px] text-center">
            {{ shortDate }}
          </span>
          <button 
            class="p-2 hover:bg-primary-700 rounded-md transition-colors text-neutral-400 hover:text-neutral-200"
            @click="nextDay"
            :disabled="isToday"
            :class="{ 'opacity-50 cursor-not-allowed': isToday }"
          >
            →
          </button>
          <button 
            v-if="!isToday"
            class="px-3 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-md text-sm font-medium transition-colors ml-2"
            @click="goToToday"
          >
            Today
          </button>
        </div>
        
        <!-- Add Task Button -->
        <button 
          class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          @click="showTaskModal = true"
        >
          <span class="text-xl">+</span>
          Add Task
        </button>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Timeline Section (Left) -->
      <div class="col-span-8">
        <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-neutral-100">Timeline</h2>
            <div class="flex items-center gap-4 text-sm text-neutral-400">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-success-500"></div>
                <span>Completed</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></div>
                <span>In Progress</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-neutral-400"></div>
                <span>Pending</span>
              </div>
            </div>
          </div>
          
          <!-- Timeline -->
          <div class="relative">
            <!-- Current Time Indicator (only for today) -->
            <div 
              v-if="isToday && currentTimePosition"
              class="absolute left-0 right-0 z-20 flex items-center"
              :style="{ top: currentTimePosition + 'px' }"
            >
              <div class="flex items-center w-full">
                <div class="w-16 text-xs text-accent-400 font-medium">
                  {{ currentTime }}
                </div>
                <div class="flex-1 h-0.5 bg-accent-400"></div>
                <div class="w-3 h-3 rounded-full bg-accent-400 border-2 border-primary-900"></div>
              </div>
            </div>
            
            <!-- Tasks Timeline -->
            <div class="space-y-2">
              <div 
                v-for="task in sortedTasks" 
                :key="task.id"
                class="relative pl-20"
              >
                <!-- Time Label -->
                <div class="absolute left-0 top-4 text-sm font-mono text-neutral-400">
                  {{ task.timeSlot || '--:--' }}
                </div>
                
                <!-- Timeline Line -->
                <div class="absolute left-16 top-0 bottom-0 w-px bg-primary-700"></div>
                
                <!-- Task Card -->
                <div class="relative">
                  <TaskCard 
                    :task="task"
                    :show-actions="true"
                    @start="startTask"
                    @pause="pauseTask"
                    @complete="completeTask"
                    @delete="deleteTask"
                    @edit="editTask"
                    @click="viewTaskDetails"
                  />
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-if="sortedTasks.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">📅</div>
                <h3 class="text-xl font-semibold text-neutral-300 mb-2">No tasks scheduled</h3>
                <p class="text-neutral-400 mb-6">Start by adding your first task for the day</p>
                <button 
                  class="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors"
                  @click="showTaskModal = true"
                >
                  Add Your First Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Summary Section (Right) -->
      <div class="col-span-4 space-y-6">
        <!-- Daily Summary -->
        <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
          <h3 class="text-lg font-semibold text-neutral-100 mb-4">Daily Summary</h3>
          
          <div class="space-y-4">
            <!-- Total Time -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-neutral-400">Total Planned</span>
                <span class="text-lg font-semibold text-accent-400">
                  {{ formatDuration(totalPlannedMinutes) }}
                </span>
              </div>
              <div class="w-full bg-primary-700 rounded-full h-2">
                <div 
                  class="bg-accent-500 h-2 rounded-full transition-all"
                  :style="{ width: '100%' }"
                ></div>
              </div>
            </div>
            
            <!-- Tasks Count -->
            <div class="grid grid-cols-3 gap-3 pt-4 border-t border-primary-700">
              <div class="text-center">
                <div class="text-2xl font-bold text-success-400">{{ completedCount }}</div>
                <div class="text-xs text-neutral-400 mt-1">Completed</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-accent-400">{{ inProgressCount }}</div>
                <div class="text-xs text-neutral-400 mt-1">In Progress</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-neutral-400">{{ pendingCount }}</div>
                <div class="text-xs text-neutral-400 mt-1">Pending</div>
              </div>
            </div>
            
            <!-- Completion Rate -->
            <div class="pt-4 border-t border-primary-700">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-neutral-400">Completion Rate</span>
                <span class="text-lg font-semibold" :class="completionRateColor">
                  {{ completionRate }}%
                </span>
              </div>
              <div class="w-full bg-primary-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all"
                  :class="completionRateBarColor"
                  :style="{ width: completionRate + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Category Breakdown -->
        <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
          <h3 class="text-lg font-semibold text-neutral-100 mb-4">Categories</h3>
          
          <div class="space-y-3">
            <div 
              v-for="category in categoryBreakdown" 
              :key="category.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span>{{ category.icon }}</span>
                <span class="text-sm text-neutral-300 capitalize">{{ category.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-24 bg-primary-700 rounded-full h-1.5">
                  <div 
                    class="h-1.5 rounded-full transition-all"
                    :class="category.color"
                    :style="{ width: category.percentage + '%' }"
                  ></div>
                </div>
                <span class="text-sm text-neutral-400 w-12 text-right">
                  {{ category.count }}
                </span>
              </div>
            </div>
            
            <div v-if="categoryBreakdown.length === 0" class="text-center py-4 text-neutral-500 text-sm">
              No categories yet
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
          <h3 class="text-lg font-semibold text-neutral-100 mb-4">Quick Actions</h3>
          
          <div class="space-y-2">
            <button 
              class="w-full px-4 py-3 bg-primary-700 hover:bg-primary-600 text-neutral-300 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-3"
              @click="copyFromPreviousDay"
            >
              <span class="text-lg">📋</span>
              <span>Copy Previous Day</span>
            </button>
            
            <button 
              class="w-full px-4 py-3 bg-primary-700 hover:bg-primary-600 text-neutral-300 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-3"
              @click="clearAllTasks"
              :disabled="sortedTasks.length === 0"
              :class="{ 'opacity-50 cursor-not-allowed': sortedTasks.length === 0 }"
            >
              <span class="text-lg">🗑️</span>
              <span>Clear All Tasks</span>
            </button>
            
            <button 
              class="w-full px-4 py-3 bg-primary-700 hover:bg-primary-600 text-neutral-300 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-3"
              @click="exportSchedule"
              :disabled="sortedTasks.length === 0"
              :class="{ 'opacity-50 cursor-not-allowed': sortedTasks.length === 0 }"
            >
              <span class="text-lg">📤</span>
              <span>Export Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Task Modal -->
    <TaskModal 
      v-if="showTaskModal"
      :task="selectedTask"
      :date="currentDate"
      @close="closeTaskModal"
      @save="saveTask"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import { useTimeTrackingStore } from '@/stores/timeTracking';
import TaskCard from '@/components/tasks/TaskCard.vue';
import TaskModal from '@/components/tasks/TaskModal.vue';

const tasksStore = useTasksStore();
const timeStore = useTimeTrackingStore();

// State
const currentDate = ref(new Date().toISOString().slice(0, 10));
const showTaskModal = ref(false);
const selectedTask = ref(null);
const currentTime = ref(new Date().toTimeString().slice(0, 5));
let timeInterval = null;

// Computed
const formattedDate = computed(() => {
  const date = new Date(currentDate.value);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

const shortDate = computed(() => {
  const date = new Date(currentDate.value);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
});

const isToday = computed(() => {
  return currentDate.value === new Date().toISOString().slice(0, 10);
});

const sortedTasks = computed(() => {
  return tasksStore.tasks
    .filter(task => task.date === currentDate.value)
    .sort((a, b) => {
      // Sort by timeSlot, put tasks without time at the end
      if (!a.timeSlot) return 1;
      if (!b.timeSlot) return -1;
      return a.timeSlot.localeCompare(b.timeSlot);
    });
});

const totalPlannedMinutes = computed(() => {
  return sortedTasks.value.reduce((sum, task) => sum + (task.duration || 0), 0);
});

const completedCount = computed(() => {
  return sortedTasks.value.filter(task => task.status === 'completed').length;
});

const inProgressCount = computed(() => {
  return sortedTasks.value.filter(task => task.status === 'in-progress').length;
});

const pendingCount = computed(() => {
  return sortedTasks.value.filter(task => task.status === 'pending').length;
});

const completionRate = computed(() => {
  if (sortedTasks.value.length === 0) return 0;
  return Math.round((completedCount.value / sortedTasks.value.length) * 100);
});

const completionRateColor = computed(() => {
  const rate = completionRate.value;
  if (rate >= 80) return 'text-success-400';
  if (rate >= 50) return 'text-accent-400';
  return 'text-warning-500';
});

const completionRateBarColor = computed(() => {
  const rate = completionRate.value;
  if (rate >= 80) return 'bg-success-500';
  if (rate >= 50) return 'bg-accent-500';
  return 'bg-warning-500';
});

const categoryBreakdown = computed(() => {
  const categories = {
    work: { name: 'work', icon: '💼', color: 'bg-accent-500', count: 0 },
    personal: { name: 'personal', icon: '👤', color: 'bg-success-500', count: 0 },
    learning: { name: 'learning', icon: '📚', color: 'bg-purple-500', count: 0 },
    health: { name: 'health', icon: '💪', color: 'bg-pink-500', count: 0 },
    other: { name: 'other', icon: '📌', color: 'bg-neutral-500', count: 0 }
  };
  
  sortedTasks.value.forEach(task => {
    if (categories[task.category]) {
      categories[task.category].count++;
    }
  });
  
  const total = sortedTasks.value.length;
  
  return Object.values(categories)
    .map(cat => ({
      ...cat,
      percentage: total > 0 ? Math.round((cat.count / total) * 100) : 0
    }))
    .filter(cat => cat.count > 0);
});

const currentTimePosition = computed(() => {
  if (!isToday.value) return null;
  
  // Calculate position based on current time
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  // Assuming timeline starts at 6 AM and each hour is ~50px
  const startHour = 6;
  const pixelsPerHour = 50;
  
  const position = ((totalMinutes - startHour * 60) / 60) * pixelsPerHour;
  
  return position > 0 ? position : null;
});

// Methods
const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
};

const previousDay = () => {
  const date = new Date(currentDate.value);
  date.setDate(date.getDate() - 1);
  currentDate.value = date.toISOString().slice(0, 10);
};

const nextDay = () => {
  if (!isToday.value) {
    const date = new Date(currentDate.value);
    date.setDate(date.getDate() + 1);
    currentDate.value = date.toISOString().slice(0, 10);
  }
};

const goToToday = () => {
  currentDate.value = new Date().toISOString().slice(0, 10);
};

const startTask = (task) => {
  tasksStore.startTask(task.id);
  
  // Only start new tracking if not already tracking this task
  if (!timeStore.currentEntry || timeStore.currentEntry.taskId !== task.id) {
    timeStore.startTracking(task.id);
  } else {
    // Resume from pause
    timeStore.resumeTracking();
  }
};

const pauseTask = (task) => {
  timeStore.pauseTracking();
  tasksStore.pauseTask(task.id);
};

const completeTask = (task) => {
  timeStore.stopTracking();
  tasksStore.completeTask(task.id);
};

const deleteTask = (task) => {
  if (confirm(`Delete task: "${task.title}"?\n\nThis cannot be undone.`)) {
    tasksStore.deleteTask(task.id);
    if (timeStore.currentEntry?.taskId === task.id) {
      timeStore.stopTracking();
    }
  }
};

const editTask = (task) => {
  selectedTask.value = task;
  showTaskModal.value = true;
};

const viewTaskDetails = (task) => {
  selectedTask.value = task;
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
  selectedTask.value = null;
};

const saveTask = (taskData) => {
  if (selectedTask.value) {
    // Update existing task
    tasksStore.updateTask(selectedTask.value.id, taskData);
  } else {
    // Create new task
    tasksStore.addTask({
      ...taskData,
      date: currentDate.value
    });
  }
  closeTaskModal();
};

const copyFromPreviousDay = () => {
  const previousDate = new Date(currentDate.value);
  previousDate.setDate(previousDate.getDate() - 1);
  const previousDateStr = previousDate.toISOString().slice(0, 10);
  
  const previousTasks = tasksStore.tasks.filter(task => task.date === previousDateStr);
  
  if (previousTasks.length === 0) {
    alert('No tasks found for the previous day');
    return;
  }
  
  if (confirm(`Copy ${previousTasks.length} task(s) from ${previousDateStr}?`)) {
    previousTasks.forEach(task => {
      tasksStore.addTask({
        title: task.title,
        description: task.description,
        duration: task.duration,
        category: task.category,
        priority: task.priority,
        timeSlot: task.timeSlot,
        date: currentDate.value,
        recurring: task.recurring,
        tags: task.tags || []
      });
    });
  }
};

const clearAllTasks = () => {
  if (confirm(`Delete all ${sortedTasks.value.length} task(s) for this day?`)) {
    sortedTasks.value.forEach(task => {
      tasksStore.deleteTask(task.id);
    });
  }
};

const exportSchedule = () => {
  const scheduleText = sortedTasks.value
    .map(task => {
      return `${task.timeSlot || '--:--'} | ${task.title} (${task.duration}m) | ${task.category} | ${task.status}`;
    })
    .join('\n');
  
  const blob = new Blob([`Schedule for ${formattedDate.value}\n\n${scheduleText}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schedule-${currentDate.value}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const updateCurrentTime = () => {
  currentTime.value = new Date().toTimeString().slice(0, 5);
};

// Lifecycle
onMounted(() => {
  // Update current time every minute
  timeInterval = setInterval(updateCurrentTime, 60000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

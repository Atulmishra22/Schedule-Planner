// stores/tasks.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getTodayLocal, getYesterdayLocal } from '../utils/dateHelpers';

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref([]);
  const activeTaskId = ref(null);
  
  // Getters
  const todayTasks = computed(() => {
    const today = getTodayLocal();
    return tasks.value
      .filter(task => task.date === today)
      .sort((a, b) => (a.timeSlot || '').localeCompare(b.timeSlot || ''));
  });
  
  const activeTask = computed(() => {
    return tasks.value.find(task => task.id === activeTaskId.value);
  });
  
  const completedTasksToday = computed(() => {
    return todayTasks.value.filter(task => task.status === 'completed');
  });
  
  const pendingTasksToday = computed(() => {
    return todayTasks.value.filter(task => task.status === 'pending');
  });
  
  const inProgressTasks = computed(() => {
    return todayTasks.value.filter(task => task.status === 'in-progress');
  });
  
  // Actions
  const addTask = (taskData) => {
    const task = {
      id: generateId(),
      ...taskData,
      date: taskData.date || getTodayLocal(), // Default to today (local timezone)
      timeSlot: taskData.timeSlot || '', // Default to empty string
      status: 'pending',
      timeSegments: [], // Track actual work sessions
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.value.push(task);
    saveTasks();
    return task;
  };
  
  const updateTask = (taskId, updates) => {
    const index = tasks.value.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveTasks();
    }
  };
  
  const deleteTask = (taskId) => {
    const index = tasks.value.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks.value.splice(index, 1);
      saveTasks();
    }
  };
  
  const startTask = (taskId) => {
    // Stop any active tasks
    if (activeTaskId.value) {
      stopTask(activeTaskId.value);
    }
    
    const task = tasks.value.find(t => t.id === taskId);
    if (!task) return;
    
    const timeSegments = task.timeSegments || [];
    const now = new Date().toISOString();
    
    // Add new active segment
    timeSegments.push({
      startTime: now,
      endTime: null // null means still running
    });
    
    updateTask(taskId, { 
      status: 'in-progress',
      startedAt: now,
      timeSegments
    });
    activeTaskId.value = taskId;
  };
  
  const stopTask = (taskId) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (!task) return;
    
    const timeSegments = task.timeSegments || [];
    const now = new Date().toISOString();
    
    // Close the last active segment
    const lastSegment = timeSegments[timeSegments.length - 1];
    if (lastSegment && lastSegment.endTime === null) {
      lastSegment.endTime = now;
    }
    
    // Calculate total actual duration
    const actualDuration = calculateActualDuration(timeSegments);
    
    updateTask(taskId, { 
      status: 'pending',
      startedAt: null,
      timeSegments,
      actualDuration
    });
    
    if (activeTaskId.value === taskId) {
      activeTaskId.value = null;
    }
  };
  
  const completeTask = (taskId) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (!task) return;
    
    const timeSegments = task.timeSegments || [];
    const now = new Date().toISOString();
    
    // Close any active segment
    const lastSegment = timeSegments[timeSegments.length - 1];
    if (lastSegment && lastSegment.endTime === null) {
      lastSegment.endTime = now;
    }
    
    // Calculate total actual duration
    const actualDuration = calculateActualDuration(timeSegments);
    
    updateTask(taskId, { 
      status: 'completed',
      completedAt: now,
      timeSegments,
      actualDuration
    });
    
    if (activeTaskId.value === taskId) {
      activeTaskId.value = null;
    }
  };
  
  const pauseTask = (taskId) => {
    stopTask(taskId);
  };
  
  const rolloverTasks = () => {
    const today = getTodayLocal();
    const yesterday = getYesterdayLocal();
    
    console.log(`Rollover: Creating recurring tasks from ${yesterday} to ${today}`);
    
    // Find all recurring tasks from yesterday (both completed and incomplete)
    const recurringTasks = tasks.value.filter(task => 
      task.date === yesterday && 
      task.recurring
    );
    
    // Check if task already exists for today (to avoid duplicates)
    const existingTodayTasks = tasks.value.filter(task => task.date === today);
    
    // Create new tasks for today
    recurringTasks.forEach(task => {
      // Check if this recurring task already exists for today
      const alreadyExists = existingTodayTasks.some(t => 
        t.title === task.title && 
        t.timeSlot === task.timeSlot &&
        t.category === task.category
      );
      
      if (!alreadyExists) {
        addTask({
          title: task.title,
          description: task.description,
          duration: task.duration,
          category: task.category,
          priority: task.priority,
          timeSlot: task.timeSlot,
          recurring: task.recurring,
          tags: task.tags || [],
          date: today,
          status: 'pending',
          actualDuration: 0,
          startedAt: null,
          completedAt: null,
          carryOver: true
        });
      }
    });
  };
  
  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
    localStorage.setItem('activeTaskId', activeTaskId.value || '');
  };
  
  const loadTasks = () => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      tasks.value = JSON.parse(stored);
    }
    
    // Load active task ID
    const storedActiveId = localStorage.getItem('activeTaskId');
    if (storedActiveId) {
      activeTaskId.value = storedActiveId;
    }
  };
  
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  const calculateActualDuration = (timeSegments) => {
    if (!timeSegments || timeSegments.length === 0) return 0;
    
    let totalMs = 0;
    timeSegments.forEach(segment => {
      const start = new Date(segment.startTime).getTime();
      const end = segment.endTime ? new Date(segment.endTime).getTime() : Date.now();
      totalMs += (end - start);
    });
    
    return Math.floor(totalMs / 60000); // Convert to minutes
  };
  
  return {
    tasks,
    activeTaskId,
    todayTasks,
    activeTask,
    completedTasksToday,
    pendingTasksToday,
    inProgressTasks,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    stopTask,
    completeTask,
    pauseTask,
    rolloverTasks,
    loadTasks,
    calculateActualDuration
  };
});

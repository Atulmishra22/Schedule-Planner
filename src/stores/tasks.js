// stores/tasks.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref([]);
  const activeTaskId = ref(null);
  
  // Getters
  const todayTasks = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
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
      date: taskData.date || new Date().toISOString().slice(0, 10), // Default to today
      timeSlot: taskData.timeSlot || '', // Default to empty string
      status: 'pending',
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
      updateTask(activeTaskId.value, { 
        status: 'pending',
        startedAt: null 
      });
    }
    
    updateTask(taskId, { 
      status: 'in-progress',
      startedAt: new Date().toISOString()
    });
    activeTaskId.value = taskId;
  };
  
  const completeTask = (taskId) => {
    updateTask(taskId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
    
    if (activeTaskId.value === taskId) {
      activeTaskId.value = null;
    }
  };
  
  const pauseTask = (taskId) => {
    updateTask(taskId, { status: 'pending' });
    if (activeTaskId.value === taskId) {
      activeTaskId.value = null;
    }
  };
  
  const rolloverTasks = () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    
    // Find incomplete recurring tasks from yesterday
    const incompleteTasks = tasks.value.filter(task => 
      task.date === yesterday && 
      task.recurring && 
      task.status !== 'completed'
    );
    
    // Create new tasks for today
    incompleteTasks.forEach(task => {
      addTask({
        ...task,
        id: undefined,
        date: today,
        status: 'pending',
        actualDuration: 0,
        startedAt: null,
        completedAt: null,
        carryOver: true
      });
    });
  };
  
  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  };
  
  const loadTasks = () => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      tasks.value = JSON.parse(stored);
    }
  };
  
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
    completeTask,
    pauseTask,
    rolloverTasks,
    loadTasks
  };
});

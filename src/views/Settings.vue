<template>
  <div class="min-h-screen bg-primary-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-neutral-100 mb-2">Settings</h1>
      <p class="text-neutral-400">Customize your productivity experience</p>
    </div>
    
    <!-- Settings Grid -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Pomodoro Settings -->
      <div class="lg:col-span-2 bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
            <span class="text-2xl">🍅</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-neutral-100">Pomodoro Technique</h2>
            <p class="text-sm text-neutral-400">Configure focus and break intervals</p>
          </div>
        </div>
        
        <!-- Pomodoro Toggle -->
        <div class="flex items-center justify-between mb-6 pb-6 border-b border-primary-700">
          <div>
            <h3 class="text-neutral-100 font-medium mb-1">Enable Pomodoro Timer</h3>
            <p class="text-sm text-neutral-400">Use Pomodoro technique for time tracking</p>
          </div>
          <button 
            class="relative w-14 h-7 rounded-full transition-colors"
            :class="settings.pomodoro.enabled ? 'bg-accent-500' : 'bg-primary-700'"
            @click="settings.pomodoro.enabled = !settings.pomodoro.enabled"
          >
            <div 
              class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
              :class="{ 'translate-x-7': settings.pomodoro.enabled }"
            ></div>
          </button>
        </div>
        
        <!-- Pomodoro Durations -->
        <div class="space-y-6">
          <!-- Work Duration -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="text-neutral-100 font-medium">Focus Duration</label>
              <span class="text-accent-400 font-semibold">{{ settings.pomodoro.workDuration }} min</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="60" 
              step="5"
              v-model.number="settings.pomodoro.workDuration"
              class="w-full h-2 bg-primary-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div class="flex justify-between text-xs text-neutral-500 mt-1">
              <span>15 min</span>
              <span>60 min</span>
            </div>
          </div>
          
          <!-- Short Break -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="text-neutral-100 font-medium">Short Break</label>
              <span class="text-success-400 font-semibold">{{ settings.pomodoro.shortBreak }} min</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="15" 
              step="1"
              v-model.number="settings.pomodoro.shortBreak"
              class="w-full h-2 bg-primary-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div class="flex justify-between text-xs text-neutral-500 mt-1">
              <span>3 min</span>
              <span>15 min</span>
            </div>
          </div>
          
          <!-- Long Break -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="text-neutral-100 font-medium">Long Break</label>
              <span class="text-success-400 font-semibold">{{ settings.pomodoro.longBreak }} min</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="30" 
              step="5"
              v-model.number="settings.pomodoro.longBreak"
              class="w-full h-2 bg-primary-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div class="flex justify-between text-xs text-neutral-500 mt-1">
              <span>10 min</span>
              <span>30 min</span>
            </div>
          </div>
          
          <!-- Intervals Before Long Break -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="text-neutral-100 font-medium">Pomodoros Before Long Break</label>
              <span class="text-neutral-300 font-semibold">{{ settings.pomodoro.intervalsBeforeLongBreak }}</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="6" 
              step="1"
              v-model.number="settings.pomodoro.intervalsBeforeLongBreak"
              class="w-full h-2 bg-primary-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div class="flex justify-between text-xs text-neutral-500 mt-1">
              <span>2</span>
              <span>6</span>
            </div>
          </div>
          
          <!-- Auto Start -->
          <div class="flex items-center justify-between pt-4 border-t border-primary-700">
            <div>
              <h3 class="text-neutral-100 font-medium mb-1">Auto-start Breaks</h3>
              <p class="text-sm text-neutral-400">Automatically start break timers</p>
            </div>
            <button 
              class="relative w-14 h-7 rounded-full transition-colors"
              :class="settings.pomodoro.autoStartBreaks ? 'bg-accent-500' : 'bg-primary-700'"
              @click="settings.pomodoro.autoStartBreaks = !settings.pomodoro.autoStartBreaks"
            >
              <div 
                class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                :class="{ 'translate-x-7': settings.pomodoro.autoStartBreaks }"
              ></div>
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-neutral-100 font-medium mb-1">Auto-start Focus Sessions</h3>
              <p class="text-sm text-neutral-400">Automatically start next pomodoro</p>
            </div>
            <button 
              class="relative w-14 h-7 rounded-full transition-colors"
              :class="settings.pomodoro.autoStartPomodoros ? 'bg-accent-500' : 'bg-primary-700'"
              @click="settings.pomodoro.autoStartPomodoros = !settings.pomodoro.autoStartPomodoros"
            >
              <div 
                class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                :class="{ 'translate-x-7': settings.pomodoro.autoStartPomodoros }"
              ></div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Quick Preview -->
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <h3 class="text-lg font-semibold text-neutral-100 mb-4">Session Preview</h3>
        
        <div class="space-y-4">
          <!-- Work Session -->
          <div class="bg-primary-900 rounded-lg p-4 border border-accent-500/30">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2 h-2 rounded-full bg-accent-500"></div>
              <span class="text-sm font-medium text-neutral-300">Focus Session</span>
            </div>
            <div class="text-3xl font-bold text-accent-400 mb-1">
              {{ formatTime(settings.pomodoro.workDuration) }}
            </div>
            <p class="text-xs text-neutral-500">Deep work time</p>
          </div>
          
          <!-- Short Break -->
          <div class="bg-primary-900 rounded-lg p-4 border border-success-500/30">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2 h-2 rounded-full bg-success-500"></div>
              <span class="text-sm font-medium text-neutral-300">Short Break</span>
            </div>
            <div class="text-3xl font-bold text-success-400 mb-1">
              {{ formatTime(settings.pomodoro.shortBreak) }}
            </div>
            <p class="text-xs text-neutral-500">Quick rest</p>
          </div>
          
          <!-- Long Break -->
          <div class="bg-primary-900 rounded-lg p-4 border border-success-500/50">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2 h-2 rounded-full bg-success-400"></div>
              <span class="text-sm font-medium text-neutral-300">Long Break</span>
            </div>
            <div class="text-3xl font-bold text-success-300 mb-1">
              {{ formatTime(settings.pomodoro.longBreak) }}
            </div>
            <p class="text-xs text-neutral-500">After {{ settings.pomodoro.intervalsBeforeLongBreak }} sessions</p>
          </div>
          
          <!-- Total Cycle -->
          <div class="pt-4 border-t border-primary-700">
            <div class="text-sm text-neutral-400 mb-1">Complete Cycle</div>
            <div class="text-2xl font-bold text-neutral-200">
              {{ calculateCycleDuration() }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Notifications Settings -->
    <div class="max-w-6xl mx-auto mt-6">
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
            <span class="text-2xl">🔔</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-neutral-100">Notifications</h2>
            <p class="text-sm text-neutral-400">Manage alerts and reminders</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-neutral-100 font-medium mb-1">Desktop Notifications</h3>
              <p class="text-sm text-neutral-400">Browser notifications for breaks</p>
            </div>
            <button 
              class="relative w-14 h-7 rounded-full transition-colors"
              :class="settings.notifications.desktop ? 'bg-accent-500' : 'bg-primary-700'"
              @click="toggleDesktopNotifications"
            >
              <div 
                class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                :class="{ 'translate-x-7': settings.notifications.desktop }"
              ></div>
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-neutral-100 font-medium mb-1">Sound Alerts</h3>
              <p class="text-sm text-neutral-400">Play sound when timer ends</p>
            </div>
            <button 
              class="relative w-14 h-7 rounded-full transition-colors"
              :class="settings.notifications.sound ? 'bg-accent-500' : 'bg-primary-700'"
              @click="settings.notifications.sound = !settings.notifications.sound"
            >
              <div 
                class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                :class="{ 'translate-x-7': settings.notifications.sound }"
              ></div>
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-neutral-100 font-medium mb-1">Task Reminders</h3>
              <p class="text-sm text-neutral-400">Remind before scheduled tasks</p>
            </div>
            <button 
              class="relative w-14 h-7 rounded-full transition-colors"
              :class="settings.notifications.taskReminders ? 'bg-accent-500' : 'bg-primary-700'"
              @click="settings.notifications.taskReminders = !settings.notifications.taskReminders"
            >
              <div 
                class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                :class="{ 'translate-x-7': settings.notifications.taskReminders }"
              ></div>
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-neutral-100 font-medium mb-1">Daily Summary</h3>
              <p class="text-sm text-neutral-400">End of day productivity summary</p>
            </div>
            <button 
              class="relative w-14 h-7 rounded-full transition-colors"
              :class="settings.notifications.dailySummary ? 'bg-accent-500' : 'bg-primary-700'"
              @click="settings.notifications.dailySummary = !settings.notifications.dailySummary"
            >
              <div 
                class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                :class="{ 'translate-x-7': settings.notifications.dailySummary }"
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- General Settings -->
    <div class="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Appearance -->
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <span class="text-2xl">🎨</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-neutral-100">Appearance</h2>
            <p class="text-sm text-neutral-400">Customize the look</p>
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="text-neutral-100 font-medium mb-3 block">Theme</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                class="px-4 py-3 rounded-lg border transition-all"
                :class="settings.theme === 'dark' 
                  ? 'bg-accent-500 border-accent-500 text-white' 
                  : 'bg-primary-700 border-primary-600 text-neutral-300 hover:border-primary-500'"
                @click="settings.theme = 'dark'"
              >
                🌙 Dark
              </button>
              <button 
                class="px-4 py-3 rounded-lg border transition-all opacity-50 cursor-not-allowed"
                disabled
              >
                ☀️ Light (Soon)
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-4 border-t border-primary-700">
            <div>
              <h3 class="text-neutral-100 font-medium mb-1">Compact Mode</h3>
              <p class="text-sm text-neutral-400">Reduce spacing and padding</p>
            </div>
            <button 
              class="relative w-14 h-7 rounded-full transition-colors"
              :class="settings.compactMode ? 'bg-accent-500' : 'bg-primary-700'"
              @click="settings.compactMode = !settings.compactMode"
            >
              <div 
                class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                :class="{ 'translate-x-7': settings.compactMode }"
              ></div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Data Management -->
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
            <span class="text-2xl">💾</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-neutral-100">Data Management</h2>
            <p class="text-sm text-neutral-400">Manage your data</p>
          </div>
        </div>
        
        <div class="space-y-3">
          <button 
            class="w-full px-4 py-3 bg-primary-700 hover:bg-primary-600 text-neutral-300 rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between"
            @click="exportData"
          >
            <span>📤 Export Data</span>
            <span class="text-xs text-neutral-500">JSON</span>
          </button>
          
          <button 
            class="w-full px-4 py-3 bg-primary-700 hover:bg-primary-600 text-neutral-300 rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between"
            @click="importData"
          >
            <span>📥 Import Data</span>
            <span class="text-xs text-neutral-500">JSON</span>
          </button>
          
          <button 
            class="w-full px-4 py-3 bg-warning-500/10 hover:bg-warning-500/20 text-warning-500 rounded-lg text-sm font-medium transition-colors text-left border border-warning-500/30"
            @click="clearAllData"
          >
            🗑️ Clear All Data
          </button>
          
          <div class="pt-3 border-t border-primary-700">
            <div class="text-xs text-neutral-500">
              <p class="mb-1">Storage: {{ storageInfo.used }} / {{ storageInfo.total }}</p>
              <p>Last backup: Never</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Save Button -->
    <div class="max-w-6xl mx-auto mt-6 flex items-center justify-between bg-primary-800 rounded-xl border border-primary-700 p-6">
      <div>
        <p class="text-neutral-300 font-medium">Settings are saved automatically</p>
        <p class="text-sm text-neutral-500">Changes take effect immediately</p>
      </div>
      <button 
        class="px-6 py-3 bg-success-500 hover:bg-success-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        @click="saveSettings"
      >
        <span>✓</span>
        Saved
      </button>
    </div>
    
    <!-- Hidden file input for import -->
    <input 
      ref="fileInput" 
      type="file" 
      accept=".json" 
      class="hidden" 
      @change="handleFileImport"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

// Settings State
const settings = reactive({
  pomodoro: {
    enabled: true,
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    intervalsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false
  },
  notifications: {
    desktop: false,
    sound: true,
    taskReminders: true,
    dailySummary: true
  },
  theme: 'dark',
  compactMode: false
});

const fileInput = ref(null);
const storageInfo = reactive({
  used: '0 KB',
  total: '5 MB'
});

// Methods
const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const calculateCycleDuration = () => {
  const work = settings.pomodoro.workDuration * settings.pomodoro.intervalsBeforeLongBreak;
  const shortBreaks = settings.pomodoro.shortBreak * (settings.pomodoro.intervalsBeforeLongBreak - 1);
  const longBreak = settings.pomodoro.longBreak;
  const total = work + shortBreaks + longBreak;
  
  return formatTime(total);
};

const toggleDesktopNotifications = async () => {
  if (!settings.notifications.desktop) {
    // Request permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        settings.notifications.desktop = true;
        new Notification('Notifications Enabled', {
          body: 'You will receive desktop notifications',
          icon: '/favicon.ico'
        });
      }
    }
  } else {
    settings.notifications.desktop = false;
  }
};

const saveSettings = () => {
  localStorage.setItem('app-settings', JSON.stringify(settings));
  // Show success message
  console.log('Settings saved');
};

const loadSettings = () => {
  const saved = localStorage.getItem('app-settings');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(settings, parsed);
  }
  calculateStorageInfo();
};

const exportData = () => {
  const data = {
    settings: settings,
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
    timeEntries: JSON.parse(localStorage.getItem('timeEntries') || '[]'),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schedule-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importData = () => {
  fileInput.value.click();
};

const handleFileImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      if (confirm('This will overwrite all existing data. Continue?')) {
        if (data.settings) {
          Object.assign(settings, data.settings);
          saveSettings();
        }
        if (data.tasks) {
          localStorage.setItem('tasks', JSON.stringify(data.tasks));
        }
        if (data.timeEntries) {
          localStorage.setItem('timeEntries', JSON.stringify(data.timeEntries));
        }
        
        alert('Data imported successfully! Refresh the page to see changes.');
      }
    } catch (error) {
      alert('Error importing data. Please check the file format.');
      console.error('Import error:', error);
    }
  };
  reader.readAsText(file);
  
  // Reset input
  event.target.value = '';
};

const clearAllData = () => {
  if (confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
    if (confirm('Really delete everything? Last chance!')) {
      localStorage.clear();
      alert('All data cleared. Refreshing page...');
      window.location.reload();
    }
  }
};

const calculateStorageInfo = () => {
  let totalSize = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }
  
  const sizeInKB = (totalSize / 1024).toFixed(2);
  storageInfo.used = `${sizeInKB} KB`;
  storageInfo.total = '5 MB'; // LocalStorage limit
};

// Watch for changes and auto-save
watch(settings, () => {
  saveSettings();
}, { deep: true });

// Load settings on mount
onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
/* Custom range slider styling */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  background: #2563EB;
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.slider::-moz-range-thumb:hover {
  background: #2563EB;
  transform: scale(1.1);
}

.slider::-webkit-slider-runnable-track {
  background: linear-gradient(to right, #3B82F6 0%, #3B82F6 var(--value), #334155 var(--value), #334155 100%);
}
</style>

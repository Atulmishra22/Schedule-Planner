<template>
  <div class="bg-primary-900 p-8 min-h-screen">
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-100">Analytics</h1>
        <p class="text-neutral-400 mt-1">Track your productivity insights</p>
      </div>
      
      <!-- Month Navigation -->
      <div class="flex items-center gap-2">
        <button 
          @click="navigateMonth(-1)"
          class="p-2 hover:bg-primary-800 rounded-md transition-colors"
        >
          <span class="text-neutral-300">←</span>
        </button>
        <span class="text-neutral-300 font-medium min-w-[120px] text-center">
          {{ currentMonthLabel }}
        </span>
        <button 
          @click="navigateMonth(1)"
          class="p-2 hover:bg-primary-800 rounded-md transition-colors"
          :disabled="isCurrentMonth"
        >
          <span class="text-neutral-300">→</span>
        </button>
      </div>
    </div>
    
    <!-- Tab Navigation -->
    <div class="mb-6 border-b border-primary-700">
      <nav class="flex gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 text-sm font-medium transition-colors relative"
          :class="activeTab === tab.id 
            ? 'text-accent-400' 
            : 'text-neutral-400 hover:text-neutral-300'"
        >
          {{ tab.name }}
          <div 
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500"
          ></div>
        </button>
      </nav>
    </div>
    
    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="text-neutral-400 text-sm mb-2">Total Tracked</div>
        <div class="text-3xl font-bold text-accent-400">{{ totalTracked }}</div>
      </div>
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="text-neutral-400 text-sm mb-2">Focus Score</div>
        <div class="text-3xl font-bold text-success-400">{{ avgFocusScore }}%</div>
      </div>
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="text-neutral-400 text-sm mb-2">Tasks Completed</div>
        <div class="text-3xl font-bold text-neutral-100">{{ tasksCompleted }}</div>
      </div>
      <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
        <div class="text-neutral-400 text-sm mb-2">Completion Rate</div>
        <div class="text-3xl font-bold text-warning-500">{{ completionRate }}%</div>
      </div>
    </div>
    
    <!-- Daily Tab -->
    <div v-if="activeTab === 'day'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Progress Chart -->
        <ProgressChart
          title="Today's Progress"
          :data="dailyChartData"
          type="bar"
        />
        
        <!-- Category Breakdown -->
        <CategoryChart :category-data="dailyAnalytics.categoryBreakdown" />
      </div>
      
      <!-- Insights -->
      <div class="mt-6 bg-primary-800 rounded-xl border border-primary-700 p-6">
        <h3 class="text-neutral-100 text-lg font-semibold mb-4">Today's Insights</h3>
        <div class="space-y-3">
          <div class="flex items-start gap-3 text-neutral-300">
            <span class="text-xl">✓</span>
            <p>Completed {{ dailyAnalytics.tasksCompleted }} out of {{ dailyAnalytics.tasksPlanned }} tasks</p>
          </div>
          <div class="flex items-start gap-3 text-neutral-300">
            <span class="text-xl">⏱</span>
            <p>Total productive time: {{ formatMinutes(dailyAnalytics.totalActual) }}</p>
          </div>
          <div v-if="dailyAnalytics.peakProductivityHour >= 0" class="flex items-start gap-3 text-neutral-300">
            <span class="text-xl">🎯</span>
            <p>Peak productivity hour: {{ dailyAnalytics.peakProductivityHour }}:00</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Weekly Tab -->
    <div v-if="activeTab === 'week'">
      <div class="grid grid-cols-1 gap-6 mb-6">
        <!-- Weekly Progress -->
        <ProgressChart
          title="Weekly Progress"
          :data="weeklyChartData"
          type="bar"
        />
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Category Breakdown -->
        <CategoryChart :category-data="weeklyAnalytics.categoryBreakdown" />
        
        <!-- Weekly Stats -->
        <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
          <h3 class="text-neutral-100 text-lg font-semibold mb-4">Weekly Summary</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-neutral-400">Total Time</span>
              <span class="text-neutral-100 font-semibold">{{ formatMinutes(weeklyAnalytics.totalActual) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-neutral-400">Best Day</span>
              <span class="text-success-400 font-semibold">{{ weeklyAnalytics.bestDay }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-neutral-400">Streak</span>
              <span class="text-warning-500 font-semibold">{{ weeklyAnalytics.streakDays }} days</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-neutral-400">Goal Progress</span>
              <span class="text-accent-400 font-semibold">{{ weeklyAnalytics.weeklyGoalProgress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Monthly Tab -->
    <div v-if="activeTab === 'month'">
      <div class="grid grid-cols-1 gap-6 mb-6">
        <!-- Monthly Progress -->
        <ProgressChart
          title="Monthly Progress"
          :data="monthlyChartData"
          type="line"
        />
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Category Breakdown -->
        <CategoryChart :category-data="monthlyAnalytics.categoryBreakdown" />
        
        <!-- Monthly Stats -->
        <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
          <h3 class="text-neutral-100 text-lg font-semibold mb-4">Monthly Summary</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-neutral-400">Total Time</span>
              <span class="text-neutral-100 font-semibold">{{ formatMinutes(monthlyAnalytics.totalActual) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-neutral-400">Best Week</span>
              <span class="text-success-400 font-semibold">Week {{ monthlyAnalytics.bestWeek }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-neutral-400">Tasks Completed</span>
              <span class="text-neutral-100 font-semibold">{{ monthlyAnalytics.totalTasksCompleted }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-neutral-400">Trend</span>
              <span 
                class="font-semibold"
                :class="{
                  'text-success-400': monthlyAnalytics.monthlyTrend === 'improving',
                  'text-warning-500': monthlyAnalytics.monthlyTrend === 'declining',
                  'text-neutral-400': monthlyAnalytics.monthlyTrend === 'stable'
                }"
              >
                {{ monthlyAnalytics.monthlyTrend === 'improving' ? '↗' : monthlyAnalytics.monthlyTrend === 'declining' ? '↘' : '→' }}
                {{ monthlyAnalytics.monthlyTrend }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Insights -->
      <div class="mt-6 bg-primary-800 rounded-xl border border-primary-700 p-6">
        <h3 class="text-neutral-100 text-lg font-semibold mb-4">Monthly Insights</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3 text-neutral-300">
            <span class="text-xl">💡</span>
            <p>Average focus score: {{ monthlyAnalytics.averageFocusScore }}%</p>
          </div>
          <div class="flex items-start gap-3 text-neutral-300">
            <span class="text-xl">📊</span>
            <p>Productivity trend is {{ monthlyAnalytics.monthlyTrend }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAnalyticsStore } from '../stores/analytics';
import { formatMinutes } from '../utils/formatters';
import ProgressChart from '../components/analytics/ProgressChart.vue';
import CategoryChart from '../components/analytics/CategoryChart.vue';

const analyticsStore = useAnalyticsStore();

const activeTab = ref('day');
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

const tabs = [
  { id: 'day', name: 'Daily' },
  { id: 'week', name: 'Weekly' },
  { id: 'month', name: 'Monthly' }
];

const today = new Date().toISOString().slice(0, 10);
const weekStart = computed(() => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
});

const dailyAnalytics = computed(() => analyticsStore.getDailyAnalytics(today));
const weeklyAnalytics = computed(() => analyticsStore.getWeeklyAnalytics(weekStart.value));
const monthlyAnalytics = computed(() => analyticsStore.getMonthlyAnalytics(currentYear.value, currentMonth.value));

const hasData = computed(() => {
  return dailyAnalytics.value.totalActual > 0 || 
         dailyAnalytics.value.tasksPlanned > 0;
});

const currentMonthLabel = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const isCurrentMonth = computed(() => {
  const now = new Date();
  return currentYear.value === now.getFullYear() && currentMonth.value === now.getMonth() + 1;
});

const totalTracked = computed(() => {
  if (activeTab.value === 'day') return formatMinutes(dailyAnalytics.value.totalActual);
  if (activeTab.value === 'week') return formatMinutes(weeklyAnalytics.value.totalActual);
  return formatMinutes(monthlyAnalytics.value.totalActual);
});

const avgFocusScore = computed(() => {
  if (activeTab.value === 'day') return dailyAnalytics.value.focusScore;
  if (activeTab.value === 'week') return weeklyAnalytics.value.averageFocusScore;
  return monthlyAnalytics.value.averageFocusScore;
});

const tasksCompleted = computed(() => {
  if (activeTab.value === 'day') return dailyAnalytics.value.tasksCompleted;
  if (activeTab.value === 'week') {
    return weeklyAnalytics.value.dailyData.reduce((sum, day) => sum + day.tasksCompleted, 0);
  }
  return monthlyAnalytics.value.totalTasksCompleted;
});

const completionRate = computed(() => {
  if (activeTab.value === 'day') return dailyAnalytics.value.completionRate;
  if (activeTab.value === 'week') return weeklyAnalytics.value.weeklyGoalProgress;
  const total = monthlyAnalytics.value.totalPlanned;
  const actual = monthlyAnalytics.value.totalActual;
  return total > 0 ? Math.round((actual / total) * 100) : 0;
});

const dailyChartData = computed(() => ({
  labels: ['Planned', 'Actual'],
  datasets: [{
    label: 'Time (minutes)',
    data: [dailyAnalytics.value.totalPlanned, dailyAnalytics.value.totalActual],
    backgroundColor: ['#3B82F6', '#10B981'],
    borderWidth: 0
  }]
}));

const weeklyChartData = computed(() => ({
  labels: weeklyAnalytics.value.dailyData.map((_, i) => {
    const date = new Date(weekStart.value);
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }),
  datasets: [
    {
      label: 'Planned',
      data: weeklyAnalytics.value.dailyData.map(day => day.totalPlanned),
      backgroundColor: '#3B82F6',
      borderWidth: 0
    },
    {
      label: 'Actual',
      data: weeklyAnalytics.value.dailyData.map(day => day.totalActual),
      backgroundColor: '#10B981',
      borderWidth: 0
    }
  ]
}));

const monthlyChartData = computed(() => ({
  labels: monthlyAnalytics.value.weeklyData.map((_, i) => `Week ${i + 1}`),
  datasets: [
    {
      label: 'Planned',
      data: monthlyAnalytics.value.weeklyData.map(week => week.totalPlanned),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Actual',
      data: monthlyAnalytics.value.weeklyData.map(week => week.totalActual),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}));

const navigateMonth = (direction) => {
  let newMonth = currentMonth.value + direction;
  let newYear = currentYear.value;
  
  if (newMonth > 12) {
    newMonth = 1;
    newYear++;
  } else if (newMonth < 1) {
    newMonth = 12;
    newYear--;
  }
  
  currentMonth.value = newMonth;
  currentYear.value = newYear;
};
</script>

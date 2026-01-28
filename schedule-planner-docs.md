# Schedule Planner - Complete Documentation

## Project Overview

A professional productivity application for task-based scheduling with comprehensive analytics. Features include daily task planning with rollover capability, time tracking, and multi-level analytics (daily, weekly, monthly).

---

## Tech Stack

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **State Management**: Pinia
- **Charts**: Chart.js / ApexCharts
- **Build Tool**: Vite

### Storage
- **MVP**: localStorage
- **Production**: Firebase/Supabase (optional)

### Chrome Extension
- **Plugin**: CRXJS Vite Plugin
- **Manifest**: V3

---

## Design System

### Color Palette

```css
/* Primary Colors - Deep Focus Theme */
:root {
  /* Background */
  --primary-900: #0F172A;      /* Main background */
  --primary-800: #1E293B;      /* Card backgrounds */
  --primary-700: #334155;      /* Borders, dividers */
  --primary-600: #475569;      /* Hover states */
  
  /* Accent - Productivity Blue */
  --accent-500: #3B82F6;       /* Primary actions */
  --accent-600: #2563EB;       /* Hover states */
  --accent-400: #60A5FA;       /* Highlights */
  --accent-300: #93C5FD;       /* Light accents */
  
  /* Success - Completion */
  --success-500: #10B981;      /* Completed tasks */
  --success-600: #059669;      /* Success hover */
  --success-400: #34D399;      /* Light success */
  
  /* Neutral - Text & UI */
  --neutral-100: #F1F5F9;      /* Primary text */
  --neutral-200: #E2E8F0;      /* Secondary text */
  --neutral-400: #94A3B8;      /* Muted text */
  --neutral-600: #475569;      /* Disabled states */
  
  /* Warning - Time Alerts */
  --warning-500: #F59E0B;      /* Overdue warnings */
  --warning-600: #D97706;      /* Warning hover */
  
  /* Chart Colors */
  --chart-purple: #8B5CF6;
  --chart-cyan: #06B6D4;
  --chart-pink: #EC4899;
  --chart-indigo: #6366F1;
  --chart-emerald: #10B981;
}
```

### Typography

```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - Small labels */
--text-sm: 0.875rem;     /* 14px - Secondary text */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Subheadings */
--text-xl: 1.25rem;      /* 20px - Headings */
--text-2xl: 1.5rem;      /* 24px - Section titles */
--text-3xl: 1.875rem;    /* 30px - Page titles */
--text-4xl: 2.25rem;     /* 36px - Large numbers */
--text-6xl: 3.75rem;     /* 60px - Timer displays */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System (8px Grid)

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Cards, buttons */
--radius-lg: 0.75rem;   /* 12px - Large cards */
--radius-xl: 1rem;      /* 16px - Modals */
--radius-full: 9999px;  /* Circular elements */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## Data Models

### Task Model

```typescript
interface Task {
  id: string;                    // UUID
  title: string;                 // Task name
  description?: string;          // Optional details
  duration: number;              // Duration in minutes
  category: TaskCategory;        // work, personal, learning, health
  priority: Priority;            // low, medium, high, urgent
  timeSlot: string;             // "09:00" format
  date: string;                 // "2025-01-28" format
  recurring: boolean;           // Daily recurrence
  status: TaskStatus;           // pending, in-progress, completed, skipped
  actualDuration?: number;      // Actual time spent (minutes)
  startedAt?: string;           // ISO timestamp
  completedAt?: string;         // ISO timestamp
  tags: string[];               // Custom tags
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
}

type TaskCategory = 'work' | 'personal' | 'learning' | 'health' | 'other';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';
```

### Time Tracking Model

```typescript
interface TimeEntry {
  id: string;
  taskId: string;
  startTime: string;            // ISO timestamp
  endTime?: string;             // ISO timestamp
  duration: number;             // Calculated in minutes
  date: string;                 // "2025-01-28"
  pauses: Pause[];             // Track pause periods
  focusScore: number;          // 0-100 based on interruptions
}

interface Pause {
  startTime: string;
  endTime: string;
  duration: number;             // In minutes
  reason?: string;
}
```

### Analytics Model

```typescript
interface DailyAnalytics {
  date: string;                 // "2025-01-28"
  totalPlanned: number;         // Minutes
  totalActual: number;          // Minutes
  tasksPlanned: number;
  tasksCompleted: number;
  tasksSkipped: number;
  focusScore: number;           // Average focus score
  categoryBreakdown: CategoryTime[];
  peakProductivityHour: number; // 0-23
  completionRate: number;       // Percentage
}

interface WeeklyAnalytics {
  weekStart: string;            // "2025-01-27" (Monday)
  weekEnd: string;              // "2025-02-02" (Sunday)
  dailyData: DailyAnalytics[];
  totalPlanned: number;
  totalActual: number;
  averageFocusScore: number;
  bestDay: string;              // Day name
  worstDay: string;
  streakDays: number;           // Consecutive productive days
  categoryBreakdown: CategoryTime[];
  weeklyGoalProgress: number;   // Percentage
}

interface MonthlyAnalytics {
  month: string;                // "2025-01"
  year: number;
  weeklyData: WeeklyAnalytics[];
  totalPlanned: number;
  totalActual: number;
  averageFocusScore: number;
  bestWeek: number;             // Week number
  totalTasksCompleted: number;
  categoryBreakdown: CategoryTime[];
  monthlyTrend: 'improving' | 'declining' | 'stable';
  productiveHoursDistribution: HourDistribution[];
}

interface CategoryTime {
  category: TaskCategory;
  planned: number;
  actual: number;
  percentage: number;
}

interface HourDistribution {
  hour: number;                 // 0-23
  productivity: number;         // 0-100
  tasksCompleted: number;
}
```

---

## Core Features

### 1. Task Scheduling

#### Daily Schedule View
- Display tasks in chronological order
- Visual timeline representation
- Current time indicator
- Task status indicators (✓ completed, → in progress, ○ pending)

#### Task Creation
```javascript
// Example task creation
{
  title: "Deep Work - Feature Development",
  duration: 90,
  category: "work",
  priority: "high",
  timeSlot: "09:00",
  recurring: true
}
```

#### Rollover System
- End of day: flag incomplete tasks
- Next day: same template activates
- Visual indicator for carried-over tasks
- Option to reschedule or skip

### 2. Time Tracking

#### Active Timer
- Start/Pause/Stop functionality
- Real-time display
- Automatic logging
- Background tracking (even when extension closed)

#### Pause Tracking
- Log all pause events
- Categorize pauses (break, distraction, other)
- Calculate impact on focus score

#### Focus Score Calculation
```javascript
// Focus Score Algorithm
focusScore = (
  (actualProductiveTime / plannedTime) * 0.6 +
  (1 - (numberOfPauses / 10)) * 0.2 +
  (tasksCompleted / tasksPlanned) * 0.2
) * 100;
```

### 3. Analytics System

#### Daily Analytics

**Metrics:**
- Total time planned vs actual
- Tasks completed/skipped/pending
- Focus score
- Category breakdown
- Peak productivity hours
- Completion rate

**Visualizations:**
- Horizontal bar chart: Planned vs Actual by category
- Pie chart: Time distribution by category
- Line graph: Hourly productivity
- Progress rings: Daily goals

#### Weekly Analytics

**Metrics:**
- 7-day overview
- Day-by-day comparison
- Weekly totals and averages
- Best/worst performing days
- Productivity streak
- Category trends
- Weekly goal progress

**Visualizations:**
- Vertical bar chart: Daily totals (7 bars)
- Stacked bar chart: Category breakdown per day
- Line graph: Focus score trend
- Heatmap: Hourly productivity across week
- Progress indicators: Weekly goals

#### Monthly Analytics

**Metrics:**
- 4-5 week overview
- Week-by-week comparison
- Monthly totals and averages
- Best performing week
- Total tasks completed
- Category distribution
- Trend analysis (improving/declining/stable)
- Productive hours patterns

**Visualizations:**
- Area chart: Weekly totals across month
- Grouped bar chart: Week-by-week category comparison
- Calendar heatmap: Daily productivity scores
- Radial chart: Category distribution
- Line graph: Focus score trend
- Bar chart: Productive hours distribution (24-hour)

---

## UI Component Specifications

### 1. Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Schedule Planner              Wed, Jan 28, 2025    🔔  ⚙  👤  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─ Focus Analytics ────────┐  ┌─ Today's Schedule ──────────┐ │
│  │                           │  │                              │ │
│  │  ┌─ Focus Score ────┐    │  │  09:00  ✓ Deep Work (90m)   │ │
│  │  │      87%         │    │  │  10:30  ✓ Break (15m)       │ │
│  │  │   ●●●●●●●●○○     │    │  │  10:45  → Code Review (75m) │ │
│  │  └──────────────────┘    │  │  12:00  ○ Lunch (60m)       │ │
│  │                           │  │  13:00  ○ Deep Work (120m)  │ │
│  │  Today:    4h 23m        │  │  15:00  ○ Break (15m)       │ │
│  │  Week:    23h 45m        │  │  15:15  ○ Learning (105m)   │ │
│  │  Month:   98h 12m        │  │  17:00  ○ Exercise (60m)    │ │
│  │                           │  │                              │ │
│  │  [View Analytics →]      │  │  [+ Add Task]               │ │
│  └───────────────────────────┘  └──────────────────────────────┘ │
│                                                                   │
│  ┌─ Active Task ─────────────────────────────────────────────┐  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │  Code Review - Feature Implementation                     │  │
│  │  🏷 Work  •  High Priority                                │  │
│  │                                                             │  │
│  │              ⏱  00:43:28 / 01:15:00                        │  │
│  │              ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░  57%                    │  │
│  │                                                             │  │
│  │     [⏸ Pause]       [✓ Complete]       [↻ Restart]        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─ Quick Stats ─────────┐  ┌─ Weekly Overview ──────────────┐ │
│  │                        │  │                                 │ │
│  │  📊 This Week         │  │  Mon ▓▓▓▓▓░░░  5h 23m          │ │
│  │  ✓ 34 Completed       │  │  Tue ▓▓▓▓▓▓░░  6h 45m          │ │
│  │  → 8  In Progress     │  │  Wed ▓▓▓▓░░░░  4h 23m (Today)  │ │
│  │  ○ 12 Pending         │  │  Thu ░░░░░░░░  0h 00m          │ │
│  │                        │  │  Fri ░░░░░░░░  0h 00m          │ │
│  │  🎯 Completion: 81%   │  │  Sat ░░░░░░░░  0h 00m          │ │
│  │  🔥 Streak: 12 days   │  │  Sun ░░░░░░░░  0h 00m          │ │
│  │                        │  │                                 │ │
│  └────────────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Analytics Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Analytics                                         ⟨ Jan 2025 ⟩ │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Day]  [Week]  [Month]  ← Active Tab                           │
│                                                                   │
│  ┌─ Overview ────────────────────────────────────────────────┐  │
│  │  Total Tracked: 98h 12m  │  Focus Score: 87%  │  Tasks: 156│ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ Monthly Progress ────────────────────────────────────────┐  │
│  │                                                             │  │
│  │    120h ┤                                    ╱█             │  │
│  │         ┤                          ╱█       ╱ █             │  │
│  │     80h ┤                ╱█       ╱ █      ╱  █             │  │
│  │         ┤       ╱█      ╱ █      ╱  █     ╱   █             │  │
│  │     40h ┤      ╱ █     ╱  █     ╱   █    ╱    █             │  │
│  │         ┤     ╱  █    ╱   █    ╱    █   ╱     █             │  │
│  │      0h └─────────────────────────────────────────           │  │
│  │            W1    W2    W3    W4    W5                        │  │
│  │                                                             │  │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ Category Breakdown ──────┐  ┌─ Productivity Heatmap ─────┐ │
│  │                            │  │                             │ │
│  │  Work        ████████ 45%  │  │  Hour  Productivity         │ │
│  │  Learning    █████ 25%     │  │  06:00  ▓░░░  20%           │ │
│  │  Personal    ███ 15%       │  │  09:00  ▓▓▓▓  95%  ← Peak   │ │
│  │  Health      ██ 10%        │  │  12:00  ▓▓░░  60%           │ │
│  │  Other       █ 5%          │  │  15:00  ▓▓▓░  85%           │ │
│  │                            │  │  18:00  ▓▓░░  70%           │ │
│  │  Total: 98h 12m           │  │  21:00  ▓░░░  30%           │ │
│  │                            │  │                             │ │
│  └────────────────────────────┘  └─────────────────────────────┘ │
│                                                                   │
│  ┌─ Weekly Comparison ───────────────────────────────────────┐  │
│  │                                                             │  │
│  │    █     █                                                  │  │
│  │    █     █     █                                            │  │
│  │    █     █     █     █                                      │  │
│  │    █     █     █     █     ░     ░     ░                    │  │
│  │  ──────────────────────────────────────                    │  │
│  │   W1   W2   W3   W4   W5   W6   W7                         │  │
│  │                                                             │  │
│  │  Trend: ↗ Improving  │  Best Week: W2 (28h 45m)           │  │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ Insights ───────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  💡 Your most productive time is 9 AM - 11 AM             │  │
│  │  📈 You're 15% more productive than last month            │  │
│  │  🎯 You completed 87% of planned tasks this month         │  │
│  │  ⚠️  Work tasks taking 23% longer than planned on average │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Code Examples

### Task Card Component

```vue
<template>
  <div 
    class="bg-primary-800 rounded-lg border border-primary-700 p-4 
           hover:border-accent-500 transition-all duration-200
           cursor-pointer group"
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
                   transition-colors">
          {{ task.title }}
        </h3>
        
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
      <span class="text-neutral-400 text-sm font-mono">
        {{ task.timeSlot }}
      </span>
    </div>
    
    <!-- Category & Duration -->
    <div class="flex items-center gap-4 mb-3 text-sm text-neutral-400">
      <span class="flex items-center gap-1">
        <span class="text-accent-400">🏷</span>
        {{ task.category }}
      </span>
      <span>{{ task.duration }}m</span>
    </div>
    
    <!-- Progress Bar (if in progress) -->
    <div v-if="task.status === 'in-progress'" class="mt-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-neutral-400">Progress</span>
        <span class="text-xs text-neutral-400 font-mono">
          {{ formatTime(task.actualDuration) }} / {{ formatTime(task.duration) }}
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
      <button 
        class="flex-1 px-3 py-2 bg-accent-500 hover:bg-accent-600 
               text-white rounded-md text-sm font-medium transition-colors"
        @click.stop="startTask"
      >
        Start
      </button>
      <button 
        class="px-3 py-2 bg-primary-700 hover:bg-primary-600 
               text-neutral-300 rounded-md text-sm transition-colors"
        @click.stop="editTask"
      >
        Edit
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

const emit = defineEmits(['start', 'edit', 'click']);

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

const progress = computed(() => {
  if (!props.task.actualDuration) return 0;
  return Math.min((props.task.actualDuration / props.task.duration) * 100, 100);
});

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const handleTaskClick = () => emit('click', props.task);
const startTask = () => emit('start', props.task);
const editTask = () => emit('edit', props.task);
</script>
```

### Focus Meter Component

```vue
<template>
  <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
    <h3 class="text-neutral-100 text-lg font-semibold mb-6">Focus Analytics</h3>
    
    <!-- Circular Progress -->
    <div class="flex justify-center mb-6">
      <div class="relative w-40 h-40">
        <!-- Background Circle -->
        <svg class="transform -rotate-90 w-40 h-40">
          <circle 
            cx="80" 
            cy="80" 
            r="70" 
            stroke="currentColor" 
            class="text-primary-700" 
            stroke-width="12" 
            fill="none"
          />
          <!-- Progress Circle -->
          <circle 
            cx="80" 
            cy="80" 
            r="70" 
            stroke="currentColor" 
            class="text-accent-500 transition-all duration-500" 
            stroke-width="12" 
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            stroke-linecap="round"
          />
        </svg>
        
        <!-- Center Text -->
        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <span class="text-4xl font-bold text-neutral-100">
            {{ focusScore }}%
          </span>
          <span class="text-xs text-neutral-400 mt-1">Focus Score</span>
        </div>
      </div>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="text-center">
        <div class="text-2xl font-semibold text-accent-400">
          {{ stats.today }}
        </div>
        <div class="text-xs text-neutral-400 mt-1">Today</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-semibold text-accent-400">
          {{ stats.week }}
        </div>
        <div class="text-xs text-neutral-400 mt-1">Week</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-semibold text-accent-400">
          {{ stats.month }}
        </div>
        <div class="text-xs text-neutral-400 mt-1">Month</div>
      </div>
    </div>
    
    <!-- Progress Dots -->
    <div class="flex justify-center gap-1 mb-6">
      <div 
        v-for="i in 10" 
        :key="i"
        class="w-2 h-2 rounded-full transition-colors"
        :class="i <= Math.floor(focusScore / 10) ? 'bg-accent-500' : 'bg-primary-700'"
      ></div>
    </div>
    
    <!-- Action Button -->
    <button 
      class="w-full py-2.5 bg-primary-700 hover:bg-primary-600 
             text-neutral-300 rounded-md text-sm font-medium transition-colors"
      @click="viewAnalytics"
    >
      View Detailed Analytics →
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  focusScore: {
    type: Number,
    default: 0
  },
  stats: {
    type: Object,
    default: () => ({
      today: '0h',
      week: '0h',
      month: '0h'
    })
  }
});

const emit = defineEmits(['view-analytics']);

const circumference = computed(() => 2 * Math.PI * 70);
const dashOffset = computed(() => {
  const progress = props.focusScore / 100;
  return circumference.value * (1 - progress);
});

const viewAnalytics = () => emit('view-analytics');
</script>
```

### Active Timer Component

```vue
<template>
  <div class="bg-gradient-to-br from-primary-800 to-primary-900 
              rounded-xl p-6 border border-primary-700">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-neutral-100 text-lg font-semibold">Active Task</h3>
      <span 
        class="px-3 py-1 rounded-full text-xs font-medium"
        :class="statusBadgeClass"
      >
        {{ statusText }}
      </span>
    </div>
    
    <!-- Divider -->
    <div class="h-px bg-gradient-to-r from-transparent via-primary-600 
                to-transparent mb-6"></div>
    
    <!-- Task Info -->
    <div class="mb-6">
      <h4 class="text-xl font-semibold text-neutral-100 mb-2">
        {{ task.title }}
      </h4>
      <div class="flex items-center gap-3 text-sm text-neutral-400">
        <span class="flex items-center gap-1">
          <span class="text-accent-400">🏷</span>
          {{ task.category }}
        </span>
        <span>•</span>
        <span :class="priorityColor">{{ task.priority }} Priority</span>
      </div>
    </div>
    
    <!-- Timer Display -->
    <div class="text-center mb-6">
      <div class="text-6xl font-mono font-bold text-neutral-100 tracking-tight mb-2">
        {{ formattedTime }}
      </div>
      <div class="text-sm text-neutral-400">
        {{ formattedDuration }} planned
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-neutral-400">Progress</span>
        <span class="text-xs font-medium" :class="progressColor">
          {{ progressPercentage }}%
        </span>
      </div>
      <div class="w-full bg-primary-700 rounded-full h-2 overflow-hidden">
        <div 
          class="h-full rounded-full transition-all duration-300"
          :class="progressBarClass"
          :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
        ></div>
      </div>
    </div>
    
    <!-- Control Buttons -->
    <div class="grid grid-cols-3 gap-3">
      <button 
        class="px-4 py-3 bg-primary-700 hover:bg-primary-600 
               text-neutral-100 rounded-lg text-sm font-medium 
               transition-colors flex items-center justify-center gap-2"
        @click="toggleTimer"
      >
        <span>{{ isRunning ? '⏸' : '▶' }}</span>
        {{ isRunning ? 'Pause' : 'Resume' }}
      </button>
      
      <button 
        class="px-4 py-3 bg-success-500 hover:bg-success-600 
               text-white rounded-lg text-sm font-medium 
               transition-colors flex items-center justify-center gap-2"
        @click="completeTask"
      >
        <span>✓</span>
        Complete
      </button>
      
      <button 
        class="px-4 py-3 bg-primary-700 hover:bg-primary-600 
               text-neutral-100 rounded-lg text-sm font-medium 
               transition-colors flex items-center justify-center gap-2"
        @click="resetTimer"
      >
        <span>↻</span>
        Reset
      </button>
    </div>
    
    <!-- Pause Count -->
    <div v-if="pauseCount > 0" class="mt-4 text-center text-sm text-neutral-400">
      Paused {{ pauseCount }} time{{ pauseCount > 1 ? 's' : '' }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  task: Object,
  elapsedSeconds: Number,
  isRunning: Boolean,
  pauseCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['toggle', 'complete', 'reset']);

const formattedTime = computed(() => {
  const hours = Math.floor(props.elapsedSeconds / 3600);
  const minutes = Math.floor((props.elapsedSeconds % 3600) / 60);
  const seconds = props.elapsedSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const formattedDuration = computed(() => {
  const hours = Math.floor(props.task.duration / 60);
  const minutes = props.task.duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

const progressPercentage = computed(() => {
  const minutes = props.elapsedSeconds / 60;
  return Math.round((minutes / props.task.duration) * 100);
});

const statusBadgeClass = computed(() => {
  return props.isRunning 
    ? 'bg-success-500/20 text-success-400 animate-pulse'
    : 'bg-warning-500/20 text-warning-400';
});

const statusText = computed(() => {
  return props.isRunning ? 'In Progress' : 'Paused';
});

const priorityColor = computed(() => {
  const colors = {
    urgent: 'text-warning-500',
    high: 'text-accent-400',
    medium: 'text-neutral-300',
    low: 'text-neutral-400'
  };
  return colors[props.task.priority] || 'text-neutral-400';
});

const progressColor = computed(() => {
  if (progressPercentage.value >= 100) return 'text-warning-500';
  if (progressPercentage.value >= 75) return 'text-success-400';
  return 'text-accent-400';
});

const progressBarClass = computed(() => {
  if (progressPercentage.value >= 100) return 'bg-warning-500';
  if (progressPercentage.value >= 75) return 'bg-success-500';
  return 'bg-accent-500';
});

const toggleTimer = () => emit('toggle');
const completeTask = () => emit('complete');
const resetTimer = () => emit('reset');
</script>
```

### Chart Component (Monthly Overview)

```vue
<template>
  <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-neutral-100 text-lg font-semibold">Monthly Progress</h3>
      
      <!-- Month Selector -->
      <div class="flex items-center gap-2">
        <button 
          class="p-2 hover:bg-primary-700 rounded-md transition-colors"
          @click="previousMonth"
        >
          <span class="text-neutral-400">←</span>
        </button>
        <span class="text-neutral-300 font-medium min-w-[120px] text-center">
          {{ currentMonthLabel }}
        </span>
        <button 
          class="p-2 hover:bg-primary-700 rounded-md transition-colors"
          @click="nextMonth"
        >
          <span class="text-neutral-400">→</span>
        </button>
      </div>
    </div>
    
    <!-- Chart Container -->
    <div class="relative h-64 mb-4">
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <!-- Legend -->
    <div class="flex items-center justify-center gap-6 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-accent-500"></div>
        <span class="text-neutral-400">Planned</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-success-500"></div>
        <span class="text-neutral-400">Actual</span>
      </div>
    </div>
    
    <!-- Summary Stats -->
    <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary-700">
      <div class="text-center">
        <div class="text-2xl font-semibold text-neutral-100">
          {{ totalPlanned }}h
        </div>
        <div class="text-xs text-neutral-400 mt-1">Planned</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-semibold text-success-400">
          {{ totalActual }}h
        </div>
        <div class="text-xs text-neutral-400 mt-1">Completed</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-semibold" :class="achievementColor">
          {{ achievementRate }}%
        </div>
        <div class="text-xs text-neutral-400 mt-1">Achievement</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  monthlyData: Array,
  currentMonth: String
});

const emit = defineEmits(['month-change']);

const chartCanvas = ref(null);
let chartInstance = null;

const currentMonthLabel = computed(() => {
  const date = new Date(props.currentMonth);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const totalPlanned = computed(() => {
  return props.monthlyData.reduce((sum, week) => sum + week.planned, 0);
});

const totalActual = computed(() => {
  return props.monthlyData.reduce((sum, week) => sum + week.actual, 0);
});

const achievementRate = computed(() => {
  if (totalPlanned.value === 0) return 0;
  return Math.round((totalActual.value / totalPlanned.value) * 100);
});

const achievementColor = computed(() => {
  const rate = achievementRate.value;
  if (rate >= 90) return 'text-success-400';
  if (rate >= 70) return 'text-accent-400';
  return 'text-warning-500';
});

const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  const ctx = chartCanvas.value.getContext('2d');
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.monthlyData.map(week => week.label),
      datasets: [
        {
          label: 'Planned',
          data: props.monthlyData.map(week => week.planned),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Actual',
          data: props.monthlyData.map(week => week.actual),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1E293B',
          titleColor: '#F1F5F9',
          bodyColor: '#94A3B8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          displayColors: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#334155',
            drawBorder: false
          },
          ticks: {
            color: '#94A3B8',
            callback: (value) => `${value}h`
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#94A3B8'
          }
        }
      }
    }
  });
};

const previousMonth = () => {
  const date = new Date(props.currentMonth);
  date.setMonth(date.getMonth() - 1);
  emit('month-change', date.toISOString().slice(0, 7));
};

const nextMonth = () => {
  const date = new Date(props.currentMonth);
  date.setMonth(date.getMonth() + 1);
  emit('month-change', date.toISOString().slice(0, 7));
};

onMounted(() => {
  initChart();
});

watch(() => props.monthlyData, () => {
  initChart();
}, { deep: true });
</script>
```

---

## Pinia Store Structure

### Tasks Store

```javascript
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
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
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
```

### Time Tracking Store

```javascript
// stores/timeTracking.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTimeTrackingStore = defineStore('timeTracking', () => {
  // State
  const timeEntries = ref([]);
  const currentEntry = ref(null);
  const intervalId = ref(null);
  
  // Getters
  const todayEntries = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return timeEntries.value.filter(entry => entry.date === today);
  });
  
  const totalTimeToday = computed(() => {
    return todayEntries.value.reduce((sum, entry) => sum + entry.duration, 0);
  });
  
  const isTracking = computed(() => currentEntry.value !== null);
  
  // Actions
  const startTracking = (taskId) => {
    if (currentEntry.value) {
      stopTracking();
    }
    
    currentEntry.value = {
      id: generateId(),
      taskId,
      startTime: new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10),
      pauses: [],
      duration: 0
    };
    
    // Start interval to update duration
    intervalId.value = setInterval(() => {
      if (currentEntry.value) {
        const start = new Date(currentEntry.value.startTime);
        const now = new Date();
        const pauseTime = currentEntry.value.pauses.reduce((sum, pause) => {
          return sum + (new Date(pause.endTime || now) - new Date(pause.startTime));
        }, 0);
        
        currentEntry.value.duration = Math.floor((now - start - pauseTime) / 60000);
      }
    }, 1000);
  };
  
  const pauseTracking = (reason = '') => {
    if (!currentEntry.value) return;
    
    currentEntry.value.pauses.push({
      startTime: new Date().toISOString(),
      endTime: null,
      reason
    });
  };
  
  const resumeTracking = () => {
    if (!currentEntry.value) return;
    
    const lastPause = currentEntry.value.pauses[currentEntry.value.pauses.length - 1];
    if (lastPause && !lastPause.endTime) {
      lastPause.endTime = new Date().toISOString();
      lastPause.duration = Math.floor(
        (new Date(lastPause.endTime) - new Date(lastPause.startTime)) / 60000
      );
    }
  };
  
  const stopTracking = () => {
    if (!currentEntry.value) return;
    
    // End any active pause
    const lastPause = currentEntry.value.pauses[currentEntry.value.pauses.length - 1];
    if (lastPause && !lastPause.endTime) {
      resumeTracking();
    }
    
    currentEntry.value.endTime = new Date().toISOString();
    
    // Calculate final duration
    const start = new Date(currentEntry.value.startTime);
    const end = new Date(currentEntry.value.endTime);
    const pauseTime = currentEntry.value.pauses.reduce((sum, pause) => {
      return sum + (new Date(pause.endTime) - new Date(pause.startTime));
    }, 0);
    
    currentEntry.value.duration = Math.floor((end - start - pauseTime) / 60000);
    
    // Calculate focus score
    currentEntry.value.focusScore = calculateFocusScore(currentEntry.value);
    
    // Save entry
    timeEntries.value.push(currentEntry.value);
    saveEntries();
    
    // Clear current entry and interval
    currentEntry.value = null;
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  };
  
  const calculateFocusScore = (entry) => {
    const pauseCount = entry.pauses.length;
    const totalPauseTime = entry.pauses.reduce((sum, pause) => sum + pause.duration, 0);
    const workTime = entry.duration;
    
    // Base score: time worked vs total time
    const timeScore = workTime / (workTime + totalPauseTime);
    
    // Penalty for number of pauses
    const pausePenalty = Math.max(0, 1 - (pauseCount * 0.05));
    
    return Math.round(timeScore * pausePenalty * 100);
  };
  
  const getEntriesByDateRange = (startDate, endDate) => {
    return timeEntries.value.filter(entry => {
      return entry.date >= startDate && entry.date <= endDate;
    });
  };
  
  const saveEntries = () => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries.value));
  };
  
  const loadEntries = () => {
    const stored = localStorage.getItem('timeEntries');
    if (stored) {
      timeEntries.value = JSON.parse(stored);
    }
  };
  
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  return {
    timeEntries,
    currentEntry,
    todayEntries,
    totalTimeToday,
    isTracking,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    getEntriesByDateRange,
    loadEntries
  };
});
```

### Analytics Store

```javascript
// stores/analytics.js
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useTasksStore } from './tasks';
import { useTimeTrackingStore } from './timeTracking';

export const useAnalyticsStore = defineStore('analytics', () => {
  const tasksStore = useTasksStore();
  const timeStore = useTimeTrackingStore();
  
  // Daily Analytics
  const getDailyAnalytics = (date) => {
    const dayTasks = tasksStore.tasks.filter(task => task.date === date);
    const dayEntries = timeStore.timeEntries.filter(entry => entry.date === date);
    
    const totalPlanned = dayTasks.reduce((sum, task) => sum + task.duration, 0);
    const totalActual = dayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    
    const tasksPlanned = dayTasks.length;
    const tasksCompleted = dayTasks.filter(t => t.status === 'completed').length;
    const tasksSkipped = dayTasks.filter(t => t.status === 'skipped').length;
    
    const avgFocusScore = dayEntries.length > 0
      ? dayEntries.reduce((sum, entry) => sum + entry.focusScore, 0) / dayEntries.length
      : 0;
    
    const categoryBreakdown = calculateCategoryBreakdown(dayTasks, dayEntries);
    const peakProductivityHour = calculatePeakHour(dayEntries);
    
    return {
      date,
      totalPlanned,
      totalActual,
      tasksPlanned,
      tasksCompleted,
      tasksSkipped,
      focusScore: Math.round(avgFocusScore),
      categoryBreakdown,
      peakProductivityHour,
      completionRate: tasksPlanned > 0 
        ? Math.round((tasksCompleted / tasksPlanned) * 100) 
        : 0
    };
  };
  
  // Weekly Analytics
  const getWeeklyAnalytics = (weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      dailyData.push(getDailyAnalytics(date.toISOString().slice(0, 10)));
    }
    
    const totalPlanned = dailyData.reduce((sum, day) => sum + day.totalPlanned, 0);
    const totalActual = dailyData.reduce((sum, day) => sum + day.totalActual, 0);
    const averageFocusScore = Math.round(
      dailyData.reduce((sum, day) => sum + day.focusScore, 0) / 7
    );
    
    const bestDay = dailyData.reduce((best, day) => 
      day.totalActual > best.totalActual ? day : best
    );
    
    const worstDay = dailyData.reduce((worst, day) => 
      day.totalActual < worst.totalActual ? day : worst
    );
    
    // Calculate streak
    const streakDays = calculateStreak(dailyData);
    
    // Calculate category breakdown
    const allTasks = dailyData.flatMap(day => 
      tasksStore.tasks.filter(task => task.date === day.date)
    );
    const allEntries = dailyData.flatMap(day => 
      timeStore.timeEntries.filter(entry => entry.date === day.date)
    );
    const categoryBreakdown = calculateCategoryBreakdown(allTasks, allEntries);
    
    return {
      weekStart: weekStart.toISOString().slice(0, 10),
      weekEnd: weekEnd.toISOString().slice(0, 10),
      dailyData,
      totalPlanned,
      totalActual,
      averageFocusScore,
      bestDay: new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'long' }),
      worstDay: new Date(worstDay.date).toLocaleDateString('en-US', { weekday: 'long' }),
      streakDays,
      categoryBreakdown,
      weeklyGoalProgress: totalPlanned > 0 
        ? Math.round((totalActual / totalPlanned) * 100) 
        : 0
    };
  };
  
  // Monthly Analytics
  const getMonthlyAnalytics = (year, month) => {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);
    
    const weeklyData = [];
    let currentWeekStart = new Date(monthStart);
    
    // Adjust to Monday
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
    currentWeekStart.setDate(diff);
    
    while (currentWeekStart <= monthEnd) {
      weeklyData.push(getWeeklyAnalytics(new Date(currentWeekStart)));
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    const totalPlanned = weeklyData.reduce((sum, week) => sum + week.totalPlanned, 0);
    const totalActual = weeklyData.reduce((sum, week) => sum + week.totalActual, 0);
    const averageFocusScore = Math.round(
      weeklyData.reduce((sum, week) => sum + week.averageFocusScore, 0) / weeklyData.length
    );
    
    const bestWeek = weeklyData.reduce((best, week, index) => 
      week.totalActual > weeklyData[best].totalActual ? index : best
    , 0);
    
    const totalTasksCompleted = weeklyData.reduce((sum, week) => 
      sum + week.dailyData.reduce((daySum, day) => daySum + day.tasksCompleted, 0)
    , 0);
    
    // Calculate category breakdown
    const allTasks = tasksStore.tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= monthStart && taskDate <= monthEnd;
    });
    const allEntries = timeStore.timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });
    const categoryBreakdown = calculateCategoryBreakdown(allTasks, allEntries);
    
    // Calculate trend
    const firstHalfActual = weeklyData.slice(0, Math.ceil(weeklyData.length / 2))
      .reduce((sum, week) => sum + week.totalActual, 0);
    const secondHalfActual = weeklyData.slice(Math.ceil(weeklyData.length / 2))
      .reduce((sum, week) => sum + week.totalActual, 0);
    
    let monthlyTrend = 'stable';
    const difference = secondHalfActual - firstHalfActual;
    if (difference > firstHalfActual * 0.1) monthlyTrend = 'improving';
    if (difference < -firstHalfActual * 0.1) monthlyTrend = 'declining';
    
    // Calculate productive hours distribution
    const productiveHoursDistribution = calculateHourlyDistribution(allEntries);
    
    return {
      month: `${year}-${month.toString().padStart(2, '0')}`,
      year,
      weeklyData,
      totalPlanned,
      totalActual,
      averageFocusScore,
      bestWeek: bestWeek + 1,
      totalTasksCompleted,
      categoryBreakdown,
      monthlyTrend,
      productiveHoursDistribution
    };
  };
  
  // Helper Functions
  const calculateCategoryBreakdown = (tasks, entries) => {
    const categories = ['work', 'personal', 'learning', 'health', 'other'];
    const breakdown = [];
    
    const totalActual = entries.reduce((sum, entry) => sum + entry.duration, 0);
    
    categories.forEach(category => {
      const categoryTasks = tasks.filter(task => task.category === category);
      const categoryTaskIds = categoryTasks.map(task => task.id);
      const categoryEntries = entries.filter(entry => 
        categoryTaskIds.includes(entry.taskId)
      );
      
      const planned = categoryTasks.reduce((sum, task) => sum + task.duration, 0);
      const actual = categoryEntries.reduce((sum, entry) => sum + entry.duration, 0);
      const percentage = totalActual > 0 ? Math.round((actual / totalActual) * 100) : 0;
      
      breakdown.push({
        category,
        planned,
        actual,
        percentage
      });
    });
    
    return breakdown;
  };
  
  const calculatePeakHour = (entries) => {
    const hourCounts = new Array(24).fill(0);
    
    entries.forEach(entry => {
      const hour = new Date(entry.startTime).getHours();
      hourCounts[hour] += entry.duration;
    });
    
    return hourCounts.indexOf(Math.max(...hourCounts));
  };
  
  const calculateStreak = (dailyData) => {
    let streak = 0;
    
    for (let i = dailyData.length - 1; i >= 0; i--) {
      if (dailyData[i].tasksCompleted > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const calculateHourlyDistribution = (entries) => {
    const distribution = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const hourEntries = entries.filter(entry => {
        const entryHour = new Date(entry.startTime).getHours();
        return entryHour === hour;
      });
      
      const productivity = hourEntries.length > 0
        ? Math.round(hourEntries.reduce((sum, entry) => sum + entry.focusScore, 0) / hourEntries.length)
        : 0;
      
      const tasksCompleted = hourEntries.filter(entry => {
        const task = tasksStore.tasks.find(t => t.id === entry.taskId);
        return task && task.status === 'completed';
      }).length;
      
      distribution.push({
        hour,
        productivity,
        tasksCompleted
      });
    }
    
    return distribution;
  };
  
  return {
    getDailyAnalytics,
    getWeeklyAnalytics,
    getMonthlyAnalytics
  };
});
```

---

## Project Structure

```
schedule-planner/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── FocusMeter.vue
│   │   │   ├── ActiveTimer.vue
│   │   │   ├── TodaySchedule.vue
│   │   │   ├── QuickStats.vue
│   │   │   └── WeeklyOverview.vue
│   │   ├── tasks/
│   │   │   ├── TaskCard.vue
│   │   │   ├── TaskList.vue
│   │   │   ├── TaskForm.vue
│   │   │   └── TaskDetails.vue
│   │   ├── analytics/
│   │   │   ├── DailyAnalytics.vue
│   │   │   ├── WeeklyAnalytics.vue
│   │   │   ├── MonthlyAnalytics.vue
│   │   │   ├── CategoryChart.vue
│   │   │   ├── ProgressChart.vue
│   │   │   └── HeatmapChart.vue
│   │   └── ui/
│   │       ├── Button.vue
│   │       ├── Card.vue
│   │       ├── Modal.vue
│   │       └── Select.vue
│   ├── stores/
│   │   ├── tasks.js
│   │   ├── timeTracking.js
│   │   └── analytics.js
│   ├── views/
│   │   ├── Dashboard.vue
│   │   ├── Analytics.vue
│   │   ├── Schedule.vue
│   │   └── Settings.vue
│   ├── router/
│   │   └── index.js
│   ├── utils/
│   │   ├── dateHelpers.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.vue
│   └── main.js
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   ├── popup.js
│   └── content.js
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Chrome Extension Manifest

```json
{
  "manifest_version": 3,
  "name": "Schedule Planner",
  "version": "1.0.0",
  "description": "Professional productivity app for task-based scheduling with analytics",
  "permissions": [
    "storage",
    "alarms",
    "notifications",
    "tabs"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
```

---

## Key Features Implementation

### Anti-Polymath Features

1. **Task Locking**
```javascript
// In tasks store
const canStartNewTask = computed(() => {
  return !activeTaskId.value; // Can't start new task if one is active
});

const forceStartTask = (taskId) => {
  if (activeTaskId.value) {
    // Show warning modal
    showModal({
      title: 'Task in Progress',
      message: 'You have an active task. Complete or pause it first.',
      actions: [
        { label: 'Pause Current', onClick: () => pauseTask(activeTaskId.value) },
        { label: 'Complete Current', onClick: () => completeTask(activeTaskId.value) },
        { label: 'Cancel', onClick: () => {} }
      ]
    });
  }
};
```

2. **Context Switch Penalty**
```javascript
// Calculate time lost to context switching
const contextSwitchPenalty = computed(() => {
  const switches = timeEntries.value.filter(entry => 
    entry.pauses.some(pause => pause.reason === 'context-switch')
  );
  
  return switches.reduce((total, entry) => {
    const switchPauses = entry.pauses.filter(p => p.reason === 'context-switch');
    return total + switchPauses.reduce((sum, p) => sum + p.duration, 0);
  }, 0);
});
```

3. **Single Focus Mode**
```javascript
// Component for fullscreen focus mode
const enableFocusMode = () => {
  document.body.requestFullscreen();
  // Hide all UI except active task
  showOnlyActiveTask.value = true;
  // Block notifications
  // Start ambient focus music (optional)
};
```

### Daily Rollover Logic

```javascript
// Run at midnight
const checkAndRollover = () => {
  const today = new Date().toISOString().slice(0, 10);
  const lastRollover = localStorage.getItem('lastRollover');
  
  if (lastRollover !== today) {
    tasksStore.rolloverTasks();
    localStorage.setItem('lastRollover', today);
  }
};

// Check every hour
setInterval(checkAndRollover, 3600000);
```

---

## Installation & Setup

### Prerequisites
```bash
Node.js >= 18.x
npm >= 9.x
```

### Installation Steps

1. **Clone and Install**
```bash
git clone <repository-url>
cd schedule-planner
npm install
```

2. **Development Server**
```bash
npm run dev
```

3. **Build for Production**
```bash
npm run build
```

4. **Build Chrome Extension**
```bash
npm run build:extension
```

### Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
        accent: {
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
        },
        success: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        neutral: {
          100: '#F1F5F9',
          200: '#E2E8F0',
          400: '#94A3B8',
          600: '#475569',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## Performance Optimization

### Chart Performance
- Use `Chart.js` with canvas rendering
- Limit data points to last 30 days for monthly view
- Implement virtual scrolling for large task lists
- Debounce chart updates

### State Management
- Use computed properties for derived data
- Implement proper watchers with deep: false when possible
- Batch localStorage updates
- Use Web Workers for heavy calculations

### Extension Performance
- Minimize background script usage
- Use chrome.alarms instead of setInterval
- Implement efficient storage with chrome.storage.local
- Cache frequently accessed data

---

## Testing Strategy

### Unit Tests
- Test store actions and getters
- Test utility functions
- Test date calculations

### Component Tests
- Test user interactions
- Test prop validation
- Test event emissions

### E2E Tests
- Test complete task lifecycle
- Test analytics calculations
- Test rollover functionality

---

## Future Enhancements

### Phase 4 (Advanced Features)
- AI-powered task suggestions
- Integration with calendar apps (Google Calendar, Outlook)
- Team collaboration features
- Export to PDF/Excel
- Custom themes
- Pomodoro timer integration
- Break reminders
- Goal setting and tracking
- Habit tracking
- Mobile app (React Native)

### Phase 5 (Analytics++)
- Predictive analytics
- Task duration prediction
- Productivity insights
- Comparative analytics (vs previous months)
- Custom reports
- Data export API

---

## Troubleshooting

### Common Issues

1. **Charts not rendering**
   - Ensure Chart.js is properly imported
   - Check canvas element ref
   - Verify data format

2. **localStorage quota exceeded**
   - Implement data cleanup for old entries
   - Consider IndexedDB for larger datasets
   - Add data export feature

3. **Extension not loading**
   - Check manifest.json syntax
   - Verify permissions
   - Check background script errors

---

## License

MIT License

---

## Contact & Support

For issues and questions, please create an issue in the GitHub repository.

---

**Last Updated**: January 28, 2025
**Version**: 1.0.0

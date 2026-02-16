<template>
  <div class="daily-clock-chart">
    <div class="clock-container">
      <!-- 24-hour clock circle -->
      <svg :width="size" :height="size" class="clock-svg">
        <!-- Background circle -->
        <circle
          :cx="centerX"
          :cy="centerY"
          :r="radius"
          fill="none"
          stroke="#1e293b"
          :stroke-width="strokeWidth"
        />
        
        <!-- Hour markers -->
        <g v-for="hour in 24" :key="`marker-${hour}`">
          <line
            :x1="getMarkerStart(hour - 1).x"
            :y1="getMarkerStart(hour - 1).y"
            :x2="getMarkerEnd(hour - 1).x"
            :y2="getMarkerEnd(hour - 1).y"
            stroke="#334155"
            :stroke-width="hour % 6 === 0 ? 2 : 1"
          />
        </g>
        
        <!-- Hour labels -->
        <text
          v-for="hour in hourLabels"
          :key="`label-${hour}`"
          :x="getLabelPosition(hour).x"
          :y="getLabelPosition(hour).y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="hour-label"
          :class="{ 'major-hour': hour % 6 === 0 }"
        >
          {{ hour }}
        </text>
        
        <!-- Scheduled task segments (thin) -->
        <path
          v-for="(segment, index) in scheduledSegments"
          :key="`scheduled-${index}`"
          :d="segment.path"
          :fill="segment.color"
          :opacity="segment.opacity"
          class="scheduled-segment"
        />
        
        <!-- Actual time tracking segments (wide) -->
        <path
          v-for="(segment, index) in trackingSegments"
          :key="`tracking-${index}`"
          :d="segment.path"
          :fill="segment.color"
          :opacity="segment.opacity"
          class="tracking-segment"
        />
        
        <!-- Pomodoro focus sessions (widest, distinctive) -->
        <path
          v-for="(segment, index) in pomodoroSegments"
          :key="`pomodoro-${index}`"
          :d="segment.path"
          :fill="segment.color"
          :opacity="segment.opacity"
          class="pomodoro-segment"
        />
        
        <!-- Current time indicator -->
        <g v-if="showCurrentTime">
          <line
            :x1="centerX"
            :y1="centerY"
            :x2="getCurrentTimePosition().x"
            :y2="getCurrentTimePosition().y"
            stroke="#3b82f6"
            stroke-width="2"
            class="current-time-hand"
          />
          <circle
            :cx="getCurrentTimePosition().x"
            :cy="getCurrentTimePosition().y"
            r="6"
            fill="#3b82f6"
            stroke="#0f172a"
            stroke-width="2"
          />
        </g>
        
        <!-- Center circle -->
        <circle
          :cx="centerX"
          :cy="centerY"
          :r="radius * 0.35"
          fill="#1e293b"
          stroke="#334155"
          stroke-width="2"
        />
      </svg>
      
      <!-- Center content -->
      <div class="center-content">
        <div class="total-minutes">{{ totalMinutes }}</div>
        <div class="label">Minutes</div>
        <div class="date-label">{{ formattedDate }}</div>
      </div>
      
      <!-- Hour labels outside -->
      <div
        v-for="hour in [0, 6, 12, 18]"
        :key="`outer-label-${hour}`"
        class="outer-hour-label"
        :style="getOuterLabelStyle(hour)"
      >
        {{ hour }}
      </div>
    </div>
    
    <!-- Legend -->
    <div class="legend">
      <div class="legend-section">
        <div class="legend-title">Scheduled (Thin)</div>
        <div class="legend-item">
          <div class="legend-color thin" style="background: #475569"></div>
          <span>Planned Time</span>
        </div>
      </div>
      <div class="legend-section">
        <div class="legend-title">Actual Work (Wide)</div>
        <div class="legend-item">
          <div class="legend-color" style="background: #22c55e"></div>
          <span>On Schedule ✨</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #10b981"></div>
          <span>Off Schedule</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #fbbf24"></div>
          <span>Active (On Time) 🎯</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #3b82f6"></div>
          <span>Active (Off Time)</span>
        </div>
      </div>
      <div class="legend-section">
        <div class="legend-title">Focus Sessions 🍅</div>
        <div class="legend-item">
          <div class="legend-color" style="background: #f97316"></div>
          <span>Active Pomodoro ⏱️</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #ef4444"></div>
          <span>Completed Pomodoro</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { getTodayLocal } from '../../utils/dateHelpers';
import { usePomodoroStore } from '../../stores/pomodoro';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  date: {
    type: String,
    required: true
  }
});

const pomodoroStore = usePomodoroStore();

const size = 400;
const centerX = size / 2;
const centerY = size / 2;
const radius = 160;
const strokeWidth = 40;
const scheduledStrokeWidth = 20; // Thin for scheduled tasks
const trackingStrokeWidth = 45; // Wide for actual tracking
const currentTime = ref(new Date());

let timeInterval = null;

const formattedDate = computed(() => {
  const date = new Date(props.date);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
});

const showCurrentTime = computed(() => {
  const today = getTodayLocal();
  return props.date === today;
});

const hourLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

const totalMinutes = computed(() => {
  const taskMinutes = props.tasks
    .filter(task => task.timeSegments && task.timeSegments.length > 0)
    .reduce((sum, task) => {
      let taskTotal = 0;
      task.timeSegments.forEach(segment => {
        const start = new Date(segment.startTime).getTime();
        const end = segment.endTime ? new Date(segment.endTime).getTime() : Date.now();
        taskTotal += (end - start);
      });
      return sum + Math.floor(taskTotal / 60000);
    }, 0);
  
  // Add Pomodoro focus minutes
  const pomodoroSessions = pomodoroStore.getSessionsForDate(props.date);
  const pomodoroMinutes = pomodoroSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  
  return taskMinutes + pomodoroMinutes;
});

// Scheduled task segments (thin, background)
const scheduledSegments = computed(() => {
  const segments = [];
  
  props.tasks.forEach(task => {
    if (!task.timeSlot) return;
    
    // Parse time slot (HH:MM format)
    const [hours, minutes] = task.timeSlot.split(':').map(Number);
    const startHour = hours + minutes / 60;
    const duration = (task.duration || 0) / 60; // Convert minutes to hours
    
    if (duration === 0) return;
    
    segments.push({
      path: createArcPath(startHour, startHour + duration, scheduledStrokeWidth),
      color: '#475569', // Gray for scheduled
      opacity: 0.4
    });
  });
  
  return segments;
});

// Check if actual work overlaps with scheduled time
function isOnSchedule(task, segmentStartHour, segmentEndHour) {
  if (!task.timeSlot) return false;
  
  const [hours, minutes] = task.timeSlot.split(':').map(Number);
  const scheduledStart = hours + minutes / 60;
  const scheduledEnd = scheduledStart + (task.duration || 0) / 60;
  
  // Check for overlap with tolerance of 15 minutes (0.25 hours)
  const tolerance = 0.25;
  const hasOverlap = !(segmentEndHour < scheduledStart - tolerance || segmentStartHour > scheduledEnd + tolerance);
  
  return hasOverlap;
}

// Actual time tracking segments (wide, foreground)
const trackingSegments = computed(() => {
  const segments = [];
  
  props.tasks.forEach(task => {
    // Only render tasks that have actual time segments
    if (!task.timeSegments || task.timeSegments.length === 0) return;
    
    // Render each time segment
    task.timeSegments.forEach(segment => {
      const startTime = new Date(segment.startTime);
      const endTime = segment.endTime ? new Date(segment.endTime) : new Date();
      
      // Convert to hours (0-24)
      const startHours = startTime.getHours();
      const startMinutes = startTime.getMinutes();
      const startHour = startHours + startMinutes / 60;
      
      const endHours = endTime.getHours();
      const endMinutes = endTime.getMinutes();
      const endHour = endHours + endMinutes / 60;
      
      // Skip if duration is too small to render
      if (endHour - startHour < 0.01) return;
      
      let color, opacity;
      
      // Check if working on schedule - REWARD COLOR!
      const onSchedule = isOnSchedule(task, startHour, endHour);
      
      // Active segment (still running)
      if (segment.endTime === null) {
        color = onSchedule ? '#fbbf24' : '#3b82f6'; // Gold if on schedule, blue otherwise
        opacity = 0.95;
      }
      // Completed segments
      else if (task.status === 'completed') {
        color = onSchedule ? '#22c55e' : '#10b981'; // Bright green if on schedule
        opacity = 0.9;
      }
      // Paused segments
      else {
        color = onSchedule ? '#a3e635' : '#64748b'; // Lime if on schedule, gray otherwise
        opacity = 0.8;
      }
      
      segments.push({
        path: createArcPath(startHour, endHour, trackingStrokeWidth),
        color,
        opacity
      });
    });
  });
  
  return segments;
});

// Pomodoro focus sessions (with distinct tomato style)
const pomodoroSegments = computed(() => {
  const segments = [];
  const pomodoroSessions = pomodoroStore.getSessionsForDate(props.date);
  
  // Add completed Pomodoro sessions
  pomodoroSessions.forEach(session => {
    if (!session.completed || session.type !== 'focus') return;
    
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    
    // Convert to hours (0-24)
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const startHour = startHours + startMinutes / 60;
    
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();
    const endHour = endHours + endMinutes / 60;
    
    // Skip if duration is too small to render
    if (endHour - startHour < 0.01) return;
    
    // Completed Pomodoro sessions in solid red
    segments.push({
      path: createArcPath(startHour, endHour, trackingStrokeWidth + 5),
      color: '#ef4444', // Tomato red for pomodoro
      opacity: 0.85
    });
  });
  
  // Add ACTIVE/RUNNING Pomodoro session in real-time
  const today = getTodayLocal();
  if (props.date === today && pomodoroStore.isActive && !pomodoroStore.isBreak) {
    const now = new Date();
    const startTime = now.getTime() - ((pomodoroStore.settings.workDuration * 60 - pomodoroStore.timeRemaining) * 1000);
    const start = new Date(startTime);
    
    const startHours = start.getHours();
    const startMinutes = start.getMinutes();
    const startHour = startHours + startMinutes / 60;
    
    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();
    const nowHour = nowHours + nowMinutes / 60;
    
    // Active Pomodoro in bright pulsing red/orange
    if (nowHour - startHour >= 0.01) {
      segments.push({
        path: createArcPath(startHour, nowHour, trackingStrokeWidth + 5),
        color: pomodoroStore.isPaused ? '#fb923c' : '#f97316', // Orange for active, lighter if paused
        opacity: pomodoroStore.isPaused ? 0.7 : 0.95
      });
    }
  }
  
  return segments;
});

function createArcPath(startHour, endHour, customStrokeWidth = strokeWidth) {
  // Convert hours to angles (0 hours = top of circle, clockwise)
  const startAngle = (startHour / 24) * 360 - 90;
  const endAngle = (endHour / 24) * 360 - 90;
  
  const innerRadius = radius - customStrokeWidth / 2;
  const outerRadius = radius + customStrokeWidth / 2;
  
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  
  const x1 = centerX + innerRadius * Math.cos(startAngleRad);
  const y1 = centerY + innerRadius * Math.sin(startAngleRad);
  const x2 = centerX + outerRadius * Math.cos(startAngleRad);
  const y2 = centerY + outerRadius * Math.sin(startAngleRad);
  const x3 = centerX + outerRadius * Math.cos(endAngleRad);
  const y3 = centerY + outerRadius * Math.sin(endAngleRad);
  const x4 = centerX + innerRadius * Math.cos(endAngleRad);
  const y4 = centerY + innerRadius * Math.sin(endAngleRad);
  
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  
  return `
    M ${x1} ${y1}
    L ${x2} ${y2}
    A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}
    L ${x4} ${y4}
    A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}
    Z
  `;
}

function getMarkerStart(hour) {
  const angle = (hour / 24) * 360 - 90;
  const angleRad = (angle * Math.PI) / 180;
  const markerRadius = radius - strokeWidth / 2 - 5;
  
  return {
    x: centerX + markerRadius * Math.cos(angleRad),
    y: centerY + markerRadius * Math.sin(angleRad)
  };
}

function getMarkerEnd(hour) {
  const angle = (hour / 24) * 360 - 90;
  const angleRad = (angle * Math.PI) / 180;
  const markerRadius = radius + strokeWidth / 2 + 5;
  
  return {
    x: centerX + markerRadius * Math.cos(angleRad),
    y: centerY + markerRadius * Math.sin(angleRad)
  };
}

function getLabelPosition(hour) {
  const angle = (hour / 24) * 360 - 90;
  const angleRad = (angle * Math.PI) / 180;
  const labelRadius = radius - strokeWidth / 2 - 20;
  
  return {
    x: centerX + labelRadius * Math.cos(angleRad),
    y: centerY + labelRadius * Math.sin(angleRad)
  };
}

function getOuterLabelStyle(hour) {
  const angle = (hour / 24) * 360 - 90;
  const angleRad = (angle * Math.PI) / 180;
  const labelRadius = radius + strokeWidth / 2 + 30;
  
  const x = centerX + labelRadius * Math.cos(angleRad);
  const y = centerY + labelRadius * Math.sin(angleRad);
  
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -50%)'
  };
}

function getCurrentTimePosition() {
  const now = currentTime.value;
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentHour = hours + minutes / 60;
  
  const angle = (currentHour / 24) * 360 - 90;
  const angleRad = (angle * Math.PI) / 180;
  const handRadius = radius + strokeWidth / 2 + 10;
  
  return {
    x: centerX + handRadius * Math.cos(angleRad),
    y: centerY + handRadius * Math.sin(angleRad)
  };
}

function updateCurrentTime() {
  currentTime.value = new Date();
}

onMounted(() => {
  timeInterval = setInterval(updateCurrentTime, 1000); // Update every second for real-time tracking
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.daily-clock-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.clock-container {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clock-svg {
  display: block;
}

.hour-label {
  fill: #64748b;
  font-size: 11px;
  font-weight: 500;
  font-family: monospace;
}

.hour-label.major-hour {
  fill: #94a3b8;
  font-size: 13px;
  font-weight: 600;
}

.scheduled-segment {
  transition: opacity 0.3s;
}

.scheduled-segment:hover {
  opacity: 0.6 !important;
}

.tracking-segment {
  transition: opacity 0.3s;
}

.tracking-segment:hover {
  opacity: 1 !important;
}

.pomodoro-segment {
  transition: opacity 0.3s;
  filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.5));
  animation: pomodoro-pulse 2s ease-in-out infinite;
}

.pomodoro-segment:hover {
  opacity: 1 !important;
  filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8));
}

@keyframes pomodoro-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.9));
  }
}

.current-time-hand {
  filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.5));
}

.center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.total-minutes {
  font-size: 48px;
  font-weight: 700;
  color: #10b981;
  line-height: 1;
  margin-bottom: 4px;
}

.label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.date-label {
  font-size: 11px;
  color: #475569;
  font-weight: 500;
}

.outer-hour-label {
  position: absolute;
  font-size: 16px;
  font-weight: 600;
  color: #94a3b8;
  font-family: monospace;
  pointer-events: none;
}

.legend {
  display: flex;
  gap: 32px;
  justify-content: center;
}

.legend-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-title {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.legend-color.thin {
  width: 16px;
  height: 8px;
}
</style>

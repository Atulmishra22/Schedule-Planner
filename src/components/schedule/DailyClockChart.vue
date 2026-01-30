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
        
        <!-- Task segments -->
        <path
          v-for="(segment, index) in taskSegments"
          :key="`segment-${index}`"
          :d="segment.path"
          :fill="segment.color"
          :opacity="segment.opacity"
          class="task-segment"
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
      <div class="legend-item">
        <div class="legend-color" style="background: #10b981"></div>
        <span>Completed</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #3b82f6"></div>
        <span>In Progress</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #64748b"></div>
        <span>Pending</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

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

const size = 400;
const centerX = size / 2;
const centerY = size / 2;
const radius = 160;
const strokeWidth = 40;
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
  const today = new Date().toISOString().slice(0, 10);
  return props.date === today;
});

const hourLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

const totalMinutes = computed(() => {
  return props.tasks
    .filter(task => task.status === 'completed' || task.status === 'in-progress')
    .reduce((sum, task) => {
      if (task.actualDuration) return sum + task.actualDuration;
      if (task.status === 'in-progress' && task.startedAt) {
        const elapsed = Math.floor((Date.now() - new Date(task.startedAt).getTime()) / 60000);
        return sum + elapsed;
      }
      return sum;
    }, 0);
});

const taskSegments = computed(() => {
  const segments = [];
  
  props.tasks.forEach(task => {
    if (!task.timeSlot) return;
    
    // Parse time slot (HH:MM format)
    const [hours, minutes] = task.timeSlot.split(':').map(Number);
    const startHour = hours + minutes / 60;
    const duration = (task.duration || 0) / 60; // Convert minutes to hours
    
    let color, opacity;
    
    switch (task.status) {
      case 'completed':
        color = '#10b981';
        opacity = 0.9;
        break;
      case 'in-progress':
        color = '#3b82f6';
        opacity = 0.95;
        break;
      default:
        color = '#64748b';
        opacity = 0.6;
    }
    
    segments.push({
      path: createArcPath(startHour, startHour + duration),
      color,
      opacity
    });
  });
  
  return segments;
});

function createArcPath(startHour, endHour) {
  // Convert hours to angles (0 hours = top of circle, clockwise)
  const startAngle = (startHour / 24) * 360 - 90;
  const endAngle = (endHour / 24) * 360 - 90;
  
  const innerRadius = radius - strokeWidth / 2;
  const outerRadius = radius + strokeWidth / 2;
  
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
  timeInterval = setInterval(updateCurrentTime, 60000); // Update every minute
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

.task-segment {
  transition: opacity 0.3s;
}

.task-segment:hover {
  opacity: 1 !important;
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
  gap: 24px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #94a3b8;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>

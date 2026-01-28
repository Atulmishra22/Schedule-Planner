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

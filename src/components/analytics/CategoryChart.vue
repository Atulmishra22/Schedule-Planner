<template>
  <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
    <h3 class="text-neutral-100 text-lg font-semibold mb-6">Category Breakdown</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Chart -->
      <div class="relative h-64">
        <canvas ref="chartCanvas"></canvas>
      </div>
      
      <!-- Legend with Stats -->
      <div class="space-y-3">
        <div 
          v-for="(item, index) in categoryData" 
          :key="item.category"
          class="flex items-center justify-between p-3 bg-primary-700/50 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <div 
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: colors[index] }"
            ></div>
            <span class="text-neutral-200 capitalize">{{ item.category }}</span>
          </div>
          <div class="text-right">
            <div class="text-neutral-100 font-semibold">{{ formatMinutes(item.actual) }}</div>
            <div class="text-xs text-neutral-400">{{ item.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { formatMinutes } from '../../utils/formatters';

Chart.register(...registerables);

const props = defineProps({
  categoryData: {
    type: Array,
    default: () => []
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

const colors = [
  '#3B82F6', // work - blue
  '#10B981', // personal - green
  '#8B5CF6', // learning - purple
  '#EC4899', // health - pink
  '#94A3B8'  // other - gray
];

const chartData = computed(() => ({
  labels: props.categoryData.map(item => item.category),
  datasets: [{
    data: props.categoryData.map(item => item.actual),
    backgroundColor: colors,
    borderWidth: 0
  }]
}));

const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  const ctx = chartCanvas.value.getContext('2d');
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: chartData.value,
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
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = formatMinutes(context.parsed);
              return `${label}: ${value}`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });
};

onMounted(() => {
  if (props.categoryData.length > 0) {
    initChart();
  }
});

watch(() => props.categoryData, () => {
  if (props.categoryData.length > 0) {
    initChart();
  }
}, { deep: true });
</script>

<template>
  <div class="bg-primary-800 rounded-xl border border-primary-700 p-6">
    <h3 class="text-neutral-100 text-lg font-semibold mb-6">{{ title }}</h3>
    
    <div class="relative h-64">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  title: {
    type: String,
    default: 'Progress Chart'
  },
  data: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'bar'
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

const initChart = () => {
  if (!chartCanvas.value) return;
  
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  
  const ctx = chartCanvas.value.getContext('2d');
  
  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#94A3B8',
            padding: 15,
            usePointStyle: true
          }
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
      scales: props.type !== 'pie' && props.type !== 'doughnut' ? {
        y: {
          beginAtZero: true,
          grid: {
            color: '#334155',
            drawBorder: false
          },
          ticks: {
            color: '#94A3B8'
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
      } : {}
    }
  });
};

onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});

// Update chart when data changes
let updateTimeout = null;
watchEffect(() => {
  if (!chartCanvas.value) return;
  
  // Track the data
  JSON.stringify(props.data);
  
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  
  updateTimeout = setTimeout(() => {
    if (chartInstance) {
      chartInstance.data = props.data;
      chartInstance.update('none');
    } else {
      initChart();
    }
  }, 100);
});
</script>

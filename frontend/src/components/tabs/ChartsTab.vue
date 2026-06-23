<script setup lang="ts">
import { computed } from 'vue';
import { useHealthData } from '../../composables/useHealthData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Filler
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
);

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        color: '#64748b',
        font: { family: "'Inter', 'Segoe UI', sans-serif", size: 12, weight: 500 }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0f172a',
      bodyColor: '#334155',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      boxPadding: 6,
      usePointStyle: true,
      titleFont: { size: 12, weight: 'bold', family: "'Inter', sans-serif" },
      bodyFont: { size: 12, family: "'Inter', sans-serif" },
      callbacks: {
        labelTextColor: () => '#334155'
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 }, maxRotation: 45, minRotation: 0 },
      border: { display: false }
    },
    y: {
      border: { display: false },
      grid: { color: '#f1f5f9', drawTicks: false },
      ticks: { color: '#94a3b8', font: { size: 11 }, padding: 6 }
    }
  }
};

const { vitals } = useHealthData();

const glucoseData = computed(() => {
  const records = vitals.value.filter(v => v.type === 'glucose');
  const labels = records.map(v =>
    new Date(v.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  );
  const data = records.map(v => v.numericValue);
  return {
    labels: labels.length > 0 ? labels : ['Sem dados'],
    datasets: [{
      label: 'Glicose (mg/dL)',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      borderColor: '#0ea5e9',
      borderWidth: 2,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#0ea5e9',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4,
      data: data.length > 0 ? data : [0]
    }]
  };
});

const bpData = computed(() => {
  const records = vitals.value.filter(v => v.type === 'blood_pressure');
  const labels = records.map(v =>
    new Date(v.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  );
  const sistolica = records.map(v => Number(v.value.split('/')[0]) || 0);
  const diastolica = records.map(v => Number(v.value.split('/')[1]) || 0);
  return {
    labels: labels.length > 0 ? labels : ['Sem dados'],
    datasets: [
      {
        label: 'Sistólica',
        backgroundColor: 'rgba(225, 29, 72, 0.05)',
        borderColor: '#e11d48',
        borderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#e11d48',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
        data: sistolica.length > 0 ? sistolica : [0]
      },
      {
        label: 'Diastólica',
        backgroundColor: 'rgba(13, 148, 136, 0.05)',
        borderColor: '#0d9488',
        borderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#0d9488',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
        data: diastolica.length > 0 ? diastolica : [0]
      }
    ]
  };
});
</script>

<template>
  <div class="charts-tab">
    <div class="header-section">
      <h2 class="title">Evolução Clínica</h2>
      <p class="subtitle">Acompanhamento detalhado das suas métricas de saúde.</p>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <div class="card-header">
          <h3>Níveis de Glicose</h3>
          <span class="badge badge-blue">Glicemia</span>
        </div>
        <div class="chart-container">
          <Line :data="glucoseData" :options="chartOptions" />
        </div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3>Pressão Arterial</h3>
          <span class="badge badge-teal">Cardiovascular</span>
        </div>
        <div class="chart-container">
          <Line :data="bpData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charts-tab {
  width: 100%;
  animation: fadeIn 0.4s ease-out;
}

.header-section {
  margin-bottom: 24px;
}

.title {
  font-size: clamp(20px, 4vw, 26px); /* Escala fluída */
  color: #0f172a;
  margin-bottom: 6px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #64748b;
  font-size: clamp(13px, 2vw, 15px);
  font-weight: 400;
}

/* Grid: 2 colunas no desktop, 1 no restante */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
}

.chart-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -2px rgba(0, 0, 0, 0.025);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease;
  min-width: 0; /* Evita overflow em grid */
}

.chart-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -4px rgba(0, 0, 0, 0.025);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 8px;
  flex-wrap: wrap; /* Badge quebra linha se necessário */
}

.card-header h3 {
  color: #1e293b;
  font-size: clamp(14px, 2.5vw, 17px);
  font-weight: 600;
  margin: 0;
}

.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  flex-shrink: 0;
}

.badge-blue { background-color: #e0f2fe; color: #0369a1; }
.badge-teal { background-color: #ccfbf1; color: #0f766e; }

/* Altura do gráfico: responsiva por breakpoint */
.chart-container {
  position: relative;
  height: 280px;
  width: 100%;
  flex-grow: 1;
}

/* Tablet: 1 coluna, altura reduzida */
@media (max-width: 1023px) {
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .chart-container {
    height: 240px;
  }

  .header-section {
    margin-bottom: 20px;
  }
}

/* Mobile: padding menor, altura menor */
@media (max-width: 640px) {
  .chart-card {
    padding: 16px;
    border-radius: 12px;
  }

  .card-header {
    margin-bottom: 14px;
  }

  .chart-container {
    height: 200px;
  }

  .charts-grid {
    gap: 16px;
  }
}

/* Mobile muito pequeno (≤380px): badge some para economizar espaço */
@media (max-width: 380px) {
  .badge {
    display: none;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>  
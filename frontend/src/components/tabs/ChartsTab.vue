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
  BarElement
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Fundamental para o gráfico não quebrar a tela
  layout: {
    padding: { bottom: 10 }
  }
};

// Puxa os dados reais armazenados no sistema
const { vitals } = useHealthData();

// --- GRÁFICO DE GLICOSE ---
const glucoseData = computed(() => {
  const glucoseRecords = vitals.value.filter(v => v.type === 'glucose');
  
  const labels = glucoseRecords.map(v => 
    new Date(v.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  );
  
  const data = glucoseRecords.map(v => v.numericValue);

  return {
    labels: labels.length > 0 ? labels : ['Sem dados'],
    datasets: [
      {
        label: 'Glicose (mg/dL)',
        backgroundColor: '#1e40af',
        borderColor: '#1e40af',
        data: data.length > 0 ? data : [0]
      }
    ]
  };
});

// --- GRÁFICO DE PRESSÃO ARTERIAL (Lendo de um campo só) ---
const bpData = computed(() => {
  const bpRecords = vitals.value.filter(v => v.type === 'blood_pressure');
  
  const labels = bpRecords.map(v => 
    new Date(v.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  );

  // Lê o texto único (ex: "120/80") e corta na barra
  const sistolica = bpRecords.map(v => {
    const parts = v.value.split('/');
    return parts.length > 0 ? Number(parts[0]) : 0;
  });

  const diastolica = bpRecords.map(v => {
    const parts = v.value.split('/');
    return parts.length > 1 ? Number(parts[1]) : 0;
  });

  return {
    labels: labels.length > 0 ? labels : ['Sem dados'],
    datasets: [
      {
        label: 'Sistólica',
        backgroundColor: '#ba1a1a',
        borderColor: '#ba1a1a',
        data: sistolica.length > 0 ? sistolica : [0]
      },
      {
        label: 'Diastólica',
        backgroundColor: '#41674c',
        borderColor: '#41674c',
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
      <p class="subtitle">Acompanhamento das suas métricas de saúde.</p>
    </div>

    <div class="charts-grid">
      <!-- Card do Gráfico de Glicose -->
      <div class="chart-card">
        <h3>Níveis de Glicose</h3>
        <div class="chart-container">
          <Line :data="glucoseData" :options="chartOptions" />
        </div>
      </div>

      <!-- Card do Gráfico de Pressão -->
      <div class="chart-card">
        <h3>Pressão Arterial</h3>
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
  animation: fadeIn 0.3s ease-in-out;
}

.header-section {
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  color: var(--text-main);
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 14px;
}

/* O minmax(0, 1fr) impede que o gráfico empurre a tela */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)); 
  gap: 24px;
  width: 100%;
}

.chart-card {
  background-color: var(--soft-white);
  border: 1px solid var(--outline-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

.chart-card h3 {
  color: var(--text-main);
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 600;
}

.chart-container {
  position: relative;
  height: 300px; 
  width: 100%;
  flex-grow: 1;
}

/* Responsividade para telas de celular e tablet */
@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
<script setup lang="ts">
import { useHealthData } from '../../composables/useHealthData';

const { 
  profile, 
  latestBP, 
  latestGlucose, 
  latestHeartRate, 
  latestWeight, 
  medications, 
  takenMedsToday, 
  appointments, 
  triggerCallSimulation, 
  currentTab,
  showToast
} = useHealthData();

const toggleMedTaken = (medId: string) => {
  const todayStr = '2026-05-27';
  const foundIndex = medications.value.findIndex(m => m.id === medId);
  if (foundIndex !== -1) {
    const med = medications.value[foundIndex];
    const isTaken = med.takenDates.includes(todayStr);
    if (isTaken) {
      med.takenDates = med.takenDates.filter(d => d !== todayStr);
    } else {
      med.takenDates = [...med.takenDates, todayStr];
      showToast(`Você anotou que tomou: ${med.name}. Parabéns!`);
    }
  }
};
</script>

<template>
  <div class="panel-content">
    <div class="greeting-section">
      <div>
        <h2 class="greeting-text-title">Reforço diário, {{ profile.name }}</h2>
        <p class="greeting-text-subtitle">Boas notícias! No geral, seus sinalizadores estão ideais hoje.</p>
      </div>
      <div class="date-badge">
        <span>Quarta-feira, 27 de Maio de 2026</span>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <div>
            <span class="metric-label-txt">Última Pressão</span>
            <h3 class="metric-value-txt">{{ latestBP ? latestBP.value : 'N/A' }}</h3>
          </div>
        </div>
        <div class="metric-footer">
          <span class="status-text-lbl">Status clínico:</span>
          <span :class="['status-badge-val', latestBP?.status || 'normal']">
            {{ latestBP?.status === 'normal' ? 'Ideal' : latestBP?.status === 'attention' ? 'Atenção' : 'Alto' }}
          </span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <div>
            <span class="metric-label-txt">Frequência de Glicemia</span>
            <h3 class="metric-value-txt">{{ latestGlucose ? latestGlucose.value : 'N/A' }}</h3>
          </div>
        </div>
        <div class="metric-footer">
          <span class="status-text-lbl">Status de Controle:</span>
          <span :class="['status-badge-val', latestGlucose?.status || 'normal']">
            {{ latestGlucose?.status === 'normal' ? 'Sob Controle' : 'Alerta Glicêmico' }}
          </span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <div>
            <span class="metric-label-txt">Frequência Cardíaca</span>
            <h3 class="metric-value-txt">{{ latestHeartRate ? latestHeartRate.value : 'N/A' }}</h3>
          </div>
        </div>
        <div class="metric-footer">
          <span class="status-text-lbl">Batimento observado:</span>
          <span class="status-badge-val normal">Regular</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <div>
            <span class="metric-label-txt">Análise de Peso</span>
            <h3 class="metric-value-txt">{{ latestWeight ? latestWeight.value : 'N/A' }}</h3>
          </div>
        </div>
        <div class="metric-footer">
          <span class="status-text-lbl">Sem Grandes Variações:</span>
          <span class="status-badge-val normal">Estável</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../../assets/styles/components/panel-tab.css';
</style>
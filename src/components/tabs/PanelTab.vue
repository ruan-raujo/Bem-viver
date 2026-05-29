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

    <div class="split-grid">
      <div class="card-container">
        <div class="card-title-row">
          <div class="card-title-heading-container">
            <img src="@/assets/images/pill.png" alt="meds icon" class="meds-icon" />
            <h3 class="card-heading-title">Remédios para Tomar Hoje</h3>
          </div>
          <span class="card-badge-count">
            {{ takenMedsToday }} de {{ medications.length }} tomados
          </span>
        </div>

        <div class="pill-med-list">
          <div 
            v-for="med in medications" 
            :key="med.id" 
            :class="['med-row-card', med.takenDates.includes('2026-05-27') ? 'taken' : '']"
          >
            <div class="med-info-left">
              <div class="med-icon-box">
                <img src="@/assets/images/registro.png" alt="schedule icon" class="schedule-icon" />
              </div>
              <div>
                <h4 class="med-detail-name">{{ med.name }} ({{ med.dosage }})</h4>
                <p class="med-detail-meta">Horário: {{ med.time }} · Frequência: {{ med.frequency }}</p>
              </div>
            </div>

            <button 
              type="button" 
              @click="toggleMedTaken(med.id)"
              :class="['btn-checkbox-pill', med.takenDates.includes('2026-05-27') ? 'taken' : '']"
            >
              <span class="material-symbols-outlined text-sm" v-if="med.takenDates.includes('2026-05-27')">check</span>
              <span>{{ med.takenDates.includes('2026-05-27') ? 'Tomado' : 'Marcar Tomado' }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="card-container">
        <div class="companion-adviser-card">
          <div>
            <div class="card-title-row">
              <div class="card-title-heading-container">
                <img src="@/assets/images/nutri.png" alt="advisor icon" class="advisor-icon" />
                <h3 class="card-heading-title">Dica da Nutricionista</h3>
              </div>
            </div>
            <div class="wisdom-box">
              "Dona Maria, reduzir o sal de cozinha e temperar as refeições com orégano, manjericão fresco, limão e hortelã realça muito mais o sabor dos alimentos, protegendo seu coração e impedindo picos súbitos na pressão arterial!"
            </div>
          </div>

          <div class="advisor-more-action">
            <button type="button" @click="currentTab = 'assistant'">
              <span>Fazer uma pergunta de saúde ao Assistente</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="alert-strip-row">
      <div class="appointment-strip">
        <div class="appointment-icon-box">
          <img src="@/assets/images/cali.png" alt="appointment icon" class="appointment-icon" />
        </div>
        <div>
          <span class="appointment-meta-lbl">Próxima Consulta Especialista</span>
          <h4 class="appointment-meta-title">{{ appointments[0].specialty }} com {{ appointments[0].doctor }}</h4>
          <span class="appointment-meta-desc">{{ appointments[0].datetime }} · {{ appointments[0].location }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../../assets/styles/components/panel-tab.css';
</style>
<script setup lang="ts">
import { ref } from 'vue';
import { useHealthData, type VitalRecord } from '../../composables/useHealthData';

const { vitals, showToast } = useHealthData();

// Estado dos filtros e controle do modal
const vitalsFilter = ref<string>('all');
const isAddVitalOpen = ref(false);

// Estado reativo dos campos do formulário
const newVitalType = ref<'blood_pressure' | 'glucose' | 'weight' | 'heart_rate'>('blood_pressure');
const newVitalValueSystolic = ref('120');
const newVitalValueDiastolic = ref('80');
const newVitalValueSingle = ref('');
const newVitalNotes = ref('');

// Tradução de termos técnicos para português amigável
const getLabelForType = (type: string) => {
  if (type === 'blood_pressure') return 'Pressão Arterial';
  if (type === 'glucose') return 'Glicemia (Açúcar)';
  if (type === 'heart_rate') return 'Batimentos';
  if (type === 'weight') return 'Peso';
  return type;
};

const handleAddVital = () => {
  let finalValue = '';
  let numeric = 0;
  let status: 'normal' | 'attention' | 'critical' = 'normal';

  if (newVitalType.value === 'blood_pressure') {
    const sys = parseInt(newVitalValueSystolic.value) || 120;
    const dia = parseInt(newVitalValueDiastolic.value) || 80;
    finalValue = `${sys}/${dia}`;
    numeric = sys;
    if (sys >= 145 || dia >= 95 || sys < 90) {
      status = 'critical';
    } else if (sys >= 130 || dia >= 85) {
      status = 'attention';
    }
  } else if (newVitalType.value === 'glucose') {
    const g = parseInt(newVitalValueSingle.value) || 90;
    finalValue = `${g} mg/dL`;
    numeric = g;
    if (g >= 140 || g < 70) {
      status = 'attention';
      if (g >= 180 || g < 55) {
        status = 'critical';
      }
    }
  } else if (newVitalType.value === 'heart_rate') {
    const hr = parseInt(newVitalValueSingle.value) || 72;
    finalValue = `${hr} bpm`;
    numeric = hr;
    if (hr > 100 || hr < 60) {
      status = 'attention';
      if (hr > 120 || hr < 50) {
        status = 'critical';
      }
    }
  } else {
    const w = parseFloat(newVitalValueSingle.value) || 74.0;
    finalValue = `${w} kg`;
    numeric = w;
    status = 'normal';
  }

  const newRecord: VitalRecord = {
    id: `v-${Date.now()}`,
    type: newVitalType.value,
    date: '2026-05-27 12:00', // Mantendo consistência com o ano simulado
    value: finalValue,
    numericValue: numeric,
    notes: newVitalNotes.value.trim() ? newVitalNotes.value.trim() : undefined,
    status: status
  };

  // Insere no início do array de medições globais
  vitals.value = [newRecord, ...vitals.value];
  isAddVitalOpen.value = false;

  // Reseta o formulário
  newVitalValueSingle.value = '';
  newVitalNotes.value = '';

  if (status === 'critical') {
    showToast(`Alerta: Novo registro classificado como CRÍTICO. Avisamos seu familiar por segurança.`);
  } else {
    showToast(`Anotação de ${getLabelForType(newVitalType.value)} salva com sucesso.`);
  }
};

const deleteVital = (id: string) => {
  if (confirm('Quer mesmo excluir esse registro?')) {
    vitals.value = vitals.value.filter(v => v.id !== id);
    showToast('Anotação de saúde excluída.');
  }
};
</script>

<template>
  <div class="vitals-tab-wrapper animate-panel">
    <div class="tab-header-row">
      <div class="tab-header-intro">
        <h2>Histórico de Medições de Saúde</h2>
        <p>Todos os dados anotados por você que auxiliam seus médicos no tratamento clínico.</p>
      </div>

      <button type="button" class="btn-add-action" @click="isAddVitalOpen = true">
        <span class="material-symbols-outlined">add</span>
        <span>Anotar Nova Medição</span>
      </button>
    </div>

    <!-- Filtros de Categorias -->
    <div class="filter-bar-container">
      <button 
        type="button" 
        :class="['btn-filter-tag', vitalsFilter === 'all' ? 'active' : '']"
        @click="vitalsFilter = 'all'"
      >
        Todas ({{ vitals.length }})
      </button>
      <button 
        type="button" 
        :class="['btn-filter-tag', vitalsFilter === 'blood_pressure' ? 'active' : '']"
        @click="vitalsFilter = 'blood_pressure'"
      >
        Pressão Arterial ({{ vitals.filter(v => v.type === 'blood_pressure').length }})
      </button>
      <button 
        type="button" 
        :class="['btn-filter-tag', vitalsFilter === 'glucose' ? 'active' : '']"
        @click="vitalsFilter = 'glucose'"
      >
        Glicemia ({{ vitals.filter(v => v.type === 'glucose').length }})
      </button>
      <button 
        type="button" 
        :class="['btn-filter-tag', vitalsFilter === 'heart_rate' ? 'active' : '']"
        @click="vitalsFilter = 'heart_rate'"
      >
        Frequência Cardíaca ({{ vitals.filter(v => v.type === 'heart_rate').length }})
      </button>
    </div>

    <!-- Lista de Registros -->
    <div class="vitals-list-container">
      <div 
        v-for="record in vitals.filter(v => vitalsFilter === 'all' || v.type === vitalsFilter)"
        :key="record.id" 
        class="vital-log-card"
      >
        <div class="vital-log-left">
          <div :class="['avatar-badge-icon', record.type]">
            <span class="material-symbols-outlined text-lg">
              {{ record.type === 'blood_pressure' ? 'favorite' : record.type === 'glucose' ? 'monitoring' : record.type === 'heart_rate' ? 'ecg' : 'scale' }}
            </span>
          </div>

          <div class="vital-log-info-box">
            <div class="vital-log-header-row">
              <span class="vital-log-title">{{ getLabelForType(record.type) }}</span>
              <span :class="['status-badge-val', record.status]">
                {{ record.status === 'normal' ? 'Normal' : record.status === 'attention' ? 'Atenção' : 'Ação Urgente' }}
              </span>
            </div>

            <span class="vital-log-score">{{ record.value }}</span>
            <span class="vital-log-time">Medido em: {{ record.date }}</span>

            <div v-if="record.notes" class="vital-log-notes">
              <strong>Anotação de Sintomas:</strong> {{ record.notes }}
            </div>
          </div>
        </div>

        <button 
          type="button" 
          class="btn-delete-row"
          @click="deleteVital(record.id)"
          title="Apagar este registro"
        >
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>

      <!-- Estado Vazio (Fallback) -->
      <div v-if="vitals.filter(v => vitalsFilter === 'all' || v.type === vitalsFilter).length === 0" class="empty-state-notice">
        <span class="material-symbols-outlined empty-icon">history</span>
        <h4 class="empty-title">Sem anotações registradas</h4>
        <p class="empty-subtitle">Clique no botão superior direito para lançar sua primeira medição.</p>
      </div>
    </div>

    <!-- MODAL LOCAL: ADICIONAR NOVO SINAL VITAL -->
    <div v-if="isAddVitalOpen" class="modal-overlay">
      <div class="modal-content-card">
        <div class="modal-header-row">
          <span class="modal-header-title">Adicionar Nova Medição</span>
          <button type="button" class="btn-modal-close" @click="isAddVitalOpen = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-form-body">
          <form @submit.prevent="handleAddVital">
            <div class="form-group">
              <label class="form-label" for="vitalTypeSelect">Tipo de Sinal Vital</label>
              <select id="vitalTypeSelect" v-model="newVitalType" class="form-input" style="padding-left: 16px;">
                <option value="blood_pressure">Pressão Arterial</option>
                <option value="glucose">Glicemia (Açúcar)</option>
                <option value="heart_rate">Frequência Cardíaca</option>
                <option value="weight">Peso Corporal</option>
              </select>
            </div>

            <!-- Formulário Condicional para Pressão Arterial -->
            <div v-if="newVitalType === 'blood_pressure'" class="form-split-metric">
              <div class="form-group">
                <label class="form-label" for="valSystolic">Sistólica (Máxima)</label>
                <input id="valSystolic" type="number" v-model="newVitalValueSystolic" class="form-input" style="padding-left: 16px;" required min="50" max="250" />
              </div>
              <div class="form-group">
                <label class="form-label" for="valDiastolic">Diastólica (Mínima)</label>
                <input id="valDiastolic" type="number" v-model="newVitalValueDiastolic" class="form-input" style="padding-left: 16px;" required min="30" max="150" />
              </div>
            </div>

            <!-- Entrada de Valor Único para os Outros Sinais -->
            <div v-else class="form-group">
              <label class="form-label" for="valSingleField">
                Valor da Medição (ex: {{ newVitalType === 'glucose' ? '105' : newVitalType === 'heart_rate' ? '75' : '74.5' }})
              </label>
              <input id="valSingleField" type="text" v-model="newVitalValueSingle" class="form-input" style="padding-left: 16px;" required placeholder="Apenas os números" />
            </div>

            <div class="form-group">
              <label class="form-label" for="vitalNote">Como você está se sentindo? (Opcional)</label>
              <textarea id="vitalNote" v-model="newVitalNotes" class="form-input" style="padding: 12px; height: 80px; resize: none;" placeholder="Exemplo: Sentindo leve dor de cabeça, medição em jejum..."></textarea>
            </div>

            <div class="modal-footer-row">
              <button type="button" class="btn-outline-cancel" @click="isAddVitalOpen = false">Cancelar</button>
              <button type="submit" class="btn-primary" style="width: auto; padding: 0 24px;">Salvar Registro</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../../assets/styles/components/vitals-tab.css';
@import '../../assets/styles/components/modals.css'; /* Reaproveita as estruturas de modal herdadas */

.animate-panel {
  animation: fadeIn 0.3s ease;
}
</style>
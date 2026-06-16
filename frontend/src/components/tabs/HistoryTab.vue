<script setup lang="ts">
import { ref, computed } from 'vue';
import { useHealthData } from '../../composables/useHealthData';

const { profile, vitals } = useHealthData();

const registroSelecionado = ref<any>(null);

const historicoRegistros = computed(() => {
  const grupos: Record<string, any> = {};

  vitals.value.forEach(vital => {
    const dataIso = vital.date;
    
    if (!grupos[dataIso]) {
      const d = new Date(dataIso);
      grupos[dataIso] = {
        id: dataIso,
        data_registro: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        horario: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        
        // Sinais Vitais
        pressao: '',
        glicemia: '',
        batimentos: '',
        peso: '',
        
        // Informações clínicas extraídas do novo formato do backend
        isDiabetico: false,
        tipoGlicemia: '',
        tomouInsulina: '',
        isHipertenso: false,
        sintomasHipertensao: [],
        adesaoMedica: '', // Tratado como booleano vindo do tomouMedicamentosHoje
        justificativaAdesao: '',
        qualidadeSono: '',
        observacoes: ''
      };
    }

    // Mapeia os dados desmembrados pelo composable de volta para o agrupamento visual do histórico
    if (vital.type === 'blood_pressure') {
      grupos[dataIso].pressao = vital.value;
    } else if (vital.type === 'glucose') {
      grupos[dataIso].glicemia = vital.numericValue;
    } else if (vital.type === 'heart_rate') {
      grupos[dataIso].batimentos = vital.numericValue;
    } else if (vital.type === 'weight') {
      grupos[dataIso].peso = vital.numericValue;
    }

    // Vincula os metadados do registro caso o objeto original da API os possua englobados
    // Nota: Como o composable itera sobre propriedades mapeadas, garantimos a persistência das regras contextuais abaixo
    if (vital.notes) {
      try {
        const meta = JSON.parse(vital.notes);
        grupos[dataIso].isDiabetico = meta.possuiDiabetes;
        grupos[dataIso].isHipertenso = meta.possuiHipertensao;
        grupos[dataIso].adesaoMedica = meta.tomouMedicamentosHoje ? 'total' : 'nenhuma';
        grupos[dataIso].qualidadeSono = meta.qualidadeSono;
      } catch (e) {
        // Fallback caso a propriedade notes contenha texto puro legível por humanos
        grupos[dataIso].qualidadeSono = grupos[dataIso].qualidadeSono || 'boa'; 
      }
    }
  });

  return Object.values(grupos).sort((a: any, b: any) => new Date(b.id).getTime() - new Date(a.id).getTime());
});

const selecionarRegistro = (registro: any) => {
  registroSelecionado.value = registro;
};

const voltarParaLista = () => {
  registroSelecionado.value = null;
};

const traduzirSintoma = (sintoma: string) => {
  const dicionario: Record<string, string> = {
    cefaleia: 'Dor de cabeça forte',
    tontura: 'Tontura ou fraqueza',
    visao_turva: 'Visão embaçada ou turva',
    dor_peito: 'Aperto ou dor no peito'
  };
  return dicionario[sintoma] || sintoma;
};

const traduzirGlicemia = (tipo: string) => {
  const dicionario: Record<string, string> = {
    jejum: 'Estava em Jejum',
    pre_prandial: 'Antes de uma refeição',
    pos_prandial: 'Após uma refeição (2h depois)'
  };
  return dicionario[tipo] || tipo;
};

const traduzirAdesao = (status: any) => {
  // Se o backend retornar booleano puro (do campo tomouMedicamentosHoje)
  if (status === true || status === 'total') return 'Sim, tomei todos corretamente';
  if (status === false || status === 'nenhuma') return 'Não tomei nenhum medicamento';
  if (status === 'parcial') return 'Tomei apenas alguns';
  return 'Não informado';
};

const traduzirSono = (qualidade: string) => {
  const dicionario: Record<string, string> = {
    excelente: 'Dormi muito bem / Sono reparador',
    boa: 'Boa',
    regular: 'Acordei algumas vezes / Sono regular',
    ruim: 'Tive insônia / Dormi muito mal'
  };
  return dicionario[qualidade] || qualidade;
};
</script>

<template>
  <div class="panel-content">
    
    <div v-if="!registroSelecionado">
      <div class="greeting-section">
        <div>
          <h2 class="greeting-text-title">Seu Histórico, {{ profile?.name }}</h2>
          <p class="greeting-text-subtitle">Selecione um dia abaixo para ver os detalhes do seu registro de saúde.</p>
        </div>
      </div>

      <div class="history-list-container">
        <div v-if="historicoRegistros.length === 0" class="empty-history">
          <i class="fas fa-folder-open"></i>
          <p>Nenhum registro de saúde encontrado.</p>
        </div>

        <div 
          v-else 
          v-for="registro in historicoRegistros" 
          :key="registro.id" 
          class="history-list-item"
          @click="selecionarRegistro(registro)"
        >
          <div class="item-left">
            <div class="calendar-badge">
              <i class="far fa-calendar-alt"></i>
            </div>
            <div class="item-date-info">
              <span class="item-date">{{ registro.data_registro }}</span>
              <span class="item-time">Registrado às {{ registro.horario }}</span>
            </div>
          </div>
          
          <div class="item-right">
            <div class="quick-summary-box">
              <span class="quick-summary">PA: {{ registro.pressao || 'N/A' }}</span>
              <span class="quick-summary">Glic: {{ registro.glicemia ? registro.glicemia + ' mg/dL' : 'N/A' }}</span>
            </div>
            <i class="fas fa-chevron-right arrow-icon"></i>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="details-view-container">
      
      <button class="btn-back" @click="voltarParaLista">
        <i class="fas fa-arrow-left"></i> Voltar para o histórico
      </button>

      <div class="detail-card">
        <div class="detail-card-header">
          <h3>Registro de Saúde — {{ registroSelecionado.data_registro }}</h3>
          <span class="detail-time">Horário do envio: {{ registroSelecionado.horario }}</span>
        </div>

        <div class="vitals-badge-grid">
          <div class="vital-item">
            <span class="vital-label">Pressão Arterial</span>
            <span class="vital-value text-blue">{{ registroSelecionado.pressao || 'N/A' }} <small>mmHg</small></span>
          </div>
          <div class="vital-item">
            <span class="vital-label">Sua Glicemia</span>
            <span class="vital-value text-green">{{ registroSelecionado.glicemia || 'N/A' }} <small>mg/dL</small></span>
          </div>
          <div class="vital-item">
            <span class="vital-label">Batimentos</span>
            <span class="vital-value text-red">{{ registroSelecionado.batimentos || 'N/A' }} <small>BPM</small></span>
          </div>
          <div class="vital-item">
            <span class="vital-label">Seu Peso</span>
            <span class="vital-value text-purple">{{ registroSelecionado.peso || 'N/A' }} <small>kg</small></span>
          </div>
        </div>

        <div class="card-details-section">
          
          <div v-if="registroSelecionado.isDiabetico === true || registroSelecionado.glicemia > 100" class="detail-tag diabetes-inline">
            <strong><i class="fas fa-notes-medical"></i> Controle de Diabetes:</strong> 
            Momento da medição: <span>{{ registroSelecionado.tipoGlicemia ? traduzirGlicemia(registroSelecionado.tipoGlicemia) : 'Não especificado' }}</span> | 
            Medicação/Insulina tomada: <span>{{ registroSelecionado.tomouInsulina === 'sim' ? 'Sim, conforme orientação' : 'Não informado' }}</span>
          </div>

          <div v-if="registroSelecionado.isHipertenso === true" class="detail-tag hipertensao-inline">
            <strong><i class="fas fa-heartbeat"></i> Controle de Hipertensão:</strong> 
            <span v-if="registroSelecionado.sintomasHipertensao && registroSelecionado.sintomasHipertensao.length > 0">
              Sintomas relatados: {{ registroSelecionado.sintomasHipertensao.map(traduzirSintoma).join(', ') }}
            </span>
            <span v-else>Nenhum sintoma crítico relatado nas últimas horas.</span>
          </div>

          <div class="general-details-row">
            <p><strong>Uso de Medicamentos:</strong> {{ traduzirAdesao(registroSelecionado.adesaoMedica) }}</p>
            <p><strong>Qualidade do Sono:</strong> {{ traduzirSono(registroSelecionado.qualidadeSono) }}</p>
            
            <p v-if="registroSelecionado.justificativaAdesao" class="full-row-text">
              <strong>Motivo de não tomar a medicação:</strong> <span class="text-alert">{{ registroSelecionado.justificativaAdesao }}</span>
            </p>
          </div>

          <div v-if="registroSelecionado.observacoes" class="notes-box">
            <strong>Relatos ou queixas adicionais sobre o dia:</strong>
            <p>{{ registroSelecionado.observacoes }}</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
@import '../../assets/styles/components/panel-tab.css';

/* Mantidos e otimizados todos os estilos fornecidos no seu escopo */
.history-list-container {
  margin-top: 24px;
  max-width: 850px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-list-item {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-list-item:hover {
  border-color: #3182ce;
  background-color: #f8fafc;
  transform: translateX(4px);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.calendar-badge {
  background: #ebf8ff;
  color: #3182ce;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.item-date-info {
  display: flex;
  flex-direction: column;
}

.item-date {
  font-weight: 700;
  font-size: 15px;
  color: #1e293b;
}

.item-time {
  font-size: 12px;
  color: #94a3b8;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quick-summary-box {
  display: flex;
  gap: 8px;
}

.quick-summary {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.arrow-icon {
  color: #cbd5e1;
  font-size: 14px;
}

.btn-back {
  background: none;
  border: none;
  color: #3182ce;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 0;
}

.btn-back:hover {
  text-decoration: underline;
}

.detail-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  max-width: 850px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card-header {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
}

.detail-card-header h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #1e293b;
}

.detail-time {
  font-size: 13px;
  color: #64748b;
}

.vitals-badge-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.vital-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #f1f5f9;
}

.vital-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
}

.vital-value {
  font-size: 20px;
  font-weight: 700;
}

.vital-value small {
  font-size: 11px;
  color: #94a3b8;
}

.text-blue { color: #3182ce; }
.text-green { color: #22c55e; }
.text-red { color: #e53e3e; }
.text-purple { color: #8b5cf6; }

.card-details-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-tag {
  padding: 12px;
  border-radius: 8px;
  font-size: 13.5px;
  color: #334155;
  border: 1px solid;
}

.diabetes-inline { background: #f0fdf4; border-color: #dcfce7; border-left: 4px solid #22c55e; }
.hipertensao-inline { background: #fff5f5; border-color: #fed7d7; border-left: 4px solid #e53e3e; }

.general-details-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 20px;
  font-size: 14px;
  color: #475569;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.general-details-row p { margin: 0; }
.full-row-text { grid-column: span 2; border-top: 1px dashed #cbd5e1; padding-top: 8px; margin-top: 4px; }
.text-alert { color: #c53030; font-weight: 600; }

.notes-box {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 14px;
  border-radius: 8px;
  font-size: 13.5px;
  color: #334155;
}

.notes-box p { margin: 6px 0 0 0; color: #475569; line-height: 1.5; }
.empty-history { text-align: center; padding: 40px; background: white; border-radius: 12px; color: #94a3b8; border: 1px solid #e2e8f0; }
.empty-history i { font-size: 48px; margin-bottom: 12px; }

@media (max-width: 600px) {
  .vitals-badge-grid { grid-template-columns: repeat(2, 1fr); }
  .general-details-row { grid-template-columns: 1fr; }
  .full-row-text { grid-column: span 1; }
}
</style>
<script setup lang="ts">
import { ref } from 'vue';
import { useHealthData } from '../../composables/useHealthData';

const { showToast } = useHealthData();

const form = ref({

  pressao: '',
  glicemia: '',
  batimentos: '',
  peso: '',
  

  isDiabetico: null as boolean | null,
  tipoGlicemia: '',
  tomouInsulina: '',
  
  isHipertenso: null as boolean | null,
  sintomasHipertensao: [] as string[],
  
 
  adesaoMedica: '',
  justificativaAdesao: '',
  nivelDor: 0,
  qualidadeSono: '',
  
  observacoes: ''
});

const submeterFormulario = () => {

  if (!form.value.pressao && !form.value.glicemia && !form.value.batimentos && !form.value.peso) {
    showToast('Por favor, preencha pelo menos um dos seus sinais vitais básicos.');
    return;
  }

  // axios.post('http://localhost:3000/api/meu-registro', form.value);
  
  console.log('Dados do paciente prontos para o Back-end:', form.value);

  showToast('Seus dados de saúde foram registrados com sucesso!');

  form.value = {
    pressao: '',
    glicemia: '',
    batimentos: '',
    peso: '',
    isDiabetico: null,
    tipoGlicemia: '',
    tomouInsulina: '',
    isHipertenso: null,
    sintomasHipertensao: [],
    adesaoMedica: '',
    justificativaAdesao: '',
    nivelDor: 0,
    qualidadeSono: '',
    observacoes: ''
  };
};
</script>

<template>
  <div class="panel-content">
    
    <div class="greeting-section">
      <div>
        <h2 class="greeting-text-title">Como você está hoje?</h2>
        <p class="greeting-text-subtitle">Registre suas medições e como está se sentindo para atualizar seu histórico de saúde.</p>
      </div>
    </div>

    <div class="form-card-container">
      <form @submit.prevent="submeterFormulario" class="clinical-form">
        
        <div class="form-section">
          <h3 class="section-title"><i class="fas fa-heartbeat"></i> 1. Minhas Medições</h3>
          <div class="form-grid">
            <div class="input-group">
              <label for="pressao">Sua Pressão Arterial</label>
              <div class="input-with-icon">
                <input type="text" id="pressao" v-model="form.pressao" placeholder="Ex: 12/8" />
                <span class="input-unit">mmHg</span>
              </div>
            </div>

            <div class="input-group">
              <label for="glicemia">Sua Glicemia</label>
              <div class="input-with-icon">
                <input type="number" id="glicemia" v-model="form.glicemia" placeholder="Ex: 95" />
                <span class="input-unit">mg/dL</span>
              </div>
            </div>

            <div class="input-group">
              <label for="batimentos">Seus Batimentos Cardíacos</label>
              <div class="input-with-icon">
                <input type="number" id="batimentos" v-model="form.batimentos" placeholder="Ex: 72" />
                <span class="input-unit">BPM</span>
              </div>
            </div>

            <div class="input-group">
              <label for="peso">Seu Peso Atual</label>
              <div class="input-with-icon">
                <input type="number" step="0.1" id="peso" v-model="form.peso" placeholder="Ex: 74.2" />
                <span class="input-unit">kg</span>
              </div>
            </div>
          </div>
        </div>

        <hr class="form-divider" />

        <div class="form-section">
          <h3 class="section-title"><i class="fas fa-notes-medical"></i> 2. Meu Histórico de Saúde</h3>
          
          <div class="form-grid">
            <div class="input-group dropdown-group">
              <label>Você possui diagnóstico de Diabetes?</label>
              <select v-model="form.isDiabetico" class="select-field">
                <option :value="null" disabled selected>Selecione uma opção</option>
                <option :value="true">Sim</option>
                <option :value="false">Não</option>
              </select>
            </div>

            <div class="input-group dropdown-group">
              <label>Você possui diagnóstico de Hipertensão?</label>
              <select v-model="form.isHipertenso" class="select-field">
                <option :value="null" disabled selected>Selecione uma opção</option>
                <option :value="true">Sim</option>
                <option :value="false">Não</option>
              </select>
            </div>
          </div>

          <div v-if="form.isDiabetico === true" class="dynamic-sub-card diabetes-theme">
            <h4><span class="badge-dot"></span> Detalhes sobre sua Glicemia</h4>
            <div class="form-grid mt-10">
              <div class="input-group">
                <label>Em qual momento você mediu?</label>
                <select v-model="form.tipoGlicemia">
                  <option value="" disabled>Selecione o momento</option>
                  <option value="jejum">Estava em Jejum</option>
                  <option value="pre_prandial">Antes de uma refeição</option>
                  <option value="pos_prandial">Após uma refeição (2h depois)</option>
                </select>
              </div>
              <div class="input-group">
                <label>Tomou sua insulina ou medicação hoje?</label>
                <select v-model="form.tomouInsulina">
                  <option value="" disabled>Selecione</option>
                  <option value="sim">Sim, conforme orientação</option>
                  <option value="nao">Não tomei hoje</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="form.isHipertenso === true" class="dynamic-sub-card hipertensao-theme">
            <h4><span class="badge-dot alert"></span> Como você está se sentindo?</h4>
            <label class="checkbox-section-label">Marque se você sentiu algum destes sintomas nas últimas horas:</label>
            <div class="checkbox-grid">
              <label class="checkbox-item"><input type="checkbox" value="cefaleia" v-model="form.sintomasHipertensao" /> Dor de cabeça forte</label>
              <label class="checkbox-item"><input type="checkbox" value="tontura" v-model="form.sintomasHipertensao" /> Tontura ou fraqueza</label>
              <label class="checkbox-item"><input type="checkbox" value="visao_turva" v-model="form.sintomasHipertensao" /> Visão embaçada ou turva</label>
              <label class="checkbox-item"><input type="checkbox" value="dor_peito" v-model="form.sintomasHipertensao" /> Aperto ou dor no peito</label>
            </div>
          </div>
        </div>

        <hr class="form-divider" />

        <div class="form-section">
          <h3 class="section-title"><i class="fas fa-pills"></i> 3. Minha Rotina e Bem-Estar</h3>
          
          <div class="form-grid">
            <div class="input-group">
              <label>Você tomou seus medicamentos hoje?</label>
              <select v-model="form.adesaoMedica">
                <option value="" disabled>Selecione a situação</option>
                <option value="total">Sim, tomei todos corretamente</option>
                <option value="parcial">Tomei apenas alguns</option>
                <option value="nenhuma">Não tomei nenhum medicamento</option>
              </select>
            </div>

            <div class="input-group">
              <label>Como foi a qualidade do seu sono esta noite?</label>
              <select v-model="form.qualidadeSono">
                <option value="" disabled>Selecione a avaliação</option>
                <option value="excelente">Dormi muito bem / Sono reparador</option>
                <option value="regular">Acordei algumas vezes / Sono regular</option>
                <option value="insonia">Tive insônia / Dormi muito mal</option>
              </select>
            </div>
          </div>

          <div v-if="form.adesaoMedica === 'parcial' || form.adesaoMedica === 'nenhuma'" class="input-group full-width mt-15 animate-input">
            <label for="justificativa" class="alert-label-text">Conte-nos o motivo de não ter tomado os medicamentos:</label>
            <input type="text" id="justificativa" v-model="form.justificativaAdesao" placeholder="Ex: Esqueci, o remédio acabou, tive efeitos colaterais..." />
          </div>
        </div>

        <hr class="form-divider" />

        <div class="input-group full-width">
          <label for="observacoes">Quer relatar mais alguma coisa sobre como se sente?</label>
          <textarea id="observacoes" v-model="form.observacoes" placeholder="Escreva aqui se tiver outros sintomas, queixas ou comentários sobre o seu dia..." rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit-health">
            <img src="@/assets/images/prancheta.png" alt="icon" width="20" class="btn-icon-white" />
            <span>Salvar Meu Registro</span>
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<style scoped>
@import '../../assets/styles/components/panel-tab.css';

.form-card-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  margin-top: 24px;
  max-width: 850px;
}

.clinical-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.section-title i {
  color: #3182ce;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group.full-width {
  grid-column: span 2;
}

label {
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

input, textarea, select {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14.5px;
  background-color: #f8fafc;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

input:focus, textarea:focus, select:focus {
  border-color: #3182ce;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.12);
}

.input-unit {
  position: absolute;
  right: 14px;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  pointer-events: none;
}

input {
  padding-right: 75px;
}

.dynamic-sub-card {
  grid-column: span 2;
  padding: 18px;
  border-radius: 10px;
  border-left: 4px solid;
  margin-top: 5px;
}

.diabetes-theme {
  background-color: #f0fdf4;
  border-color: #22c55e;
  border-top: 1px solid #dcfce7;
  border-right: 1px solid #dcfce7;
  border-bottom: 1px solid #dcfce7;
}

.hipertensao-theme {
  background-color: #fff5f5;
  border-color: #e53e3e;
  border-top: 1px solid #fed7d7;
  border-right: 1px solid #fed7d7;
  border-bottom: 1px solid #fed7d7;
}

.dynamic-sub-card h4 {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
}

.badge-dot.alert {
  background-color: #e53e3e;
}

.checkbox-section-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 13.5px;
  cursor: pointer;
  color: #334155;
}

.checkbox-item input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.form-divider {
  border: 0;
  height: 1px;
  background: #e2e8f0;
  margin: 10px 0;
}

.mt-10 { margin-top: 10px; }
.mt-15 { margin-top: 15px; }
.mt-20 { margin-top: 20px; }

.alert-label-text {
  color: #c53030;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.btn-submit-health {
  background-color: #3182ce;
  color: #ffffff;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s;
}

.btn-submit-health:hover {
  background-color: #2b6cb0;
}

.btn-icon-white {
  filter: brightness(0) invert(1);
}

@media (max-width: 768px) {
  .form-grid, .checkbox-grid {
    grid-template-columns: 1fr;
  }
  .input-group.full-width, .dynamic-sub-card {
    grid-column: span 1;
  }
}
</style>
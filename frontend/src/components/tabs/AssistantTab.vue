<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useHealthData, type VitalRecord } from '../../composables/useHealthData';

const { showToast, vitals } = useHealthData();

const form = ref({
  pressaoArterial: '',
  glicemia: null as number | null,
  frequenciaCardiaca: null as number | null,
  peso: null as number | null,
  possuiDiabetes: null as boolean | null,
  possuiHipertensao: null as boolean | null,
  tomouMedicamentosHoje: null as boolean | null,
  qualidadeSono: '',
  
  tipoGlicemia: '',
  tomouInsulina: '',
  sintomasHipertensao: [] as string[],
  justificativaAdesao: '',
  observacoes: ''
});

const submeterFormulario = async () => {
  if (
    !form.value.pressaoArterial || 
    form.value.glicemia === null || 
    form.value.frequenciaCardiaca === null || 
    form.value.peso === null ||
    form.value.tomouMedicamentosHoje === null ||
    !form.value.qualidadeSono
  ) {
    showToast('Por favor, preencha todos os campos obrigatórios (*).');
    return;
  }

  try {
    const token = localStorage.getItem('tokenBemViver');
    
    if (!token) {
      showToast('Sessão inválida. Por favor, faça login novamente.');
      return;
    }

    const payloadBase64 = token.split('.')[1];
    const tokenDados = JSON.parse(atob(payloadBase64));
    const userId = tokenDados._id || tokenDados.id;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const payloadBackend = {
      userId: userId,
      pressaoArterial: form.value.pressaoArterial,
      glicemia: Number(form.value.glicemia),
      frequenciaCardiaca: Number(form.value.frequenciaCardiaca),
      peso: Number(form.value.peso),
      possuiDiabetes: form.value.possuiDiabetes ?? false,
      possuiHipertensao: form.value.possuiHipertensao ?? false,
      tomouMedicamentosHoje: form.value.tomouMedicamentosHoje,
      qualidadeSono: form.value.qualidadeSono
    };

    await axios.post('http://localhost:3000/api/registros', payloadBackend, config);

    const dataAtual = new Date().toISOString();

    vitals.value.push({ type: 'blood_pressure', date: dataAtual, value: form.value.pressaoArterial, numericValue: 0, status: 'normal' } as VitalRecord);
    vitals.value.push({ type: 'glucose', date: dataAtual, value: form.value.glicemia + ' mg/dL', numericValue: Number(form.value.glicemia), status: 'normal' } as VitalRecord);
    vitals.value.push({ type: 'heart_rate', date: dataAtual, value: form.value.frequenciaCardiaca + ' BPM', numericValue: Number(form.value.frequenciaCardiaca), status: 'normal' } as VitalRecord);
    vitals.value.push({ type: 'weight', date: dataAtual, value: form.value.peso + ' kg', numericValue: Number(form.value.peso), status: 'normal' } as VitalRecord);

    showToast('Tudo certo! Registro salvo com sucesso.');

    form.value = {
      pressaoArterial: '',
      glicemia: null,
      frequenciaCardiaca: null,
      peso: null,
      possuiDiabetes: null,
      possuiHipertensao: null,
      tomouMedicamentosHoje: null,
      qualidadeSono: '',
      tipoGlicemia: '',
      tomouInsulina: '',
      sintomasHipertensao: [],
      justificativaAdesao: '',
      observacoes: ''
    };

  } catch (error: any) {
    console.error('Erro ao salvar no servidor:', error);
    const mensagemErro = error.response?.data?.message || 'Erro ao salvar o registro. Verifique a ligação ao servidor.';
    showToast(mensagemErro);
  }
};
</script>

<template>
  <div class="panel-content">
    
    <div class="greeting-section">
      <div class="greeting-header">
        <h2 class="greeting-text-title">Como você está hoje?</h2>
        <p class="greeting-text-subtitle">Registre suas medições e rotinas diárias para manter seu histórico clínico impecável.</p>
      </div>
    </div>

    <div class="form-card-container">
      <form @submit.prevent="submeterFormulario" class="clinical-form">
        
        <div class="form-section">
          <div class="section-header">
            <div class="icon-wrapper blue-icon">
              <i class="fas fa-heartbeat"></i>
            </div>
            <h3 class="section-title">1. Minhas Medições</h3>
          </div>
          
          <div class="form-grid">
            <div class="input-group">
              <label for="pressao">Sua Pressão Arterial <span class="required-dot">*</span></label>
              <div class="input-with-icon">
                <input type="text" id="pressao" v-model="form.pressaoArterial" placeholder="Ex: 12/8" required />
                <span class="input-unit">mmHg</span>
              </div>
            </div>

            <div class="input-group">
              <label for="glicemia">Sua Glicemia <span class="required-dot">*</span></label>
              <div class="input-with-icon">
                <input type="number" id="glicemia" v-model="form.glicemia" placeholder="Ex: 95" required />
                <span class="input-unit">mg/dL</span>
              </div>
            </div>

            <div class="input-group">
              <label for="batimentos">Seus Batimentos Cardíacos <span class="required-dot">*</span></label>
              <div class="input-with-icon">
                <input type="number" id="batimentos" v-model="form.frequenciaCardiaca" placeholder="Ex: 72" required />
                <span class="input-unit">BPM</span>
              </div>
            </div>

            <div class="input-group">
              <label for="peso">Seu Peso Atual <span class="required-dot">*</span></label>
              <div class="input-with-icon">
                <input type="number" step="0.1" id="peso" v-model="form.peso" placeholder="Ex: 74.2" required />
                <span class="input-unit">kg</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <div class="icon-wrapper teal-icon">
              <i class="fas fa-notes-medical"></i>
            </div>
            <h3 class="section-title">2. Meu Histórico de Saúde</h3>
          </div>
          
          <div class="form-grid">
            <div class="input-group dropdown-group">
              <label>Você possui diagnóstico de Diabetes?</label>
              <div class="select-wrapper">
                <select v-model="form.possuiDiabetes" class="select-field">
                  <option :value="null" disabled selected>Selecione uma opção</option>
                  <option :value="true">Sim, possuo</option>
                  <option :value="false">Não possuo</option>
                </select>
              </div>
            </div>

            <div class="input-group dropdown-group">
              <label>Você possui diagnóstico de Hipertensão?</label>
              <div class="select-wrapper">
                <select v-model="form.possuiHipertensao" class="select-field">
                  <option :value="null" disabled selected>Selecione uma opção</option>
                  <option :value="true">Sim, possuo</option>
                  <option :value="false">Não possuo</option>
                </select>
              </div>
            </div>
          </div>

          <Transition name="fade-slide">
            <div v-if="form.possuiDiabetes === true" class="dynamic-sub-card diabetes-theme">
              <div class="card-inner-header">
                <span class="badge-dot"></span>
                <h4>Detalhes sobre sua Glicemia</h4>
              </div>
              <div class="form-grid mt-10">
                <div class="input-group">
                  <label>Em qual momento você mediu?</label>
                  <div class="select-wrapper">
                    <select v-model="form.tipoGlicemia">
                      <option value="" disabled>Selecione o momento</option>
                      <option value="jejum">Estava em Jejum</option>
                      <option value="pre_prandial">Antes de uma refeição</option>
                      <option value="pos_prandial">Após uma refeição (2h depois)</option>
                    </select>
                  </div>
                </div>
                <div class="input-group">
                  <label>Tomou sua insulina ou medicação hoje?</label>
                  <div class="select-wrapper">
                    <select v-model="form.tomouInsulina">
                      <option value="" disabled>Selecione</option>
                      <option value="sim">Sim, conforme orientação</option>
                      <option value="nao">Não tomei hoje</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <Transition name="fade-slide">
            <div v-if="form.possuiHipertensao === true" class="dynamic-sub-card hipertensao-theme">
              <div class="card-inner-header">
                <span class="badge-dot alert"></span>
                <h4>Como você está se sentindo?</h4>
              </div>
              <label class="checkbox-section-label">Marque se você sentiu algum destes sintomas nas últimas horas:</label>
              <div class="checkbox-grid">
                <label class="checkbox-item">
                  <input type="checkbox" value="cefaleia" v-model="form.sintomasHipertensao" />
                  <span class="custom-checkbox"></span>
                  Dor de cabeça forte
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" value="tontura" v-model="form.sintomasHipertensao" />
                  <span class="custom-checkbox"></span>
                  Tontura ou fraqueza
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" value="visao_turva" v-model="form.sintomasHipertensao" />
                  <span class="custom-checkbox"></span>
                  Visão embaçada ou turva
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" value="dor_peito" v-model="form.sintomasHipertensao" />
                  <span class="custom-checkbox"></span>
                  Aperto ou dor no peito
                </label>
              </div>
            </div>
          </Transition>
        </div>

        <div class="form-section">
          <div class="section-header">
            <div class="icon-wrapper purple-icon">
              <i class="fas fa-pills"></i>
            </div>
            <h3 class="section-title">3. Minha Rotina e Bem-Estar</h3>
          </div>
          
          <div class="form-grid">
            <div class="input-group">
              <label>Você tomou seus medicamentos hoje? <span class="required-dot">*</span></label>
              <div class="select-wrapper">
                <select v-model="form.tomouMedicamentosHoje" required>
                  <option :value="null" disabled>Selecione a situação</option>
                  <option :value="true">Sim, tomei todos corretamente</option>
                  <option :value="false">Não tomei / Tomei apenas alguns</option>
                </select>
              </div>
            </div>

            <div class="input-group">
              <label>Como foi a qualidade do seu sono esta noite? <span class="required-dot">*</span></label>
              <div class="select-wrapper">
                <select v-model="form.qualidadeSono" required>
                  <option value="" disabled>Selecione a avaliação</option>
                  <option value="excelente">Dormi muito bem / Sono reparador</option>
                  <option value="boa">Boa</option>
                  <option value="regular">Acordei algumas vezes / Sono regular</option>
                  <option value="ruim">Tive insônia / Dormi muito mal</option>
                </select>
              </div>
            </div>
          </div>

          <Transition name="fade-slide">
            <div v-if="form.tomouMedicamentosHoje === false" class="input-group full-width mt-15">
              <label for="justificativa" class="alert-label-text">Conte-nos o motivo de não ter tomado os medicamentos:</label>
              <input type="text" id="justificativa" v-model="form.justificativaAdesao" placeholder="Ex: Esqueci, remédio acabou, efeitos colaterais..." />
            </div>
          </Transition>
        </div>

        <div class="input-group full-width mt-10">
          <label for="observacoes">Quer relatar mais alguma coisa sobre como se sente?</label>
          <textarea id="observacoes" v-model="form.observacoes" placeholder="Escreva aqui se tiver outros sintomas, queixas ou comentários sobre o seu dia..." rows="4"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit-health">
            <img src="@/assets/images/prancheta.png" alt="icon" width="18" class="btn-icon-white" />
            <span>Salvar Registro Clínico</span>
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<style scoped>
@import '../../assets/styles/components/panel-tab.css';

/* CONTAINER PRINCIPAL E ESTRUTURA GLOBAL */
.panel-content {
  padding: 16px;
  max-width: 100%;
  margin: 0 auto;
}

.greeting-section {
  margin-bottom: 24px;
}

.greeting-text-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin-bottom: 6px;
}

.greeting-text-subtitle {
  font-size: 15px;
  color: #64748b;
  line-height: 1.5;
}

/* CARTÃO PRINCIPAL */
.form-card-container {
  background: #ffffff;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  max-width: 850px;
  margin: 0 auto;
}

.clinical-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* CABEÇALHOS DAS SECÇÕES */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f8fafc;
}

.icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.blue-icon { background: #eff6ff; color: #2563eb; }
.teal-icon { background: #f0fdfa; color: #0d9488; }
.purple-icon { background: #faf5ff; color: #7c3aed; }

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* GRIDS RESPONSIVOS DE VERDADE */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

label {
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
}

.required-dot {
  color: #ef4444;
  margin-left: 3px;
}

/* CAMPOS DE INPUT E COMPONENTES */
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

input, textarea, select {
  width: 100%;
  padding: 13px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 15px;
  color: #334155;
  background-color: #ffffff;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  -webkit-appearance: none; /* Remove estilos do iOS */
}

input:focus, textarea:focus, select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.input-unit {
  position: absolute;
  right: 16px;
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  pointer-events: none;
}

input {
  padding-right: 75px;
}

/* TRATAMENTO PREMIUM DE SELECTS (DROPDOWNS) */
.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper::after {
  content: '\f078';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  font-size: 12px;
  color: #64748b;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

select {
  padding-right: 40px;
  cursor: pointer;
}

textarea {
  resize: vertical;
  line-height: 1.5;
}

/* CARDS CLÍNICOS DINÂMICOS */
.dynamic-sub-card {
  grid-column: 1 / -1;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid transparent;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01);
}

.card-inner-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.card-inner-header h4 {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.diabetes-theme {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
}

.diabetes-theme .badge-dot {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
}

.hipertensao-theme {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.hipertensao-theme .badge-dot.alert {
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
}

.checkbox-section-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
  display: block;
}

/* CUSTOM CHECKBOXES PARA MOBILE (FÁCIL TOQUE) */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.checkbox-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  color: #334155;
  background: #ffffff;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  user-select: none;
}

.checkbox-item input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  display: inline-block;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-item:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.checkbox-item input:checked ~ .custom-checkbox {
  background-color: #2563eb;
  border-color: #2563eb;
}

.checkbox-item input:checked ~ .custom-checkbox::after {
  content: "";
  display: block;
  margin-left: 6px;
  margin-top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-item input:checked {
  background: #eff6ff;
}

/* DIVISORES AUTOMÁTICOS COM MARGENS */
.form-divider {
  display: none; /* Removido para manter o fluxo limpo por sessões em caixas */
}

.mt-10 { margin-top: 10px; }
.mt-15 { margin-top: 15px; }

.alert-label-text {
  color: #dc2626;
  font-weight: 600;
}

/* BOTÃO DE SUBMISSÃO ESTILO PREMIUM */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn-submit-health {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  padding: 16px 32px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%; /* Mobile first: Ocupa toda a largura da tela */
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1);
  transition: all 0.25s ease;
}

.btn-submit-health:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.25);
}

.btn-submit-health:active {
  transform: translateY(1px);
}

.btn-icon-white {
  filter: brightness(0) invert(1);
}

/* ANIMAÇÃO DE ENTRADA SUAVE (TRANSITION DO VUE) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* RESPONSIVIDADE EM SCREENS MAIORES (DESKTOP / TABLET) */
@media (min-width: 640px) {
  .panel-content {
    padding: 32px;
  }
  
  .form-card-container {
    padding: 32px;
  }

  .btn-submit-health {
    width: auto; /* Em telas maiores volta a ter tamanho próprio */
  }
}
</style>
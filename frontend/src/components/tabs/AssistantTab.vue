<script setup lang="ts">
import { reactive } from 'vue';

const form = reactive({
  pressaoArterial: '',
  glicemia: null as number | null,
  frequenciaCardiaca: null as number | null,
  peso: null as number | null,
  possuiDiabetes: null as boolean | null,
  possuiHipertensao: null as boolean | null,
  tipoGlicemia: '',
  tomouInsulina: '',
  sintomasHipertensao: [] as string[],
  tomouMedicamentosHoje: null as boolean | null,
  qualidadeSono: '',
  justificativaAdesao: '',
  observacoes: ''
});

const submeterFormulario = () => {
  const payload = {
    ...form,
    glicemia: form.glicemia === null ? undefined : form.glicemia,
    frequenciaCardiaca: form.frequenciaCardiaca === null ? undefined : form.frequenciaCardiaca,
    peso: form.peso === null ? undefined : form.peso
  };

  console.log('Registro de saúde enviado:', payload);
};
</script>

<template>
  <div class="panel-content">
    
    <div class="greeting-section">
      <div class="greeting-header">
        <h2 class="greeting-text-title">Como você está hoje?</h2>
        <p class="greeting-text-subtitle">Registre suas medições e como está se sentindo para manter seu histórico atualizado.</p>
      </div>
    </div>

    <div class="form-card-container">
      <form @submit.prevent="submeterFormulario" class="clinical-form">
        
        <div class="form-section">
          <h3 class="section-title">
            <span class="icon-wrapper blue"><i class="fas fa-heartbeat"></i></span> 
            Minhas Medições
          </h3>
          <div class="form-grid">
            <div class="input-group">
              <label for="pressao">Pressão Arterial <span class="required">*</span></label>
              <div class="input-with-icon">
                <input type="text" id="pressao" v-model="form.pressaoArterial" placeholder="Ex: 120/80" required />
                <span class="input-unit">mmHg</span>
              </div>
            </div>

            <div class="input-group">
              <label for="glicemia">Glicemia <span class="required">*</span></label>
              <div class="input-with-icon">
                <input type="number" id="glicemia" v-model="form.glicemia" placeholder="Ex: 95" required />
                <span class="input-unit">mg/dL</span>
              </div>
            </div>

            <div class="input-group">
              <label for="batimentos">Frequência Cardíaca <span class="required">*</span></label>
              <div class="input-with-icon">
                <input type="number" id="batimentos" v-model="form.frequenciaCardiaca" placeholder="Ex: 72" required />
                <span class="input-unit">BPM</span>
              </div>
            </div>

            <div class="input-group">
              <label for="peso">Peso Atual <span class="required">*</span></label>
              <div class="input-with-icon">
                <input type="number" step="0.1" id="peso" v-model="form.peso" placeholder="Ex: 74.2" required />
                <span class="input-unit">kg</span>
              </div>
            </div>
          </div>
        </div>

        <hr class="form-divider" />

        <div class="form-section">
          <h3 class="section-title">
            <span class="icon-wrapper teal"><i class="fas fa-notes-medical"></i></span> 
            Meu Histórico de Saúde
          </h3>
          
          <div class="form-grid">
            <div class="input-group dropdown-group">
              <label>Possui diagnóstico de Diabetes?</label>
              <div class="select-wrapper">
                <select v-model="form.possuiDiabetes" class="select-field">
                  <option :value="null" disabled selected>Selecione uma opção</option>
                  <option :value="true">Sim</option>
                  <option :value="false">Não</option>
                </select>
              </div>
            </div>

            <div class="input-group dropdown-group">
              <label>Possui diagnóstico de Hipertensão?</label>
              <div class="select-wrapper">
                <select v-model="form.possuiHipertensao" class="select-field">
                  <option :value="null" disabled selected>Selecione uma opção</option>
                  <option :value="true">Sim</option>
                  <option :value="false">Não</option>
                </select>
              </div>
            </div>
          </div>

          <Transition name="slide-fade">
            <div v-if="form.possuiDiabetes === true" class="dynamic-sub-card diabetes-theme">
              <h4><span class="badge-dot green"></span> Detalhes da Glicemia</h4>
              <div class="form-grid mt-10">
                <div class="input-group">
                  <label>Momento da medição</label>
                  <select v-model="form.tipoGlicemia">
                    <option value="" disabled>Selecione o momento</option>
                    <option value="jejum">Em Jejum</option>
                    <option value="pre_prandial">Antes da refeição</option>
                    <option value="pos_prandial">Após a refeição (2h)</option>
                  </select>
                </div>
                <div class="input-group">
                  <label>Tomou insulina/medicação hoje?</label>
                  <select v-model="form.tomouInsulina">
                    <option value="" disabled>Selecione</option>
                    <option value="sim">Sim, conforme orientação</option>
                    <option value="nao">Não tomei hoje</option>
                  </select>
                </div>
              </div>
            </div>
          </Transition>

          <Transition name="slide-fade">
            <div v-if="form.possuiHipertensao === true" class="dynamic-sub-card hipertensao-theme">
              <h4><span class="badge-dot red"></span> Monitoramento de Sintomas</h4>
              <label class="checkbox-section-label">Sentiu algum destes sintomas nas últimas horas?</label>
              <div class="checkbox-grid">
                <label class="checkbox-item">
                  <input type="checkbox" value="cefaleia" v-model="form.sintomasHipertensao" /> 
                  <span class="checkbox-text">Dor de cabeça forte</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" value="tontura" v-model="form.sintomasHipertensao" /> 
                  <span class="checkbox-text">Tontura ou fraqueza</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" value="visao_turva" v-model="form.sintomasHipertensao" /> 
                  <span class="checkbox-text">Visão embaçada</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" value="dor_peito" v-model="form.sintomasHipertensao" /> 
                  <span class="checkbox-text">Aperto ou dor no peito</span>
                </label>
              </div>
            </div>
          </Transition>
        </div>

        <hr class="form-divider" />

        <div class="form-section">
          <h3 class="section-title">
            <span class="icon-wrapper purple"><i class="fas fa-pills"></i></span> 
            Rotina e Bem-Estar
          </h3>
          
          <div class="form-grid">
            <div class="input-group">
              <label>Tomou seus medicamentos hoje? <span class="required">*</span></label>
              <select v-model="form.tomouMedicamentosHoje" required>
                <option :value="null" disabled>Selecione a situação</option>
                <option :value="true">Sim, tomei todos corretamente</option>
                <option :value="false">Não tomei / Tomei apenas alguns</option>
              </select>
            </div>

            <div class="input-group">
              <label>Qualidade do sono esta noite <span class="required">*</span></label>
              <select v-model="form.qualidadeSono" required>
                <option value="" disabled>Selecione a avaliação</option>
                <option value="excelente">Excelente / Reparador</option>
                <option value="boa">Boa</option>
                <option value="regular">Regular / Acordei algumas vezes</option>
                <option value="ruim">Ruim / Insônia</option>
              </select>
            </div>
          </div>

          <Transition name="slide-fade">
            <div v-if="form.tomouMedicamentosHoje === false" class="input-group full-width mt-15 alert-input-group">
              <label for="justificativa" class="alert-label-text">Motivo de não ter tomado os medicamentos:</label>
              <input type="text" id="justificativa" v-model="form.justificativaAdesao" placeholder="Ex: Esqueci, o remédio acabou, efeitos colaterais..." />
            </div>
          </Transition>
        </div>

        <hr class="form-divider" />

        <div class="input-group full-width">
          <label for="observacoes">Observações adicionais (Opcional)</label>
          <textarea id="observacoes" v-model="form.observacoes" placeholder="Relate aqui outros sintomas, queixas ou comentários sobre o seu dia..." rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit-health">
            <img src="@/assets/images/prancheta.png" alt="icon" width="20" class="btn-icon-white" />
            <span>Salvar Registro Clínico</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped>
/* @import '../../assets/styles/components/panel-tab.css'; Manter se necessário */

.panel-content {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  color: #0f172a;
}

.greeting-section {
  margin-bottom: 24px;
}

.greeting-text-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.greeting-text-subtitle {
  color: #64748b;
  font-size: 15px;
}

.form-card-container {
  background: #ffffff;
  border-radius: 20px;
  padding: 36px 40px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid #f1f5f9;
  margin-top: 24px;
  max-width: 850px;
}

.clinical-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 14px;
}

.icon-wrapper.blue { background: #e0f2fe; color: #0284c7; }
.icon-wrapper.teal { background: #ccfbf1; color: #0f766e; }
.icon-wrapper.purple { background: #f3e8ff; color: #7e22ce; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group.full-width {
  grid-column: span 2;
}

label {
  font-size: 13.5px;
  font-weight: 500;
  color: #475569;
}

.required {
  color: #e11d48;
  margin-left: 2px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

input[type="text"], 
input[type="number"], 
textarea, 
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14.5px;
  color: #1e293b;
  background-color: #f8fafc;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.01);
}

/* Estado de Foco Elegante */
input:focus, textarea:focus, select:focus {
  border-color: #0ea5e9;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
}

input::placeholder, textarea::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.input-unit {
  position: absolute;
  right: 16px;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  pointer-events: none;
  background-color: transparent;
}

.input-with-icon input {
  padding-right: 80px;
}

/* Cards Dinâmicos (Subseções) */
.dynamic-sub-card {
  grid-column: span 2;
  padding: 24px;
  border-radius: 14px;
  border-left: 4px solid;
  margin-top: 8px;
}

.diabetes-theme {
  background-color: #f0fdf4; /* Emerald 50 */
  border-color: #10b981;     /* Emerald 500 */
  border-top: 1px solid #dcfce7;
  border-right: 1px solid #dcfce7;
  border-bottom: 1px solid #dcfce7;
}

.hipertensao-theme {
  background-color: #fff1f2; /* Rose 50 */
  border-color: #e11d48;     /* Rose 600 */
  border-top: 1px solid #ffe4e6;
  border-right: 1px solid #ffe4e6;
  border-bottom: 1px solid #ffe4e6;
}

.dynamic-sub-card h4 {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.badge-dot.green { background-color: #10b981; }
.badge-dot.red { background-color: #e11d48; }

.checkbox-section-label {
  font-size: 13.5px;
  color: #475569;
  margin-bottom: 12px;
  display: block;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  color: #334155;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s;
}

.checkbox-item:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

/* Customização da cor do checkbox */
.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #e11d48; /* Combina com o tema de hipertensão */
}

.form-divider {
  border: 0;
  height: 1px;
  background: #f1f5f9;
  margin: 8px 0;
}

.mt-10 { margin-top: 10px; }
.mt-15 { margin-top: 15px; }

.alert-label-text {
  color: #be123c; /* Rose 700 */
}

.alert-input-group input:focus {
  border-color: #f43f5e;
  box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.15);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn-submit-health {
  background-color: #0ea5e9; /* Sky 500 */
  color: #ffffff;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -2px rgba(14, 165, 233, 0.1);
}

.btn-submit-health:hover {
  background-color: #0284c7; /* Sky 600 */
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -1px rgba(14, 165, 233, 0.3), 0 2px 4px -2px rgba(14, 165, 233, 0.15);
}

.btn-submit-health:active {
  transform: translateY(0);
}

.btn-icon-white {
  filter: brightness(0) invert(1);
}

/* Animações para exibir/ocultar os cards dinâmicos */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media (max-width: 768px) {
  .form-card-container {
    padding: 24px;
  }
  .form-grid, .checkbox-grid {
    grid-template-columns: 1fr;
  }
  .input-group.full-width, .dynamic-sub-card {
    grid-column: span 1;
  }
  .btn-submit-health {
    width: 100%;
    justify-content: center;
  }
}
</style>
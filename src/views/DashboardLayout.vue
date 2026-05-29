<script setup lang="ts">
import { useHealthData } from '../composables/useHealthData';
import PanelTab from '../components/tabs/PanelTab.vue';

// IMPORTANTE: Para que a alternância funcione por completo, certifique-se de importar 
// as outras abas conforme criar os arquivos (VitalsTab, MedsTab, etc.)
// import VitalsTab from './VitalsTab.vue';
// import MedsTab from './MedsTab.vue';
// import AssistantTab from './AssistantTab.vue';
// import SupportTab from './SupportTab.vue';

const { isLoggedIn, currentTab, profile } = useHealthData();
</script>

<template>
  <div class="logged-area">
    <header class="dashboard-header">
      <div class="header-brand">
       <img src="@/assets/images/logo.png" alt="logo" class="logo-header" />
        <div class="header-text-container">
          <span class="header-sub">Ambiente Clínico Ativo</span>
          <span class="header-title">Bem-Viver</span>
        </div>
      </div>

      <div class="header-right">
        <div class="user-text-block">
          <span class="user-name">{{ profile.name }}</span>
        </div>
        <div class="user-avatar-circle">
          <img src="@/assets/images/person.png" alt="avatar" class="avatar" />
        </div>
        <button class="btn-icon-logout" @click="isLoggedIn = false" title="Encerrar sessão de forma segura">
          <img src="@/assets/images/Log out.png" alt="logout" class="icon-logout" />
        </button>
      </div>
    </header>

    <div class="dashboard-container">
      <aside class="sidebar-nav">
        <button 
          @click="currentTab = 'panel'" 
          :class="['nav-button', currentTab === 'panel' ? 'nav-button-active' : 'nav-button-inactive']"
        >
          <img src="@/assets/images/painel.png" alt="logo" class="logo-sidebar" />
          <span>Painel de Controle</span>
        </button>

        <button 
          @click="currentTab = 'vitals'" 
          :class="['nav-button', currentTab === 'vitals' ? 'nav-button-active' : 'nav-button-inactive']"
        >
          <img src="@/assets/images/pulso.png" alt="logo" class="logo-sidebar" />
          <span>Meus Sinais Vitais</span>
        </button>

        <button 
          @click="currentTab = 'meds'" 
          :class="['nav-button', currentTab === 'meds' ? 'nav-button-active' : 'nav-button-inactive']"
        >
          <img src="@/assets/images/registro.png" alt="logo" class="logo-sidebar" />
          <span>Medicamento Diário</span>
        </button>

        <button 
          @click="currentTab = 'assistant'" 
          :class="['nav-button', currentTab === 'assistant' ? 'nav-button-active' : 'nav-button-inactive']"
        >
          <img src="@/assets/images/agentes.png" alt="logo" class="logo-sidebar" />
          <span>Conversar c/ Assistente</span>
        </button>
      </aside>

      <main class="content-panel">
        <PanelTab v-if="currentTab === 'panel'" />
        </main>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/styles/views/dashboard.css';
</style>
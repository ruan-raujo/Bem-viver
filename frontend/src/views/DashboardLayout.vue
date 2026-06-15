<script setup lang="ts">
import { onMounted } from 'vue';
import { useHealthData } from '../composables/useHealthData';
import PanelTab from '../components/tabs/PanelTab.vue';
import AssistantTab from '../components/tabs/AssistantTab.vue';
import HistoryTab from '../components/tabs/HistoryTab.vue';
import { useRouter } from 'vue-router';

const { currentTab, profile, isLoading, carregarDadosDoUsuario } = useHealthData();
const router = useRouter();

onMounted(async () => {
  await carregarDadosDoUsuario();
});

const logout = () => {
  localStorage.removeItem('tokenBemViver');
  router.push('/');
};
</script>

<template>
  <div class="logged-area">
    
    <div v-if="isLoading" style="display: flex; justify-content: center; align-items: center; height: 100vh; color: #fff;">
      <h2>A carregar o seu ambiente clínico...</h2>
    </div>

    <div v-else>
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
            <span class="user-name">{{ profile?.name || 'Utilizador' }}</span>
          </div>
          <div class="user-avatar-circle">
            <img src="@/assets/images/person.png" alt="avatar" class="avatar" />
          </div>
          <button class="btn-icon-logout" @click="logout" title="Encerrar sessão de forma segura">
            <img src="@/assets/images/Log out.png" alt="logout" class="icon-logout" />
          </button>
        </div>
      </header>

      <div class="dashboard-container">
        <aside class="sidebar-nav">
          <button 
            @click="currentTab = 'dashboard'" 
            :class="['nav-button', currentTab === 'dashboard' ? 'nav-button-active' : 'nav-button-inactive']"
          >
            <img src="@/assets/images/dashboard.png" alt="logo" width="25" />
            <span>Dashboard</span>
          </button>

          <button 
            @click="currentTab = 'registar'" 
            :class="['nav-button', currentTab === 'registar' ? 'nav-button-active' : 'nav-button-inactive']"
          >
            <img src="@/assets/images/prancheta.png" alt="logo" width="25" />
            <span>Registrar</span>
          </button>

          <button 
            @click="currentTab = 'historico'" 
            :class="['nav-button', currentTab === 'historico' ? 'nav-button-active' : 'nav-button-inactive']"
          >
            <img src="@/assets/images/historicologo.png" alt="logo" width="25" />
            <span>Histórico</span>
          </button>

          <button 
            @click="currentTab = 'graficos'" 
            :class="['nav-button', currentTab === 'graficos' ? 'nav-button-active' : 'nav-button-inactive']"
          >
            <img src="@/assets/images/graficos.png" alt="logo" width="25" />
            <span>Gráficos</span>
          </button>
        </aside>

        <main class="content-panel">
          <PanelTab v-if="currentTab === 'dashboard'" />
          
          <AssistantTab v-if="currentTab === 'registar'" />
          <HistoryTab v-if="currentTab === 'historico'" />
          <GraphicsTab v-if="currentTab === 'graficos'" />
        </main>
      </div> </div> </div> </template>

<style scoped>
@import '../assets/styles/views/dashboard.css';
</style>
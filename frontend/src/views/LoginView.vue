<template>
  <div class="login-wrapper">
    <div class="login-container">

      <div class="brand">
        <img src="@/assets/images/logo.png" alt="Logo Bem-viver" class="logo" />
        <span class="brand-name">Bem-viver</span>
        <p>{{ isLogin ? 'Cuidado digital para o seu bem-estar.' : 'Preencha os dados para se cadastrar' }}</p>
      </div>

      <div class="login-card">

        <form @submit.prevent="handleSubmit" class="form-content">

          <div class="input-group" v-if="!isLogin">
            <label for="name">Nome completo</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Seu nome"
              required
            />
          </div>

          <div class="input-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="nome@exemplo.com"
              required
            />
          </div>

          <div class="input-group">
            <div class="label-row">
              <label for="password">Senha</label>
              <button type="button" class="form-link" @click="recoverPasswordModal = true">
                {{ isLogin ? 'Recuperar senha' : 'Dúvidas sobre a senha?' }}
              </button>
            </div>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="btn-primary">
            {{ isLogin ? 'Entrar' : 'Cadastrar' }}
          </button>
        </form>

        <div class="divider-row">
          <div class="divider-line"></div>
          <span class="divider-text">ou</span>
          <div class="divider-line"></div>
        </div>

        <div class="login-promo">
          <p>
            {{ isLogin ? 'Não possui uma conta?' : 'Já possui uma conta?' }}
            <button type="button" @click="toggleMode" class="btn-link">
              {{ isLogin ? 'Solicitar acesso' : 'Faça login' }}
            </button>
          </p>
        </div>
      </div>
       <div class="login-footer">
          <div class="legal-links">
            <a href="#">Termos de Uso</a>
            <a href="#">Privacidade</a>
            <a href="#">Suporte ao Usuário</a>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const isLogin = ref(true)

const formData = reactive({
  name: '',
  email: '',
  password: ''
})

const recoverPasswordModal = ref(false)

const toggleMode = () => {
  isLogin.value = !isLogin.value
  formData.name = ''
  formData.email = ''
  formData.password = ''
}

const handleSubmit = async () => {
  if (isLogin.value) {
    try {
      const resposta = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email, 
        senha: formData.password
      });

      localStorage.setItem('tokenBemViver', resposta.data.token);
      router.push('/dashboard'); 

    } catch (erro) {
      console.error('Erro na requisição de login:', erro);
      const mensagemErro = erro.response?.data?.message || 'Erro ao conectar com o servidor.';
      alert(mensagemErro);
    }

  } else {
    try {
      const resposta = await axios.post('http://localhost:3000/api/users', {
        nome: formData.name,
        email: formData.email,
        senha: formData.password
      });

      alert('Cadastro realizado com sucesso! Agora você pode fazer login.');

      formData.password = ''
      isLogin.value = true

    } catch (erro) {
      console.error('Erro na requisição de cadastro:', erro);
      const mensagemErro = erro.response?.data?.message || 'Erro ao cadastrar.';
      alert(mensagemErro);
    }

  }
}
</script>

<style scoped>
@import '../assets/styles/views/login.css';
</style>
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
      const resposta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          senha: formData.password
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.message || 'Erro ao fazer login.');
        return;
      }
      // Guarda o token no navegador para acessar rotas protegidas depois
      localStorage.setItem('tokenBemViver', dados.token);

      router.push('/dashboard'); // Redireciona para o dashboard após login bem-sucedido

    } catch (erro) {
      console.error('Erro na requisição de login:', erro);
      alert('Erro ao conectar com o servidor.');
    }

  } else {
    try {
      const resposta = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nome: formData.name,
          email: formData.email, 
          senha: formData.password
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.message || 'Erro ao cadastrar.');
        return;
      }

      // Sucesso no Cadastro!
      alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
      
      // Limpa a senha e muda a aba para "Login"
      formData.password = '';
      isLogin.value = true; 

    } catch (erro) {
      console.error('Erro na requisição de cadastro:', erro);
      alert('Erro ao conectar com o servidor.');
    }
  }
}
</script>

<style scoped>
@import '../assets/styles/views/login.css';
</style>
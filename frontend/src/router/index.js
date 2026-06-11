import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardLayout from '../views/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: false }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('tokenBemViver')
  const paginaProtegida = to.matched.some(record => record.meta.requiresAuth)
  
  if (paginaProtegida && !token) {
    next('/')
  } else if (to.path === '/' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
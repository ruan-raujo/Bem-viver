import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importe o CSS Global aqui
import './assets/styles/global.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
import { ref, computed } from 'vue';
import axios from 'axios';

export interface VitalRecord {
  _id?: string;
  type: 'blood_pressure' | 'glucose' | 'weight' | 'heart_rate';
  date: string;
  value: string;
  numericValue: number;
  notes?: string;
  status: 'normal' | 'attention' | 'critical';
}

export interface Medication {
  _id?: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  takenDates: string[];
}

export interface Appointment {
  _id?: string;
  specialty: string;
  doctor: string;
  datetime: string;
  location: string;
}

export interface UserProfile {
  _id?: string;
  name: string;
  email: string; 
  age?: number;
  condition?: string;
  bloodType?: string;
  phone?: string;
  insuranceCard?: string;
  caregiverName?: string;
  caregiverPhone?: string;
  caregiverRelation?: string;
}


const isLoggedIn = ref(false);
const currentTab = ref<'dashboard' | 'registar' | 'graficos' | 'historico'>('dashboard');
const toastMessage = ref<string | null>(null);
const callScenario = ref<{ isOpen: boolean; name: string; phone: string; type: 'caregiver' | 'doctor' | 'emerg' } | null>(null);

const profile = ref<UserProfile | null>(null);
const vitals = ref<VitalRecord[]>([]);
const medications = ref<Medication[]>([]);
const appointments = ref<Appointment[]>([]);


const isLoading = ref(true);

export function useHealthData() {
  

  const showToast = (message: string) => {
    toastMessage.value = message;
    setTimeout(() => {
      toastMessage.value = null;
    }, 4000);
  };


  const triggerCallSimulation = (name: string, phone: string, type: 'caregiver' | 'doctor' | 'emerg') => {
    callScenario.value = { isOpen: true, name, phone, type };
    showToast(`A efetuar chamada segura para ${name}...`);
  };

  const endCall = () => {
    callScenario.value = null;
    showToast('Chamada finalizada.');
  };

  const carregarDadosDoUsuario = async () => {
    isLoading.value = true;
    try {
      const token = localStorage.getItem('tokenBemViver');
      
      if (!token) {
        isLoading.value = false;
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const respostaUsuario = await axios.get('http://localhost:3000/api/users/me', config);
      
      profile.value = respostaUsuario.data;


    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
      showToast('Não foi possível carregar alguns dados.');
    } finally {
      isLoading.value = false;
    }
  };

  const latestBP = computed(() => [...vitals.value].reverse().find(v => v.type === 'blood_pressure'));
  const latestGlucose = computed(() => [...vitals.value].reverse().find(v => v.type === 'glucose'));
  const latestHeartRate = computed(() => [...vitals.value].reverse().find(v => v.type === 'heart_rate'));
  const latestWeight = computed(() => [...vitals.value].reverse().find(v => v.type === 'weight'));

  const takenMedsToday = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return medications.value.filter(m => m.takenDates.includes(todayStr)).length;
  });

  return {
    isLoggedIn,
    currentTab,
    toastMessage,
    callScenario,
    profile,
    vitals,
    medications,
    appointments,
    latestBP,
    latestGlucose,
    latestHeartRate,
    latestWeight,
    takenMedsToday,
    isLoading,
    showToast,
    triggerCallSimulation,
    endCall,
    carregarDadosDoUsuario
  };
}
import { ref, computed } from 'vue';

// ==========================================
// INTERFACES (Modelos de Dados)
// ==========================================
export interface VitalRecord {
  id: string;
  type: 'blood_pressure' | 'glucose' | 'weight' | 'heart_rate';
  date: string;
  value: string;
  numericValue: number;
  notes?: string;
  status: 'normal' | 'attention' | 'critical';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  takenDates: string[];
}

export interface Appointment {
  id: string;
  specialty: string;
  doctor: string;
  datetime: string;
  location: string;
}

export interface UserProfile {
  name: string;
  age: number;
  condition: string;
  bloodType: string;
  phone: string;
  insuranceCard: string;
  caregiverName: string;
  caregiverPhone: string;
  caregiverRelation: string;
}

export interface WellnessTip {
  id: string;
  title: string;
  category: 'exercise' | 'hydration' | 'medication' | 'nutrition' | 'general';
  content: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// ==========================================
// ESTADO GLOBAL REATIVO
// (Declarado fora da função para persistir entre as telas)
// ==========================================
const isLoggedIn = ref(false);
const currentTab = ref<'panel' | 'vitals' | 'meds' | 'assistant' | 'support'>('panel');
const toastMessage = ref<string | null>(null);
const callScenario = ref<{ isOpen: boolean; name: string; phone: string; type: 'caregiver' | 'doctor' | 'emerg' } | null>(null);

// Dados Iniciais da Dona Maria
const profile = ref<UserProfile>({
  name: 'Maria Silva',
  age: 68,
  condition: 'Hipertensão e Controle de Glicose',
  bloodType: 'O+',
  phone: '(11) 98765-4321',
  insuranceCard: '302 9847 2191 0023',
  caregiverName: 'Lucas Silva (Filho)',
  caregiverPhone: '(11) 99123-4567',
  caregiverRelation: 'Filho e Responsável Principal'
});

// Histórico Inicial de Sinais Vitais
const vitals = ref<VitalRecord[]>([
  {
    id: 'v1',
    type: 'blood_pressure',
    date: '2026-05-27 08:30',
    value: '120/80',
    numericValue: 120,
    notes: 'Medido em jejum após acordar.',
    status: 'normal'
  },
  {
    id: 'v2',
    type: 'glucose',
    date: '2026-05-27 09:00',
    value: '98 mg/dL',
    numericValue: 98,
    notes: 'Jejum de 8 horas.',
    status: 'normal'
  },
  {
    id: 'v3',
    type: 'heart_rate',
    date: '2026-05-27 08:30',
    value: '72 bpm',
    numericValue: 72,
    notes: 'Medição automática do aparelho de pressão.',
    status: 'normal'
  },
  {
    id: 'v4',
    type: 'weight',
    date: '2026-05-26 10:15',
    value: '74.2 kg',
    numericValue: 74.2,
    notes: 'Peso semanal matinal.',
    status: 'normal'
  },
  {
    id: 'v5',
    type: 'blood_pressure',
    date: '2026-05-26 18:45',
    value: '135/88',
    numericValue: 135,
    notes: 'Sentindo leve cansaço após a caminhada.',
    status: 'attention'
  },
  {
    id: 'v6',
    type: 'glucose',
    date: '2026-05-25 14:00',
    value: '142 mg/dL',
    numericValue: 142,
    notes: '2 horas após o almoço.',
    status: 'attention'
  },
  {
    id: 'v7',
    type: 'blood_pressure',
    date: '2026-05-25 08:15',
    value: '145/92',
    numericValue: 145,
    notes: 'Esqueceu de tomar o remédio na noite anterior.',
    status: 'critical'
  }
]);

// Grade de Medicamentos
const medications = ref<Medication[]>([
  {
    id: 'm1',
    name: 'Losartana Potássica',
    dosage: '50mg',
    time: '08:00',
    frequency: 'Uma vez ao dia',
    takenDates: ['2026-05-27']
  },
  {
    id: 'm2',
    name: 'Metformina',
    dosage: '850mg',
    time: '12:30',
    frequency: 'Com o almoço',
    takenDates: []
  },
  {
    id: 'm3',
    name: 'Atorvastatina',
    dosage: '20mg',
    time: '20:00',
    frequency: 'Uma vez ao dia (noite)',
    takenDates: []
  }
]);

// Grade de Consultas
const appointments = ref<Appointment[]>([
  {
    id: 'a1',
    specialty: 'Cardiologia',
    doctor: 'Dr. Paulo Mendes',
    datetime: '2026-06-03 14:30',
    location: 'Hospital Santa Catarina - Consultório 204'
  },
  {
    id: 'a2',
    specialty: 'Especialista em Diabetes',
    doctor: 'Dra. Aline Rocha',
    datetime: '2026-06-18 10:00',
    location: 'Centro Clínico Saúde Total, Sala 12'
  }
]);

// ==========================================
// COMPOSABLE PRINCIPAL (EXPORT MODULE)
// ==========================================
export function useHealthData() {
  
  // Exibir notificações Toast temporárias
  const showToast = (message: string) => {
    toastMessage.value = message;
    setTimeout(() => {
      toastMessage.value = null;
    }, 4000);
  };

  // Ativar modal de simulação de ligação
  const triggerCallSimulation = (name: string, phone: string, type: 'caregiver' | 'doctor' | 'emerg') => {
    callScenario.value = { isOpen: true, name, phone, type };
    showToast(`Discando ligação telefônica segura para ${name}...`);
  };

  // Finalizar chamada simulada
  const endCall = () => {
    callScenario.value = null;
    showToast('Ligação finalizada.');
  };

  // ==========================================
  // PROPRIEDADES COMPUTADAS (Getters)
  // ==========================================
  const latestBP = computed(() => vitals.value.find(v => v.type === 'blood_pressure'));
  const latestGlucose = computed(() => vitals.value.find(v => v.type === 'glucose'));
  const latestHeartRate = computed(() => vitals.value.find(v => v.type === 'heart_rate'));
  const latestWeight = computed(() => vitals.value.find(v => v.type === 'weight'));

  const takenMedsToday = computed(() => {
    const todayStr = '2026-05-27';
    return medications.value.filter(m => m.takenDates.includes(todayStr)).length;
  });

  // Retorno explícito de todo o ecossistema para as Views e Componentes
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
    showToast,
    triggerCallSimulation,
    endCall
  };
}
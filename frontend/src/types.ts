export interface VitalRecord {
  id: string;
  type: 'blood_pressure' | 'glucose' | 'weight' | 'heart_rate';
  date: string; // YYYY-MM-DD HH:mm
  value: string; // "120/80", "105 mg/dL", "74 kg", etc.
  numericValue: number; // For plotting or safety checks
  notes?: string;
  status: 'normal' | 'attention' | 'critical';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // HH:MM
  frequency: string; // e.g. "Uma vez ao dia", "A cada 12 horas"
  takenDates: string[]; // YYYY-MM-DD strings of when taken
}

export interface Appointment {
  id: string;
  specialty: string;
  doctor: string;
  datetime: string; // YYYY-MM-DD HH:mm
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

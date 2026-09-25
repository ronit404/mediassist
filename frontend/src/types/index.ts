export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  lastActive?: string;
  status?: 'active' | 'inactive';
  totalAnalyses?: number;
}

export interface EmergencyContact {
  name?: string;
  phone?: string;
  relation?: string;
}

export interface PatientProfile {
  id?: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  current_medications?: string[];
  emergency_contact?: EmergencyContact;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type UserProfile = User;

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agreeToTerms?: boolean;
}

export interface Medicine {
  id: string;
  _id?: string;
  name: string;
  generic_name?: string;
  category_or_disease?: string;
  manufacturer?: string;
  prescription_required?: string;
  price?: string;
  drug_content?: string;
  image_urls?: string;
}

export interface Disease {
  id: string;
  _id?: string;
  name: string;
  aliases?: string[];
  description?: string;
  symptoms?: string[];
  precautions?: string[];
  diet_recommendations?: string[];
  workout_recommendations?: string[];
  related_medicine_ids?: string[];
  medicines?: Medicine[];
}

export interface PredictionItem {
  disease: string;
  confidence: number;
  disease_details?: {
    id?: string;
    name?: string;
    description?: string;
    precautions?: string[];
    diet_recommendations?: string[];
    workout_recommendations?: string[];
  };
  medicines?: Medicine[];
}

export interface PredictionResponse {
  input_symptoms: string[];
  predictions: PredictionItem[];
}

export interface PatientInfo {
  age?: number | string;
  gender?: string;
  weight?: number | string;
  duration?: string;
  severity?: string;
}

export interface AnalysisHistoryItem {
  id: string;
  date: string;
  patientInfo?: PatientInfo;
  symptoms: string[];
  predictions: PredictionItem[];
}

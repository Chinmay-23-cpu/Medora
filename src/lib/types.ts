export type Organ = "brain" | "heart" | "lung";

export type TriageLevel = "critical" | "urgent" | "priority" | "routine";

export type Gender = "female" | "male" | "other" | "prefer-not-to-say";

export interface FindingRegion {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  confidence: number;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  organ: Organ;
  imageDataUrl: string;
  heatmapDataUrl: string;
  diseaseMapDataUrl: string;
  suspectedCondition: string;
  icdHint: string;
  confidence: number;
  triage: TriageLevel;
  triageReason: string;
  findings: string[];
  clinicalSummary: string;
  regions: FindingRegion[];
  specialistFocus: string;
}

export interface UserProfile {
  name: string;
  address: string;
  city: string;
  age: string;
  gender: Gender;
  lat: number | null;
  lng: number | null;
}

export interface MedicalHistoryEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  hospitalId: string;
  datetime: string;
  reason: string;
  status: "confirmed" | "pending";
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  organ: Organ;
  hospitalId: string;
  years: number;
  rating: number;
  bio: string;
  languages: string[];
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  departments: Organ[];
}

export interface AppState {
  profile: UserProfile;
  history: MedicalHistoryEntry[];
  scans: AnalysisResult[];
  appointments: Appointment[];
}

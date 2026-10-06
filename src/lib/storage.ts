import type {
  AnalysisResult,
  Appointment,
  AppState,
  MedicalHistoryEntry,
  UserProfile,
} from "./types";

const KEY = "medora-app-state-v1";

export const defaultProfile: UserProfile = {
  name: "",
  address: "",
  city: "Bengaluru",
  age: "",
  gender: "prefer-not-to-say",
  lat: 12.9716,
  lng: 77.5946,
};

export const sampleHistory: MedicalHistoryEntry[] = [
  {
    id: "mh1",
    date: "2024-11-02",
    title: "Seasonal asthma follow-up",
    detail: "Inhaled corticosteroid continued. Peak flow stable. No recent admissions.",
  },
  {
    id: "mh2",
    date: "2025-03-18",
    title: "Hypertension screening",
    detail: "Clinic BP 138/86. Lifestyle advice given. No antihypertensives started.",
  },
];

export function emptyState(): AppState {
  return {
    profile: defaultProfile,
    history: sampleHistory,
    scans: [],
    appointments: [],
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as AppState;
    return {
      profile: { ...defaultProfile, ...parsed.profile },
      history: parsed.history ?? sampleHistory,
      scans: parsed.scans ?? [],
      appointments: parsed.appointments ?? [],
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function addScan(scans: AnalysisResult[], scan: AnalysisResult) {
  return [scan, ...scans].slice(0, 8);
}

export function addAppointment(
  appointments: Appointment[],
  appt: Appointment,
) {
  return [appt, ...appointments];
}

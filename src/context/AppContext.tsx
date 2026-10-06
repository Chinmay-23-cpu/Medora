"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { addAppointment, addScan, loadState, saveState } from "@/lib/storage";
import type {
  AnalysisResult,
  Appointment,
  AppState,
  MedicalHistoryEntry,
  UserProfile,
} from "@/lib/types";

interface AppContextValue extends AppState {
  ready: boolean;
  updateProfile: (patch: Partial<UserProfile>) => void;
  saveScan: (scan: AnalysisResult) => void;
  addHistory: (entry: MedicalHistoryEntry) => void;
  bookAppointment: (appt: Appointment) => void;
  latestScan: AnalysisResult | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState((s) =>
      s ? { ...s, profile: { ...s.profile, ...patch } } : s,
    );
  }, []);

  const saveScan = useCallback((scan: AnalysisResult) => {
    setState((s) => (s ? { ...s, scans: addScan(s.scans, scan) } : s));
  }, []);

  const addHistory = useCallback((entry: MedicalHistoryEntry) => {
    setState((s) =>
      s ? { ...s, history: [entry, ...s.history] } : s,
    );
  }, []);

  const bookAppointment = useCallback((appt: Appointment) => {
    setState((s) =>
      s ? { ...s, appointments: addAppointment(s.appointments, appt) } : s,
    );
  }, []);

  const value = useMemo<AppContextValue | null>(() => {
    if (!state) return null;
    return {
      ...state,
      ready: true,
      updateProfile,
      saveScan,
      addHistory,
      bookAppointment,
      latestScan: state.scans[0] ?? null,
    };
  }, [state, updateProfile, saveScan, addHistory, bookAppointment]);

  if (!value) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">
        Loading workspace…
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

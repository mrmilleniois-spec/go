import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppMode, Business, PaymentRecord, ScheduleRequest, ThemePref } from "./types";
import { loadState, saveState, wipeState, type PersistedState } from "./storage";

export type ToastItem = { id: number; message: string };

interface AppContextValue {
  mode: AppMode;
  theme: ThemePref;
  business: Business | null;
  schedules: ScheduleRequest[];
  payments: PaymentRecord[];
  passengerName: string;
  toasts: ToastItem[];
  setTheme: (t: ThemePref) => void;
  registerBusiness: (b: Business) => void;
  updateBusiness: (b: Business) => void;
  enterBusiness: () => void;
  leaveBusiness: () => void;
  deleteBusiness: () => void;
  addSchedule: (r: ScheduleRequest) => void;
  payWeek: (id: string) => void;
  toast: (message: string) => void;
  hasBusiness: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    saveState(state);
    document.documentElement.dataset.theme =
      state.theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : state.theme;
  }, [state]);

  const mode: AppMode = state.business && state.businessActive ? "business" : "passenger";

  const toast = (message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  };

  const value: AppContextValue = useMemo(
    () => ({
      mode,
      theme: state.theme,
      business: state.business,
      schedules: state.schedules,
      payments: state.payments,
      passengerName: state.passengerName,
      toasts,
      setTheme: (t) => setState((s) => ({ ...s, theme: t })),
      registerBusiness: (b) => setState((s) => ({ ...s, business: b, businessActive: true })),
      updateBusiness: (b) => setState((s) => ({ ...s, business: b })),
      enterBusiness: () => setState((s) => ({ ...s, businessActive: true })),
      leaveBusiness: () => setState((s) => ({ ...s, businessActive: false })),
      deleteBusiness: () => setState((s) => ({ ...s, business: null, businessActive: false })),
      addSchedule: (r) => setState((s) => ({ ...s, schedules: [r, ...s.schedules] })),
      payWeek: (id) =>
        setState((s) => ({
          ...s,
          payments: s.payments.map((p) =>
            p.id === id ? { ...p, paid: true, paidAt: new Date().toISOString() } : p
          ),
        })),
      toast,
      hasBusiness: !!state.business,
    }),
    [state, toasts, mode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useWipe(): () => void {
  return wipeState;
}
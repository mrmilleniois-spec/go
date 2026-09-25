import type { Business, PaymentRecord, ScheduleRequest, ThemePref } from "./types";
import { buildPayments, initialSchedules } from "./mockData";

const KEY = "go-app-state-v1";

export interface PersistedState {
  theme: ThemePref;
  business: Business | null;
  businessActive: boolean;
  schedules: ScheduleRequest[];
  payments: PaymentRecord[];
  passengerName: string;
}

export function defaultState(): PersistedState {
  return {
    theme: "system",
    business: null,
    businessActive: false,
    schedules: initialSchedules(),
    payments: buildPayments(),
    passengerName: "Emma Wambui",
  };
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...defaultState(),
      ...parsed,
      schedules: parsed.schedules ?? defaultState().schedules,
      payments: parsed.payments ?? defaultState().payments,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — ignore in demo
  }
}

export function wipeState(): void {
  localStorage.removeItem(KEY);
}
export type VehicleType = "motorcycle" | "car";
export type DeliveryUse = "to" | "from" | "both";
export type ThemePref = "light" | "dark" | "system";
export type AppMode = "passenger" | "business";

export interface Business {
  name: string;
  logo: string | null;
  businessType: string;
  deliveryUse: DeliveryUse;
  email: string;
  phone: string;
  address: string;
  registeredAt: string;
}

export interface Driver {
  id: string;
  name: string;
  vehicleType: VehicleType;
  rating: number;
}

export interface Job {
  id: string;
  driverId: string;
  day: number;
  time: string;
  from: string;
  to: string;
  distanceKm: number;
  durationMin: number;
}

export interface DriverWeek {
  driverId: string;
  weekKey: string;
  jobs: Job[];
}

export interface ScheduleRequest {
  id: string;
  createdAt: string;
  periodType: "week" | "month" | "year";
  periodStart: string;
  periodLabel: string;
  motorcycles: number;
  cars: number;
  deadline: "fulfilled" | "pending" | "expired";
  active: boolean;
  requiredFound: boolean;
}

export interface PaymentRecord {
  id: string;
  weekLabel: string;
  totalKm: number;
  totalMin: number;
  amount: number;
  paid: boolean;
  paidAt?: string;
}

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  date: string;
  kind: "debit" | "credit";
}
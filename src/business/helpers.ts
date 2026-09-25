import type { Driver, ScheduleRequest } from "../types";
import { DRIVERS } from "../mockData";

export const FLEET_POS = [
  { lat: -1.2649, lng: 36.8066 },
  { lat: -1.2769, lng: 36.7982 },
  { lat: -1.2894, lng: 36.7842 },
  { lat: -1.2582, lng: 36.8149 },
  { lat: -1.2845, lng: 36.8102 },
  { lat: -1.2701, lng: 36.8032 },
  { lat: -1.2937, lng: 36.7901 },
  { lat: -1.2637, lng: 36.7862 },
];

export function fleetForSchedules(schedules: ScheduleRequest[]): Driver[] {
  const active =
    schedules.find((s) => s.active && s.deadline !== "expired") ?? schedules[0] ?? null;
  const bikes = active ? active.motorcycles : 4;
  const cars = active ? active.cars : 2;
  const bikers = DRIVERS.filter((d) => d.vehicleType === "motorcycle").slice(0, bikes);
  const carDrivers = DRIVERS.filter((d) => d.vehicleType === "car").slice(0, cars);
  return [...bikers, ...carDrivers];
}

export function money(n: number): string {
  return "$" + n.toFixed(2);
}

export const FARE_PER_KM = 0.62;
export const FARE_PER_MIN = 0.11;
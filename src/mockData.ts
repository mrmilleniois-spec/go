import type { Driver, Job, DriverWeek, ScheduleRequest, PaymentRecord, Transaction } from "./types";

export function hashHue(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function weekKey(date: Date = new Date()): string {
  return isoWeek(date);
}

export function weekKeyFromOffset(offset: number): string {
  const d = new Date();
  const dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
  d.setDate(d.getDate() - dow + offset * 7);
  return weekKey(d);
}

export function weekLabel(weekKeyStr: string): string {
  const [year, w] = weekKeyStr.split("-W").map(Number);
  const jan1 = new Date(year, 0, 1);
  const start = new Date(jan1.getTime() + (w - 1) * 7 * 86400000);
  const startDay = start.getDay() === 0 ? 6 : start.getDay() - 1;
  const monday = new Date(start.getTime() - startDay * 86400000);
  const sunday = new Date(monday.getTime() + 6 * 86400000);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

export function daysOfWeek(weekKeyStr: string): Date[] {
  const [year, w] = weekKeyStr.split("-W").map(Number);
  const jan1 = new Date(year, 0, 1);
  const start = new Date(jan1.getTime() + (w - 1) * 7 * 86400000);
  const startDay = start.getDay() === 0 ? 6 : start.getDay() - 1;
  const monday = new Date(start.getTime() - startDay * 86400000);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function monthLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "utc" });
}

export const DRIVERS: Driver[] = [
  { id: "d1", name: "Brian Otieno", vehicleType: "motorcycle", rating: 4.9 },
  { id: "d2", name: "Wanjiru Kariuki", vehicleType: "car", rating: 4.8 },
  { id: "d3", name: "Samuel Mwangi", vehicleType: "motorcycle", rating: 4.7 },
  { id: "d4", name: "Amina Hassan", vehicleType: "car", rating: 5.0 },
  { id: "d5", name: "Kevin Ochieng", vehicleType: "motorcycle", rating: 4.6 },
  { id: "d6", name: "Grace Njeri", vehicleType: "car", rating: 4.9 },
  { id: "d7", name: "Peter Kamau", vehicleType: "motorcycle", rating: 4.8 },
  { id: "d8", name: "Janet Achieng", vehicleType: "car", rating: 4.7 },
];

export const AREAS = [
  "Westlands",
  "Kilimani",
  "CBD",
  "South B",
  "Riverside",
  "Kasarani",
  "Lang'ata",
  "Ngong Rd",
  "Eastleigh",
  "Karen",
];

function genJobs(): Record<string, DriverWeek[]> {
  const rand = mulberry32(20260924);
  const now = new Date();
  const result: Record<string, DriverWeek[]> = {};

  for (let w = -9; w <= 0; w++) {
    const monday = new Date(now);
    const dow = now.getDay() === 0 ? 6 : now.getDay() - 1;
    monday.setDate(now.getDate() - dow - w * 7);
    const key = isoWeek(monday);

    for (const driver of DRIVERS) {
      const jobs: Job[] = [];
      for (let d = 0; d < 7; d++) {
        const dayDate = new Date(monday);
        dayDate.setDate(monday.getDate() + d);
        if (dayDate > now) break;
        if (d === 6 && rand() < 0.7) continue;
        const count = 1 + Math.floor(rand() * 3);
        for (let j = 0; j < count; j++) {
          const from = AREAS[Math.floor(rand() * AREAS.length)];
          let to = AREAS[Math.floor(rand() * AREAS.length)];
          if (to === from) to = AREAS[(AREAS.indexOf(from) + 1 + Math.floor(rand() * 3)) % AREAS.length];
          jobs.push({
            id: `${key}-${driver.id}-${d}-${j}`,
            driverId: driver.id,
            day: d,
            time: `${8 + Math.floor(rand() * 11)}:${rand() < 0.5 ? "00" : "30"}`,
            from,
            to,
            distanceKm: Math.round((2.4 + rand() * 10 + driver.id.charCodeAt(1) * 0.3) * 10) / 10,
            durationMin: Math.round(12 + rand() * 35),
          });
        }
      }
      result[key] = result[key] ?? [];
      result[key].push({ driverId: driver.id, weekKey: key, jobs });
    }
  }
  return result;
}

export const WEEK_DATA = genJobs();

export function getWeekData(key: string): DriverWeek[] {
  return WEEK_DATA[key] ?? [];
}

export function allWeekKeys(): string[] {
  return Object.keys(WEEK_DATA).sort();
}

export function sumWeek(jobs: Job[]) {
  const km = jobs.reduce((a, b) => a + b.distanceKm, 0);
  const min = jobs.reduce((a, b) => a + b.durationMin, 0);
  return { km, min, count: jobs.length };
}

export function buildPayments(): PaymentRecord[] {
  return allWeekKeys().map((k) => {
    const { km, min } = sumWeek(getWeekData(k).flatMap((w) => w.jobs));
    const amount = Math.round((km * 0.62 + min * 0.11) * 100) / 100;
    return {
      id: `pay-${k}`,
      weekLabel: weekLabel(k),
      totalKm: Math.round(km * 10) / 10,
      totalMin: Math.round(min),
      amount,
      paid: k !== allWeekKeys()[allWeekKeys().length - 1],
    };
  });
}

export function initialSchedules(): ScheduleRequest[] {
  const now = new Date();
  const fmt = (d: Date) => d.toDateString();
  const d = new Date(now);
  d.setDate(now.getDate() + 6);
  return [
    {
      id: "rq1",
      createdAt: fmt(d),
      periodType: "week",
      periodStart: weekKeyFromOffset(-1),
      periodLabel: weekLabel(weekKeyFromOffset(-1)),
      motorcycles: 3,
      cars: 1,
      deadline: "expired",
      active: false,
      requiredFound: false,
    },
    {
      id: "rq2",
      createdAt: fmt(now),
      periodType: "week",
      periodStart: weekKeyFromOffset(0),
      periodLabel: weekLabel(weekKeyFromOffset(0)),
      motorcycles: 4,
      cars: 2,
      deadline: "pending",
      active: true,
      requiredFound: true,
    },
    {
      id: "rq3",
      createdAt: fmt(now),
      periodType: "month",
      periodStart: d.toDateString(),
      periodLabel: "October 2026",
      motorcycles: 5,
      cars: 3,
      deadline: "pending",
      active: false,
      requiredFound: false,
    },
  ];
}

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: "t1", label: "Top-up via card", amount: 50, date: "Sep 22", kind: "credit" },
  { id: "t2", label: "Ride to Westlands", amount: 6.5, date: "Sep 21", kind: "debit" },
  { id: "t3", label: "Top-up via M-Pesa", amount: 20, date: "Sep 20", kind: "credit" },
  { id: "t4", label: "Ride to Kilimani", amount: 8.2, date: "Sep 20", kind: "debit" },
  { id: "t5", label: "Ride to CBD", amount: 4.1, date: "Sep 18", kind: "debit" },
];
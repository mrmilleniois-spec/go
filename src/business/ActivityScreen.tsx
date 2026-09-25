import { useMemo, useState } from "react";
import { BarChart, type BarItem } from "../components/BarChart";
import { Segmented, RowStat } from "../components/Segmented";
import { Avatar } from "../components/Avatar";
import { DRIVERS, allWeekKeys, getWeekData, weekLabel, daysOfWeek, sumWeek } from "../mockData";
import { IconCalendar, IconChevronLeft, IconClock, IconPin, IconTrendUp } from "../components/Icons";
import type { Job } from "../types";

const WEEKDAY_LETTERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function monthKeyOfWeek(key: string): string {
  const [y, w] = key.split("-W").map(Number);
  const start = new Date(Date.UTC(y, 0, 1)).getTime() + (w - 1) * 7 * 86400000;
  const off = new Date(start).getUTCDay() === 0 ? 6 : new Date(start).getUTCDay() - 1;
  const monday = new Date(start - off * 86400000);
  return `${monday.getUTCFullYear()}\u2013${monday.getUTCMonth()}`;
}

function monthLabel(mk: string): string {
  const [y, m] = mk.split("\u2013").map(Number);
  return new Date(Date.UTC(y, m, 1)).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

function shortDay(key: string): string {
  const d = daysOfWeek(key)[0];
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function shortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function kmFormatted(n: number): string {
  const r = Math.round(n);
  return `${r} km`;
}

const lastKey = (keysStr: string[]) => keysStr[keysStr.length - 1];

type Level =
  | { t: "range" }
  | { t: "weeks"; monthKey: string }
  | { t: "weekdays"; monthKey: string }
  | { t: "days"; weekKey: string };

export function ActivityScreen() {
  const keys = allWeekKeys();
  const [range, setRange] = useState<"week" | "month" | "year">("week");
  const [stack, setStack] = useState<Level[]>([{ t: "range" }]);
  const [weekday, setWeekday] = useState(false);
  const [driverId, setDriverId] = useState<string>(DRIVERS[0].id);
  const [driverWeek, setDriverWeek] = useState<string | null>(lastKey(allWeekKeys()));

  const months = useMemo(() => {
    const map = new Map<string, { key: string; weeks: string[] }>();
    for (const k of keys) {
      const mk = monthKeyOfWeek(k);
      if (!map.has(mk)) map.set(mk, { key: mk, weeks: [] });
      map.get(mk)!.weeks.push(k);
    }
    return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
  }, [keys]);

  const current = stack[stack.length - 1];
  const latestYear = months[months.length - 1]?.key.split("\u2013")[0] ?? "2026";

  const items: BarItem[] = useMemo(() => {
    const weekBars = (wk: string[]) =>
      wk.map((k) => {
        const s = sumWeek(getWeekData(k).flatMap((w) => w.jobs));
        return { label: shortDay(k), value: Math.round(s.km), display: kmFormatted(s.km), sub: `${s.count} jobs` };
      });

    if (current.t === "range") {
      if (range === "week") return weekBars(keys.slice(-8));
      if (range === "month") {
        const m = months.slice(-5);
        return m.map((mo) => ({
          label: monthLabel(mo.key).replace(" 2026", ""),
          value: Math.round(sumWeek(mo.weeks.flatMap((k) => getWeekData(k).flatMap((w) => w.jobs))).km),
          display: monthLabel(mo.key),
          sub: `${mo.weeks.length} wks`,
        }));
      }
      const mo = months.filter((x) => x.key.startsWith(latestYear));
      return mo.map((x) => ({
        label: monthLabel(x.key).split(" ")[0],
        value: Math.round(sumWeek(x.weeks.flatMap((k) => getWeekData(k).flatMap((w) => w.jobs))).km),
        display: monthLabel(x.key),
        sub: `${x.weeks.length} wks`,
      }));
    }
    if (current.t === "weeks" || current.t === "weekdays") {
      const mo = months.find((x) => x.key === current.monthKey)!;
      if (current.t === "weekdays") {
        return WEEKDAY_LETTERS.map((l, d) => {
          let km = 0;
          let c = 0;
          for (const k of mo.weeks) {
            const jobs = getWeekData(k).flatMap((w) => w.jobs).filter((j) => j.day === d);
            km += sumWeek(jobs).km;
            c += jobs.length;
          }
          return {
            label: l,
            value: Math.round(km / Math.max(1, mo.weeks.length)),
            display: `${Math.round((km / Math.max(1, mo.weeks.length)) * 10) / 10} km`,
            sub: `${c} jobs`,
          };
        });
      }
      return weekBars(mo.weeks);
    }
    const wk = current.weekKey;
    return daysOfWeek(wk).map((d, i) => {
      const jobs = getWeekData(wk).flatMap((w) => w.jobs).filter((j) => j.day === i);
      const s = sumWeek(jobs);
      return { label: WEEKDAY_LETTERS[i], value: Math.round(s.km), display: kmFormatted(s.km), sub: `${s.count} jobs · ${shortDate(d)}` };
    });
  }, [current, range, months, keys, latestYear]);

  const scopeWeeks: string[] = useMemo(() => {
    if (current.t === "range") {
      if (range === "week") return keys.slice(-8);
      if (range === "month") return months.slice(-5).flatMap((x) => x.weeks);
      return months.filter((x) => x.key.startsWith(latestYear)).flatMap((x) => x.weeks);
    }
    if (current.t === "weeks" || current.t === "weekdays") return months.find((x) => x.key === current.monthKey)?.weeks ?? [];
    return [current.weekKey];
  }, [current, range, months, keys, latestYear]);

  const scopeStats = useMemo(() => {
    const jobs = scopeWeeks.flatMap((k) => getWeekData(k).flatMap((w) => w.jobs));
    return sumWeek(jobs);
  }, [scopeWeeks]);

  const drill = (i: number) => {
    setStack((prev) => {
      const next = [...prev];
      const cur = next[next.length - 1];
      if (cur.t === "range") {
        if (range === "week") next.push({ t: "days", weekKey: keys.slice(-8)[i] });
        else if (range === "month") next.push({ t: "weeks", monthKey: months.slice(-5)[i].key });
        else next.push({ t: "weeks", monthKey: months.filter((x) => x.key.startsWith(latestYear))[i].key });
      } else if (cur.t === "weeks") {
        const wk = months.find((x) => x.key === cur.monthKey)!.weeks[i];
        next.push({ t: "days", weekKey: wk });
      }
      return next;
    });
  };

  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  const onChangeRange = (r: string) => {
    setRange(r as typeof range);
    setStack([{ t: "range" }]);
  };

  const breadcrumb = () => {
    if (current.t === "range") {
      if (range === "week") return "Range · last 8 weeks";
      if (range === "month") return "Range · last 5 months";
      return "Range · this year";
    }
    const parts: string[] = [];
    const first = stack[0];
    if (first.t === "range") parts.push(range === "week" ? "Week" : range === "month" ? "Month" : "Year");
    if (current.t === "weeks" || current.t === "weekdays") {
      parts.push(monthLabel(current.monthKey));
      if (current.t === "weekdays") parts.push("by weekday");
    }
    if (current.t === "days") parts.push(weekLabel(current.weekKey));
    return parts.join(" · ");
  };

  /* driver section */
  const driver = DRIVERS.find((d) => d.id === driverId)!;
  const dwKeys = keys.slice(-6);
  const driverItems: BarItem[] = dwKeys.map((k) => {
    const jobs = getWeekData(k).find((w) => w.driverId === driverId)?.jobs ?? [];
    const s = sumWeek(jobs);
    return { label: shortDay(k), value: Math.round(s.km), display: kmFormatted(s.km), sub: `${s.count} jobs` };
  });
  const selJobs: Job[] = driverWeek
    ? getWeekData(driverWeek).find((w) => w.driverId === driverId)?.jobs ?? []
    : [];
  const selStats = sumWeek(selJobs);

  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {stack.length > 1 ? (
          <button className="icon-btn" onClick={back} aria-label="Back">
            <IconChevronLeft />
          </button>
        ) : null}
        <div className="grow">
          <h1 className="h1" style={{ fontSize: 19 }}>Activity</h1>
          <div className="muted" style={{ fontSize: 12 }}>{breadcrumb()}</div>
        </div>
        <span className="status ok" style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <IconTrendUp /> +8%
        </span>
      </div>

      <Segmented
        options={[
          { key: "week", label: "Week" },
          { key: "month", label: "Month" },
          { key: "year", label: "Year" },
        ]}
        value={range}
        onChange={onChangeRange}
      />

      {current.t === "range" && range === "month" && (
        <div className="chips">
          <button className={`chip ${!weekday ? "active" : ""}`} onClick={() => setWeekday(false)}>Weekly</button>
          <button className={`chip ${weekday ? "active" : ""}`} onClick={() => setWeekday(true)}>Day of week</button>
        </div>
      )}

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span className="row-ic" style={{ width: 34, height: 34, fontSize: 16 }}>
            <IconCalendar />
          </span>
          <span className="grow" style={{ fontWeight: 700, fontSize: 14.5 }}>
            {current.t === "weekdays" ? "Average distance per weekday" : "Distance covered"}
          </span>
          <span className="muted">{kmFormatted(scopeStats.km)}</span>
        </div>
        <BarChart items={items} height={150} unit="km " onClickItem={current.t !== "weekdays" ? drill : undefined} />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <RowStat label="Total distance" value={kmFormatted(scopeStats.km)} icon={<IconPin />} />
          <RowStat label="Jobs" value={`${scopeStats.count}`} icon={<IconClock />} />
          <RowStat label="Time" value={`${Math.round(scopeStats.min / 60)} h`} icon={<IconTrendUp />} />
        </div>
      </div>

      <div>
        <div className="section-title">Driver activity</div>
        <div className="card" style={{ display: "flex", gap: 8, overflowX: "auto", padding: 12 }}>
          {DRIVERS.map((d) => (
            <button
              key={d.id}
              className={`chip ${driverId === d.id ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 10px 5px 5px" }}
              onClick={() => {
                setDriverId(d.id);
                setDriverWeek(dwKeys[dwKeys.length - 1]);
              }}
            >
              <Avatar name={d.name} size={24} />
              {d.name.split(" ")[0]}
            </button>
          ))}
        </div>
        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="grow" style={{ fontWeight: 700, fontSize: 14.5 }}>{driver.name} · weekly</span>
            <span className="muted">★ {driver.rating.toFixed(1)}</span>
          </div>
          <BarChart items={driverItems} height={120} onClickItem={(i) => setDriverWeek(dwKeys[i])} />
        </div>

        {driverWeek && (
          <div className="card" style={{ marginTop: 8, padding: 6 }}>
            <div className="section-title" style={{ padding: "10px 10px 4px" }}>
              {weekLabel(driverWeek)} · jobs
            </div>
            {selJobs.length === 0 && <div className="muted" style={{ padding: "14px 10px" }}>No jobs that week.</div>}
            {selJobs.length > 0 && (
              <div>
                {selJobs.map((j) => (
                  <div className="list-item" key={j.id}>
                    <div className="li-main">
                      <div className="li-title">
                        {j.time} · {j.from} → {j.to}
                      </div>
                      <div className="li-sub">
                        {j.distanceKm} km · {j.durationMin} min
                      </div>
                    </div>
                    <span className="status ok">${(j.distanceKm * 0.62 + j.durationMin * 0.11).toFixed(1)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, padding: "10px 6px 0" }}>
                  <RowStat label="Jobs" value={`${selStats.count}`} icon={<IconClock />} />
                  <RowStat label="Distance" value={kmFormatted(selStats.km)} icon={<IconPin />} />
                  <RowStat label="Avg ride" value={`${(selStats.km / Math.max(1, selStats.count)).toFixed(1)} km`} icon={<IconCalendar />} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
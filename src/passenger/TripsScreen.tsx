import { RowStat } from "../components/Segmented";
import { IconCar, IconClock, IconPin, IconTrendUp } from "../components/Icons";

const TRIPS = [
  { id: 4, date: "Today · 9:41", from: "Westlands", to: "Kilimani", driver: "Joyce N.", fare: 5.6, vehicle: "Car" },
  { id: 3, date: "Sep 21 · 18:05", from: "CBD", to: "Riverside", driver: "Brian O.", fare: 3.8, vehicle: "Motorcycle" },
  { id: 2, date: "Sep 20 · 14:22", from: "Kilimani", to: "South B", driver: "Amina H.", fare: 8.2, vehicle: "Car" },
  { id: 1, date: "Sep 18 · 08:15", from: "Home", to: "CBD", driver: "Kevin O.", fare: 4.1, vehicle: "Motorcycle" },
];

export function TripsScreen() {
  return (
    <div className="screen">
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 className="h1">Trips</h1>
        <span className="muted">Your recent Go rides</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <RowStat label="This month" value="12 trips" icon={<IconTrendUp />} />
        <RowStat label="Total distance" value="74 km" icon={<IconPin />} />
        <RowStat label="Total spent" value="$48.70" icon={<IconCar />} />
      </div>
      <div className="card" style={{ padding: 6 }}>
        <div className="section-title" style={{ padding: "10px 10px 4px" }}>Recent</div>
        {TRIPS.map((t) => (
          <div className="list-item" key={t.id} style={{ cursor: "pointer" }}>
            <span className="row-ic" style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              <IconClock />
            </span>
            <div className="li-main">
              <div className="li-title">
                {t.from} → {t.to}
              </div>
              <div className="li-sub">
                {t.date} · {t.driver} · {t.vehicle}
              </div>
            </div>
            <span className="li-right">${t.fare.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from "react";
import { useApp } from "../AppContext";
import { Modal } from "../components/Modal";
import { Segmented } from "../components/Segmented";
import { IconCar, IconMinus, IconMotorcycle, IconPlus } from "../components/Icons";
import { weekKey } from "../mockData";
import type { ScheduleRequest } from "../types";

function Stepper({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="stepper">
      <span className="st-info">
        <span className="sic">{icon}</span>
        {label}
      </span>
      <span className="st-ctl">
        <button className="st-btn" disabled={value <= 0} onClick={() => onChange(Math.max(0, value - 1))}>
          <IconMinus />
        </button>
        <span className="st-val">{value}</span>
        <button className="st-btn" onClick={() => onChange(Math.min(20, value + 1))}>
          <IconPlus />
        </button>
      </span>
    </div>
  );
}

export function ScheduleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addSchedule, toast } = useApp();
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    return d.toISOString().slice(0, 10);
  });
  const [bikes, setBikes] = useState(4);
  const [cars, setCars] = useState(2);

  const periodLabel = () => {
    if (period === "week") {
      const d = new Date(start);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    if (period === "month") {
      const d = new Date(start);
      return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    return new Date(start).getFullYear().toString();
  };

  const submit = () => {
    const now = new Date();
    const active = period === "week" && weekKey(new Date(start)) === weekKey(now);
    const req: ScheduleRequest = {
      id: `rq-${Date.now()}`,
      createdAt: now.toDateString(),
      periodType: period,
      periodStart: new Date(start).toDateString(),
      periodLabel: periodLabel(),
      motorcycles: bikes,
      cars,
      deadline: active ? "pending" : "pending",
      active,
      requiredFound: false,
    };
    addSchedule(req);
    onClose();
    toast(`${bikes} motorcycle(s) & ${cars} car(s) scheduled for ${periodLabel()}`);
  };

  return (
    <Modal open={open} onClose={onClose} title="Schedule new drivers">
      <div className="field">
        <label className="field-label">Period</label>
        <Segmented
          options={[
            { key: "week", label: "Week" },
            { key: "month", label: "Month" },
            { key: "year", label: "Year" },
          ]}
          value={period}
          onChange={(k) => setPeriod(k as typeof period)}
        />
      </div>
      <div className="field">
        <label className="field-label">Starts on</label>
        <input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <span className="muted" style={{ fontSize: 12 }}>{periodLabel()}</span>
      </div>
      <div className="field">
        <label className="field-label">Drivers needed</label>
        <Stepper label="Motorcycle" icon={<IconMotorcycle />} value={bikes} onChange={setBikes} />
        <Stepper label="Car" icon={<IconCar />} value={cars} onChange={setCars} />
      </div>
      <button className="btn btn-primary btn-full" onClick={submit}>
        Submit schedule request
      </button>
    </Modal>
  );
}
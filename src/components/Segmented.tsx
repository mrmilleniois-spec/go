import type { ReactNode } from "react";

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button
          key={o.key}
          className={`seg-item ${value === o.key ? "active" : ""}`}
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function RowStat({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rowstat">
      {icon && <span className="rowstat-ic">{icon}</span>}
      <div>
        <div className="rowstat-label">{label}</div>
        <div className="rowstat-value">{value}</div>
      </div>
    </div>
  );
}
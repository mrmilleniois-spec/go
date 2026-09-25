import type { ReactNode } from "react";

export interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
}

export function BottomNav({
  items,
  active,
  onChange,
}: {
  items: NavItem[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <nav className="bnav">
      {items.map((it) => (
        <button
          key={it.key}
          className={`bnav-item ${active === it.key ? "active" : ""}`}
          onClick={() => onChange(it.key)}
        >
          <span className="bnav-ic">{it.icon}</span>
          <span className="bnav-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
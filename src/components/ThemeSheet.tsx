import { useApp } from "../AppContext";
import { Modal } from "./Modal";
import { IconSun, IconMoon, IconMonitor } from "./Icons";
import type { ThemePref } from "../types";

export function ThemeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, setTheme } = useApp();
  const opts: { key: ThemePref; label: string; sub: string; icon: React.ReactNode; preview: string }[] = [
    { key: "light", label: "Light", sub: "Bright and airy", icon: <IconSun />, preview: "#eef1f5" },
    { key: "dark", label: "Dark", sub: "Easy on the eyes", icon: <IconMoon />, preview: "#0a0e14" },
    { key: "system", label: "Follow device", sub: "Uses your device setting", icon: <IconMonitor />, preview: "linear-gradient(45deg,#eef1f5 0 50%,#0a0e14 50% 100%)" },
  ];
  return (
    <Modal open={open} onClose={onClose} title="Theme">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {opts.map((o) => (
          <button
            key={o.key}
            className={`theme-row ${theme === o.key ? "active" : ""}`}
            onClick={() => {
              setTheme(o.key);
              onClose();
            }}
          >
            <span className="preview" style={{ background: o.preview }}>
              {o.icon}
            </span>
            <span style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{o.label}</div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 1 }}>
                {o.sub}
              </div>
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
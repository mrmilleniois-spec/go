import { useEffect, useRef, useState } from "react";

export interface BarItem {
  label: string;
  value: number;
  display?: string;
  sub?: string;
}

export function BarChart({
  items,
  height = 150,
  accent,
  unit,
  onClickItem,
}: {
  items: BarItem[];
  height?: number;
  accent?: string;
  unit?: string;
  onClickItem?: (index: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setW(entries[0].contentRect.width);
    });
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const max = Math.max(1, ...items.map((i) => i.value));
  const pad = 6;
  const idx = hover ?? (onClickItem && items.length ? Math.max(0, items.length - 1) : null);

  return (
    <div ref={wrapRef} className="barchart" style={{ height }}>
      {items.map((it, i) => {
        const h = (it.value / max) * (height - 34);
        const barW = Math.max(0, (w - pad * (items.length - 1)) / items.length - 6);
        return (
          <div
            key={i}
            className="barbox"
            style={{ cursor: onClickItem ? "pointer" : "default" }}
            onClick={() => onClickItem?.(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="bar-label">{it.label}</div>
            <div className="bar-track">
              <div
                className={`bar ${i === idx ? "bar-accent" : ""}`}
                style={{
                  height,
                  width: barW,
                  background: i === idx ? accent ?? "var(--accent)" : "var(--bar)",
                  borderRadius: 6,
                  transition: "background .2s",
                }}
              >
                <div className="bar-fill" style={{ height: h }} />
              </div>
            </div>
            {i === idx && (
              <div className="bar-tip">
                <b>
                  {unit ?? ""}
                  {it.display ?? it.value}
                </b>
                {it.sub && <span>{it.sub}</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
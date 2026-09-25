import { useMemo, useState } from "react";
import { useApp } from "../AppContext";
import { Modal } from "../components/Modal";
import { IconCar, IconCheck, IconChevronLeft, IconChevronRight, IconClock, IconMotorcycle, IconX } from "../components/Icons";
import type { ScheduleRequest } from "../types";

type Tab = "completed" | "active" | "pendfull" | "pendshort" | "expired";

export function RequestsScreen({ onBack }: { onBack?: () => void }) {
  const { schedules } = useApp();
  const [tab, setTab] = useState<Tab>("pendshort");
  const [detail, setDetail] = useState<ScheduleRequest | null>(null);

  const groups = useMemo(() => {
    const g: Record<Tab, ScheduleRequest[]> = { completed: [], active: [], pendfull: [], pendshort: [], expired: [] };
    for (const r of schedules) {
      if (r.deadline === "expired") {
        (r.requiredFound ? g.completed : g.expired).push(r);
      } else if (r.active) {
        g.active.push(r);
      } else {
        (r.requiredFound ? g.pendfull : g.pendshort).push(r);
      }
    }
    return g;
  }, [schedules]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "completed", label: "Completed", count: groups.completed.length },
    { key: "active", label: "Active", count: groups.active.length },
    { key: "pendfull", label: "Pending · full", count: groups.pendfull.length },
    { key: "pendshort", label: "Pending · short", count: groups.pendshort.length },
    { key: "expired", label: "Expired", count: groups.expired.length },
  ];

  const list = groups[tab];

  const foundFor = (r: ScheduleRequest) => {
    const needed = r.motorcycles + r.cars;
    if (r.requiredFound) return needed;
    return Math.max(0, needed - Math.ceil(needed / 3));
  };

  const statusChip = (r: ScheduleRequest) => {
    const needed = r.motorcycles + r.cars;
    const found = foundFor(r);
    if (r.deadline === "expired" && r.requiredFound) return <span className="status ok"><IconCheck /> Completed</span>;
    if (r.deadline === "expired") return <span className="status err">Expired</span>;
    if (r.active && r.requiredFound) return <span className="status ok"><IconClock /> Active · full</span>;
    if (r.active) return <span className="status warn"><IconClock /> Active · short {found}/{needed}</span>;
    if (r.requiredFound) return <span className="status ok">Pending · full</span>;
    return <span className="status warn">Pending · {found}/{needed}</span>;
  };

  return (
    <div className="screen" style={{ paddingTop: 8, gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        {onBack && (
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <IconChevronLeft />
          </button>
        )}
        <div className="h2 grow">Requests</div>
      </div>
      <div className="chips">
          {tabs.map((t) => (
            <button key={t.key} className={`chip ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              {t.label} · {t.count}
            </button>
          ))}
        </div>

      {list.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 26 }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}><IconClock /></div>
          <div style={{ fontWeight: 700 }}>Nothing here</div>
          <div className="muted" style={{ marginTop: 4 }}>No {tab} requests yet.</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((r) => (
          <button key={r.id} className="row" style={{ alignItems: "flex-start" }} onClick={() => setDetail(r)}>
            <span className="row-ic" style={{ marginTop: 2 }}>
              {r.periodType === "week" ? <IconCheck /> : <IconCar />}
            </span>
            <span className="grow">
              <span className="row-label">{r.periodLabel}</span>
              <span className="row-sub">
                {r.periodType} · requested {r.motorcycles} × motorcycle · {r.cars} × car
              </span>
              <span style={{ display: "block", marginTop: 6 }}>{statusChip(r)}</span>
            </span>
            <IconChevronRight />
          </button>
        ))}
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Request details">
        {detail && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div className="h2">{detail.periodLabel}</div>
              <div className="muted">{detail.periodType} schedule · created {detail.createdAt}</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div className="rowstat">
                <span className="rowstat-ic"><IconMotorcycle /></span>
                <div>
                  <div className="rowstat-label">Motorcycles</div>
                  <div className="rowstat-value">{detail.motorcycles} / {detail.motorcycles}</div>
                </div>
              </div>
              <div className="rowstat">
                <span className="rowstat-ic"><IconCar /></span>
                <div>
                  <div className="rowstat-label">Cars</div>
                  <div className="rowstat-value">{detail.cars} / {detail.cars}</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {detail.requiredFound ? (
                <div className="list-item"><span className="row-ic" style={{ width: 34, height: 34 }}><IconCheck /></span> <span className="li-title">All drivers found & accepted</span></div>
              ) : (
                <>
                  <div className="list-item"><span className="row-ic" style={{ width: 34, height: 34, color: "var(--danger)", background: "var(--danger-soft)" }}><IconX /></span> <span className="li-title">Not enough drivers accepted yet</span></div>
                  <div className="li-sub muted">
                    {foundFor(detail)} of {detail.motorcycles + detail.cars} required drivers have accepted so far.
                  </div>
                </>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconClock />
                <span className="muted" style={{ fontSize: 13 }}>
                  {detail.active ? "Schedule is running now" : detail.deadline === "expired" ? "Schedule period has passed" : "Schedule hasn't started yet"}
                </span>
              </div>
            </div>
            {foundFor(detail) < detail.motorcycles + detail.cars && !detail.requiredFound && (
              <button className="btn btn-primary btn-full btn-sm" onClick={() => setDetail(null)}>
                Remind drivers to accept
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
import { useApp } from "../AppContext";
import { RowStat } from "../components/Segmented";
import { IconCard, IconCheck, IconClock, IconPin, IconWallet } from "../components/Icons";
import { FARE_PER_KM, FARE_PER_MIN, money } from "./helpers";

export function PaymentsScreen() {
  const { payments, payWeek, toast } = useApp();
  const unpaid = payments.filter((p) => !p.paid);
  const paid = payments.filter((p) => p.paid).slice(0, 6).reverse();
  const current = unpaid[0];

  return (
    <div className="screen">
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 className="h1">Payments</h1>
        <span className="muted">Settle your fleet activity weekly</span>
      </div>

      {current && (
        <div className="card" style={{ borderColor: "var(--accent)", borderWidth: 1.5 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className="status warn">Due · {current.weekLabel}</span>
            <span className="muted" style={{ fontSize: 12 }}>
              {current.totalKm} km · {current.totalMin} min
            </span>
          </div>
          <div className="balance-hero" style={{ marginBottom: 4 }}>
            <span className="muted" style={{ fontWeight: 700 }}>Amount owed</span>
            <div className="amount" style={{ fontSize: 30 }}>{money(current.amount)}</div>
          </div>
          <p className="muted" style={{ margin: "6px 0 12px", fontSize: 12 }}>
            Calculated from distance (${FARE_PER_KM}/km) and time (${FARE_PER_MIN}/min) ridden by your drivers this week.
          </p>
          <button className="btn btn-primary btn-full" onClick={() => { payWeek(current.id); toast("Payment of " + money(current.amount) + " completed"); }}>
            <IconWallet /> Pay {money(current.amount)} now
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <RowStat label="Outstanding" value={money(unpaid.reduce((a, b) => a + b.amount, 0))} icon={<IconClock />} />
        <RowStat label="Paid to date" value={`${paid.length} weeks`} icon={<IconCheck />} />
      </div>

      <div>
        <div className="section-title">Statement · weekly</div>
        <div className="card" style={{ padding: 6 }}>
          {[...unpaid, ...paid].map((p) => (
            <div className="list-item" key={p.id}>
              <span className="row-ic" style={{ background: p.paid ? "var(--accent-soft)" : "var(--surface-2)", color: p.paid ? "var(--accent)" : "var(--muted)" }}>
                {p.paid ? <IconCheck /> : <IconCard />}
              </span>
              <div className="li-main">
                <div className="li-title">{p.weekLabel}</div>
                <div className="li-sub">{p.totalKm} km · {p.totalMin} min time</div>
              </div>
              {p.paid ? (
                <span className="status ok">Paid</span>
              ) : (
                <button className="btn btn-sm btn-primary" onClick={() => { payWeek(p.id); toast("Paid " + money(p.amount)); }}>
                  {money(p.amount)} · Pay
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="muted" style={{ fontSize: 12, textAlign: "center", marginTop: 4 }}>
        <IconPin /> All statements are stored on this device for the presentation.
      </p>
    </div>
  );
}
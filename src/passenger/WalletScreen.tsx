import { useState } from "react";
import { useApp } from "../AppContext";
import { SEED_TRANSACTIONS } from "../mockData";
import { IconCard, IconPlus, IconWallet } from "../components/Icons";

export function WalletScreen() {
  const { toast } = useApp();
  const [balance, setBalance] = useState(32.4);

  const topUp = (amt: number) => {
    setBalance((b) => Math.round((b + amt) * 100) / 100);
    toast(`Added $${amt.toFixed(2)} to your wallet`);
  };

  return (
    <div className="screen">
      <div className="card balance-hero" style={{ padding: 20 }}>
        <span className="muted" style={{ fontWeight: 700 }}>Wallet balance</span>
        <div className="amount">${balance.toFixed(2)}</div>
        <span className="muted">Go wallet · used to pay for rides</span>
      </div>
      <div>
        <div className="section-title">Add money</div>
        <div className="chips" style={{ marginTop: 6 }}>
          {[5, 10, 20, 50].map((a) => (
            <button key={a} className="chip" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={() => topUp(a)}>
              <IconPlus /> ${a}
            </button>
          ))}
          <button className="chip" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={() => toast("Card setup is disabled in this demo")}>
            <IconCard /> Card
          </button>
        </div>
      </div>
      <div>
        <div className="section-title">Transactions</div>
        <div className="card" style={{ padding: 6 }}>
          {SEED_TRANSACTIONS.map((t) => (
            <div className="list-item" key={t.id}>
              <span className="row-ic" style={{ width: 40, height: 40, borderRadius: 12, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                <IconWallet />
              </span>
              <div className="li-main">
                <div className="li-title">{t.label}</div>
                <div className="li-sub">{t.date}</div>
              </div>
              <span className="li-right" style={{ color: t.kind === "credit" ? "var(--accent)" : "var(--text)" }}>
                {t.kind === "credit" ? "+" : "−"}${t.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
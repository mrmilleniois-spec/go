import { useState } from "react";
import { useApp } from "../AppContext";
import { BottomNav, type NavItem } from "../components/BottomNav";
import { IconAccount, IconChart, IconHome, IconWallet, IconPlus } from "../components/Icons";
import { BusinessHome } from "./BusinessHome";
import { ActivityScreen } from "./ActivityScreen";
import { PaymentsScreen } from "./PaymentsScreen";
import { BusinessAccount } from "./BusinessAccount";

type Screen = "home" | "activity" | "payments" | "account";

export function BusinessApp() {
  const { payments } = useApp();
  const [screen, setScreen] = useState<Screen>("home");
  const unpaid = payments.filter((p) => !p.paid).length;

  const nav: NavItem[] = [
    { key: "home", label: "Home", icon: <IconHome /> },
    { key: "activity", label: "Activity", icon: <IconChart /> },
    {
      key: "payments",
      label: "Payments",
      icon: unpaid > 0 ? (
        <span style={{ position: "relative", display: "inline-flex" }}>
          <IconWallet />
          <span className="badge-dot" />
        </span>
      ) : (
        <IconWallet />
      ),
    },
    { key: "account", label: "Account", icon: <IconAccount /> },
  ];

  return (
    <>
      {screen === "home" && <BusinessHome />}
      {screen === "activity" && <ActivityScreen />}
      {screen === "payments" && <PaymentsScreen />}
      {screen === "account" && <BusinessAccount />}
      <BottomNav items={nav} active={screen} onChange={(k) => setScreen(k as Screen)} />
      {screen === "home" && (
        <button
          className="fab-map icon-btn solid"
          style={{ position: "absolute", right: 14, bottom: "calc(96px + env(safe-area-inset-bottom))", zIndex: 1100, width: 52, height: 52, borderRadius: 18, fontSize: 22, boxShadow: "0 8px 22px var(--accent-soft)" }}
          onClick={() => setScreen("payments")}
          aria-label="New"
        >
          <IconPlus />
        </button>
      )}
    </>
  );
}
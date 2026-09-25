import { useState } from "react";
import { useApp } from "../AppContext";
import { Avatar } from "../components/Avatar";
import { Confirm } from "../components/Confirm";
import { ThemeSheet } from "../components/ThemeSheet";
import { ScheduleModal } from "./ScheduleModal";
import { AccountInfoScreen } from "./AccountInfoScreen";
import { RequestsScreen } from "./RequestsScreen";
import {
  IconCalendar,
  IconChevronRight,
  IconGlobe,
  IconInfo,
  IconLogout,
  IconMoon,
  IconTag,
  IconTrash,
} from "../components/Icons";

type Sub = "root" | "info" | "requests";

export function BusinessAccount() {
  const { business, leaveBusiness, deleteBusiness, toast } = useApp();
  const [sub, setSub] = useState<Sub>("root");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  if (sub === "info") return <AccountInfoScreen onBack={() => setSub("root")} />;
  if (sub === "requests") return <RequestsScreen onBack={() => setSub("root")} />;

  if (!business) return null;

  return (
    <div className="screen" style={{ gap: 10 }}>
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 6, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Avatar name={business.name} src={business.logo} size={56} />
        </div>
        <div style={{ textAlign: "left" }}>
          <div className="h1" style={{ fontSize: 21 }}>{business.name}</div>
          <div className="muted">{business.businessType} · {business.deliveryUse === "both" ? "both ways" : business.deliveryUse === "to" ? "deliveries out" : "deliveries in"}</div>
        </div>
      </div>

      <div>
        <div className="section-title">Business</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="row" onClick={() => setSub("info")}>
            <span className="row-ic"><IconInfo /></span>
            <span className="row-label">Account info</span>
            <IconChevronRight />
          </button>
          <button className="row" onClick={() => setScheduleOpen(true)}>
            <span className="row-ic"><IconCalendar /></span>
            <span className="row-label">Schedule new</span>
            <span className="row-sub">Hire drivers for a period</span>
            <IconChevronRight />
          </button>
          <button className="row" onClick={() => setSub("requests")}>
            <span className="row-ic"><IconTag /></span>
            <span className="row-label">Requests</span>
            <span className="row-sub">Completed · active · pending</span>
            <IconChevronRight />
          </button>
        </div>
      </div>

      <div>
        <div className="section-title">Settings</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="row" onClick={() => setThemeOpen(true)}>
            <span className="row-ic"><IconMoon /></span>
            <span className="row-label">Theme</span>
            <IconChevronRight />
          </button>
          <button className="row" onClick={() => toast("Language selection is coming soon")}>
            <span className="row-ic"><IconGlobe /></span>
            <span className="row-label">Language</span>
            <span className="status info">Soon</span>
          </button>
          <button className="row" onClick={() => setLogoutOpen(true)}>
            <span className="row-ic"><IconLogout /></span>
            <span className="row-label">Log out</span>
            <IconChevronRight />
          </button>
          <button className="row" onClick={() => setDelOpen(true)}>
            <span className="row-ic" style={{ color: "var(--danger)", background: "var(--danger-soft)" }}><IconTrash /></span>
            <span className="row-label" style={{ color: "var(--danger)" }}>Delete acc</span>
            <IconChevronRight />
          </button>
        </div>
      </div>

      <p className="muted" style={{ textAlign: "center", fontSize: 12, marginTop: 4 }}>
        Your business data stays saved on this device unless you delete it.
      </p>

      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <ThemeSheet open={themeOpen} onClose={() => setThemeOpen(false)} />
      <Confirm
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Log out of business"
        message={`Switch back to the rider side? ${business.name} stays saved on this device — you can return any time.`}
        confirmLabel="Log out"
        subtle
        onConfirm={() => {
          leaveBusiness();
          toast("Logged out — your business is safely stored");
        }}
      />
      <Confirm
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title="Delete account"
        message="This deletes your business, all schedules, requests and activity from this device. This cannot be undone."
        confirmLabel="Delete account"
        onConfirm={() => {
          deleteBusiness();
          toast("Account deleted");
        }}
      />
    </div>
  );
}
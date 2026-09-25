import { useState } from "react";
import { useApp } from "../AppContext";
import { Avatar } from "../components/Avatar";
import { Confirm } from "../components/Confirm";
import { ThemeSheet } from "../components/ThemeSheet";
import { IconBell, IconBriefcase, IconCard, IconChevronRight, IconInfo, IconLogout, IconMoon, IconShield, IconTag, IconTrash, IconUser, IconGlobe } from "../components/Icons";

export function AccountScreen({
  onOpenRegister,
}: {
  onOpenRegister: () => void;
}) {
  const { passengerName, hasBusiness, business, enterBusiness, toast, deleteBusiness } = useApp();
  const [themeOpen, setThemeOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);

  const wipeAll = () => {
    deleteBusiness();
    localStorage.removeItem("go-app-state-v1");
    window.location.reload();
  };

  if (signedOut) {
    return (
      <div className="screen" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div className="brand" style={{ marginBottom: 16 }}>Go</div>
        <h1 className="h1">Signed out</h1>
        <p className="muted" style={{ maxWidth: 260 }}>
          Your account is kept safely on this device. Sign back in anytime.
        </p>
        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: 8, maxWidth: 260 }}
          onClick={() => {
            setSignedOut(false);
            toast(`Welcome back, ${passengerName.split(" ")[0]}`);
          }}
        >
          Sign in as {passengerName}
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 className="h1">Account</h1>
      </div>

      <div className="card" style={{ display: "flex", alignItems: "center", gap: 14, padding: 18 }}>
        <div className="avatar-ring">
          <Avatar name={passengerName} size={54} />
          <span className="ring-on" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="h2">{passengerName}</div>
          <div className="muted">+254 712 345 678 · Verified</div>
        </div>
        <button className="icon-btn">
          <IconChevronRight />
        </button>
      </div>

      {!hasBusiness && (
        <button className="row" style={{ borderColor: "var(--accent)", borderWidth: 1.5, background: "var(--accent-soft)" }} onClick={onOpenRegister}>
          <span className="row-ic" style={{ background: "var(--accent)", color: "#fff" }}>
            <IconBriefcase />
          </span>
          <span>
            <span className="row-label" style={{ color: "var(--accent)" }}>Go Business</span>
            <span className="row-sub">Set up your business and manage a fleet</span>
          </span>
          <IconChevronRight />
        </button>
      )}

      {hasBusiness && (
        <button className="row" style={{ borderColor: "var(--accent)", borderWidth: 1.5, background: "var(--accent-soft)" }} onClick={() => { enterBusiness(); }}>
          <span className="row-ic" style={{ background: "var(--accent)", color: "#fff" }}>
            <IconBriefcase />
          </span>
          <span>
            <span className="row-label" style={{ color: "var(--accent)" }}>{business?.name}</span>
            <span className="row-sub">Back to your business dashboard</span>
          </span>
          <IconChevronRight />
        </button>
      )}

      <div>
        <div className="section-title">Go services</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Profile", sub: "Edit personal info", icon: <IconUser />, on: () => toast("Profile editing lives in the dashboard") },
            { label: "Safety center", sub: "Tips & support", icon: <IconShield />, on: () => toast("Safety center is a static page in this demo") },
            { label: "Promotions", sub: "Codes & offers", icon: <IconTag />, on: () => toast("No active promos right now") },
            { label: "Payments", sub: "Methods & invoices", icon: <IconCard />, on: () => toast("Payment methods are stored on your device") },
          ].map((b) => (
            <button key={b.label} className="card" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }} onClick={b.on}>
              <span className="row-ic">{b.icon}</span>
              <span style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{b.label}</div>
                <div className="muted" style={{ fontSize: 11 }}>{b.sub}</div>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="section-title">Settings</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="row" onClick={() => toast("You have 2 new notifications")}>
            <span className="row-ic"><IconBell /></span>
            <span className="row-label">Notifications</span>
            <IconChevronRight />
          </button>
          <button className="row" onClick={() => setThemeOpen(true)}>
            <span className="row-ic"><IconMoon /></span>
            <span className="row-label">Theme</span>
            <IconChevronRight />
          </button>
          <button className="row" onClick={() => toast("Privacy policy is printed in the presentation")}>
            <span className="row-ic"><IconInfo /></span>
            <span className="row-label">Privacy policy</span>
            <IconChevronRight />
          </button>
          <button className="row" onClick={() => toast("Terms of use is printed in the presentation")}>
            <span className="row-ic"><IconGlobe /></span>
            <span className="row-label">Terms of use</span>
            <IconChevronRight />
          </button>
          <button className="row" onClick={() => setLogoutOpen(true)}>
            <span className="row-ic"><IconLogout /></span>
            <span className="row-label">Log out</span>
            <IconChevronRight />
          </button>
          <button className="row" onClick={() => setDelOpen(true)}>
            <span className="row-ic" style={{ color: "var(--danger)", background: "var(--danger-soft)" }}><IconTrash /></span>
            <span className="row-label" style={{ color: "var(--danger)" }}>Delete account</span>
            <IconChevronRight />
          </button>
        </div>
      </div>

      <ThemeSheet open={themeOpen} onClose={() => setThemeOpen(false)} />
      <Confirm
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Log out"
        message={`Sign out of ${passengerName}? Your data stays saved on this device.`}
        confirmLabel="Log out"
        subtle
        onConfirm={() => setSignedOut(true)}
      />
      <Confirm
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title="Delete account"
        message="This permanently erases your Go account, any business, schedules and activity from this device. There is no undo."
        confirmLabel="Delete everything"
        onConfirm={wipeAll}
      />
    </div>
  );
}
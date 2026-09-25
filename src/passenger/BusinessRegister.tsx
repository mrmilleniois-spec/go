import { useRef, useState } from "react";
import { useApp } from "../AppContext";
import { Avatar } from "../components/Avatar";
import { IconArrowLeft, IconBriefcase } from "../components/Icons";
import type { Business, DeliveryUse } from "../types";

const TYPES = ["Restaurant", "Pharmacy", "Retail", "Fashion", "Groceries", "Electronics", "Courier / Documents", "Other"];
const USE: { key: DeliveryUse; label: string; sub: string }[] = [
  { key: "to", label: "Deliver to customers", sub: "Orders go out" },
  { key: "from", label: "Receive deliveries", sub: "Supplies come in" },
  { key: "both", label: "Both ways", sub: "Outgoing & incoming" },
];

export function BusinessRegister({ onBack }: { onBack: () => void }) {
  const { registerBusiness, toast } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [use, setUse] = useState<DeliveryUse>("both");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(f);
  };

  const submit = () => {
    if (!name.trim()) {
      toast("Give your business a name");
      return;
    }
    const biz: Business = {
      name: name.trim(),
      logo,
      businessType: type,
      deliveryUse: use,
      email: email.trim() || "accounts@" + name.trim().replace(/\s+/g, "").toLowerCase().concat(".demo"),
      phone: phone.trim() || "+254 700 000 000",
      address: address.trim() || "Unit 4, Riverside Drive",
      registeredAt: new Date().toDateString(),
    };
    registerBusiness(biz);
    toast(`${biz.name} is now on Go Business`);
  };

  return (
    <div className="screen" style={{ paddingBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <IconArrowLeft />
        </button>
        <div>
          <h1 className="h1">Set up Go Business</h1>
          <div className="muted">Register your business in under a minute</div>
        </div>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 22 }}>
        <button onClick={() => fileRef.current?.click()} style={{ position: "relative" }}>
          <Avatar name={name || "Your business"} src={logo} size={76} />
          <span
            style={{
              position: "absolute",
              right: -2,
              bottom: -2,
              background: "var(--accent)",
              color: "#fff",
              width: 26,
              height: 26,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              border: "3px solid var(--surface)",
            }}
          >
            +
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
        <div className="muted" style={{ textAlign: "center" }}>
          Logo / profile picture
          <br />
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>Upload or tap to change</span>
        </div>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 2, padding: 18 }}>
        <div className="field">
          <label className="field-label">Business name</label>
          <input className="input" placeholder="e.g. Saffron Bites" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Type of business</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div className="section-title" style={{ paddingBottom: 8 }}>Use our service for</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {USE.map((u) => (
            <button
              key={u.key}
              className={`row ${use === u.key ? "active" : ""}`}
              style={
                use === u.key
                  ? { borderColor: "var(--accent)", background: "var(--accent-soft)" }
                  : undefined
              }
              onClick={() => setUse(u.key)}
            >
              <span className="row-ic" style={use === u.key ? { background: "var(--accent)", color: "#fff" } : undefined}>
                <IconBriefcase />
              </span>
              <span>
                <span className="row-label">{u.label}</span>
                <span className="row-sub">{u.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="field">
          <label className="field-label">Contact email</label>
          <input className="input" type="email" placeholder="orders@business.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Phone</label>
          <input className="input" type="tel" placeholder="+254 7xx xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="field" style={{ marginBottom: 4 }}>
          <label className="field-label">Business address</label>
          <textarea className="input" rows={2} placeholder="Street, building, area" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
      </div>

      <button className="btn btn-primary btn-full" style={{ marginTop: 4 }} onClick={submit}>
        Create Go Business account
      </button>
      <p className="muted" style={{ textAlign: "center", maxWidth: 300, margin: "6px auto 0" }}>
        Just for the presentation — everything is stored on this device only.
      </p>
    </div>
  );
}
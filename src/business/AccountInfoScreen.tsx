import { useRef, useState } from "react";
import { useApp } from "../AppContext";
import { Avatar } from "../components/Avatar";
import { IconChevronLeft, IconPencil } from "../components/Icons";
import type { DeliveryUse } from "../types";

const TYPES = ["Restaurant", "Pharmacy", "Retail", "Fashion", "Groceries", "Electronics", "Courier / Documents", "Other"];

export function AccountInfoScreen({ onBack }: { onBack?: () => void }) {
  const { business, updateBusiness, toast } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: business?.name ?? "",
    logo: business?.logo ?? null,
    businessType: business?.businessType ?? TYPES[0],
    deliveryUse: (business?.deliveryUse ?? "both") as DeliveryUse,
    email: business?.email ?? "",
    phone: business?.phone ?? "",
    address: business?.address ?? "",
  });

  if (!business) return null;

  const set = (k: keyof typeof form, v: string | DeliveryUse | null) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => set("logo", reader.result as string);
    reader.readAsDataURL(f);
  };

  const save = () => {
    updateBusiness({ ...business, ...form, name: form.name.trim() || business.name });
    setEditing(false);
    toast("Business info updated");
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="list-item" style={{ paddingLeft: 4, paddingRight: 4 }}>
      <div className="li-main">
        <div className="li-title">{label}</div>
        <div className="li-sub">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="screen" style={{ paddingTop: 8, gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {onBack && (
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <IconChevronLeft />
          </button>
        )}
        <div className="grow">
          <div className="h2">Account info</div>
          <div className="muted" style={{ fontSize: 12 }}>Your business details</div>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={() => setEditing((e) => !e)}>
          <IconPencil /> {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {editing ? (
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <button onClick={() => fileRef.current?.click()}>
              <Avatar name={form.name || business.name} src={form.logo} size={72} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            <span className="muted" style={{ fontSize: 12 }}>Logo · tap to change</span>
          </div>
          <div className="field">
            <label className="field-label">Business name</label>
            <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Type of business</label>
            <select className="input" value={form.businessType} onChange={(e) => set("businessType", e.target.value)}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Use our service</label>
            <div className="chips">
              {(["to", "from", "both"] as DeliveryUse[]).map((u) => (
                <button
                  key={u}
                  className={`chip ${form.deliveryUse === u ? "active" : ""}`}
                  onClick={() => set("deliveryUse", u)}
                >
                  {u === "to" ? "Deliver out" : u === "from" ? "Receive in" : "Both ways"}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">Contact email</label>
            <input className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Address</label>
            <input className="input" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <button className="btn btn-primary btn-full" onClick={save}>Save changes</button>
        </div>
      ) : (
        <>
          <div className="card">
            <Row label="Business name" value={business.name} />
            <Row label="Type of business" value={business.businessType} />
            <Row
              label="Use of service"
              value={
                business.deliveryUse === "to"
                  ? "Deliver to customers"
                  : business.deliveryUse === "from"
                    ? "Receive deliveries"
                    : "Both outgoing & incoming"
              }
            />
          </div>
          <div className="card">
            <Row label="Contact email" value={business.email} />
            <Row label="Phone" value={business.phone} />
            <Row label="Address" value={business.address} />
            <Row label="Registered" value={business.registeredAt} />
          </div>
        </>
      )}
    </div>
  );
}
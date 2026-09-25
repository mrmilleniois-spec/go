import { useState } from "react";
import { useApp } from "../AppContext";
import { Avatar } from "../components/Avatar";
import { MapView } from "../components/MapView";
import { Modal } from "../components/Modal";
import { IconBriefcase, IconCall, IconChat, IconPin } from "../components/Icons";
import { FLEET_POS, fleetForSchedules } from "./helpers";
import { hashHue, weekLabel, weekKey } from "../mockData";
import type { Driver } from "../types";

function ChatSheet({ driver, onClose }: { driver: Driver; onClose: () => void }) {
  const { toast } = useApp();
  const [msgs, setMsgs] = useState([
    { me: false, text: `Hello! I'm ${driver.name}, at the pick-up point now.` },
    { me: true, text: "Great, please wait at gate B." },
  ]);
  const [draft, setDraft] = useState("");

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setMsgs((m) => [...m, { me: true, text: t }]);
    setDraft("");
    toast("Message sent");
  };

  return (
    <Modal open onClose={onClose} title={`Chat · ${driver.name.split(" ")[0]}`}>
      <div className="chat">
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.me ? "me" : "them"}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 10 }}>
        <input
          className="input grow"
          placeholder="Message your driver…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="btn btn-primary" onClick={send} style={{ padding: "0 18px" }}>
          Send
        </button>
      </div>
    </Modal>
  );
}

export function BusinessHome() {
  const { business, schedules, toast } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const [chatDriver, setChatDriver] = useState<Driver | null>(null);

  const fleet = fleetForSchedules(schedules);
  const warmHue = [24, 18, 34, 12, 28, 40, 20, 46];
  const periodLabel =
    schedules.find((s) => s.active && s.deadline !== "expired")?.periodLabel ??
    `${weekLabel(weekKey())} · scheduled`;

  return (
    <div className="map-screen">
      <MapView
        markers={fleet.map((d, i) => ({
          id: d.id,
          lat: FLEET_POS[i % FLEET_POS.length].lat,
          lng: FLEET_POS[i % FLEET_POS.length].lng,
          hue: warmHue[hashHue(d.name) % warmHue.length],
        }))}
        onInteract={() => setOpenId(null)}
      />

      <div className="biz-top">
        <div className="biz-chip">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar name={business?.name ?? "Go Business"} src={business?.logo} size={26} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="bname" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {business?.name}
              </div>
              <div className="bsub">
                <IconBriefcase /> Your fleet · {periodLabel}
              </div>
            </div>
          </div>
        </div>
        <div className="icon-btn" style={{ background: "var(--nav)", backdropFilter: "blur(12px)", border: "1px solid var(--line)" }} onClick={() => toast("Fleet summary: " + fleet.length + " vehicles active")}>
          <IconPin />
        </div>
      </div>

      <div className="wrap-drivers">
        {fleet.map((d) => (
          <div key={d.id} className={`drow ${openId === d.id ? "open" : ""}`}>
            <button className="pill" onClick={() => setOpenId(openId === d.id ? null : d.id)}>
              <Avatar name={d.name} size={34} />
              <span className="pill-name">{d.name}</span>
              <span className="vtag">{d.vehicleType === "motorcycle" ? "Bike" : "Car"}</span>
              <span className="dot" />
            </button>
            <div className="pill-actions">
              <button
                className="pact"
                title="Chat"
                onClick={() => {
                  setChatDriver(d);
                  setOpenId(null);
                }}
              >
                <IconChat />
              </button>
              <button
                className="pact"
                title="Call"
                onClick={() => toast(`Calling ${d.name.split(" ")[0]}…`)}
              >
                <IconCall />
              </button>
            </div>
          </div>
        ))}
      </div>

      {chatDriver && <ChatSheet driver={chatDriver} onClose={() => setChatDriver(null)} />}
    </div>
  );
}
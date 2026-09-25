import { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import { Avatar } from "../components/Avatar";
import {
  IconArrowRight,
  IconCard,
  IconCar,
  IconChat,
  IconChevronLeft,
  IconClock,
  IconMotorcycle,
  IconPin,
  IconX,
} from "../components/Icons";

const RIDE_TYPES = [
  { key: "motorcycle", name: "Motorcycle", eta: "12 min", fare: 3.8, icon: <IconMotorcycle /> },
  { key: "car", name: "Car", eta: "8 min", fare: 5.6, icon: <IconCar /> },
  { key: "premium", name: "Premium", eta: "6 min", fare: 8.9, icon: <IconCar /> },
];

type RidePhase = "idle" | "finding" | "matched";

export function OrderPanel({
  expanded,
  onExpand,
  onCollapse,
}: {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}) {
  const { toast, passengerName } = useApp();
  const [rideType, setRideType] = useState("car");
  const [dest, setDest] = useState("Silverstone Mall, Kilimani");
  const [phase, setPhase] = useState<RidePhase>("idle");
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer) clearTimeout(timer);
  }, [timer]);

  const selected = RIDE_TYPES.find((r) => r.key === rideType)!;

  const requestRide = () => {
    setPhase("finding");
    const t = setTimeout(() => setPhase("matched"), 2600);
    setTimer(t);
  };

  const cancelRide = () => {
    if (timer) clearTimeout(timer);
    setPhase("idle");
    toast("Ride cancelled");
    onCollapse();
  };

  const matchedDriver = { name: "Joyce Njoroge", vehicle: "Toyota · KDA 223F" };

  return (
    <div className="op-wrap">
      {phase !== "idle" ? (
        <div className="op">
          {phase === "finding" ? (
            <div className="op-busy">
              <div className="spinner" />
              <div>
                <div className="h2" style={{ textAlign: "center" }}>Finding your {RIDE_TYPES.find((r) => r.key === rideType)?.name.toLowerCase()}…</div>
                <div className="muted" style={{ textAlign: "center", marginTop: 4 }}>
                  {selected.name} · {dest}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={cancelRide}>
                Cancel request
              </button>
            </div>
          ) : (
            <div style={{ padding: "14px 14px 16px" }}>
              <div className="op-matched">
                <Avatar name={matchedDriver.name} size={46} />
                <div className="m-info">
                  <div className="m-name">{matchedDriver.name}</div>
                  <div className="m-sub">
                    {matchedDriver.vehicle} · arriving in ~6 min
                  </div>
                </div>
                <button className="icon-btn solid" title="Message" onClick={() => toast(`Chatting with ${matchedDriver.name.split(" ")[0]}`)} style={{ fontSize: 17 }}>
                  <IconChat />
                </button>
              </div>
              <button className="btn btn-danger btn-full btn-sm" onClick={cancelRide}>
                Cancel ride
              </button>
            </div>
          )}
        </div>
      ) : expanded ? (
        <div className="op op-exp">
          <div className="op-exp-head">
            <button className="icon-btn" onClick={onCollapse} aria-label="Back">
              <IconChevronLeft />
            </button>
            <span className="ttl">Go ride</span>
            <span />
          </div>
          <div className="op-field">
            <span className="fpin">
              <IconPin />
            </span>
            <input value="Home · Westlands" readOnly />
            <span className="fsub">Home</span>
          </div>
          <div className="op-field bottom">
            <span className="fpin">
              <IconPin />
            </span>
            <input
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              placeholder="Where to?"
            />
            <span className="fsub">Drop-off</span>
          </div>
          <div className="op-types">
            {RIDE_TYPES.map((r) => (
              <button
                key={r.key}
                className={`op-type ${rideType === r.key ? "active" : ""}`}
                onClick={() => setRideType(r.key)}
              >
                <span className="tic">{r.icon}</span>
                <span>{r.name}</span>
                <span className="eta">{r.eta}</span>
                <span className="fare">${r.fare.toFixed(2)}</span>
              </button>
            ))}
          </div>
          <div className="op-rowline">
            <span>Pick-up</span>
            <b>Now</b>
          </div>
          <div className="op-rowline">
            <span>Payment</span>
            <b>
              <IconCard /> Wallet · $32.40
            </b>
          </div>
          <button className="btn btn-primary btn-full op-submit" onClick={requestRide}>
            Request {selected.name} · <span style={{ fontWeight: 900 }}>${selected.fare.toFixed(2)}</span>
          </button>
        </div>
      ) : (
        <div className="op op-min">
          <div className="op-pin">
            <IconPin />
          </div>
          <button className="op-fake" onClick={onExpand}>
            Where are you going, {passengerName.split(" ")[0]}?
          </button>
          <button className="op-go" onClick={onExpand}>
            Go <IconArrowRight />
          </button>
        </div>
      )}
      {expanded && phase === "idle" && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 10, gap: 8 }}
        >
          <button
            className="chip"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => toast("This is a demo — no live scheduled rides")}
          >
            <IconClock /> Scheduled
          </button>
          <button
            className="chip"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={onCollapse}
          >
            <IconX /> Close
          </button>
        </div>
      )}
    </div>
  );
}
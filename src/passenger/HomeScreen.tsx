import { useState } from "react";
import { MapView } from "../components/MapView";
import { OrderPanel } from "./OrderPanel";
import { IconAccount } from "../components/Icons";

const FROM = { lat: -1.2649, lng: 36.8066 };
const TO = { lat: -1.2894, lng: 36.7842 };

export function HomeScreen({ onOpenAccount }: { onOpenAccount: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="map-screen">
      <MapView route={{ from: FROM, to: TO }} onInteract={() => setExpanded(false)} />
      {expanded && <div className="op-scrim" onClick={() => setExpanded(false)} />}
      <div className="home-top">
        <div className="brand">Go</div>
        <button className="icon-btn" onClick={onOpenAccount} aria-label="Account">
          <IconAccount />
        </button>
      </div>
      <OrderPanel expanded={expanded} onExpand={() => setExpanded(true)} onCollapse={() => setExpanded(false)} />
    </div>
  );
}
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  hue?: number;
}

export interface MapRoute {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
}

export function MapView({
  interactive = true,
  markers = [],
  route,
  center,
  zoom = 14,
  onInteract,
}: {
  interactive?: boolean;
  markers?: MapMarker[];
  route?: MapRoute;
  center?: { lat: number; lng: number };
  zoom?: number;
  onInteract?: () => void;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const propsRef = useRef({ markers, route, onInteract, interactive });
  propsRef.current = { markers, route, onInteract, interactive };

  const NAIROBI = { lat: -1.286389, lng: 36.817223 };
  const initialCenter = center ?? NAIROBI;

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;
    const map = L.map(divRef.current, {
      center: initialCenter,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
    map.on("dragstart zoomstart", () => {
      if (propsRef.current.interactive) propsRef.current.onInteract?.();
    });
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map && center) map.setView([center.lat, center.lng]);
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const { route: r, markers: ms } = propsRef.current;

    for (const m of ms) {
      const icon = L.divIcon({
        className: "fleet-pin",
        html: `<div class="pin-dot" style="background:hsl(${m.hue ?? 0} 78% 48%)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker([m.lat, m.lng], { icon }).addTo(layer);
    }

    if (r) {
      L.polyline(
        [
          [r.from.lat, r.from.lng],
          [r.to.lat, r.to.lng],
        ],
        { color: "var(--accent)", weight: 5, opacity: 0.85 }
      ).addTo(layer);
      const a = L.divIcon({
        className: "route-pin",
        html: `<div class="pin-a"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      const b = L.divIcon({
        className: "route-pin",
        html: `<div class="pin-b"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      L.marker([r.from.lat, r.from.lng], { icon: a }).addTo(layer);
      L.marker([r.to.lat, r.to.lng], { icon: b }).addTo(layer);
    }
  }, []);

  return <div className="map" ref={divRef} />;
}
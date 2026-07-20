"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type Vessel,
} from "@/lib/live-vessel-traffic";

/** Larger, high-contrast cargo ship marker for map readability */
function createShipIcon(vessel: Vessel, highlighted = false) {
  const color = STATUS_COLORS[vessel.status];
  const heading = vessel.heading ?? 0;
  const size = highlighted ? 40 : 32;

  const html = `
    <div style="
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      transform:rotate(${heading}deg);
      filter:drop-shadow(0 2px 3px rgba(0,0,0,.55));
      ${highlighted ? "outline:3px solid #fff;outline-offset:2px;border-radius:50%;" : ""}
    ">
      <svg width="${size - 2}" height="${size - 2}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="16" cy="16" rx="14" ry="14" fill="white" opacity="0.92"/>
        <path d="M5 18.5 L7.5 24.5 H24.5 L27 18.5 H5 Z"
          fill="${color}" stroke="#0f172a" stroke-width="0.9"/>
        <rect x="8" y="15" width="16" height="3.5" rx="0.6" fill="${color}"/>
        <rect x="8.5" y="11.2" width="4" height="3.8" rx="0.45" fill="#fff"/>
        <rect x="13.2" y="11.2" width="4" height="3.8" rx="0.45" fill="#fff" opacity="0.85"/>
        <rect x="17.9" y="11.2" width="4" height="3.8" rx="0.45" fill="#fff"/>
        <rect x="21.2" y="8.5" width="4.8" height="6.5" rx="0.55" fill="${color}" stroke="#0f172a" stroke-width="0.5"/>
        <rect x="22.1" y="9.4" width="1.4" height="1.5" rx="0.2" fill="#e0f2fe"/>
        <rect x="24" y="9.4" width="1.4" height="1.5" rx="0.2" fill="#e0f2fe"/>
        <rect x="22.6" y="5.8" width="1.8" height="2.8" rx="0.3" fill="#0f172a" opacity="0.7"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: "mfresh-ship-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 - 2)],
  });
}

function MapResizeFix({ isVisible = true }: { isVisible?: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!isVisible) return;
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map, isVisible]);
  return null;
}

function FlyToVessel({ vessel }: { vessel: Vessel | null }) {
  const map = useMap();
  useEffect(() => {
    if (!vessel) return;
    map.flyTo([vessel.lat, vessel.lng], Math.max(map.getZoom(), 6), {
      duration: 1.2,
    });
  }, [map, vessel]);
  return null;
}

interface LiveVesselMapProps {
  vessels: Vessel[];
  isVisible?: boolean;
  focusedVesselId?: string | null;
}

export function LiveVesselMap({
  vessels,
  isVisible = true,
  focusedVesselId = null,
}: LiveVesselMapProps) {
  const focused = useMemo(
    () => vessels.find((v) => v.id === focusedVesselId) ?? null,
    [vessels, focusedVesselId],
  );

  const markers = useMemo(
    () =>
      vessels.map((vessel) => ({
        vessel,
        icon: createShipIcon(vessel, vessel.id === focusedVesselId),
      })),
    [vessels, focusedVesselId],
  );

  return (
    <MapContainer
      center={[18, 55]}
      zoom={3}
      minZoom={2}
      maxZoom={18}
      scrollWheelZoom
      zoomControl
      className="h-full w-full"
      worldCopyJump
    >
      <TileLayer
        attribution='Map data &copy; <a href="https://www.google.com/maps">Google</a>'
        url="https://mt{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
        subdomains={["0", "1", "2", "3"]}
        maxZoom={20}
      />
      <MapResizeFix isVisible={isVisible} />
      <FlyToVessel vessel={focused} />
      {markers.map(({ vessel, icon }) => (
        <Marker
          key={vessel.id}
          position={[vessel.lat, vessel.lng]}
          icon={icon}
          zIndexOffset={vessel.id === focusedVesselId ? 1000 : 0}
        >
          <Popup>
            <div className="min-w-[200px] space-y-1 text-sm">
              <p className="font-bold text-dark-gray">{vessel.name}</p>
              <p className="text-xs font-medium text-primary">
                Ref: {vessel.referenceNo}
              </p>
              <p className="text-xs text-muted">
                {STATUS_LABELS[vessel.status]} · {vessel.type}
              </p>
              <p className="text-xs">
                <span className="font-medium">Cargo:</span> {vessel.cargo}
              </p>
              <p className="text-xs text-muted">
                {vessel.origin} → {vessel.destination}
              </p>
              <p className="text-xs text-muted">{vessel.speedKnots} kn</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

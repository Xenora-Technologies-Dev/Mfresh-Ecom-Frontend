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
function createShipIcon(vessel: Vessel) {
  const color = STATUS_COLORS[vessel.status];
  const heading = vessel.heading ?? 0;

  const html = `
    <div style="
      width:32px;height:32px;
      display:flex;align-items:center;justify-content:center;
      transform:rotate(${heading}deg);
      filter:drop-shadow(0 2px 3px rgba(0,0,0,.55));
    ">
      <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <!-- white outline plate for contrast on any basemap -->
        <ellipse cx="16" cy="16" rx="14" ry="14" fill="white" opacity="0.92"/>
        <!-- hull -->
        <path d="M5 18.5 L7.5 24.5 H24.5 L27 18.5 H5 Z"
          fill="${color}" stroke="#0f172a" stroke-width="0.9"/>
        <!-- deck -->
        <rect x="8" y="15" width="16" height="3.5" rx="0.6" fill="${color}"/>
        <!-- containers -->
        <rect x="8.5" y="11.2" width="4" height="3.8" rx="0.45" fill="#fff"/>
        <rect x="13.2" y="11.2" width="4" height="3.8" rx="0.45" fill="#fff" opacity="0.85"/>
        <rect x="17.9" y="11.2" width="4" height="3.8" rx="0.45" fill="#fff"/>
        <!-- bridge -->
        <rect x="21.2" y="8.5" width="4.8" height="6.5" rx="0.55" fill="${color}" stroke="#0f172a" stroke-width="0.5"/>
        <rect x="22.1" y="9.4" width="1.4" height="1.5" rx="0.2" fill="#e0f2fe"/>
        <rect x="24" y="9.4" width="1.4" height="1.5" rx="0.2" fill="#e0f2fe"/>
        <!-- funnel -->
        <rect x="22.6" y="5.8" width="1.8" height="2.8" rx="0.3" fill="#0f172a" opacity="0.7"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: "mfresh-ship-marker",
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14],
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

interface LiveVesselMapProps {
  vessels: Vessel[];
  isVisible?: boolean;
}

export function LiveVesselMap({ vessels, isVisible = true }: LiveVesselMapProps) {
  const markers = useMemo(
    () =>
      vessels.map((vessel) => ({
        vessel,
        icon: createShipIcon(vessel),
      })),
    [vessels],
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
      {/* Google Maps roadmap look — blue seas, greenery, country labels */}
      <TileLayer
        attribution='Map data &copy; <a href="https://www.google.com/maps">Google</a>'
        url="https://mt{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
        subdomains={["0", "1", "2", "3"]}
        maxZoom={20}
      />
      <MapResizeFix isVisible={isVisible} />
      {markers.map(({ vessel, icon }) => (
        <Marker
          key={vessel.id}
          position={[vessel.lat, vessel.lng]}
          icon={icon}
        >
          <Popup>
            <div className="min-w-[180px] space-y-1 text-sm">
              <p className="font-bold text-dark-gray">{vessel.name}</p>
              <p className="text-xs text-muted">
                {STATUS_LABELS[vessel.status]} · {vessel.type}
              </p>
              <p className="text-xs">
                <span className="font-medium">Cargo:</span> {vessel.cargo}
              </p>
              <p className="text-xs text-muted">
                {vessel.region} · {vessel.port}
              </p>
              <p className="text-xs text-muted">{vessel.speedKnots} kn</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

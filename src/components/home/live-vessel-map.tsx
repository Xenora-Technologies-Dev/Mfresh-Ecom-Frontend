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

function createShipIcon(vessel: Vessel) {
  const color = STATUS_COLORS[vessel.status];
  return L.divIcon({
    className: "mfresh-ship-marker",
    html: `<div style="
      width:0;height:0;
      border-left:6px solid transparent;
      border-right:6px solid transparent;
      border-bottom:14px solid ${color};
      transform:rotate(${vessel.heading}deg);
      filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4));
    "></div>`,
    iconSize: [12, 14],
    iconAnchor: [6, 7],
  });
}

function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

interface LiveVesselMapProps {
  vessels: Vessel[];
}

export function LiveVesselMap({ vessels }: LiveVesselMapProps) {
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
      maxZoom={12}
      scrollWheelZoom
      zoomControl
      className="h-full w-full rounded-xl"
      worldCopyJump
    >
      {/* Google Maps–style: blue seas, light land, borders, country/city labels */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <MapResizeFix />
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

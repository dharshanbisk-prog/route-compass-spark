import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Stop } from "@/lib/floyd-warshall";

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const busIcon = new L.DivIcon({
  html: `<div style="background: linear-gradient(135deg, hsl(200,80%,45%), hsl(175,70%,40%)); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:16px; box-shadow: 0 4px 15px rgba(0,150,200,0.4); border: 2px solid white;">🚌</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const activeIcon = new L.DivIcon({
  html: `<div style="background: linear-gradient(135deg, hsl(30,90%,55%), hsl(15,85%,50%)); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:18px; box-shadow: 0 4px 20px rgba(255,140,0,0.5); border: 3px solid white; animation: pulse 1.5s infinite;">🚌</div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function FitBounds({ stops }: { stops: Stop[] }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stops, map]);
  return null;
}

interface RouteMapProps {
  stops: Stop[];
  pathStops?: Stop[];
  className?: string;
}

export default function RouteMap({ stops, pathStops = [], className = "" }: RouteMapProps) {
  const pathCoords = pathStops.map(s => [s.lat, s.lng] as [number, number]);
  const pathIds = new Set(pathStops.map(s => s.id));

  return (
    <div className={`rounded-xl overflow-hidden border border-border shadow-lg ${className}`}>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={12}
        style={{ height: "100%", width: "100%", minHeight: 400 }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds stops={pathStops.length > 0 ? pathStops : stops} />
        {stops.map(stop => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={pathIds.has(stop.id) ? activeIcon : busIcon}
          >
            <Popup>
              <strong>{stop.name}</strong>
              <br />
              {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
            </Popup>
          </Marker>
        ))}
        {pathCoords.length > 1 && (
          <Polyline
            positions={pathCoords}
            pathOptions={{
              color: "#0ea5e9",
              weight: 5,
              opacity: 0.8,
              dashArray: "10 6",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

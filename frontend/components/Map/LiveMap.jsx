"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapUpdater({ center, isUserPos, recenterTrigger }) {
  const map = useMap();
  const [hasInitialCentered, setHasInitialCentered] = useState(false);

  useEffect(() => {
    if (center && center[0] && center[1]) {
      // Priority 1: Force Recenter on Trigger
      if (recenterTrigger) {
        map.flyTo(center, 15, { duration: 1.5 });
      } 
      // Priority 2: Initial Center on User
      else if (isUserPos && !hasInitialCentered) {
        map.flyTo(center, 15, { duration: 2 });
        setHasInitialCentered(true);
      } 
      // Priority 3: First visual catch if no user pos
      else if (!hasInitialCentered) {
        map.setView(center, map.getZoom());
        setHasInitialCentered(true);
      }
    }
  }, [center, map, recenterTrigger, isUserPos, hasInitialCentered]);
  return null;
}

// Fix for default marker icons not showing in react-leaflet due to Webpack
delete L.Icon.Default.prototype._getIconUrl;

const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = createIcon('red');
const greenIcon = createIcon('green');
const blueIcon = createIcon('blue');
const violetIcon = createIcon('violet');

export default function LiveMap({ lat, lng, markers = [], popupText="Selected Location", recenterTrigger }) {
  // If no markers array provided, use the single lat/lng
  const displayMarkers = markers.length > 0 ? markers : (lat && lng ? [{ lat, lng, popupText, type: 'default' }] : []);
  
  if (displayMarkers.length === 0) return null;

  // Center on the first marker or provided lat/lng
  const center = lat && lng ? [lat, lng] : [displayMarkers[0].lat, displayMarkers[0].lng];

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full min-h-[400px] z-0"
      >
        <MapUpdater center={center} isUserPos={!!(lat && lng)} recenterTrigger={recenterTrigger} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {displayMarkers.map((m, i) => (
          <Marker 
            key={i} 
            position={[m.lat, m.lng]} 
            icon={m.type === 'waste' ? redIcon : m.type === 'donation' ? greenIcon : m.type === 'ngo' ? violetIcon : blueIcon}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-slate-800 m-0">{m.popupText}</p>
                {m.details && <p className="text-xs text-slate-500 m-0 mt-1">{m.details}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { CrisisPacket } from '../types';
import { getPackets } from '../firebase';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSettings } from '../SettingsContext';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons based on severity
const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const criticalIcon = createCustomIcon('#EF4444');
const highIcon = createCustomIcon('#F59E0B');
const lowIcon = createCustomIcon('#3B82F6');

interface MapComponentProps {
  onSelectPacket?: (packet: CrisisPacket) => void;
  height?: string;
  className?: string;
}

const BUCHAREST_CENTER = { lat: 44.4268, lng: 26.1025 };

function MapUpdater({ center }: { center: { lat: number, lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

export function MapComponent({ onSelectPacket, height = '300px', className = '' }: MapComponentProps) {
  const [packets, setPackets] = useState<CrisisPacket[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(BUCHAREST_CENTER);
  const { mapStyle } = useSettings();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation failed, defaulting to Bucharest', error);
        }
      );
    }

    const fetchPackets = async () => {
      try {
        const data = await getPackets();
        const validPackets = (data as CrisisPacket[]).filter(p => p.lat && p.lng);
        setPackets(validPackets);
      } catch (e) {
        console.error('Error fetching packets for map', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPackets();
  }, []);

  const getTileUrl = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'streets':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'tactical':
      default:
        // Dark theme map (Stadia Alidade Smooth Dark fallback if Carto fails, or Carto Dark Matter)
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
  };

  const mapAttribution = mapStyle === 'satellite' 
    ? 'Tiles &copy; Esri' 
    : mapStyle === 'streets' 
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div className={`w-full bg-surface border border-mist/30 rounded-2xl overflow-hidden relative z-0 ${className}`} style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cloud/50 backdrop-blur-sm z-[1000]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
        </div>
      )}
      
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={12} 
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <MapUpdater center={center} />
        <TileLayer
          attribution={mapAttribution}
          url={getTileUrl()}
        />
        {packets.map((packet, i) => (
          <Marker 
            key={packet.id || i}
            position={[packet.lat!, packet.lng!]} 
            icon={packet.severity === 'critical' ? criticalIcon : packet.severity === 'high' ? highIcon : lowIcon}
          >
            <Popup className="signalpack-popup">
               <div className="p-1 min-w-[150px]">
                 <div className="flex items-center gap-2 mb-1">
                   {packet.severity === 'critical' ? <ShieldAlert className="w-4 h-4 text-[#EF4444]" /> : <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />}
                   <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>{packet.incident_type}</span>
                 </div>
                 <p className="text-xs font-semibold mb-2" style={{ color: '#0F1115' }}>"{packet.location_text}"</p>
                 <button 
                   onClick={() => onSelectPacket?.(packet)}
                   className="w-full py-1.5 bg-[#3B82F6] text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors hover:bg-blue/90 border-0"
                 >
                   View Packet
                 </button>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

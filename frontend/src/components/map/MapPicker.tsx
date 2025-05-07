import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

interface Props {
  onPick: (coords: { latitude: number; longitude: number }) => void;
  defaultCoords?: { latitude: number; longitude: number };
}

const LocationMarker = ({ onPick }: { onPick: Props["onPick"] }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPick({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
};

const MapPicker = ({ onPick, defaultCoords }: Props) => {
  return (
    <MapContainer
      center={[defaultCoords?.latitude || 32, defaultCoords?.longitude || -6]}
      zoom={6}
      scrollWheelZoom={true}
      style={{ height: '300px', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onPick={onPick} />
    </MapContainer>
  );
};

export default MapPicker;

// src/components/LunarMap.tsx
import { MapContainer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const mapStyle = {
  height: '350px',
  width: '100%',
  borderRadius: '1.5rem',
  marginBottom: '1.5rem',
  boxShadow: '0 0 24px 0 rgba(0,0,0,0.1)'
};

export default function LunarMap() {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      minZoom={0}
      maxZoom={7}
      style={mapStyle}
      scrollWheelZoom={true}
      crs={undefined}
    >
      <WMSTileLayer
        url="http://luna.iaaras.ru/lunaserv/wms"
        layers="Lunar_LRO_LOLA_DEM_118m"
        format="image/png"
        transparent={true}
        version="1.1.1"
        attribution="IAARAS LunaServ"
      />
    </MapContainer>
  );
}

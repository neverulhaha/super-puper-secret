import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const mapStyle: React.CSSProperties = {
  height: '400px',
  width: '100%',
  borderRadius: '1.5rem',
  marginTop: '1rem'
};

export default function LunarMap() {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      minZoom={1}
      maxZoom={8}
      style={mapStyle}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='NASA/USGS'
        url="https://ode.rsl.wustl.edu/moon/content/tiles/basemap/{z}/{x}/{y}.png"
        maxZoom={8}
        minZoom={1}
      />
    </MapContainer>
  );
}

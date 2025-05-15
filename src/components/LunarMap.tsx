import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const mapStyle = {
  height: '350px',
  width: '100%',
  borderRadius: '1.5rem',
  marginBottom: '1.5rem',
  boxShadow: '0 0 24px 0 rgba(0,0,0,0.1)',
};

export default function LunarMap() {
  return (
    <MapContainer
        className="w-full h-full rounded-2xl shadow"
      center={[0, 0]}
      zoom={2}
      minZoom={0}
      maxZoom={7}
      style={mapStyle}
      scrollWheelZoom={true}
      worldCopyJump={false}
      maxBounds={[[90, -180], [-90, 180]]}
    >
      <TileLayer
        attribution="NASA MoonTrek"
        url="https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0//default/default028mm/{z}/{x}/{y}.jpg"
        maxZoom={7}
        minZoom={0}
        noWrap={true}
      />
    </MapContainer>
  );
}

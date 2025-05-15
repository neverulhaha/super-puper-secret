import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LunarMap() {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      minZoom={0}
      maxZoom={7}
      scrollWheelZoom={true}
      worldCopyJump={false}
      maxBounds={[[90, -180], [-90, 180]]}
      className="w-full h-full rounded-2xl"
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

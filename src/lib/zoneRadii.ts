export const ZONE_RADII: Record<string, number> = {
  module: 0.1,
  launch: 0.1,
  lab: 0.1,
  power: 0.1,
  storage: 0.1,
};

export const getZoneRadius = (typeKey: string) => ZONE_RADII[typeKey] || 0.21;

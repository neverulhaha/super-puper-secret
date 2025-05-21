export const ZONE_RADII: Record<string, number> = {
  module: 0.21,
  launch: 0.27,
  lab: 0.22,
  power: 0.26,
  storage: 0.22,
};

export const getZoneRadius = (typeKey: string) => ZONE_RADII[typeKey] || 0.21;

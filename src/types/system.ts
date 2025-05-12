export interface System {
  id: string;
  name: string;
  icon_name: string | null;
  status: 'optimal' | 'warning' | 'error';
  details: string | null;
  metrics: Record<string, any>;
  owner_id: string;
}

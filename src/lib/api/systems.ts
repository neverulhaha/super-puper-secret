import { supabase } from '../supabase';
import { System } from '@/types/system';

export const fetchSystems = async (): Promise<System[]> => {
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = data?.user;
  if (!user) throw new Error('User not found');

  const { data: systems, error } = await supabase
    .from('systems')
    .select('*')
    .eq('owner_id', user.id);

  if (error) throw error;
  return systems;
};

export const createSystem = async (system: Omit<System, 'id' | 'owner_id'>) => {
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = data?.user;
  if (!user) throw new Error('User not found');

  const { data: systemData, error } = await supabase
    .from('systems')
    .insert([{ ...system, owner_id: user.id }])
    .single();

  if (error) throw error;
  return systemData;
};

export const updateSystemStatus = async (id: string, status: 'optimal' | 'warning' | 'error') => {
  const { data, error } = await supabase
    .from('systems')
    .update({ status })
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const deleteSystem = async (id: string) => {
  const { data, error } = await supabase
    .from('systems')
    .delete()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

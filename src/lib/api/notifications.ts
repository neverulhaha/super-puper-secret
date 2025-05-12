import { supabase } from '../supabase';
import { Notification } from '@/types/notification';

export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = data?.user;
  if (!user) throw new Error('User not found');

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('owner_id', user.id)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return notifications;
};

export const createNotification = async (notification: Omit<Notification, 'id' | 'owner_id'>) => {
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = data?.user;
  if (!user) throw new Error('User not found');

  const { data: notificationData, error } = await supabase
    .from('notifications')
    .insert([{ ...notification, owner_id: user.id }])
    .single();

  if (error) throw error;
  return notificationData;
};

export const deleteNotification = async (id: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

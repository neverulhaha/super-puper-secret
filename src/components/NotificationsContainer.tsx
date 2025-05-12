'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Notification } from '@/types/notification';
import { fetchNotifications } from '@/lib/api/notifications';
import NotificationsList from './NotificationsList';

const NotificationsContainer = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        toast.success('Уведомления успешно загружены!');
      } catch (error) {
        setError('Ошибка при загрузке уведомлений');
        toast.error('Ошибка при загрузке уведомлений!');
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, []);

  return (
    <div>
      {loading && <p>Загружаем уведомления...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <NotificationsList notifications={notifications} />
    </div>
  );
};

export default NotificationsContainer;

import React from 'react';
import { Notification } from '@/types/notification';

interface NotificationsListProps {
  notifications: Notification[];
}

const NotificationsList: React.FC<NotificationsListProps> = ({ notifications }) => {
  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">Нет уведомлений</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border rounded-md shadow-sm ${
              notification.type === 'info'
                ? 'bg-blue-100 border-blue-300'
                : notification.type === 'warning'
                ? 'bg-yellow-100 border-yellow-300'
                : 'bg-red-100 border-red-300'
            }`}
          >
            <h3 className="text-lg font-semibold">{notification.title}</h3>
            <p className="mt-1">{notification.message}</p>
            <small className="text-gray-400">{new Date(notification.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsList;

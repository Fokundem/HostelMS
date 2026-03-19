import React, { createContext, useContext, useMemo } from 'react';
import type { NotificationContextType } from '@/types';
import { useDeleteNotification, useMarkAllNotificationsRead, useMarkNotificationRead, useMyNotifications } from '@/hooks/api';
// Removed useAuth to avoid circular import

import { getAuthToken } from '@/lib/api-client';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // Only fetch notifications if user has a token
  const isAuthenticated = !!getAuthToken();
  const { data: notifications = [] } = useMyNotifications(false, { enabled: isAuthenticated });
  const unreadCount = useMemo(() => notifications.filter((n: any) => !n.read).length, [notifications]);

  const { mutate: markAsReadMut } = useMarkNotificationRead();
  const { mutate: markAllAsReadMut } = useMarkAllNotificationsRead();
  const { mutate: deleteNotificationMut } = useDeleteNotification();

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification: () => undefined,
        markAsRead: (id: string) => markAsReadMut(id),
        markAllAsRead: () => markAllAsReadMut(),
        deleteNotification: (id: string) => deleteNotificationMut(id),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

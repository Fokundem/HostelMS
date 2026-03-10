import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Notification, NotificationContextType } from '@/types';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: 'all',
    title: 'Welcome to Hostel Management System',
    message: 'Your account has been successfully created. Explore the dashboard to get started.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    link: '/student/dashboard',
  },
  {
    id: '2',
    userId: 'all',
    title: 'Room Allocation Approved',
    message: 'Your room request for Room A12 has been approved. You can now move in.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    link: '/student/dashboard',
  },
  {
    id: '3',
    userId: 'all',
    title: 'Payment Reminder',
    message: 'Your hostel fee payment of 50,000 FCFA is due in 3 days.',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    link: '/student/dashboard',
  },
  {
    id: '4',
    userId: '1',
    title: 'New Complaint Submitted',
    message: 'A new maintenance complaint has been submitted by John Doe.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    link: '/admin/complaints',
  },
  {
    id: '5',
    userId: '1',
    title: 'Room Allocation Request',
    message: 'Mary Johnson has requested room allocation. Please review.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    link: '/admin/allocations',
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

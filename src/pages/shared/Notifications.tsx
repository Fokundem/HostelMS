import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  Check,
  Trash2,
  Filter,
  Home,
  CreditCard,
  MessageSquare,
  BedDouble,
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Info className="w-5 h-5 text-blue-600" />;
  }
};

const getNotificationBg = (type: string, read: boolean) => {
  if (read) return 'bg-white border-gray-200';
  switch (type) {
    case 'success':
      return 'bg-emerald-50 border-emerald-200';
    case 'warning':
      return 'bg-amber-50 border-amber-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-blue-50 border-blue-200';
  }
};

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll('.notification-item');
      gsap.fromTo(
        items,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' }
      );
    }
  }, [notifications, filter]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationLinkIcon = (link?: string) => {
    if (!link) return null;
    if (link.includes('room')) return <BedDouble className="w-4 h-4" />;
    if (link.includes('payment')) return <CreditCard className="w-4 h-4" />;
    if (link.includes('complaint')) return <MessageSquare className="w-4 h-4" />;
    return <Home className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className={`px-4 py-2 flex items-center gap-2 transition-colors border ${
              filter === 'unread'
                ? 'bg-[#1a56db] border-[#1a56db] text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <Filter className="w-4 h-4" />
            {filter === 'unread' ? 'Show All' : 'Show Unread'}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-primary flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div ref={listRef} className="space-y-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item relative p-4 border transition-all ${getNotificationBg(notification.type, notification.read)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-gray-500 text-sm mt-0.5">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-gray-400 text-xs">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        {notification.link && (
                          <a
                            href={notification.link}
                            className="text-[#1a56db] text-xs hover:underline flex items-center gap-1 font-medium"
                          >
                            {getNotificationLinkIcon(notification.link)}
                            View
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-[#1a56db] transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {!notification.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1a56db]"></div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread'
                ? 'You have no unread notifications'
                : 'You have no notifications yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

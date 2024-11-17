import { Bell, X, Mail } from 'lucide-react';
import './NotificationDrawer.css';

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkAsRead }) {
  return (
    <div className={`drawer ${isOpen ? 'drawer-open' : 'drawer-closed'}`}>
      <div className="h-full flex flex-col">
        <div className="drawer-header">
          <div className="flex items-center justify-between">
            <h2 className="drawer-header-title">Notifications</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="drawer-content">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? '' : 'notification-item-unread'}`}
            >
              <div className="flex items-start">
                {notification.type === 'certificate' ? (
                  <Bell className="h-5 w-5 text-indigo-600 mt-1" />
                ) : (
                  <Mail className="h-5 w-5 text-indigo-600 mt-1" />
                )}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                  <p className="notification-timestamp">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="ml-2 text-xs text-indigo-600 hover:text-indigo-500"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

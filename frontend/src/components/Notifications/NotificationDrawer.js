import { Bell, X, Mail } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkAsRead }) {
  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform ${isOpen ? 'drawer-open translate-x-0' : 'drawer-closed translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="h-full flex flex-col">
        <div className="px-4 py-6 bg-indigo-600">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-indigo-50'} ${notification.read ? 'border-gray-200' : 'border-indigo-200'} border`}
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
                  <p className="mt-2 text-xs text-gray-400">
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

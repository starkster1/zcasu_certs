import { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import './MessageDrawer.css';

export default function MessageDrawer({ isOpen, onClose, messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className={`drawer ${isOpen ? 'drawer-open' : 'drawer-closed'}`}>
      <div className="h-full flex flex-col">
        <div className="drawer-header">
          <div className="flex items-center justify-between">
            <h2 className="drawer-header-title">Messages</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="drawer-content">
          {messages.map((message, index) => (
            <div key={index} className={`message-container ${message.isInstitute ? 'is-institute' : ''}`}>
              <div className={`message ${message.isInstitute ? 'message-received' : 'message-sent'}`}>
                <p className="text-sm">{message.content}</p>
                <p className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

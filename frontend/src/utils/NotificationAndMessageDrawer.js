import React, { useState } from "react";
import {
  IoNotificationsSharp,
  IoChatbubbleEllipsesSharp,
  IoClose,
  IoCheckmarkDoneSharp,
  IoSend,
  IoCreateOutline,
} from "react-icons/io5";
import styles from "./NotificationAndMessageDrawer.module.css";

const NotificationAndMessageDrawer = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New project assigned: Dashboard redesign", time: "2 mins ago", read: false },
    { id: 2, text: "Meeting scheduled for tomorrow at 10 AM", time: "1 hour ago", read: false },
    { id: 3, text: "Your project submission was approved", time: "2 hours ago", read: false },
  ]);

  const [messages,] = useState([
    { id: 1, sender: "John Doe", avatar: "images.unsplash.com/photo-1472099645785-5658abf4ff4e", preview: "Hey, can we discuss the new feature?", time: "10:30 AM", unread: true },
    { id: 2, sender: "Jane Smith", avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330", preview: "The design looks great! Just a few tweaks...", time: "Yesterday", unread: true },
    { id: 3, sender: "Mike Johnson", avatar: "images.unsplash.com/photo-1507003211169-0a1dd7228f2d", preview: "Updated the documentation as requested", time: "2 days ago", unread: false },
  ]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearAllNotifications = () => setNotifications([]);

  return (
    <div className={styles.container}>
      <div className={styles.headerButtons}>
        <button className={styles.iconButton} onClick={toggleNotifications}>
          <IoNotificationsSharp className={styles.icon} />
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className={styles.notificationBadge}>
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </button>
        <button className={styles.iconButton} onClick={toggleMessages}>
          <IoChatbubbleEllipsesSharp className={styles.icon} />
          <span className={styles.notificationBadge}>
            {messages.filter((m) => m.unread).length}
          </span>
        </button>
      </div>

      {/* Notification Drawer */}
      <div
        className={`${styles.drawer} ${
          showNotifications ? styles.openDrawer : styles.closedDrawer
        }`}
      >
        <div className={styles.drawerHeader}>
          <h2>Notifications</h2>
          <div>
            <button className={styles.clearButton} onClick={clearAllNotifications}>
              Clear All
            </button>
            <button className={styles.iconButton} onClick={toggleNotifications}>
              <IoClose className={styles.icon} />
            </button>
          </div>
        </div>
        <div className={styles.drawerContent}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${
                notification.read ? styles.read : ""
              }`}
            >
              <div className={styles.notificationText}>
                <p>{notification.text}</p>
                <button onClick={() => markAsRead(notification.id)}>
                  <IoCheckmarkDoneSharp className={styles.icon} />
                </button>
              </div>
              <small className={styles.time}>{notification.time}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Message Drawer */}
      <div
        className={`${styles.drawer} ${
          showMessages ? styles.openDrawer : styles.closedDrawer
        }`}
      >
        <div className={styles.drawerHeader}>
          <h2>Messages</h2>
          <div>
            <button className={styles.iconButton}>
              <IoCreateOutline className={styles.icon} />
            </button>
            <button className={styles.iconButton} onClick={toggleMessages}>
              <IoClose className={styles.icon} />
            </button>
          </div>
        </div>
        <div className={styles.drawerContent}>
          {messages.map((message) => (
            <div key={message.id} className={styles.messageItem}>
              <img src={`https://${message.avatar}`} alt={message.sender} className={styles.avatar} />
              <div className={styles.messageDetails}>
                <div className={styles.messageHeader}>
                  <h3>{message.sender}</h3>
                  <small>{message.time}</small>
                </div>
                <p>{message.preview}</p>
                <button className={styles.replyButton}>
                  <IoSend className={styles.icon} /> Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {(showNotifications || showMessages) && (
        <div className={styles.overlay} onClick={() => {
          setShowNotifications(false);
          setShowMessages(false);
        }} />
      )}
    </div>
  );
};

export default NotificationAndMessageDrawer;

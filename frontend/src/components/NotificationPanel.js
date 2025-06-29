import React, { useEffect, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { getNotifications, markNotificationAsRead } from '../services/api.js';
import './NotificationPanel.css';
import socket from '../services/socket.js';

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [branchId, setBranchId] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error('❌ โหลดการแจ้งเตือนไม่ได้:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('❌ อ่านแจ้งเตือนไม่ได้:', err);
    }
  };

  const formatTimeAgo = (dateStr) => {
    const now = new Date();
    const created = new Date(dateStr);
    const diff = now - created;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${days} วันที่แล้ว`;
  };

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch((err) => {
      console.warn('🔇 ไม่สามารถเล่นเสียง:', err);
    });
  };

  // ✅ Step 1: ดึง branchId จาก sessionStorage
useEffect(() => {
  const handleBranchIdSet = () => {
    const storedBranchId = Number(sessionStorage.getItem('branch_id'));
    if (storedBranchId) {
      setBranchId(storedBranchId);
    }
  };

  // โหลดตอนแรก
  handleBranchIdSet();

  // ฟัง event จาก login
  window.addEventListener("branch_id_set", handleBranchIdSet);

  return () => {
    window.removeEventListener("branch_id_set", handleBranchIdSet);
  };
}, []);

  // ✅ Step 2: join room เมื่อ branchId + socket เชื่อมต่อแล้ว
useEffect(() => {
  if (!branchId) return;

  // ✅ บังคับให้ connect ถ้ายังไม่เชื่อม
  if (!socket.connected) {
    //console.log("🚀 Connecting socket...");
    socket.connect();
  }

  const joinRoom = () => {
    // console.log("✅ Socket connected:", socket); // ✅ log ตอนเชื่อมต่อ
    socket.emit('join-branch', { branch_id: branchId });
    //console.log('📡 เข้าห้อง branch-' + branchId);
  };

  if (socket.connected) {
    joinRoom();
  } else {
    socket.once('connect', joinRoom); // ✅ ใช้ .once ป้องกันยิงซ้ำ
    //console.log('🕐 รอเชื่อมต่อ...');
  }

   // ✅ log เมื่อตัดการเชื่อมต่อ
  socket.on('disconnect', () => {
    //console.log('❌ Socket disconnected');
  });

  fetchNotifications();

  const handleNewNotification = (data) => {
   // console.log('📢 แจ้งเตือนใหม่:', data);
    playNotificationSound();
    setNotifications((prev) => [
      { ...data, read: false, created_at: new Date().toISOString() },
      ...prev,
    ]);
  };

  socket.on('new-notification', handleNewNotification);

  return () => {
    socket.off('new-notification', handleNewNotification);
    socket.off('connect', joinRoom);
    socket.emit('leave-branch', { branch_id: branchId });
   // console.log('🚪 ออกจากห้อง branch-' + branchId);
  };
}, [branchId]);


  return (
    <div className="notification-container" style={{ position: 'fixed', top: '45px', right: '45px', zIndex: 9999 }}>
      <button onClick={() => setShowPanel(!showPanel)} className="notification-bell">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {isLoading && (
          <div className="notification-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </button>

      {showPanel && (
        <div className="notification-panel">
          <div className="panel-header">
            <span>การแจ้งเตือน</span>
            <button onClick={() => setShowPanel(false)} className="panel-close-btn">
              <X size={20} />
            </button>
          </div>

          <ul className="panel-list">
            {notifications.length === 0 ? (
              <li className="notification-empty">
                <Bell size={48} className="notification-empty-icon" />
                ไม่มีการแจ้งเตือน
              </li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`panel-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="panel-message">{notification.message}</div>
                  <div className="panel-time">{formatTimeAgo(notification.created_at)}</div>
                  {!notification.read && (
                    <button
                      className="read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      title="อ่านแล้ว"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;

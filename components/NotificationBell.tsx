
import React, { useState, useEffect } from 'react';
import { Bell, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockDb } from '../services/mockDb';
import { Notification } from '../types';

const playNotificationSound = () => {
  try {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.warn('Audio notification failed', e);
  }
};

interface NotificationBellProps {
  userId: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = () => {
    const data = mockDb.getNotifications(userId);
    const unreadCount = data.filter(n => !n.read).length;
    
    setNotifications(prev => {
      const prevUnreadCount = prev.filter(n => !n.read).length;
      if (unreadCount > prevUnreadCount) {
        playNotificationSound();
      }
      return data;
    });
  };

  const handleDeleteOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    mockDb.deleteNotification(id);
    refreshNotifications();
  };

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-eln hover:text-white transition-all relative border border-gray-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setShowNotifications(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh] z-10"
            >
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <h4 className="font-black text-xs uppercase tracking-widest text-gray-900">Notifications</h4>
                </div>
                <button onClick={() => setShowNotifications(false)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        mockDb.markNotificationRead(n.id);
                        refreshNotifications();
                      }}
                      className={`p-4 rounded-2xl transition-all cursor-pointer border ${n.read ? 'bg-white border-gray-100' : 'bg-eln/5 border-eln/10'}`}
                    >
                      <div className="flex items-start space-x-3">
                        <button 
                          onClick={(e) => handleDeleteOne(e, n.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.read ? 'bg-gray-100 text-gray-400' : 'bg-eln text-white'}`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-gray-900 mb-0.5">{n.title}</p>
                          <p className="text-[11px] text-gray-500 leading-relaxed">{n.message}</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-2">{new Date(n.createdAt).toLocaleTimeString()}</p>
                        </div>
                        {!n.read && <div className="h-2 w-2 bg-eln rounded-full mt-1" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No notifications</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

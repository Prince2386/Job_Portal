import { useState } from 'react';

const Notifications = () => {
  // 1. We moved the mock data into React State so it can update!
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Application Shortlisted! 🎉',
      message: 'Your application for "Frontend Developer" at TechCorp has been shortlisted.',
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'Application Viewed',
      message: 'A recruiter from StartupInc viewed your profile.',
      time: '5 hours ago',
      isRead: false,
    },
    {
      id: 3,
      type: 'alert',
      title: 'New Job Match',
      message: '3 new jobs match your skills in React and Node.js.',
      time: '1 day ago',
      isRead: true, // This one starts already read
    }
  ]);

  // 2. Function to mark ALL notifications as read
  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, isRead: true }));
    setNotifications(updated);
  };

  // 3. Function to mark just ONE notification as read when clicked
  const markAsRead = (id) => {
    const updated = notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updated);
  };

  // Count how many are still unread so we can show a badge
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            Notifications 
            {/* Show a cool blue badge if there are unread notifications */}
            {unreadCount > 0 && (
              <span className="text-blue-400 bg-blue-500/10 border border-blue-500/20 text-sm px-3 py-1 rounded-full ml-3 font-medium">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-slate-400">Stay updated on your applications and job matches.</p>
        </div>
        
        {/* Only show the "Mark all" button if there are actually unread messages */}
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            onClick={() => markAsRead(notif.id)}
            className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
              notif.isRead 
                ? 'bg-slate-900 border-slate-800 opacity-70' // Dimmed if read
                : 'bg-slate-800/60 border-slate-600 hover:border-slate-500 hover:bg-slate-800' // Brighter if unread
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                
                {/* Dynamic Icon Indicator */}
                <div className="mt-1">
                  {notif.type === 'success' && <div className={`w-2.5 h-2.5 rounded-full bg-emerald-500 ${!notif.isRead && 'shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>}
                  {notif.type === 'info' && <div className={`w-2.5 h-2.5 rounded-full bg-blue-500 ${!notif.isRead && 'shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}></div>}
                  {notif.type === 'alert' && <div className={`w-2.5 h-2.5 rounded-full bg-purple-500 ${!notif.isRead && 'shadow-[0_0_8px_rgba(168,85,247,0.5)]'}`}></div>}
                </div>

                <div>
                  <h3 className={`font-semibold ${notif.isRead ? 'text-slate-400' : 'text-white'}`}>
                    {notif.title}
                  </h3>
                  <p className={`text-sm mt-1 transition-colors ${notif.isRead ? 'text-slate-500' : 'text-slate-300'}`}>
                    {notif.message}
                  </p>
                  <p className="text-slate-500 text-xs mt-2">{notif.time}</p>
                </div>
              </div>

              {/* Blue dot on the right side if it is unread */}
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
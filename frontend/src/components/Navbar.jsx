import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://webapp-production-d767.up.railway.app');

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    socket.on('taskCreated', (task) => {
      setNotifications(prev => [{
        id: Date.now(),
        message: `New task created: "${task.title}"`,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 10));
    });

    socket.on('taskUpdated', (task) => {
      setNotifications(prev => [{
        id: Date.now(),
        message: `Task updated: "${task.title}" → ${task.status.replace('_', ' ')}`,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 10));
    });

    socket.on('taskDeleted', ({ id }) => {
      setNotifications(prev => [{
        id: Date.now(),
        message: `A task was deleted`,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 10));
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleColors = {
    ADMIN: 'text-red-400',
    PROJECT_MANAGER: 'text-yellow-400',
    COLLABORATOR: 'text-green-400'
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-blue-400">ProTask</h1>
        <span className="text-gray-500 text-sm">IT Project Management</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-300 hover:text-white transition text-xl"
          >
            🔔
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="flex justify-between items-center p-3 border-b border-gray-700">
                <h3 className="text-white font-medium text-sm">Notifications</h3>
                <button
                  onClick={() => setNotifications([])}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm p-4 text-center">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3 border-b border-gray-700 hover:bg-gray-700">
                      <p className="text-white text-sm">{n.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{n.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-white text-sm font-medium">{user?.name}</p>
          <p className={`text-xs font-medium ${roleColors[user?.role]}`}>
            {user?.role?.replace('_', ' ')}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
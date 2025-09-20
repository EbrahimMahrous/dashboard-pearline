import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: t('dashboard'), icon: '📊' },
    { path: '/dashboard/products', label: t('products'), icon: '🛍️' },
    { path: '/dashboard/orders', label: t('orders'), badge: 5, icon: '📦' },
    { path: '/dashboard/messages', label: t('messages'), badge: 3, icon: '✉️' },
  ];

  // Get user's display name - use firstName + lastName or email as fallback
  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : user?.email || 'User';

  // Get initial for avatar
  const userInitial = user?.firstName 
    ? user.firstName.charAt(0).toUpperCase() 
    : user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className={`flex h-screen bg-bg-secondary ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Side Bar */}
      <div className={`relative bg-accent-1 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex justify-between items-center border-b border-accent-3">
          {isSidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
            {isSidebarOpen ? '«' : '»'}
          </button>
        </div>
        
        <div className="p-4 border-b border-accent-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-accent-3 flex items-center justify-center">
              {userInitial}
            </div>
            {isSidebarOpen && (
              <div>
                <p className="font-semibold">{displayName}</p>
                <p className="text-sm text-accent-2">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 transition-colors duration-200 ${
                isActive(item.path) ? 'bg-accent-4 text-white' : 'hover:bg-accent-3'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isSidebarOpen && (
                <span className="ml-3 flex-1">{item.label}</span>
              )}
              {item.badge && (
                <span className="bg-accent-4 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-accent-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center text-white w-full p-2 hover:bg-accent-3 rounded"
          >
            <span className="text-lg">{language === 'ar' ? '🇺🇸' : '🇸🇦'}</span>
            {isSidebarOpen && (
              <span className="ml-3">{language === 'ar' ? 'English' : 'العربية'}</span>
            )}
          </button>
          
          <Link
            to="/dashboard/profile"
            className="flex items-center text-white mt-2 p-2 hover:bg-accent-3 rounded"
          >
            <span className="text-lg">👤</span>
            {isSidebarOpen && <span className="ml-3">{t('profile')}</span>}
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center text-white mt-2 p-2 hover:bg-accent-3 rounded w-full"
          >
            <span className="text-lg">🚪</span>
            {isSidebarOpen && <span className="ml-3">{t('logout')}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
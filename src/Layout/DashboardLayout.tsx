import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: "/dashboard", label: t("dashboard", "common"), icon: "📊" },
    { path: "/dashboard/products", label: t("products", "common"), icon: "🛍️" },
    {
      path: "/dashboard/orders",
      label: t("orders", "common"),
      badge: 5,
      icon: "📦",
    },
    {
      path: "/dashboard/messages",
      label: t("messages", "common"),
      badge: 3,
      icon: "✉️",
    },
  ];

  // Get user's display name - use firstName + lastName or email as fallback
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email || t("user", "common");

  // Get initial for avatar
  const userInitial = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div
      className={`flex h-screen bg-bg-secondary ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Side Bar */}
      <div
        className={`relative bg-accent-1 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-accent-3">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold text-right w-full">
              {t("admin_panel", "common")}
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-1 rounded hover:bg-accent-3"
          >
            {isSidebarOpen ? (isRTL ? "«" : "»") : isRTL ? "»" : "«"}
          </button>
        </div>

        <div className="p-4 border-b border-accent-3">
          <div
            className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-10 h-10 rounded-full bg-accent-3 flex items-center justify-center ${
                isRTL ? "ml-3" : "mr-3"
              }`}
            >
              {userInitial}
            </div>
            {isSidebarOpen && (
              <div className={isRTL ? "text-right" : "text-left"}>
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
                isActive(item.path)
                  ? "bg-accent-4 text-white"
                  : "hover:bg-accent-3"
              } ${isRTL ? "flex-row-reverse justify-end" : ""}`}
            >
              <span className="text-lg">{item.icon}</span>
              {isSidebarOpen && (
                <span
                  className={`${
                    isRTL ? "mr-3 text-right flex-1" : "ml-3 text-left flex-1"
                  }`}
                >
                  {item.label}
                </span>
              )}
              {item.badge && isSidebarOpen && (
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
            className={`flex items-center text-white w-full p-2 hover:bg-accent-3 rounded ${
              isRTL ? "flex-row-reverse justify-end" : ""
            }`}
          >
            <span className="text-lg">{language === "ar" ? "🇺🇸" : "🇸🇦"}</span>
            {isSidebarOpen && (
              <span
                className={
                  isRTL ? "mr-3 text-right flex-1" : "ml-3 text-left flex-1"
                }
              >
                {language === "ar" ? "English" : "العربية"}
              </span>
            )}
          </button>

          <Link
            to="/dashboard/profile"
            className={`flex items-center text-white mt-2 p-2 hover:bg-accent-3 rounded ${
              isRTL ? "flex-row-reverse justify-end" : ""
            }`}
          >
            <span className="text-lg">👤</span>
            {isSidebarOpen && (
              <span
                className={
                  isRTL ? "mr-3 text-right flex-1" : "ml-3 text-left flex-1"
                }
              >
                {t("profile", "common")}
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center text-white mt-2 p-2 hover:bg-accent-3 rounded w-full ${
              isRTL ? "flex-row-reverse justify-end" : ""
            }`}
          >
            <span className="text-lg">🚪</span>
            {isSidebarOpen && (
              <span
                className={
                  isRTL ? "mr-3 text-right flex-1" : "ml-3 text-left flex-1"
                }
              >
                {t("logout", "common")}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6" dir={isRTL ? "rtl" : "ltr"}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

// SVG Icon Components
const DashboardIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const ProductsIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const OrdersIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const MessagesIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  </svg>
);
const TagIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    className={className}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" 
    />
  </svg>
);
const ProfileIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LogoutIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const LanguageIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
    />
  </svg>
);

const CollapseIcon = ({
  isOpen,
  isRTL,
}: {
  isOpen: boolean;
  isRTL: boolean;
}) => {
  if (isOpen) {
    return isRTL ? (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    ) : (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    );
  }

  return isRTL ? (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  ) : (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface Message {
  id: string;
}

interface Order {
  id: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout, token } = useAuth();
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lastSeenMessages, setLastSeenMessages] = useState<number>(0);
  const [lastSeenOrders, setLastSeenOrders] = useState<number>(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/Contact/all`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        const currentMessagesCount = data.length;
        const newUnreadCount = Math.max(
          0,
          currentMessagesCount - lastSeenMessages
        );
        setUnreadMessagesCount(newUnreadCount);
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/quotes/all`, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        const currentOrdersCount = data.length;
        const newOrders = Math.max(0, currentOrdersCount - lastSeenOrders);
        setNewOrdersCount(newOrders);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const markMessagesAsSeen = () => {
    setLastSeenMessages(messages.length);
    setUnreadMessagesCount(0);
  };

  const markOrdersAsSeen = () => {
    setLastSeenOrders(orders.length);
    setNewOrdersCount(0);
  };

  useEffect(() => {
    fetchMessages();
    fetchOrders();
    const interval = setInterval(() => {
      fetchMessages();
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (location.pathname === "/dashboard/messages") {
      markMessagesAsSeen();
    }

    if (location.pathname === "/dashboard/orders") {
      markOrdersAsSeen();
    }
  }, [location.pathname, messages.length, orders.length]);

  const menuItems = [
    {
      path: "/dashboard",
      label: t("dashboard", "common"),
      icon: <DashboardIcon className="w-5 h-5" />,
    },
    {
      path: "/dashboard/products",
      label: t("products", "common"),
      icon: <ProductsIcon className="w-5 h-5" />,
    },
    {
      path: "/dashboard/orders",
      label: t("orders", "common"),
      badge: newOrdersCount > 0 ? newOrdersCount : undefined,
      icon: <OrdersIcon className="w-5 h-5" />,
    },
    {
      path: "/dashboard/messages",
      label: t("messages", "common"),
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      icon: <MessagesIcon className="w-5 h-5" />,
    },
    {
      path: "/dashboard/brands",
      label: t("brands", "common"),
      icon: <TagIcon  className="w-5 h-5" />,
    },
  ];

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email || t("user", "common");

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
            <CollapseIcon isOpen={isSidebarOpen} isRTL={isRTL} />
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
            <LanguageIcon className="w-5 h-5" />
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
            <ProfileIcon className="w-5 h-5" />
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
            <LogoutIcon className="w-5 h-5" />
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

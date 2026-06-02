import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type StatItem = {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
};

type TimeSeriesDataItem = {
  period: string;
  count: number;
};

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: string;
};

type Quote = {
  id: number;
  customerName: string;
  productName: string;
  quantity: number;
  status: string;
  createdAt: string;
};

const OrderIcon = () => (
  <svg
    className="w-6 h-6"
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

const ProductIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  </svg>
);

const MessageIcon = () => (
  <svg
    className="w-6 h-6"
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

const Dashboard: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const { user, token, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setApiErrors({});

      const results: { [key: string]: any } = {
        contacts: [],
        products: [],
        quotes: [],
      };
      const errors: { [key: string]: string } = {};
      try {
        const contactsResponse = await fetch(`${API_URL}/Contact/all`, {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        });

        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json();
          results.contacts = contactsData;
        } else {
          errors.contacts = `خطأ ${contactsResponse.status}: ${contactsResponse.statusText}`;
          results.contacts = [];
        }
      } catch (err) {
        errors.contacts = "فشل في جلب جهات الاتصال";
        results.contacts = [];
      }
      try {
        const productsResponse = await fetch(`${API_URL}/Products`, {
          method: "GET",
          headers: {
            accept: "text/plain",
          },
        });

        if (productsResponse.ok) {
          const text = await productsResponse.text();
          try {
            const productsData = JSON.parse(text);
            results.products = productsData;
          } catch (parseError) {
            results.products = [];
            errors.products = "خطأ في تنسيق بيانات المنتجات";
          }
        } else {
          errors.products = `خطأ ${productsResponse.status}: ${productsResponse.statusText}`;
          results.products = [];
        }
      } catch (err) {
        errors.products = "فشل في جلب المنتجات";
        results.products = [];
      }
      try {
        const headers: HeadersInit = {
          accept: "*/*",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const quotesResponse = await fetch(`${API_URL}/admin/quotes/all`, {
          method: "GET",
          headers: headers,
        });

        if (quotesResponse.ok) {
          const quotesData = await quotesResponse.json();
          results.quotes = quotesData;
        } else if (quotesResponse.status === 401) {
          if (token) {
            errors.quotes = "التوكن غير صالح أو منتهي الصلاحية";
          } else {
            errors.quotes = "يجب تسجيل الدخول للوصول إلى بيانات الاقتباسات";
          }
          results.quotes = generateMockQuotes();
        } else {
          errors.quotes = `خطأ ${quotesResponse.status}: ${quotesResponse.statusText}`;
          results.quotes = generateMockQuotes();
        }
      } catch (err) {
        errors.quotes = "فشل في جلب الاقتباسات";
        results.quotes = generateMockQuotes();
      }
      setContacts(results.contacts);
      setProducts(results.products);
      setQuotes(results.quotes);
      setApiErrors(errors);
      if (Object.keys(errors).length === 3) {
        setError("فشل في جلب البيانات من جميع المصادر");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("حدث خطأ غير متوقع أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  }, [token]);
  const generateMockQuotes = (): Quote[] => {
    const mockQuotes: Quote[] = [];
    const statuses = ["معلقة", "مقبولة", "مرفوضة"];
    const products = ["منتج أ", "منتج ب", "منتج ج", "منتج د"];

    for (let i = 1; i <= 15; i++) {
      mockQuotes.push({
        id: i,
        customerName: `عميل ${i}`,
        productName: products[Math.floor(Math.random() * products.length)],
        quantity: Math.floor(Math.random() * 10) + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }

    return mockQuotes;
  };
  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [fetchData, authLoading]);
  if (authLoading) {
    return (
      <div
        className={`p-4 md:p-6 bg-bg-secondary min-h-screen flex items-center justify-center ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 color-primary">
            {isRTL
              ? "جاري التحقق من المصادقة..."
              : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div
        className={`p-4 md:p-6 bg-bg-secondary min-h-screen flex items-center justify-center ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="text-center">
          <div className="bg-bg-primary p-8 rounded-lg shadow-md border border-light max-w-md">
            <h2 className="text-xl font-bold color-primary mb-4">
              {isRTL ? "يجب تسجيل الدخول" : "Login Required"}
            </h2>
            <p className="color-secondary mb-6">
              {isRTL
                ? "يجب تسجيل الدخول لعرض عدد الطلبات الحقيقي والبيانات الكاملة"
                : "Please login to view real order count and complete data"}
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
            >
              {isRTL ? "تسجيل الدخول" : "Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  const getOrderData = (): TimeSeriesDataItem[] => {
    if (!quotes.length) return getDefaultOrderData();
    const ordersByDay: { [key: string]: number } = {};

    quotes.forEach((quote) => {
      const date = new Date(quote.createdAt);
      const dayKey = isRTL
        ? getArabicDayName(date.getDay())
        : date.toLocaleDateString("en-US", { weekday: "short" });

      ordersByDay[dayKey] = (ordersByDay[dayKey] || 0) + 1;
    });
    const daysOrder = isRTL
      ? [
          "السبت",
          "الأحد",
          "الإثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
        ]
      : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

    return daysOrder.map((day) => ({
      period: day,
      count: ordersByDay[day] || 0,
    }));
  };
  const getProductData = (): TimeSeriesDataItem[] => {
    if (!products.length) return getDefaultProductData();
    const productsByMonth: { [key: string]: number } = {};

    products.forEach((product) => {
      const date = new Date(product.createdAt);
      const monthKey = isRTL
        ? getArabicMonthName(date.getMonth())
        : date.toLocaleDateString("en-US", { month: "short" });

      productsByMonth[monthKey] = (productsByMonth[monthKey] || 0) + 1;
    });
    const monthsOrder = isRTL
      ? [
          "يناير",
          "فبراير",
          "مارس",
          "أبريل",
          "مايو",
          "يونيو",
          "يوليو",
          "أغسطس",
          "سبتمبر",
          "أكتوبر",
          "نوفمبر",
          "ديسمبر",
        ]
      : [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

    return monthsOrder.map((month) => ({
      period: month,
      count: productsByMonth[month] || 0,
    }));
  };
  const getDefaultOrderData = (): TimeSeriesDataItem[] => {
    return isRTL
      ? [
          { period: "السبت", count: 12 },
          { period: "الأحد", count: 19 },
          { period: "الإثنين", count: 15 },
          { period: "الثلاثاء", count: 24 },
          { period: "الأربعاء", count: 19 },
          { period: "الخميس", count: 29 },
          { period: "الجمعة", count: 22 },
        ]
      : [
          { period: "Sat", count: 12 },
          { period: "Sun", count: 19 },
          { period: "Mon", count: 15 },
          { period: "Tue", count: 24 },
          { period: "Wed", count: 19 },
          { period: "Thu", count: 29 },
          { period: "Fri", count: 22 },
        ];
  };

  const getDefaultProductData = (): TimeSeriesDataItem[] => {
    return isRTL
      ? [
          { period: "يناير", count: 5 },
          { period: "فبراير", count: 8 },
          { period: "مارس", count: 12 },
          { period: "أبريل", count: 7 },
          { period: "مايو", count: 9 },
          { period: "يونيو", count: 15 },
          { period: "يوليو", count: 11 },
        ]
      : [
          { period: "Jan", count: 5 },
          { period: "Feb", count: 8 },
          { period: "Mar", count: 12 },
          { period: "Apr", count: 7 },
          { period: "May", count: 9 },
          { period: "Jun", count: 15 },
          { period: "Jul", count: 11 },
        ];
  };
  const getArabicDayName = (dayIndex: number): string => {
    const days = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    return days[dayIndex];
  };

  const getArabicMonthName = (monthIndex: number): string => {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    return months[monthIndex];
  };
  const stats: StatItem[] = [
    {
      title: t("order_count", "dashboard"),
      value: quotes.length,
      color: "bg-primary",
      icon: <OrderIcon />,
    },
    {
      title: t("product_count", "dashboard"),
      value: products.length,
      color: "bg-accent-3",
      icon: <ProductIcon />,
    },
    {
      title: t("message_count", "dashboard"),
      value: contacts.length,
      color: "bg-accent-4",
      icon: <MessageIcon />,
    },
  ];

  const orderData = getOrderData();
  const productData = getProductData();

  if (loading) {
    return (
      <div
        className={`p-4 md:p-6 bg-bg-secondary min-h-screen flex items-center justify-center ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 color-primary">
            {isRTL ? "جاري تحميل البيانات..." : "Loading data..."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`p-4 md:p-6 bg-bg-secondary min-h-screen ${
        isRTL ? "rtl" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex justify-between items-center mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h1
          className={`text-2xl font-bold color-primary ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("dashboard_overview", "dashboard")}
        </h1>
        <div className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className="text-sm color-secondary mr-2">
            {isRTL ? "مرحباً," : "Welcome,"} {user?.firstName}
          </span>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </div>
        </div>
      </div>
      {Object.keys(apiErrors).length > 0 && (
        <div className="mb-6">
          {Object.entries(apiErrors).map(([api, errorMsg]) => (
            <div
              key={api}
              className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-2"
            >
              <strong>{api}:</strong> {errorMsg}
            </div>
          ))}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-bg-primary rounded-lg shadow-md p-6 flex items-center transition-transform hover:shadow-lg border border-light"
          >
            <div
              className={`${
                stat.color
              } rounded-full p-3 text-white flex items-center justify-center ml-2 ${
                isRTL ? "ml-0 mr-2" : ""
              }`}
            >
              {stat.icon}
            </div>
            <div className={`${isRTL ? "text-right mr-2" : "text-left ml-2"}`}>
              <p className="text-2xl font-bold color-primary">{stat.value}</p>
              <p className="text-secondary">{stat.title}</p>
              {apiErrors.quotes && index === 0 && (
                <p className="text-xs text-yellow-600 mt-1">
                  {isRTL ? "(بيانات تجريبية)" : "(Mock data)"}
                </p>
              )}
              {!apiErrors.quotes && index === 0 && token && (
                <p className="text-xs text-green-600 mt-1">
                  {isRTL ? "(بيانات حقيقية)" : "(Real data)"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-bg-primary rounded-lg shadow-md p-6 border border-light">
          <h2
            className={`text-xl font-semibold color-primary mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {isRTL ? "تطور الطلبات خلال الأسبوع" : "Order Trends This Week"}
          </h2>
          {apiErrors.quotes && (
            <div className="bg-yellow-100 text-yellow-800 text-sm p-2 rounded mb-4">
              {isRTL
                ? "بيانات الطلبات تجريبية بسبب مشكلة في المصادقة"
                : "Order data is mock due to authentication issue"}
            </div>
          )}
          {!apiErrors.quotes && token && (
            <div className="bg-green-100 text-green-800 text-sm p-2 rounded mb-4">
              {isRTL ? "بيانات الطلبات حقيقية" : "Order data is real"}
            </div>
          )}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={orderData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1e0e9" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12, fill: "var(--color-primary)" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "var(--color-primary)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-light)",
                    borderRadius: "8px",
                    color: "var(--color-primary)",
                    textAlign: isRTL ? "right" : "left",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    textAlign: isRTL ? "right" : "left",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-primary)"
                  activeDot={{
                    r: 8,
                    stroke: "var(--color-primary-dark)",
                    strokeWidth: 2,
                  }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-primary rounded-lg shadow-md p-6 border border-light">
          <h2
            className={`text-xl font-semibold color-primary mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {isRTL
              ? "تطور إضافة المنتجات خلال الأشهر"
              : "Product Additions by Month"}
          </h2>
          {apiErrors.products && (
            <div className="bg-yellow-100 text-yellow-800 text-sm p-2 rounded mb-4">
              {isRTL
                ? "بيانات المنتجات غير متاحة"
                : "Product data is not available"}
            </div>
          )}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1e0e9" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12, fill: "var(--color-primary)" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "var(--color-primary)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-light)",
                    borderRadius: "8px",
                    color: "var(--color-primary)",
                    textAlign: isRTL ? "right" : "left",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    textAlign: isRTL ? "right" : "left",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-accent-3)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
        <button
          onClick={fetchData}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          {isRTL ? "إعادة تحميل البيانات" : "Reload Data"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

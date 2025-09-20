import React from "react";
import { useLanguage } from "../context/LanguageContext";
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

  const stats: StatItem[] = [
    {
      title: t("order_count", "dashboard"),
      value: 152,
      color: "bg-primary",
      icon: <OrderIcon />,
    },
    {
      title: t("product_count", "dashboard"),
      value: 45,
      color: "bg-accent-3",
      icon: <ProductIcon />,
    },
    {
      title: t("message_count", "dashboard"),
      value: 23,
      color: "bg-accent-4",
      icon: <MessageIcon />,
    },
  ];

  const orderData: TimeSeriesDataItem[] = isRTL
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

  const productData: TimeSeriesDataItem[] = isRTL
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

  return (
    <div
      className={`p-4 md:p-6 bg-bg-secondary min-h-screen ${
        isRTL ? "rtl" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1
        className={`text-2xl font-bold text-primary mb-6 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("dashboard_overview", "dashboard")}
      </h1>

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
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-secondary">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-bg-primary rounded-lg shadow-md p-6 border border-light">
          <h2
            className={`text-xl font-semibold text-primary mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {isRTL ? "تطور الطلبات خلال الأسبوع" : "Order Trends This Week"}
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={orderData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1e0e9" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12, fill: "var(--text-primary)" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-primary)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-light)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
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
            className={`text-xl font-semibold text-primary mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {isRTL
              ? "تطور إضافة المنتجات خلال الأشهر"
              : "Product Additions by Month"}
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1e0e9" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12, fill: "var(--text-primary)" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-primary)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-light)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
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
    </div>
  );
};

export default Dashboard;

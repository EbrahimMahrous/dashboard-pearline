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

// تعريف الأنواع في TypeScript
type StatItem = {
  title: string;
  value: number;
  color: string;
  icon: string;
};

type TimeSeriesDataItem = {
  period: string;
  count: number;
};

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats: StatItem[] = [
    { title: t("order_count"), value: 152, color: "bg-blue-500", icon: "📦" },
    { title: t("product_count"), value: 45, color: "bg-green-500", icon: "🛍️" },
    {
      title: t("message_count"),
      value: 23,
      color: "bg-yellow-500",
      icon: "✉️",
    },
  ];

  const orderData: TimeSeriesDataItem[] = [
    { period: "السبت", count: 12 },
    { period: "الأحد", count: 19 },
    { period: "الإثنين", count: 15 },
    { period: "الثلاثاء", count: 24 },
    { period: "الأربعاء", count: 19 },
    { period: "الخميس", count: 29 },
    { period: "الجمعة", count: 22 },
  ];

  const productData: TimeSeriesDataItem[] = [
    { period: "يناير", count: 5 },
    { period: "فبراير", count: 8 },
    { period: "مارس", count: 12 },
    { period: "أبريل", count: 7 },
    { period: "مايو", count: 9 },
    { period: "يونيو", count: 15 },
    { period: "يوليو", count: 11 },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-6">
        {t("dashboard_overview")}
      </h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex items-center transition-transform hover:shadow-lg"
          >
            <div
              className={`${stat.color} rounded-full p-3 mr-4 text-white text-xl`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            تطور الطلبات خلال الأسبوع
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={orderData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            تطور إضافة المنتجات خلال الأشهر
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

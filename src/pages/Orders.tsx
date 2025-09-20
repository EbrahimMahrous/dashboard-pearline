import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

interface OrderItem {
  id: number;
  name: string;
  barcode: string;
  caseSize: number;
  casesPerLayer: number;
  casesPerPallet: number;
  leadTimeDays: number;
  quantity: number;
  unitPrice: number;
  image: string;
}

interface Order {
  id: number;
  email: string;
  date: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  items: OrderItem[];
  comments: string;
}

// أيقونات SVG
const SearchIcon = (props: { className?: string }) => (
  <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const OrderIcon = (props: { className?: string }) => (
  <svg className={props.className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const CloseIcon = (props: { className?: string }) => (
  <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EyeIcon = (props: { className?: string }) => (
  <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const Orders: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, isRTL } = useLanguage();
  const { token, logout } = useAuth();

  const getSampleOrders = (): Order[] => {
    return [
      {
        id: 1001,
        email: "customer@example.com",
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        subtotal: 7500,
        tax: 0,
        total: 7500,
        items: [
          {
            id: 1,
            name: "Product One",
            barcode: "1234567890123",
            caseSize: 24,
            casesPerLayer: 5,
            casesPerPallet: 100,
            leadTimeDays: 7,
            quantity: 10,
            unitPrice: 750,
            image: "/placeholder.png",
          },
        ],
        comments: "Sample order for demonstration",
      },
      {
        id: 1002,
        email: "client@example.com",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        status: "completed",
        subtotal: 12000,
        tax: 0,
        total: 12000,
        items: [
          {
            id: 2,
            name: "Product Two",
            barcode: "2345678901234",
            caseSize: 12,
            casesPerLayer: 6,
            casesPerPallet: 80,
            leadTimeDays: 5,
            quantity: 15,
            unitPrice: 800,
            image: "/placeholder.png",
          },
        ],
        comments: "Another sample order",
      },
      {
        id: 1003,
        email: "business@example.com",
        date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
        status: "shipped",
        subtotal: 18500,
        tax: 0,
        total: 18500,
        items: [],
        comments: "Large order with multiple products",
      },
    ];
  };

  const mapQuoteStatus = (status: string | undefined | null): string => {
    if (!status) return "pending";

    const statusMap: { [key: string]: string } = {
      Pending: "pending",
      Approved: "completed",
      Rejected: "cancelled",
      Shipped: "shipped",
      Processing: "pending",
    };

    return statusMap[status] || status.toLowerCase();
  };

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("No authentication token found. Please login first.");
      }

      const response = await fetch("/api/Cart", {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Quotes API response:", data);

        const quotesData = Array.isArray(data) ? data : [data];

        const formattedOrders: Order[] = quotesData.map((quote: any) => ({
          id: quote.id || 0,
          email: quote.email || "unknown@example.com",
          date: new Date(quote.createdDate || quote.date || Date.now())
            .toISOString()
            .split("T")[0],
          status: mapQuoteStatus(quote.status),
          subtotal: quote.subTotal || quote.subtotal || 0,
          tax: quote.taxAmount || quote.tax || 0,
          total: quote.totalAmount || quote.total || 0,
          items:
            quote.items && Array.isArray(quote.items)
              ? quote.items.map((item: any) => ({
                  id: item.id || 0,
                  name: item.productName || "Unknown Product",
                  barcode: item.productBarcode || "",
                  caseSize: item.caseSize || 0,
                  casesPerLayer: item.casesPerLayer || 0,
                  casesPerPallet: item.casesPerPallet || 0,
                  leadTimeDays: item.leadTimeDays || 0,
                  quantity: item.quantity || 0,
                  unitPrice: item.unitPrice || 0,
                  image: item.productImage || "/placeholder.png",
                }))
              : [],
          comments: quote.comments || "",
        }));

        setOrders(formattedOrders);
      } else if (response.status === 401) {
        logout();
        throw new Error("Authentication failed. Please login again.");
      } else {
        throw new Error(`Failed to fetch quotes: ${response.status}`);
      }
    } catch (err: any) {
      console.error("Error fetching quotes:", err);
      setError(err.message || "Failed to fetch orders");

      if (!navigator.onLine) {
        console.log("No internet connection, using sample data");
        setOrders(getSampleOrders());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchQuotes();
    } else {
      setError("Please login to view your orders");
      setLoading(false);
    }
  }, [token]);

  const filteredOrders = orders.filter((order) => {
    return (
      order.id.toString().includes(searchTerm) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${imagePath}`;
  };

  const handleRetry = () => {
    fetchQuotes();
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center h-64 bg-bg-secondary">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <div className="text-lg text-primary">{isRTL ? "جاري تحميل الطلبات..." : "Loading orders..."}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-bg-secondary min-h-screen">
      <div className="flex items-center mb-6">
        <div className="bg-primary rounded-full p-2 text-white mr-3">
          <OrderIcon />
        </div>
        <h1 className="text-2xl font-bold text-primary">
          {t("orders", "navigation")}
        </h1>
        <div className="bg-accent-4 text-white px-3 py-1 rounded-full mr-4">
          {orders.length} {t("orders", "navigation")}
        </div>
      </div>

      {error && !orders.length && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 border border-red-200">
          <div className="font-bold">{isRTL ? "خطأ في تحميل الطلبات" : "Error Loading Orders"}</div>
          <div className="mb-2">{error}</div>
          <div className="flex gap-2">
            <button
              onClick={handleRetry}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-dark"
            >
              {isRTL ? "حاول مرة أخرى" : "Try Again"}
            </button>
            {error.includes("Authentication") && (
              <button
                onClick={handleLoginRedirect}
                className="bg-accent-4 text-white px-4 py-2 rounded-md text-sm hover:bg-accent-4-dark"
              >
                {isRTL ? "انتقل إلى تسجيل الدخول" : "Go to Login"}
              </button>
            )}
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <>
          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder={t("search", "common") || (isRTL ? "ابحث في الطلبات..." : "Search orders...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>

          {/* Order Table */}
          <div className="bg-bg-primary rounded-lg shadow-md overflow-hidden border border-light">
            <table className="w-full">
              <thead className="bg-accent-2">
                <tr>
                  <th className="px-4 py-3 font-semibold text-primary">{t("order_id", "orders")}</th>
                  <th className="px-4 py-3 font-semibold text-primary">{t("email", "common")}</th>
                  <th className="px-4 py-3 font-semibold text-primary">{t("date", "orders")}</th>
                  <th className="px-4 py-3 font-semibold text-primary">{t("status", "orders")}</th>
                  <th className="px-4 py-3 font-semibold text-primary">{t("total", "orders")}</th>
                  <th className="px-4 py-3 font-semibold text-primary">{t("actions", "products")}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-light hover:bg-accent-2 transition-colors"
                  >
                    <td className="px-4 py-3 text-secondary">#{order.id}</td>
                    <td className="px-4 py-3 text-secondary">{order.email}</td>
                    <td className="px-4 py-3 text-secondary">{order.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {t(order.status, "orders") || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3">
                      <button
                        className="text-accent-4 hover:text-accent-4-dark flex items-center"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <EyeIcon className="ml-1" />
                        {t("view", "common") || (isRTL ? "عرض" : "View")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="p-8 text-center text-muted">
                {searchTerm ? 
                  (isRTL ? "لا توجد طلبات تطابق بحثك" : "No orders match your search") : 
                  (isRTL ? "لا توجد طلبات" : "No orders found")}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                className={`mx-1 px-3 py-1 rounded bg-bg-primary border border-light disabled:opacity-50 hover:bg-accent-2 ${isRTL ? 'ml-2' : 'mr-2'}`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {isRTL ? "السابق" : "Previous"}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "bg-bg-primary border border-light text-secondary hover:bg-accent-2"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className={`mx-1 px-3 py-1 rounded bg-bg-primary border border-light disabled:opacity-50 hover:bg-accent-2 ${isRTL ? 'mr-2' : 'ml-2'}`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                {isRTL ? "التالي" : "Next"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-primary rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto border border-light">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-light">
                <h2 className="text-xl font-bold text-primary">
                  {t("order_details", "orders")} #{selectedOrder.id}
                </h2>
                <button
                  className="text-muted hover:text-primary"
                  onClick={closeOrderDetails}
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    {isRTL ? "معلومات العميل" : "Customer Information"}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-secondary">
                      <strong className="text-primary">{t("email", "common")}:</strong> {selectedOrder.email}
                    </p>
                    <p className="text-secondary">
                      <strong className="text-primary">{t("order_date", "orders")}:</strong> {selectedOrder.date}
                    </p>
                    <p className="text-secondary">
                      <strong className="text-primary">{t("status", "orders")}:</strong>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusClass(
                          selectedOrder.status
                        )}`}
                      >
                        {t(selectedOrder.status, "orders") || selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    {t("order_summary", "orders") || (isRTL ? "ملخص الطلب" : "Order Summary")}
                  </h3>
                  <div className="bg-accent-2 p-4 rounded-lg">
                    <div className="flex justify-between mb-2 text-secondary">
                      <span>{t("subtotal", "orders")}:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-secondary">
                      <span>{t("tax", "orders") || "Tax"}:</span>
                      <span>{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-light text-primary">
                      <span>{t("total", "orders")}:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-primary mb-4">
                  {t("products", "navigation")}
                </h3>
                {selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-light rounded-lg p-4 mb-4"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.png";
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-primary">{item.name}</h4>
                            <span className="font-bold text-primary">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary">
                            <div>
                              <p>
                                <strong>{t("barcode", "products") || "Barcode"}:</strong> {item.barcode}
                              </p>
                              <p>
                                <strong>{t("quantity", "orders")}:</strong> {item.quantity}
                              </p>
                              <p>
                                <strong>{t("unit_price", "orders") || "Unit Price"}:</strong>{" "}
                                {formatCurrency(item.unitPrice)}
                              </p>
                              <p>
                                <strong>{t("lead_time", "orders") || "Lead Time"}:</strong> {item.leadTimeDays}{" "}
                                {isRTL ? "أيام" : "days"}
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>{t("case_size", "orders") || "Units per Case"}:</strong> {item.caseSize}
                              </p>
                              <p>
                                <strong>{t("cases_per_layer", "orders") || "Cases Per Layer"}:</strong>{" "}
                                {item.casesPerLayer}
                              </p>
                              <p>
                                <strong>{t("cases_per_pallet", "orders") || "Cases Per Pallet"}:</strong>{" "}
                                {item.casesPerPallet}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-4">
                    {isRTL ? "لا توجد منتجات في هذا الطلب" : "No products in this order"}
                  </p>
                )}
              </div>

              {selectedOrder.comments && (
                <div className="mb-6">
                  <h3 className="font-semibold text-primary mb-2">
                    {t("comments", "orders") || (isRTL ? "ملاحظات" : "Comments")}
                  </h3>
                  <p className="bg-accent-2 p-4 rounded-lg text-secondary">
                    {selectedOrder.comments}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-light">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                  onClick={closeOrderDetails}
                >
                  {t("close", "common") || (isRTL ? "إغلاق" : "Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
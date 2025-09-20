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

const Orders: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();
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
      <div className="p-4 md:p-6 flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">{t("orders")}</h1>
        <div className="bg-accent-4 text-white px-3 py-1 rounded-full">
          {orders.length} {t("orders")}
        </div>
      </div>

      {error && !orders.length && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          <div className="font-bold">Error Loading Orders</div>
          <div className="mb-2">{error}</div>
          <div className="flex gap-2">
            <button
              onClick={handleRetry}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm"
            >
              Try Again
            </button>
            {error.includes("Authentication") && (
              <button
                onClick={handleLoginRedirect}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <>
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder={t("search_orders") || "Search orders..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-light rounded focus:outline-none focus:border-primary"
            />
          </div>

          {/* Order Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-accent-2">
                <tr>
                  <th className="px-4 py-2 text-left">
                    {t("order_id") || "Order ID"}
                  </th>
                  <th className="px-4 py-2 text-left">
                    {t("email") || "Email"}
                  </th>
                  <th className="px-4 py-2 text-left">{t("date") || "Date"}</th>
                  <th className="px-4 py-2 text-left">
                    {t("status") || "Status"}
                  </th>
                  <th className="px-4 py-2 text-left">
                    {t("total") || "Total"}
                  </th>
                  <th className="px-4 py-2 text-left">
                    {t("actions") || "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-light hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">#{order.id}</td>
                    <td className="px-4 py-2">{order.email}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {t(order.status) || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() => viewOrderDetails(order)}
                      >
                        {t("view") || "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? "No orders match your search" : "No orders found"}
              </div>
            )}
          </div>

          {/* Pagenation */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                className="mx-1 px-3 py-1 rounded bg-white border border-light disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "bg-white border border-light"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="mx-1 px-3 py-1 rounded bg-white border border-light disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Order Details #{selectedOrder.id}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={closeOrderDetails}
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p>
                    <strong>Email:</strong> {selectedOrder.email}
                  </p>
                  <p>
                    <strong>Order Date:</strong> {selectedOrder.date}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusClass(
                        selectedOrder.status
                      )}`}
                    >
                      {t(selectedOrder.status) || selectedOrder.status}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Tax:</span>
                      <span>{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Products</h3>
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-light rounded p-4 mb-4"
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
                          <h4 className="font-medium">{item.name}</h4>
                          <span className="font-bold">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p>
                              <strong>Barcode:</strong> {item.barcode}
                            </p>
                            <p>
                              <strong>Quantity:</strong> {item.quantity}
                            </p>
                            <p>
                              <strong>Unit Price:</strong>{" "}
                              {formatCurrency(item.unitPrice)}
                            </p>
                            <p>
                              <strong>Lead Time:</strong> {item.leadTimeDays}{" "}
                              days
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Units per Case:</strong> {item.caseSize}
                            </p>
                            <p>
                              <strong>Cases Per Layer:</strong>{" "}
                              {item.casesPerLayer}
                            </p>
                            <p>
                              <strong>Cases Per Pallet:</strong>{" "}
                              {item.casesPerPallet}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrder.comments && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Comments</h3>
                  <p className="bg-gray-50 p-4 rounded">
                    {selectedOrder.comments}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                  onClick={closeOrderDetails}
                >
                  Close
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

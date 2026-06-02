import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUrl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productBarcode: string;
  caseSize: number;
  casesPerLayer: number;
  casesPerPallet: number;
  leadTimeDays: number;
  quantity: number;
  unitPrice: number;
  productImage: string;
}

interface Order {
  id: number;
  quoteId: number;
  email: string;
  createdDate: string;
  status: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  items: OrderItem[];
  comments: string;
  userId?: number;
}

interface ApiResponse<T> {
  data?: T;
  items?: T[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

interface PaginationParams {
  page: number;
  pageSize: number;
  email?: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
// ** START PDF
const PDFIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-5 h-5"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
// ** END PDF

// SVG Icons
const SearchIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-5 h-5"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const OrderIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-6 h-6"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const CloseIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-5 h-5"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const EyeIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-5 h-5"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const DeleteIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-5 h-5"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const RefreshIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-5 h-5"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const SaveIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-4 h-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const CancelIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-4 h-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const FilterIcon = (props: { className?: string }) => (
  <svg
    className={props.className || "w-5 h-5"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
    />
  </svg>
);

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 25,
    totalCount: 0,
    totalPages: 0,
  });
  const [emailFilter, setEmailFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tempStatus, setTempStatus] = useState<string>("");
  const [savingStatus, setSavingStatus] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [lastRefetchTime, setLastRefetchTime] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const { t, isRTL } = useLanguage();
  const { token, logout } = useAuth();

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const toastConfig = {
      position: (isRTL ? "top-left" : "top-right") as any,
      rtl: isRTL,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (type) {
      case "success":
        toast.success(message, toastConfig);
        break;
      case "error":
        toast.error(message, toastConfig);
        break;
      default:
        toast.info(message, toastConfig);
    }
  };

  const updateOrderStatusInAllPlaces = (orderId: number, newStatus: string) => {
    console.log(`🔄 تحديث حالة الطلب ${orderId} إلى: ${newStatus}`);

    const updateOrder = (order: Order) =>
      order.id === orderId ? { ...order, status: newStatus } : order;
    setOrders((prevOrders) => prevOrders.map(updateOrder));
    setFilteredOrders((prevFiltered) => prevFiltered.map(updateOrder));

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  const refetchOrders = async (force: boolean = false) => {
    const now = Date.now();
    if (!force && now - lastRefetchTime < 2000) {
      console.log("⏳ تجنب التكرار المفرط لإعادة الجلب");
      return;
    }

    console.log("🔄 إعادة جلب بيانات الطلبات...");
    setLastRefetchTime(now);

    try {
      setLoading(true);

      if (!token) {
        throw new Error("No authentication token found");
      }
      const timestamp = new Date().getTime();
      const response = await fetch(
        `${API_URL}/admin/quotes/all?t=${timestamp}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-cache",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error("Authentication failed");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      processOrdersData(data);
      console.log("✅ تم إعادة جلب بيانات الطلبات بنجاح");
    } catch (err: any) {
      console.error("❌ خطأ في إعادة جلب الطلبات:", err);
      showToast(
        isRTL ? "فشل في تحديث بيانات الطلبات" : "Failed to refresh orders data",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("No authentication token found");
      }
      const timestamp = new Date().getTime();
      const response = await fetch(
        `${API_URL}/admin/quotes/all?t=${timestamp}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-cache",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error("Authentication failed");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      processOrdersData(data);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
      showToast(
        isRTL ? "فشل في تحميل الطلبات" : "Failed to load orders",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (id: number): Promise<Order | null> => {
    try {
      if (!token) return null;
      const timestamp = new Date().getTime();
      const response = await fetch(
        `${API_URL}/admin/quotes/${id}?t=${timestamp}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-cache",
        }
      );

      if (response.ok) {
        const data = await response.json();
        return transformOrder(data);
      }
      return null;
    } catch (err) {
      console.error("Error fetching order:", err);
      return null;
    }
  };

  const transformOrder = (orderData: any): Order => {
    const email =
      orderData.email ||
      orderData.customerEmail ||
      orderData.user?.email ||
      "unknown@example.com";

    const items = Array.isArray(orderData.items) ? orderData.items : [];
    const subTotal =
      orderData.subTotal ||
      orderData.subtotal ||
      items.reduce(
        (sum: number, item: any) => sum + item.unitPrice * item.quantity,
        0
      );

    const taxAmount = orderData.taxAmount || orderData.tax || 0;
    const totalAmount =
      orderData.totalAmount || orderData.total || subTotal + taxAmount;
    const status = orderData.status || "Pending";

    return {
      id: orderData.id || orderData.quoteId || 0,
      quoteId: orderData.quoteId || orderData.id || 0,
      email: email,
      createdDate: new Date(
        orderData.createdDate ||
          orderData.dateCreated ||
          orderData.date ||
          Date.now()
      )
        .toISOString()
        .split("T")[0],
      status: status,
      subTotal: subTotal,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      items: items.map((item: any) => ({
        id: item.id || 0,
        productId: item.productId || item.product?.id || 0,
        productName:
          item.productName ||
          item.name ||
          item.product?.name ||
          "Unknown Product",
        productBarcode:
          item.productBarcode || item.barcode || item.product?.barcode || "",
        caseSize: item.caseSize || item.product?.caseSize || 0,
        casesPerLayer: item.casesPerLayer || item.product?.casesPerLayer || 0,
        casesPerPallet:
          item.casesPerPallet || item.product?.casesPerPallet || 0,
        leadTimeDays: item.leadTimeDays || item.product?.leadTimeDays || 0,
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || item.pricePerUnit || 0,
        productImage:
          item.productImage ||
          item.image ||
          item.product?.image ||
          "/images/placeholder.png",
      })),
      comments: orderData.comments || orderData.notes || "",
      userId:
        orderData.userId ||
        orderData.customerId ||
        orderData.user?.id ||
        undefined,
    };
  };

  const processOrdersData = (data: any) => {
    let ordersData: any[] = [];

    if (Array.isArray(data)) {
      ordersData = data;
    } else if (data && Array.isArray(data.items)) {
      ordersData = data.items;
    } else if (data && Array.isArray(data.data)) {
      ordersData = data.data;
    } else if (data && typeof data === "object") {
      ordersData = [data];
    }

    const formattedOrders: Order[] = ordersData.map(transformOrder);
    setOrders((prevOrders) => {
      const updatedOrders = formattedOrders.map((newOrder) => {
        const existingOrder = prevOrders.find(
          (order) => order.id === newOrder.id
        );
        return existingOrder && existingOrder.status !== newOrder.status
          ? { ...newOrder, status: existingOrder.status }
          : newOrder;
      });
      return updatedOrders;
    });

    setFilteredOrders(formattedOrders);
  };

  const updateOrderStatus = async (
    orderId: number,
    status: string
  ): Promise<boolean> => {
    try {
      console.log("🔄 محاولة تحديث حالة الطلب:", orderId, "إلى:", status);

      const allowedStatuses = ["Pending", "Completed", "Shipped", "Cancelled"];
      const normalizedStatus =
        allowedStatuses.find((s) => s.toLowerCase() === status.toLowerCase()) ||
        status;

      if (!allowedStatuses.includes(normalizedStatus)) {
        console.error("❌ حالة غير مسموحة:", status);
        return false;
      }

      const requestBody = {
        status: normalizedStatus,
      };

      const response = await fetch(
        `${API_URL}/admin/quotes/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("📊 استجابة الخادم:", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      if (response.ok) {
        console.log("✅ تم تحديث الحالة في الخادم بنجاح");
        updateOrderStatusInAllPlaces(orderId, normalizedStatus);

        setTimeout(() => {
          refetchOrders(true);
        }, 1000);

        return true;
      }

      const errorText = await response.text();
      console.error("❌ خطأ من الخادم:", errorText);
      return false;
    } catch (error) {
      console.error("💥 خطأ في الشبكة:", error);
      return false;
    }
  };

  const verifyOrderStatus = async (orderId: number): Promise<string | null> => {
    try {
      const response = await fetch(`${API_URL}/admin/quotes/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const orderData = await response.json();
        return orderData.status || null;
      }
      return null;
    } catch (error) {
      console.error("Error verifying status:", error);
      return null;
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (!newStatus || newStatus === selectedOrder?.status) return;

    setSavingStatus(true);
    const originalStatus = orders.find((order) => order.id === orderId)?.status;

    try {
      const serverSuccess = await updateOrderStatus(orderId, newStatus);

      if (serverSuccess) {
        setTimeout(async () => {
          const actualStatus = await verifyOrderStatus(orderId);
          console.log("🔍 الحالة الفعلية في الخادم:", actualStatus);

          if (actualStatus && actualStatus !== newStatus) {
            console.warn("⚠️ هناك اختلاف بين الواجهة والخادم");
            updateOrderStatusInAllPlaces(orderId, actualStatus);
          }
        }, 1500);

        showToast(isRTL ? "تم حفظ التغييرات" : "Changes saved", "success");
      } else {
        if (originalStatus) {
          updateOrderStatusInAllPlaces(orderId, originalStatus);
        }
        showToast(isRTL ? "فشل في الحفظ" : "Save failed", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      if (originalStatus) {
        updateOrderStatusInAllPlaces(orderId, originalStatus);
      }
      showToast(isRTL ? "حدث خطأ" : "An error occurred", "error");
    } finally {
      setSavingStatus(false);
      setTempStatus("");
    }
  };

  const viewOrderDetails = async (order: Order) => {
    try {
      const freshOrderData = await fetchOrderById(order.id);
      if (freshOrderData) {
        setSelectedOrder(freshOrderData);
        updateOrderStatusInAllPlaces(order.id, freshOrderData.status);
      } else {
        setSelectedOrder(order);
      }
      setTempStatus("");
    } catch (error) {
      console.error("Error fetching order details:", error);
      setSelectedOrder(order);
      setTempStatus("");
    }
  };

  const deleteOrder = async (orderId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/admin/quotes/${orderId}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTimeout(() => {
          refetchOrders(true);
        }, 500);

        showToast(
          isRTL ? "تم حذف الطلب بنجاح" : "Order deleted successfully",
          "success"
        );
        return true;
      }
      showToast(isRTL ? "فشل في حذف الطلب" : "Failed to delete order", "error");
      return false;
    } catch (err) {
      console.error("Error deleting order:", err);
      showToast(
        isRTL ? "حدث خطأ أثناء حذف الطلب" : "Error deleting order",
        "error"
      );
      return false;
    }
  };

  const deleteAllOrders = async (): Promise<boolean> => {
    if (
      !window.confirm(
        isRTL
          ? "هل أنت متأكد من أنك تريد حذف جميع الطلبات؟ لا يمكن التراجع عن هذا الإجراء."
          : "Are you sure you want to delete all orders? This action cannot be undone."
      )
    ) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/admin/quotes/all`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTimeout(() => {
          refetchOrders(true);
        }, 500);

        showToast(
          isRTL
            ? "تم حذف جميع الطلبات بنجاح"
            : "All orders deleted successfully",
          "success"
        );
        return true;
      }
      showToast(
        isRTL ? "فشل في حذف جميع الطلبات" : "Failed to delete all orders",
        "error"
      );
      return false;
    } catch (err) {
      console.error("Error deleting all orders:", err);
      showToast(
        isRTL ? "حدث خطأ أثناء حذف جميع الطلبات" : "Error deleting all orders",
        "error"
      );
      return false;
    }
  };

  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toString().includes(term) ||
          order.email.toLowerCase().includes(term) ||
          (order.status && order.status.toLowerCase().includes(term)) ||
          order.createdDate.includes(term)
      );
    }

    if (emailFilter) {
      result = result.filter((order) =>
        order.email.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, orders, emailFilter, statusFilter]);

  useEffect(() => {
    if (token) {
      fetchAllOrders();
    } else {
      setLoading(false);
      setError("Please login to view orders");
    }
  }, [token, refetchTrigger]);

  const getStatusClass = (status: string | undefined | null) => {
    if (!status) {
      return "bg-bg-secondary text-secondary";
    }

    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
      case "submitted":
        return "bg-accent-2 text-accent-1";
      case "approved":
      case "completed":
        return "bg-primary-light text-[var(--color-primary)]";
      case "shipped":
        return "bg-primary text-white";
      case "rejected":
      case "cancelled":
        return "bg-accent-1 text-white";
      case "draft":
        return "bg-bg-secondary text-secondary";
      default:
        return "bg-bg-secondary text-secondary";
    }
  };

  const getStatusText = (status: string | undefined | null) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch (error) {
      return dateString;
    }
  };

  const fetchOrders = async (params: PaginationParams) => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("No authentication token found");
      }

      let url = `${API_URL}/admin/quotes?page=${params.page}&pageSize=${params.pageSize}`;
      if (params.email) {
        url += `&email=${encodeURIComponent(params.email)}`;
      }

      const timestamp = new Date().getTime();
      url += `&t=${timestamp}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error("Authentication failed");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Order> = await response.json();
      processOrdersData(data);

      const totalCount = data.totalCount ?? 0;
      setPagination((prev) => ({
        ...prev,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / params.pageSize),
      }));
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
      showToast(
        isRTL ? "فشل في تحميل الطلبات" : "Failed to load orders",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders({
      page: 1,
      pageSize: pagination.pageSize,
      email: emailFilter,
    });
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (
      window.confirm(
        isRTL
          ? "هل أنت متأكد من أنك تريد حذف هذا الطلب؟"
          : "Are you sure you want to delete this order?"
      )
    ) {
      await deleteOrder(orderId);
    }
  };

  const forceRefetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };
  // ** START PDF

  const generateOrderPDF = async (order: Order) => {
    try {
      showToast(
        isRTL ? "جاري إنشاء ملف PDF..." : "Generating PDF file...",
        "info"
      );

      // استيراد jsPDF و autoTable بشكل صحيح
      const { jsPDF } = await import("jspdf");

      // استيراد jspdf-autotable بشكل منفصل
      const autoTable = await import("jspdf-autotable");

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text(`Order Details #${order.id}`, 14, 22);

      // Add order information
      doc.setFontSize(11);
      doc.text(`Order Date: ${formatDate(order.createdDate)}`, 14, 32);
      doc.text(`Customer Email: ${order.email}`, 14, 38);
      doc.text(`Status: ${getStatusText(order.status)}`, 14, 44);
      doc.text(`Comments: ${order.comments || "None"}`, 14, 50);

      // Add order summary
      doc.text("Order Summary", 14, 62);
      doc.text(`Subtotal: ${formatCurrency(order.subTotal)}`, 14, 68);
      doc.text(`Tax: ${formatCurrency(order.taxAmount)}`, 14, 74);
      doc.text(`Total: ${formatCurrency(order.totalAmount)}`, 14, 80);

      // Add order items table - استخدام autoTable بشكل صحيح
      const tableColumn = [
        "Product",
        "Barcode",
        "Quantity",
        "Unit Price",
        "Total",
      ];
      const tableRows = order.items.map((item) => [
        item.productName,
        item.productBarcode,
        item.quantity.toString(),
        formatCurrency(item.unitPrice),
        formatCurrency(item.unitPrice * item.quantity),
      ]);

      // استخدام autoTable بشكل صحيح
      autoTable.default(doc, {
        startY: 90,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      // الحصول على الموضع النهائي بعد الجدول
      const finalY = (doc as any).lastAutoTable.finalY + 10;

      // Add additional product details
      doc.text("Product Details", 14, finalY);
      let currentY = finalY + 8;

      order.items.forEach((item) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(10);
        doc.text(`${item.productName}:`, 14, currentY);
        doc.text(`Case Size: ${item.caseSize}`, 60, currentY);
        doc.text(`Cases/Layer: ${item.casesPerLayer}`, 100, currentY);
        doc.text(`Cases/Pallet: ${item.casesPerPallet}`, 140, currentY);
        doc.text(`Lead Time: ${item.leadTimeDays} days`, 180, currentY);

        currentY += 6;
      });

      // Add footer with generation date
      const generationDate = new Date().toLocaleDateString("en-GB");
      doc.setFontSize(8);
      doc.text(`Generated on: ${generationDate}`, 14, 285);

      // Save the PDF
      doc.save(`order-${order.id}-${generationDate.replace(/\//g, "-")}.pdf`);

      showToast(
        isRTL ? "تم تنزيل ملف PDF بنجاح" : "PDF downloaded successfully",
        "success"
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast(
        isRTL ? "فشل في إنشاء ملف PDF" : "Failed to generate PDF",
        "error"
      );
    }
  };

  // ثم في قسم الأزرار في نافذة عرض التفاصيل، أضف الزر:
  // ** END PDF

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setTempStatus("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setEmailFilter("");
    setStatusFilter("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <div className="text-lg text-[var(--color-primary)]">
            {isRTL ? "جاري تحميل الطلبات..." : "Loading orders..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-bg-secondary ${isRTL ? "rtl" : "ltr"}`}>
      {/* Toast Container */}
      <ToastContainer
        position={isRTL ? "top-left" : "top-right"}
        rtl={isRTL}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header Section */}
      <div className="bg-bg-primary shadow-sm border-b border-light">
        <div className="container-custom">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-primary rounded-lg p-2 text-white mr-3">
                <OrderIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">
                  {t("orders", "navigation") || "Orders Management"}
                </h1>
                <p className="text-secondary text-sm mt-1">
                  {isRTL
                    ? "إدارة وتتبع طلبات العملاء"
                    : "Manage and track customer orders"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-accent-2 text-accent-1 px-3 py-1 rounded-full text-sm font-medium">
                {orders.length} {isRTL ? "طلب" : "Orders"}
              </div>

              <button
                onClick={() => refetchOrders(false)}
                className="bg-bg-primary text-secondary border border-light px-4 py-2 rounded-lg hover:bg-bg-secondary flex items-center transition-colors duration-200"
              >
                <RefreshIcon className={isRTL ? "ml-2" : "mr-2"} />
                {isRTL ? "تحديث" : "Refresh"}
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-bg-primary text-secondary border border-light px-4 py-2 rounded-lg hover:bg-bg-secondary flex items-center transition-colors duration-200"
              >
                <FilterIcon className={isRTL ? "ml-2" : "mr-2"} />
                {isRTL ? "الفلاتر" : "Filters"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Search and Filters Section */}
        <div className="bg-bg-primary rounded-lg shadow-sm border border-light mb-6">
          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 ${
                      isRTL ? "right-0 pr-3" : "left-0 pl-3"
                    } flex items-center pointer-events-none`}
                  >
                    <SearchIcon className="text-muted" />
                  </div>
                  <input
                    type="text"
                    placeholder={
                      isRTL ? "ابحث في الطلبات..." : "Search orders..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`block w-full ${
                      isRTL ? "pr-10 pl-3" : "pl-10 pr-3"
                    } py-2 border border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 text-[var(--color-primary)] outline-none`}
                  />
                </div>

                <input
                  type="email"
                  placeholder={isRTL ? "البريد الإلكتروني..." : "Email..."}
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  className="px-3 py-2 border border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 text-[var(--color-primary)] outline-none"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 text-[var(--color-primary)]"
                >
                  <option value="">
                    {isRTL ? "جميع الحالات" : "All Statuses"}
                  </option>
                  <option value="Pending">{isRTL ? "معلق" : "Pending"}</option>
                  <option value="Completed">
                    {isRTL ? "مكتمل" : "Completed"}
                  </option>
                  <option value="Shipped">
                    {isRTL ? "تم الشحن" : "Shipped"}
                  </option>
                  <option value="Cancelled">
                    {isRTL ? "ملغى" : "Cancelled"}
                  </option>
                </select>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover-primary transition-colors duration-200"
                  >
                    {isRTL ? "بحث" : "Search"}
                  </button>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 border border-light text-secondary rounded-lg hover:bg-bg-secondary transition-colors duration-200"
                  >
                    {isRTL ? "مسح" : "Clear"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              {error.includes("Authentication") && (
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors duration-200"
                >
                  {isRTL ? "تسجيل الدخول" : "Login"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-bg-primary rounded-lg shadow-sm border border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-bg-primary divide-y divide-light">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-bg-secondary transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--color-primary)]">
                        #{order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-primary)]">
                        {order.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary">
                        {formatDate(order.createdDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[var(--color-primary)]">
                        {formatCurrency(order.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-[var(--color-primary)] hover:text-[var(--color-primary)]-dark flex items-center transition-colors duration-200"
                        >
                          <EyeIcon
                            className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"}`}
                          />
                          {isRTL ? "عرض" : "View"}
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-accent-4 hover:text-accent-4-dark flex items-center transition-colors duration-200"
                        >
                          <DeleteIcon
                            className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"}`}
                          />
                          {isRTL ? "حذف" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-muted mb-4">
                <OrderIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-primary)] mb-2">
                {isRTL ? "لا توجد طلبات" : "No orders found"}
              </h3>
              <p className="text-secondary mb-4">
                {isRTL
                  ? "لم يتم العثور على أي طلبات تطابق معايير البحث الخاصة بك"
                  : "No orders found matching your search criteria"}
              </p>
              <button
                onClick={clearFilters}
                className="text-[var(--color-primary)] hover:text-[var(--color-primary)]-dark font-medium transition-colors duration-200"
              >
                {isRTL ? "مسح جميع الفلاتر" : "Clear all filters"}
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-secondary">
            {isRTL ? "عرض" : "Showing"} {filteredOrders.length}{" "}
            {isRTL ? "من أصل" : "of"} {orders.length} {isRTL ? "طلب" : "orders"}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={forceRefetch}
              className="bg-accent-3 text-white px-4 py-2 rounded-lg hover-accent-3 flex items-center transition-colors duration-200"
            >
              <RefreshIcon className={isRTL ? "ml-2" : "mr-2"} />
              {isRTL ? "إعادة تحميل" : "Reload"}
            </button>

            <button
              onClick={deleteAllOrders}
              className="bg-accent-4 text-white px-4 py-2 rounded-lg hover-accent-4 flex items-center transition-colors duration-200"
            >
              <DeleteIcon className={isRTL ? "ml-2" : "mr-2"} />
              {isRTL ? "حذف الكل" : "Delete All"}
            </button>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-primary rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-light">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                      {isRTL
                        ? `تفاصيل الطلب #${selectedOrder.id}`
                        : `Order Details #${selectedOrder.id}`}
                    </h2>
                    <p className="text-secondary text-sm mt-1">
                      {formatDate(selectedOrder.createdDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* <button
                      onClick={async () => {
                        const actualStatus = await verifyOrderStatus(
                          selectedOrder.id
                        );
                        alert(
                          isRTL
                            ? `الحالة في الخادم: ${actualStatus}`
                            : `Server status: ${actualStatus}`
                        );
                      }}
                      className="bg-bg-secondary text-secondary px-3 py-2 rounded-lg text-sm hover:bg-bg-primary transition-colors duration-200"
                    >
                      {isRTL ? "تحقق من الخادم" : "Check Server"}
                    </button> */}
                    {/* In the order details modal actions section, add this button */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-light">
                      {/* Add PDF Download Button */}
                      <button
                        onClick={() => generateOrderPDF(selectedOrder)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                      >
                        <PDFIcon className={isRTL ? "ml-2" : "mr-2"} />
                        {isRTL ? "تنزيل PDF" : "Download PDF"}
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(selectedOrder.id)}
                        className="bg-accent-4 text-white px-6 py-2 rounded-lg hover-accent-4 transition-colors duration-200"
                      >
                        {isRTL ? "حذف الطلب" : "Delete Order"}
                      </button>
                      <button
                        onClick={closeOrderDetails}
                        className="bg-bg-secondary text-secondary px-6 py-2 rounded-lg hover:bg-bg-primary transition-colors duration-200"
                      >
                        {isRTL ? "إغلاق" : "Close"}
                      </button>
                    </div>
                    <button
                      onClick={closeOrderDetails}
                      className="text-muted hover:text-[var(--color-primary)] transition-colors duration-200"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
                        {isRTL ? "معلومات الطلب" : "Order Information"}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-secondary">
                            {isRTL ? "البريد الإلكتروني:" : "Email:"}
                          </span>
                          <span className="font-medium text-[var(--color-primary)]">
                            {selectedOrder.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">
                            {isRTL ? "الحالة:" : "Status:"}
                          </span>
                          <div className="flex items-center gap-2">
                            <select
                              value={
                                tempStatus || selectedOrder.status || "Pending"
                              }
                              onChange={(e) => {
                                setTempStatus(e.target.value);
                              }}
                              className={`px-3 py-1 rounded text-sm ${getStatusClass(
                                tempStatus || selectedOrder.status
                              )} border-none outline-none `}
                              disabled={savingStatus}
                            >
                              <option value="Pending">
                                {isRTL ? "معلق" : "Pending"}
                              </option>
                              <option value="Completed">
                                {isRTL ? "مكتمل" : "Completed"}
                              </option>
                              <option value="Shipped">
                                {isRTL ? "تم الشحن" : "Shipped"}
                              </option>
                              <option value="Cancelled">
                                {isRTL ? "ملغى" : "Cancelled"}
                              </option>
                            </select>

                            {tempStatus &&
                              tempStatus !== selectedOrder.status && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        selectedOrder.id,
                                        tempStatus
                                      )
                                    }
                                    className="bg-primary text-white p-1 rounded hover-primary transition-colors duration-200"
                                    disabled={savingStatus}
                                  >
                                    <SaveIcon className="w-3 h-3" />
                                  </button>

                                  <button
                                    onClick={() => setTempStatus("")}
                                    className="bg-[var(--text-muted)] text-white p-1 rounded hover:bg-text-secondary transition-colors duration-200"
                                    disabled={savingStatus}
                                  >
                                    <CancelIcon className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
                        {isRTL ? "ملخص الطلب" : "Order Summary"}
                      </h3>
                      <div className="bg-bg-secondary rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-secondary">
                            {isRTL ? "المجموع الفرعي:" : "Subtotal:"}
                          </span>
                          <span className="font-medium text-[var(--color-primary)]">
                            {formatCurrency(selectedOrder.subTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">
                            {isRTL ? "الضريبة:" : "Tax:"}
                          </span>
                          <span className="font-medium text-[var(--color-primary)]">
                            {formatCurrency(selectedOrder.taxAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-light">
                          <span>{isRTL ? "المجموع الكلي:" : "Total:"}</span>
                          <span className="text-[var(--color-primary)]">
                            {formatCurrency(selectedOrder.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
                      {isRTL ? "عناصر الطلب" : "Order Items"}
                    </h3>
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedOrder.items.map((item) => (
                          <div
                            key={item.id}
                            className="border border-light rounded-lg p-4 hover:border-medium transition-colors duration-200"
                          >
                            <div className="flex items-start mb-3">
                              <img
                                src={getImageUrl(item.productImage)}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded mr-3"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/images/placeholder.png";
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-[var(--color-primary)]">
                                  {item.productName}
                                </h4>
                                <p className="text-sm text-secondary">
                                  {isRTL ? "الباركود:" : "Barcode:"}{" "}
                                  {item.productBarcode}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-secondary">
                                  {isRTL ? "الكمية:" : "Qty:"}
                                </span>{" "}
                                <span className="font-medium text-[var(--color-primary)]">
                                  {item.quantity}
                                </span>
                              </div>
                              <div>
                                <span className="text-secondary">
                                  {isRTL ? "سعر الوحدة:" : "Unit Price:"}
                                </span>{" "}
                                <span className="font-medium text-[var(--color-primary)]">
                                  {formatCurrency(item.unitPrice)}
                                </span>
                              </div>
                              <div>
                                <span className="text-secondary">
                                  {isRTL ? "حجم العلبة:" : "Case Size:"}
                                </span>{" "}
                                <span className="font-medium text-[var(--color-primary)]">
                                  {item.caseSize}
                                </span>
                              </div>
                              <div>
                                <span className="text-secondary">
                                  {isRTL ? "وقت التوصيل:" : "Lead Time:"}
                                </span>{" "}
                                <span className="font-medium text-[var(--color-primary)]">
                                  {item.leadTimeDays} {isRTL ? "أيام" : "days"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center py-8">
                        {isRTL
                          ? "لا توجد عناصر في هذا الطلب"
                          : "No items in this order"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Comments */}
                {selectedOrder.comments && (
                  <div className="mt-6 pt-6 border-t border-light">
                    <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">
                      {isRTL ? "ملاحظات" : "Comments"}
                    </h3>
                    <p className="bg-bg-secondary rounded-lg p-4 text-secondary">
                      {selectedOrder.comments}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-light">
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="bg-accent-4 text-white px-6 py-2 rounded-lg hover-accent-4 transition-colors duration-200"
                  >
                    {isRTL ? "حذف الطلب" : "Delete Order"}
                  </button>
                  <button
                    onClick={closeOrderDetails}
                    className="bg-bg-secondary text-secondary px-6 py-2 rounded-lg hover:bg-bg-primary transition-colors duration-200"
                  >
                    {isRTL ? "إغلاق" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

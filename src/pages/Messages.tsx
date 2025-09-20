import React, { useEffect, useState } from "react";

interface Message {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/Contact/all");
        const data = await res.json();
        setMessages(data.reverse());
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMessages = messages.filter((m) =>
    [m.firstName, m.lastName, m.email, m.message]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="text-center p-6">⏳ جاري تحميل الرسائل...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📩 الرسائل</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="ابحث..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-6 border rounded"
      />

      {/*  Messages Table  */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-right">الاسم</th>
              <th className="px-4 py-2 text-right">الإيميل</th>
              <th className="px-4 py-2 text-right">الهاتف</th>
              <th className="px-4 py-2 text-right">التاريخ</th>
              <th className="px-4 py-2 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="px-4 py-2">{m.firstName} {m.lastName}</td>
                <td className="px-4 py-2">{m.email}</td>
                <td className="px-4 py-2">{m.phone}</td>
                <td className="px-4 py-2">
                  {new Date(m.createdAt).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedMessage(m)}
                  >
                    عرض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagenation */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 border"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Message Deatils */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">تفاصيل الرسالة</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedMessage(null)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p><strong>الاسم:</strong> {selectedMessage.firstName} {selectedMessage.lastName}</p>
              <p><strong>الإيميل:</strong> {selectedMessage.email}</p>
              <p><strong>الهاتف:</strong> {selectedMessage.phone}</p>
              <p><strong>التاريخ:</strong> {new Date(selectedMessage.createdAt).toLocaleString("ar-EG")}</p>
              <p className="bg-gray-50 p-4 rounded">
                {selectedMessage.message}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={() => setSelectedMessage(null)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

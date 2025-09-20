import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

interface Message {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

// Icons SVG
const SearchIcon = () => (
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const MessageIcon = () => (
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
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  </svg>
);

const CloseIcon = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const EyeIcon = () => (
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

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();

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

  const markAsRead = (id: number) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

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

  if (loading)
    return (
      <div className="flex justify-center items-center p-10 bg-bg-secondary min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted">{t("loading_messages", "messages")}</p>
        </div>
      </div>
    );

  return (
    <div
      className={`p-4 md:p-6 bg-bg-secondary min-h-screen ${
        isRTL ? "rtl" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex items-center mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <div
          className={`bg-primary rounded-full p-2 text-white ${
            isRTL ? "ml-3" : "mr-3"
          }`}
        >
          <MessageIcon />
        </div>
        <h1 className="text-2xl font-bold text-primary">
          {t("messages", "messages")}
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div
          className={`absolute inset-y-0 ${
            isRTL ? "right-0 pr-3" : "left-0 pl-3"
          } flex items-center pointer-events-none`}
        >
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder={t("search", "common")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full ${
            isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
          } py-2 border border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition duration-200`}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      {/* Messages Table */}
      <div className="bg-bg-primary rounded-lg shadow-md overflow-hidden border border-light">
        <table className="w-full">
          <thead className="bg-accent-2">
            <tr>
              <th
                className={`px-4 py-3 font-semibold text-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("name", "common")}
              </th>
              <th
                className={`px-4 py-3 font-semibold text-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("email", "common")}
              </th>
              <th
                className={`px-4 py-3 font-semibold text-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("phone", "common")}
              </th>
              <th
                className={`px-4 py-3 font-semibold text-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("date", "orders")}
              </th>
              <th
                className={`px-4 py-3 font-semibold text-primary ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("actions", "products")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.length > 0 ? (
              paginatedMessages.map((m) => (
                <tr
                  key={m.id}
                  className={`border-t border-light ${
                    !m.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <td
                    className={`px-4 py-3 text-secondary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      {m.firstName} {m.lastName}
                      {!m.isRead && (
                        <span
                          className={`inline-block h-2 w-2 rounded-full bg-accent-4 ${
                            isRTL ? "mr-2" : "ml-2"
                          }`}
                        ></span>
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 text-secondary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {m.email}
                  </td>
                  <td
                    className={`px-4 py-3 text-secondary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {m.phone}
                  </td>
                  <td
                    className={`px-4 py-3 text-secondary ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {new Date(m.createdAt).toLocaleDateString(
                      isRTL ? "ar-EG" : "en-US"
                    )}
                  </td>
                  <td
                    className={`px-4 py-3 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <button
                      className="text-accent-4 hover:text-accent-4-dark flex items-center"
                      onClick={() => {
                        setSelectedMessage(m);
                        if (!m.isRead) markAsRead(m.id);
                      }}
                    >
                      {isRTL ? (
                        <>
                          {t("view", "messages")}
                          {/* <EyeIcon className="ml-1" /> */}
                        </>
                      ) : (
                        <>
                          {/* <EyeIcon className="mr-1" /> */}
                          {t("view", "messages")}
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-muted"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("no_messages", "messages")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className={`flex ${
            isRTL ? "flex-row-reverse" : ""
          } justify-center mt-6`}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          ))}
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`bg-bg-primary rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-light ${
              isRTL ? "rtl" : "ltr"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div
              className={`flex justify-between items-center mb-4 p-6 border-b border-light ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <h2 className="text-xl font-bold text-primary">
                {t("message_details", "messages")}
              </h2>
              <button
                className="text-muted hover:text-primary"
                onClick={() => setSelectedMessage(null)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={isRTL ? "text-right" : "text-left"}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <p className="text-sm font-semibold text-secondary mb-1">
                    {t("name", "common")}
                  </p>
                  <p className="text-primary">
                    {selectedMessage.firstName} {selectedMessage.lastName}
                  </p>
                </div>
                <div
                  className={isRTL ? "text-right" : "text-left"}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <p className="text-sm font-semibold text-secondary mb-1">
                    {t("email", "common")}
                  </p>
                  <p className="text-primary">{selectedMessage.email}</p>
                </div>
                <div
                  className={isRTL ? "text-right" : "text-left"}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <p className="text-sm font-semibold text-secondary mb-1">
                    {t("phone", "common")}
                  </p>
                  <p className="text-primary">{selectedMessage.phone}</p>
                </div>
                <div
                  className={isRTL ? "text-right" : "text-left"}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <p className="text-sm font-semibold text-secondary mb-1">
                    {t("date", "orders")}
                  </p>
                  <p className="text-primary">
                    {new Date(selectedMessage.createdAt).toLocaleString(
                      isRTL ? "ar-EG" : "en-US"
                    )}
                  </p>
                </div>
              </div>
              <div
                className={isRTL ? "text-right" : "text-left"}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <p className="text-sm font-semibold text-secondary mb-1">
                  {t("content", "messages")}
                </p>
                <p
                  className="bg-accent-2 p-4 rounded-lg text-primary"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {selectedMessage.message}
                </p>
              </div>
            </div>
            <div className="mt-6 p-6 border-t border-light flex justify-end">
              <button
                className="bg-accent-2 hover:bg-gray-300 text-primary px-4 py-2 rounded-lg"
                onClick={() => setSelectedMessage(null)}
              >
                {t("close", "messages")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

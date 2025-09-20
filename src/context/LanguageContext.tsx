import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// ترجمة للنصوص
const translations: Record<Language, Record<string, string>> = {
  ar: {
    'login': 'تسجيل الدخول',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'sign_in': 'تسجيل الدخول',
    'dashboard': 'لوحة التحكم',
    'products': 'المنتجات',
    'orders': 'الطلبات',
    'messages': 'الرسائل',
    'profile': 'الملف الشخصي',
    'logout': 'تسجيل الخروج',
    'all': 'الكل',
    'body_skin_care': 'العناية بالبشرة والجسم',
    'cosmetics': 'مستحضرات التجميل',
    'hair_care': 'العناية بالشعر',
    'hair_removal': 'إزالة الشعر',
    'personal_fragrance': 'العطور الشخصية',
    'new_order': 'طلب جديد',
    'new_message': 'رسالة جديدة',
    'search': 'بحث',
    'edit': 'تعديل',
    'delete': 'حذف',
    'add_product': 'إضافة منتج',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'change_password': 'تغيير كلمة المرور',
    'current_password': 'كلمة المرور الحالية',
    'new_password': 'كلمة المرور الجديدة',
    'confirm_password': 'تأكيد كلمة المرور',
    'name': 'الاسم',
    'category': 'الفئة',
    'price': 'السعر',
    'stock': 'المخزون',
    'actions': 'الإجراءات',
    'order_id': 'رقم الطلب',
    'customer': 'العميل',
    'date': 'التاريخ',
    'status': 'الحالة',
    'total': 'المجموع',
    'pending': 'قيد الانتظار',
    'completed': 'مكتمل',
    'shipped': 'تم الشحن',
    'cancelled': 'ملغي',
    'message_id': 'رقم الرسالة',
    'subject': 'الموضوع',
    'received_at': 'تاريخ الاستلام',
    'read': 'مقروء',
    'unread': 'غير مقروء',
    'invalid_credentials': 'بيانات الدخول غير صحيحة',
    'welcome_message': 'مرحباً بك في لوحة التحكم',
    'order_count': 'عدد الطلبات',
    'product_count': 'عدد المنتجات',
    'message_count': 'عدد الرسائل',
    'view_all': 'عرض الكل',
    'recent_orders': 'الطلبات الحديثة',
    'recent_messages': 'الرسائل الحديثة',
    'dashboard_overview': 'نظرة عامة',
    'phone': 'الهاتف',
    'update': 'تحديث',
    'order_details': 'تفاصيل الطلب',
    'message_details': 'تفاصيل الرسالة',
    'product_details': 'تفاصيل المنتج',
    'description': 'الوصف',
    'quantity': 'الكمية',
    'subtotal': 'المجموع الجزئي',
    'shipping_address': 'عنوان الشحن',
    'payment_method': 'طريقة الدفع',
    'order_date': 'تاريخ الطلب',
    'content': 'المحتوى',
    'reply': 'رد',
    'mark_as_read': 'وضع علامة مقروء',
    'mark_as_unread': 'وضع علامة غير مقروء',
    'customer_name': 'اسم العميل',
    'customer_email': 'بريد العميل',
    'customer_phone': 'هاتف العميل',
  },
  en: {
    'login': 'Login',
    'email': 'Email',
    'password': 'Password',
    'sign_in': 'Sign In',
    'dashboard': 'Dashboard',
    'products': 'Products',
    'orders': 'Orders',
    'messages': 'Messages',
    'profile': 'Profile',
    'logout': 'Logout',
    'all': 'All',
    'body_skin_care': 'Body & Skin Care',
    'cosmetics': 'Cosmetics',
    'hair_care': 'Hair Care',
    'hair_removal': 'Hair Removal',
    'personal_fragrance': 'Personal Fragrance',
    'new_order': 'New Order',
    'new_message': 'New Message',
    'search': 'Search',
    'edit': 'Edit',
    'delete': 'Delete',
    'add_product': 'Add Product',
    'save': 'Save',
    'cancel': 'Cancel',
    'change_password': 'Change Password',
    'current_password': 'Current Password',
    'new_password': 'New Password',
    'confirm_password': 'Confirm Password',
    'name': 'Name',
    'category': 'Category',
    'price': 'Price',
    'stock': 'Stock',
    'actions': 'Actions',
    'order_id': 'Order ID',
    'customer': 'Customer',
    'date': 'Date',
    'status': 'Status',
    'total': 'Total',
    'pending': 'Pending',
    'completed': 'Completed',
    'shipped': 'Shipped',
    'cancelled': 'Cancelled',
    'message_id': 'Message ID',
    'subject': 'Subject',
    'received_at': 'Received At',
    'read': 'Read',
    'unread': 'Unread',
    'invalid_credentials': 'Invalid credentials',
    'welcome_message': 'Welcome to Dashboard',
    'order_count': 'Orders Count',
    'product_count': 'Products Count',
    'message_count': 'Messages Count',
    'view_all': 'View All',
    'recent_orders': 'Recent Orders',
    'recent_messages': 'Recent Messages',
    'dashboard_overview': 'Dashboard Overview',
    'phone': 'Phone',
    'update': 'Update',
    'order_details': 'Order Details',
    'message_details': 'Message Details',
    'product_details': 'Product Details',
    'description': 'Description',
    'quantity': 'Quantity',
    'subtotal': 'Subtotal',
    'shipping_address': 'Shipping Address',
    'payment_method': 'Payment Method',
    'order_date': 'Order Date',
    'content': 'Content',
    'reply': 'Reply',
    'mark_as_read': 'Mark as Read',
    'mark_as_unread': 'Mark as Unread',
    'customer_name': 'Customer Name',
    'customer_email': 'Customer Email',
    'customer_phone': 'Customer Phone',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
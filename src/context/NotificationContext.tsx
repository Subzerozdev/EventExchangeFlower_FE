import React, { createContext, useContext, useState, ReactNode } from 'react';


// Định nghĩa kiểu cho một thông báo
interface Notification {
  id: number;
  message: string;
}

// Định nghĩa kiểu cho context
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: number) => void;  // Thêm hàm removeNotification
}

// Tạo context cho thông báo
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook để sử dụng context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Giao diện cho prop `children`
interface NotificationProviderProps {
  children: ReactNode;
}

// Provider để quản lý thông báo
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Hàm để thêm thông báo mới
  const addNotification = (message: string) => {
    const newNotification = { id: Date.now(), message };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  // Hàm để xóa thông báo theo id
  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

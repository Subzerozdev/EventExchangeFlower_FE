// context/NotificationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "../config/api";

// Định nghĩa kiểu Notification
interface Notification {
  id: number;
  message: string;
  sender: string;
  createDate: string; // Đã ép kiểu từ LocalDateTime về string
  notificationType: "REMIND" | "INFORMATION" | "WARNING"; // Các loại thông báo
}

// Định nghĩa kiểu context
interface NotificationContextType {
  notifications: Notification[];
  loadNotifications: () => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Hàm load thông báo từ API
  const loadNotifications = async () => {
    try {
      const response = await api.get<Notification[]>("/api/notification");
      setNotifications(response.data); // Gán dữ liệu thông báo
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // Hàm xóa thông báo
  const removeNotification = async (id: number) => {
    try {
      await api.put(`/api/notification/${id}`); // Gọi API xóa thông báo
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  useEffect(() => {
    loadNotifications(); // Load thông báo khi component được mount
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, loadNotifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

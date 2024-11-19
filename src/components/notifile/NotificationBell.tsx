import React from "react";
import { Badge, Button, Dropdown, List, Typography } from "antd";
import { BellOutlined, CloseOutlined } from "@ant-design/icons";
import { useNotification } from "../../context/NotificationContext";
import "./NotificationBell.scss";

const { Text } = Typography;

// Định nghĩa kiểu cho Notification
interface Notification {
  id: number;
  message: string;
  sender: string;
  createDate: string; // Đã ép kiểu từ LocalDateTime về string
  notificationType: "REMIND" | "INFORMATION" | "WARNING"; // Các loại thông báo
}

const NotificationBell: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  // Render từng thông báo
  const renderNotificationItem = (notification: Notification) => (
    <div className="notification-item">
      <div className="notification-item__content">
        <Text strong className="notification-item__sender">
          {notification.sender}
        </Text>
        <p className="notification-item__message">{notification.message}</p>
        <Text type="secondary" className="notification-item__meta">
          {notification.createDate} - {notification.notificationType}
        </Text>
      </div>
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={() => removeNotification(notification.id)}
        className="notification-item__close-btn"
      />
    </div>
  );

  // Menu hiển thị danh sách thông báo
  const menu = (
    <div className="notification-menu">
      {notifications.length > 0 ? (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item key={notification.id} className="notification-list-item">
              {renderNotificationItem(notification)}
            </List.Item>
          )}
        />
      ) : (
        <div className="notification-menu__empty">Không có thông báo mới</div>
      )}
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Badge count={notifications.length} offset={[10, 0]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: "34px", color: "white" }} />}
          className="notification-bell__icon"
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;

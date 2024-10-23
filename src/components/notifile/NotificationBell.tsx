import React from "react";
import { Badge, Button, Dropdown, Menu } from "antd";
import { BellOutlined, CloseOutlined } from "@ant-design/icons";
import { useNotification } from "../../context/NotificationContext"; // Sử dụng context
import "./NotificationBell.scss";
const NotificationBell: React.FC = () => {
  const { notifications, removeNotification } = useNotification(); // Lấy thông báo và hàm xóa thông báo từ context

  const menu = (
    <Menu>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Menu.Item key={notification.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{notification.message}</span>
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={() => removeNotification(notification.id)} // Xóa thông báo khi nhấn nút
              />
            </div>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item key="no-notification">Không có thông báo mới</Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Badge count={notifications.length} offset={[10, 0]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: "24px", color: "white" }} />}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;

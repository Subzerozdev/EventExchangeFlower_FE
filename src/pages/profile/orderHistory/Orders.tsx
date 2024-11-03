import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification, Table, Button } from "antd"; // Import Modal
import moment from "moment";
import api from "../../../config/api"; // Đường dẫn API
import "./Orders.scss";

interface ApiOrder {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  note: string;
  orderDate: string | null;
  totalMoney: string;
  status: string;
  check: string;
}

interface Order {
  key: string;
  orderNumber: string;
  orderDate: string;
  address: string;
  totalMoney: string;
  note: string;
  status: string;
  check: string;
  showConfirmReceived: boolean;
  hasFeedback: boolean;
}

const translateStatus = (status: string): string => {
  switch (status) {
    case "AWAITING_PAYMENT":
      return "Đang chờ thanh toán";
    case "AWAITING_PICKUP":
      return "Đang chờ lấy hàng";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get<ApiOrder[]>("/api/orders");
        const feedbackStatus = localStorage.getItem("feedbackStatus")
          ? JSON.parse(localStorage.getItem("feedbackStatus") || "{}")
          : {};

        const fetchedOrders = response.data.map((order) => ({
          key: order.id,
          orderNumber: order.phoneNumber,
          orderDate: order.orderDate
            ? moment(order.orderDate).format("DD/MM/YYYY")
            : "Không xác định",
          address: order.address || "Không xác định",
          totalMoney: order.totalMoney
            ? parseInt(order.totalMoney).toLocaleString("vi-VN") + "₫"
            : "Không xác định",
          note: order.note,
          status: order.status,
          check: order.check,
          showConfirmReceived: order.status === "AWAITING_PICKUP",
          hasFeedback: feedbackStatus[order.id] || false,
        }));

        setOrders(fetchedOrders);
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Lỗi",
          description: "Không thể lấy thông tin đơn hàng.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirmOrderReceived = async (key: string) => {
    try {
      await api.put(`/api/receive/${key}`, { status: "COMPLETED" });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.key === key ? { ...order, status: "COMPLETED" } : order
        )
      );

      notification.success({
        message: "Xác nhận thành công",
        description: "Đơn hàng đã được xác nhận là đã nhận hàng.",
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xác nhận đơn hàng. Vui lòng thử lại.",
      });
    }
  };

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/order_details/${orderId}`);
  };

  // Lọc các đơn hàng để ẩn những đơn hàng có trạng thái "CANCELLED"
  const filteredOrders = orders.filter((order) => order.status !== "CANCELLED");

  const handleFeedback = (orderId: string, shopId?: number) => {
    if (shopId !== undefined) {
      localStorage.setItem("shopId", shopId.toString());
    }
    localStorage.setItem("orderId", orderId);

    // Cập nhật trạng thái đã đánh giá vào localStorage
    const feedbackStatus = localStorage.getItem("feedbackStatus")
      ? JSON.parse(localStorage.getItem("feedbackStatus") || "{}")
      : {};
    feedbackStatus[orderId] = true;
    localStorage.setItem("feedbackStatus", JSON.stringify(feedbackStatus));

    // Cập nhật trạng thái hasFeedback của đơn hàng trong state
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.key === orderId ? { ...order, hasFeedback: true } : order
      )
    );

    // Điều hướng đến trang phản hồi
    window.location.href = `/feedBack`;
  };

  const columns = [
    {
      title: "Đơn hàng",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Số điện thoại",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Ngày Đặt",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tổng tiền đơn hàng",
      dataIndex: "totalMoney",
      key: "totalMoney",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => translateStatus(status), // Dịch trạng thái
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Đánh Giá",
      dataIndex: "status",
      key: "feedback",
      render: (_: string, record: Order) =>
        record.status === "COMPLETED" && !record.hasFeedback ? (
          <Button
            type="primary"
            onClick={() => handleFeedback(record.key)} // Chỉ truyền orderId
          >
            Đánh giá
          </Button>
        ) : (
          <span>{record.hasFeedback ? "Đã đánh giá" : "Chưa hoàn thành"}</span>
        ),
    },

    {
      title: "Xác Nhận",
      dataIndex: "check",
      key: "check",
      render: (_: string, record: Order) =>
        record.showConfirmReceived ? (
          <Button
            type="primary"
            onClick={() => handleConfirmOrderReceived(record.key)}
          >
            Đã nhận hàng
          </Button>
        ) : (
          <span>
            {record.status === "COMPLETED" ? "Đã nhận hàng" : "Chưa nhận"}
          </span>
        ),
    },
    {
      title: "Chi Tiết",
      key: "details",
      render: (_: string, record: Order) => (
        <Button
          type="default"
          onClick={() => handleViewOrderDetails(record.key)} // Truyền ID của đơn hàng vào hàm
        >
          Xem Chi Tiết
        </Button>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="order_container">
      <h2> LỊCH SỬ ĐẶT HÀNG CỦA BẠN</h2>
      <Table
        columns={columns}
        dataSource={filteredOrders} // Sử dụng danh sách đã lọc để không hiển thị đơn hàng đã hủy
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredOrders.length, // Cập nhật số lượng đơn hàng hiển thị
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        locale={{ emptyText: "Không có đơn hàng nào đã thanh toán." }}
        bordered
        scroll={{ x: "max-content" }} // Kích hoạt thanh cuộn ngang
      />
    </div>
  );
};

export default Orders;

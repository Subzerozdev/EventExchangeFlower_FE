import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification, Table, Button, Modal, Input } from "antd"; // Import Modal
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
  validationImage: string;
  stopReason?: string;
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
  validationImage: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState({
    problem: "",
    content: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get<ApiOrder[]>("/api/orders");
        console.log(response);
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
          validationImage: order.validationImage,
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
  //Mở form report
  const handleOpenReportModal = (orderId: string) => {
    setCurrentOrderId(orderId);
    setReportModalVisible(true);
  };
  //đóng fomr report
  const handleCloseReportModal = () => {
    setReportModalVisible(false);
    setCurrentOrderId(null);
    setReportForm({ problem: "", content: "" });
  };
  //Gửi report cho admin
  const handleSubmitReport = async () => {
    if (!reportForm.problem || !reportForm.content || !currentOrderId) {
      notification.warning({
        message: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin khiếu nại.",
      });
      return;
    }

    try {
      await api.post("/api/user/report", {
        problem: reportForm.problem,
        content: reportForm.content,
        orderId: currentOrderId,
      });

      notification.success({
        message: "Thành công",
        description: "Khiếu nại của bạn đã được gửi, đang chờ xử lý.",
      });

      handleCloseReportModal();
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Lỗi",
        description: "Không thể gửi khiếu nại, vui lòng thử lại.",
      });
    }
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
      render: (status: string) => {
        let color = "";
        let icon = "";
        let text = "";
        switch (status) {
          case "AWAITING_PAYMENT":
            color = "orange";
            icon = "💳"; // Biểu tượng thanh toán
            text = "Đang chờ thanh toán";
            break;
          case "AWAITING_PICKUP":
            color = "blue";
            icon = "📦"; // Biểu tượng hàng chờ lấy
            text = "Đang chờ lấy hàng";
            break;
          case "COMPLETED":
            color = "green";
            icon = "✅"; // Biểu tượng hoàn thành
            text = "Hoàn thành";
            break;
          case "STOPPED":
            color = "red";
            icon = "❌"; // Biểu tượng hủy
            text = "Đã hủy";
            break;

          default:
            color = "gray";
            icon = "❓"; // Biểu tượng không xác định
            text = "Không xác định";
        }

        return (
          <div
            style={{
              color: color,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "18px" }}>{icon}</span>
            {text}
          </div>
        );
      },
    },

    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: " Shop Xác Minh",
      dataIndex: "validationImage",
      key: "validationImage",
      render: (validationImage: string) => (
        <div style={{ textAlign: "center" }}>
          {validationImage ? (
            <img
              src={validationImage}
              alt="Xác minh"
              style={{
                width: "80px", // Kích thước ảnh
                height: "80px",
                objectFit: "cover", // Cắt ảnh nếu không đúng tỷ lệ
                borderRadius: "8px", // Bo góc ảnh
                border: "1px solid #ddd", // Viền nhẹ
              }}
            />
          ) : (
            <span>Không có hình ảnh</span>
          )}
        </div>
      ),
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
      title: "Khiếu nại",
      key: "report",
      render: (_: string, record: Order) => (
        <Button
          type="primary"
          onClick={() => handleOpenReportModal(record.key)} // Mở form khiếu nại
        >
          Khiếu nại
        </Button>
      ),
    },
    // {
    //   title: "Trạng thái khiếu nại",
    //   key: "reportStatus",
    //   render: (_: string, record: Order) => {
    //     switch (record.status) {
    //       case "PROCESSING":
    //         return <span style={{ color: "orange" }}>Đang chờ duyệt</span>;
    //       case "COMPLETED":
    //         return <span style={{ color: "green" }}>Đã duyệt</span>;
    //       case "REJECTED":
    //         return <span style={{ color: "red" }}>Đã xử lý</span>;
    //       default:
    //         return <span>Không xác định</span>;
    //     }
    //   },
    // },

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

      <Modal
        title="Gửi khiếu nại" // fom khiếu nại
        visible={isReportModalVisible}
        onCancel={handleCloseReportModal}
        onOk={handleSubmitReport}
        okText="Gửi"
        cancelText="Hủy"
      >
        <div>
          <label>Vấn đề:</label>
          <Input
            value={reportForm.problem}
            onChange={(e) =>
              setReportForm({ ...reportForm, problem: e.target.value })
            }
            placeholder="Nhập vấn đề bạn gặp phải"
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Nội dung:</label>
          <Input.TextArea
            value={reportForm.content}
            onChange={(e) =>
              setReportForm({ ...reportForm, content: e.target.value })
            }
            placeholder="Nhập nội dung chi tiết"
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Orders;

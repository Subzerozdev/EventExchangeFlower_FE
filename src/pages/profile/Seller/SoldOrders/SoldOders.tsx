import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  message,
  Modal,
  Upload,
  UploadFile,
  Image,
  Input,
  Form,
} from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import "./SoldOrders.scss"; // Import SCSS
import api from "../../../../config/api";
import uploadFile from "../../../../utils/file"; // Hàm upload file lên Firebase

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface OrderRecord {
  id: number;
  fullName: string;
  status: string;
  totalMoney: number;
  phoneNumber?: string;
  email?: string;
  address?: string;
  note?: string;
  orderDate?: string;
  validationImage: string;
}

const SoldOrders = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelForm] = Form.useForm();

  const navigate = useNavigate();

  // Lấy danh sách đơn hàng đã bán từ API
  const fetchSoldOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get<OrderRecord[]>("/api/seller/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data);
      message.success("Tải danh sách đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldOrders();
  }, []);

  const handleViewOrderDetails = (orderId: number) => {
    navigate(`/seller/sold-orders/${orderId}`);
  };

  const handleCompleteOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleModalOk = async () => {
    if (!fileList.length) {
      message.error("Vui lòng upload ảnh xác nhận trước khi tiếp tục.");
      return;
    }

    try {
      const uploadedFile = fileList[0].originFileObj as File;
      const imageUrl = await uploadFile(uploadedFile); // Nhận URL ảnh từ Firebase

      // Gửi URL ảnh qua API để lưu trong cơ sở dữ liệu
      await api.put(
        `/api/seller/orders/${selectedOrderId}`,
        { image: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Cập nhật trạng thái thành công!");
      setIsModalVisible(false);
      setFileList([]);
      fetchSoldOrders();
    } catch (error) {
      console.error("Lỗi khi upload ảnh hoặc cập nhật trạng thái:", error);
      message.error("Không thể cập nhật trạng thái đơn hàng.");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
  };

  const handleCancelOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCancelModalVisible(true);
  };

  const handleCancelOrderConfirm = async (values: { content: string }) => {
    if (!selectedOrderId) return;

    try {
      await api.delete(`/api/seller/orders/${selectedOrderId}`, {
        data: {
          problem: "Hủy Đơn Hàng",
          content: values.content,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      message.success("Hủy đơn hàng thành công!");
      setCancelModalVisible(false);
      fetchSoldOrders();
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      message.error("Không thể hủy đơn hàng.");
    }
  };

  const handleCancelModalCancel = () => {
    setCancelModalVisible(false);
    cancelForm.resetFields();
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (total: number) => (
        <span className="currency">
          {total.toLocaleString("vi-VN")}{" "}
          <span className="currency-symbol">đ</span>
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "COMPLETED"
            ? "green"
            : status === "STOPPED"
            ? "red"
            : "blue";
        const label =
          status === "COMPLETED"
            ? "Hoàn thành"
            : status === "STOPPED"
            ? "Đã hủy"
            : "Đang xử lý";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (record: OrderRecord) => (
        <div className="action-buttons">
          <Button
            type="primary"
            onClick={() => handleCompleteOrder(record.id)}
            disabled={
              record.status === "COMPLETED" || record.status === "STOPPED"
            }
          >
            Đã giao thành công
          </Button>
          <Button
            danger
            onClick={() => handleCancelOrder(record.id)}
            disabled={
              record.status === "COMPLETED" || record.status === "STOPPED"
            }
          >
            Hủy đơn hàng
          </Button>
          <Button type="link" onClick={() => handleViewOrderDetails(record.id)}>
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="sold-orders-container">
      <h2>Quản lý đơn hàng</h2>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Xác nhận giao hàng thành công"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        {selectedOrderId && (
          <>
            <p>Ảnh xác minh hiện tại:</p>
            {orders.find((order) => order.id === selectedOrderId)
              ?.validationImage ? (
              <Image
                src={
                  orders.find((order) => order.id === selectedOrderId)
                    ?.validationImage
                }
                alt="Ảnh xác minh hiện tại"
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
                preview
              />
            ) : (
              <p>Không có ảnh xác minh hiện tại.</p>
            )}
          </>
        )}
        <p>Vui lòng upload ảnh mới làm bằng chứng giao hàng thành công.</p>
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Modal>

      <Modal
        title="Hủy đơn hàng"
        visible={cancelModalVisible}
        onCancel={handleCancelModalCancel}
        footer={null}
      >
        <Form
          form={cancelForm}
          onFinish={handleCancelOrderConfirm}
          layout="vertical"
          initialValues={{ problem: "Hủy Đơn Hàng" }}
        >
          <Form.Item label="Mã đơn hàng">
            <strong>{selectedOrderId}</strong>
          </Form.Item>
          <Form.Item
            label="Lý do hủy"
            name="content"
            rules={[
              { required: true, message: "Vui lòng nhập lý do hủy đơn hàng!" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do hủy..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Xác nhận hủy
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              onClick={handleCancelModalCancel}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SoldOrders;

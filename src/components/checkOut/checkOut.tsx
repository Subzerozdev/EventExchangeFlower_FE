import React, { useEffect, useState } from "react";
import { Button, Input, Radio, Form, notification, Modal } from "antd";
import { PhoneOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./checkOut.scss";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

import { RadioChangeEvent } from "antd/lib/radio";

// Interface cho thông tin sản phẩm trong giỏ hàng
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

// Interface cho dữ liệu biểu mẫu đầu vào
interface FormValues {
  email: string;
  fullname: string;
  phone: string;
  address: string;
  note: string;
}

interface HttpError {
  response?: {
    status: number;
  };
}
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [form] = Form.useForm();
  const [cart, setCart] = useState<Product[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEditProfile = () => {
    setEditProfile(true);
    navigate("/updateProfile", { state: { fromCheckout: true } });
  };

  useEffect(() => {
    if (editProfile) {
      setEditProfile(false);
    }
  }, [editProfile]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (!user || !user.email) {
      notification.warning({
        message: "Cần đăng nhập",
        description: "Vui lòng đăng nhập hoặc đăng ký để tiếp tục.",
      });
      navigate("/login");
    }
  }, [user, navigate]);

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const handleDelete = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    notification.success({ message: "Sản phẩm đã được xóa" });
  };

  // const handleQuantityChange = (value: number, id: number) => {
  //   const updatedCart = cart.map((item) =>
  //     item.id === id ? { ...item, quantity: value } : item
  //   );
  //   setCart(updatedCart);
  //   localStorage.setItem("cart", JSON.stringify(updatedCart));
  // };

  const onFinish = async (values: FormValues) => {
    setLoading(true);

    if (cart.length === 0) {
      notification.error({
        message: "Giỏ hàng trống",
        description:
          "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
      });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: user.fullName,
        phoneNumber: user.phone,
        email: user.email,
        address: user.address,
        note: values.note || "",
        paymentMethod: "VNPAY",
        totalMoney: totalPrice,
        orderDetails: cart.map((item) => ({
          postID: item.id,
          numberOfProducts: item.quantity,
        })),
      };

      const response = await api.post("/api/orders", payload);

      if (response.status === 200) {
        const vnpayResult = response.data;
        if (vnpayResult) {
          window.location.href = vnpayResult;
          localStorage.removeItem("cart");
        } else {
          const failureUrl = response.data.failureUrl;
          if (failureUrl) {
            window.location.href = failureUrl;
          } else {
            notification.error({
              message: "Lỗi thanh toán",
              description: "Không nhận được URL thanh toán từ VNPay.",
            });
            navigate("/paymentFailure");
          }
        }
      } else {
        throw new Error("Thất bại khi đặt hàng");
      }
    } catch (error: unknown) {
      const httpError = error as HttpError;

      if (httpError.response?.status === 400) {
        notification.error({
          message: "Đặt hàng thất bại",
          description:
            "Bạn không thể đặt hàng với sản phẩm của chính mình hoặc đặt hàng từ một shop khác .",
        });
      } else {
        notification.error({
          message: "Đặt hàng thất bại",
          description: "Có lỗi xảy ra khi đặt hàng.",
        });
      }

      navigate("/errorPayment");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentChange = (e: RadioChangeEvent) => {
    if (e.target.value === "VNPAY") {
      setIsModalVisible(true);
    }
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.setFieldsValue({ payment: null }); // Bỏ chọn VNPay trong Radio.Group
  };

  return (
    <div className="checkout-container">
      <Modal
        title="⚠️ Lưu ý quan trọng"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={handleModalCancel} // Gọi handleModalCancel khi nhấn nút "Bỏ chọn"
        okText="Tôi đã hiểu"
        cancelText="Bỏ chọn"
        maskClosable={false} // Ngăn đóng Modal khi nhấn ra ngoài
      >
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <strong style={{ color: "#d9534f" }}>Xin lưu ý:</strong> Vì đây là
          phương thức thanh toán qua
          <strong style={{ color: "#007bff" }}> VNPay</strong> và hoàn tất thanh
          toán, đơn hàng của bạn sẽ được
          <strong> xử lý ngay lập tức</strong>.
          <br />
          <br />
          <span
            style={{ color: "#d9534f", fontWeight: "bold", fontSize: "16px" }}
          >
            ❗ Sau khi thanh toán thành công, bạn sẽ không thể hủy hoặc thay đổi
            đơn hàng.
          </span>
          <br />
          <br />
          Vui lòng <em>kiểm tra kỹ thông tin</em> trước khi tiếp tục thanh toán
          để đảm bảo tính chính xác.
          <br />
          <br />
          <span style={{ color: "#28a745", fontWeight: "bold" }}>
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.
          </span>
        </p>
      </Modal>

      <div className="checkout-form">
        {/* Container cho tiêu đề và nút */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Thông tin nhận hàng</h2>
          <Button
            type="primary"
            className="edit-info-button"
            icon={<EditOutlined />}
            onClick={handleEditProfile}
            style={{ marginLeft: "auto" }}
          >
            Chỉnh sửa thông tin
          </Button>
        </div>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            style={{ color: "#4CC9FE", fontWeight: "bold" }}
            name="email"
            label="Email "
          >
            <span>{user.email}</span>
          </Form.Item>

          <Form.Item
            style={{ color: "#4CC9FE", fontWeight: "bold" }}
            name="fullname"
            label="Họ và tên "
          >
            <span>{user.fullName}</span>
          </Form.Item>

          <Form.Item
            style={{ color: "#4CC9FE", fontWeight: "bold" }}
            name="phone"
            label="Số điện thoại "
          >
            <PhoneOutlined style={{ paddingRight: 10, fontSize: 15 }} />
            <span>{user.phone}</span>
          </Form.Item>

          <Form.Item
            style={{ color: "#4CC9FE", fontWeight: "bold" }}
            name="address"
            label="Địa chỉ (tùy chọn)"
          >
            <span>{user.address}</span>
          </Form.Item>

          {/* Các phần tử khác trong form */}
          <Form.Item
            name="note"
            style={{ fontWeight: "bold" }}
            label="Ghi chú (tùy chọn)"
            rules={[
              {
                max: 255,
                message: "Ghi chú không được vượt quá 255 ký tự",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Ghi chú cho đơn hàng( Không vượt quá 255 ký tự)"
              maxLength={255}
            />
          </Form.Item>

          <h2>Thanh toán</h2>
          <Form.Item
            name="payment"
            label="Phương thức thanh toán"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn phương thức thanh toán!",
              },
            ]}
          >
            <Radio.Group onChange={handlePaymentChange}>
              <Radio value="VNPAY">Thanh toán qua VNPAY-QR</Radio>
            </Radio.Group>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              backgroundColor: "#4CAF50",
              borderColor: "#4CAF50",
              width: "100%",
              borderRadius: "8px",
            }}
          >
            Đặt hàng
          </Button>
        </Form>
      </div>

      <div className="checkout-cart">
        <h2>Đơn hàng ({cart.length} sản phẩm)</h2>
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.thumbnail}
              alt={item.name}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "4px",
                marginRight: "10px",
              }}
            />
            <div>
              <p style={{ fontWeight: "bold", margin: 0 }}>{item.name}</p>
              <p style={{ color: "#999", margin: 0 }}>
                {item.price.toLocaleString()}₫
              </p>
              {/* <InputNumber
                readOnly
                min={1}
                value={item.quantity}
                onChange={(value) => handleQuantityChange(value || 1, item.id)}
                style={{ marginRight: "10px" }}
              /> */}
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(item.id)}
                style={{
                  color: "#f5222d",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  padding: 0,
                  gap: "4px", // Khoảng cách giữa biểu tượng và chữ
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#d32029")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#f5222d")}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
        <div className="checkout-summary">
          <p style={{ fontWeight: "bold", fontSize: "16px" }}>
            Tổng cộng: {totalPrice.toLocaleString()}₫
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

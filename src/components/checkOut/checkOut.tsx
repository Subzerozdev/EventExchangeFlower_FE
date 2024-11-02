import React, { useEffect, useState } from "react";
import { Button, Input, Radio, Form, notification, InputNumber } from "antd";
import { PhoneOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./checkOut.scss";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useNotification } from "../../context/NotificationContext";

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

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Lấy thông tin người dùng từ context
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [editProfile, setEditProfile] = useState(false); // Trạng thái để kiểm tra chỉnh sửa thông tin
  const [form] = Form.useForm(); // Khởi tạo biểu mẫu với Ant Design Form
  const [cart, setCart] = useState<Product[]>([]); // Danh sách sản phẩm trong giỏ hàng
  const { addNotification } = useNotification(); // Hàm để thêm thông báo vào context

  // Hàm chuyển hướng tới trang cập nhật thông tin với trạng thái chỉnh sửa
  const handleEditProfile = () => {
    setEditProfile(true);
    navigate("/updateProfile", { state: { fromCheckout: true } });
  };

  // Sử dụng useEffect để kiểm tra nếu người dùng quay lại từ trang cập nhật
  useEffect(() => {
    if (editProfile) {
      setEditProfile(false); // Reset trạng thái sau khi quay lại
    }
  }, [editProfile]);

  // Lấy giỏ hàng từ localStorage khi component được mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Nếu người dùng chưa đăng nhập, chuyển hướng họ đến trang đăng nhập
  useEffect(() => {
    if (!user || !user.email) {
      notification.warning({
        message: "Cần đăng nhập",
        description: "Vui lòng đăng nhập hoặc đăng ký để tiếp tục.",
      });
      navigate("/login");
    }
  }, [user, navigate]);

  // Tính tổng tiền của tất cả sản phẩm trong giỏ hàng
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleDelete = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id); // Xóa sản phẩm có id được truyền vào
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Cập nhật giỏ hàng trong localStorage
    notification.success({ message: "Sản phẩm đã được xóa" });
  };

  // Xử lý thay đổi số lượng sản phẩm trong giỏ hàng
  const handleQuantityChange = (value: number, id: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: value } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Xử lý khi hoàn tất đặt hàng
  const onFinish = async (values: FormValues) => {
    setLoading(true);

    // Kiểm tra giỏ hàng rỗng
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
      // Tạo payload gửi lên API đặt hàng
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

      // Gửi yêu cầu đặt hàng đến API
      const response = await api.post("/api/orders", payload);

      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        const updateStatus = async () => {
          try {
            // Cập nhật trạng thái sản phẩm trong giỏ hàng thành "SOLD_OUT"
            await Promise.all(
              cart.map(async (item) => {
                await api.patch(`/posts/${item.id}`, { status: "SOLD_OUT" });
              })
            );
          } catch (error) {
            console.error("Error updating status:", error);
          }
        };

        const vnpayResult = response.data; // URL thanh toán của VNPay
        if (vnpayResult) {
          await updateStatus();
          window.location.href = vnpayResult; // Chuyển hướng người dùng đến trang thanh toán
          localStorage.removeItem("cart"); // Xóa giỏ hàng sau khi thanh toán
          addNotification("Bạn đã thanh toán thành công 1 đơn hàng!"); // Thông báo thành công
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
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Đặt hàng thất bại",
        description: "Có lỗi xảy ra khi đặt hàng.",
      });
      addNotification("Bạn thanh toán không thành công vui lòng kiểm tra lại!");
      navigate("/paymentFailure");
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <h2>Thông tin nhận hàng</h2>

          {/* Thông tin email người dùng */}
          <Form.Item
            style={{ color: "#4CC9FE", fontWeight: "bold" }}
            name="email"
            label="Email "
          >
            <span>{user.email}</span>
          </Form.Item>

          {/* Thông tin họ và tên người dùng */}
          <Form.Item
            style={{ color: "#4CC9FE", fontWeight: "bold" }}
            name="fullname"
            label="Họ và tên "
          >
            <span>{user.fullName}</span>
          </Form.Item>

          {/* Thông tin số điện thoại người dùng */}
          <Form.Item
            style={{ color: "#4CC9FE", fontWeight: "bold" }}
            name="phone"
            label="Số điện thoại "
          >
            <PhoneOutlined style={{ paddingRight: 10, fontSize: 15 }} />
            <span>{user.phone}</span>
          </Form.Item>

          {/* Thông tin địa chỉ người dùng */}
          <Form.Item
            style={{ color: "#4CC9FE", fontWeight: "bold" }}
            name="address"
            label="Địa chỉ (tùy chọn)"
          >
            <span>{user.address}</span>
          </Form.Item>
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Button
              type="primary"
              className="edit-info-button"
              icon={<EditOutlined />}
              onClick={handleEditProfile} // Gọi hàm chỉnh sửa
            >
              Chỉnh sửa thông tin
            </Button>
          </div>
          {/* Ghi chú cho đơn hàng */}
          <Form.Item
            name="note"
            style={{ fontWeight: "bold" }}
            label="Ghi chú (tùy chọn)"
          >
            <Input.TextArea placeholder="Ghi chú cho đơn hàng" />
          </Form.Item>
          {/*Chinh sua thong tin*/}

          {/* Phương thức thanh toán */}
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
            <Radio.Group value="VNPAY">
              <Radio value="VNPAY">Thanh toán qua VNPAY-QR</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Nút đặt hàng */}
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

      {/* Giỏ hàng hiển thị các sản phẩm */}
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
              <InputNumber
                readOnly
                min={1}
                value={item.quantity}
                onChange={(value) => handleQuantityChange(value || 1, item.id)}
                style={{ marginRight: "10px" }}
              />
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(item.id)}
                style={{ color: "#f5222d" }}
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

import React, { useEffect, useState } from "react";
import { Button, Input, Radio, Form, notification, InputNumber } from "antd";
import { PhoneOutlined, DeleteOutlined } from "@ant-design/icons";
import "./Checkout.scss";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

// Interface cho sản phẩm trong giỏ hàng
interface Product {
  id: number; // Mã sản phẩm
  name: string; // Tên sản phẩm
  price: number; // Giá sản phẩm
  quantity: number; // Số lượng sản phẩm
  thumbnail: string; // Ảnh đại diện sản phẩm
}

// Interface cho các giá trị trong form
interface FormValues {
  email: string; // Email người dùng (tùy chọn)
  fullname: string; // Họ và tên người dùng
  phone: string; // Số điện thoại người dùng
  address: string; // Địa chỉ người dùng
  note: string; // Ghi chú cho đơn hàng
  payment_method: string; // Phương thức thanh toán
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Lấy thông tin người dùng từ context
  const [loading, setLoading] = useState(false); // Trạng thái tải khi đặt hàng
  const [form] = Form.useForm(); // Quản lý form
  const [paymentMethod, setPaymentMethod] = useState<string>("COD"); // Phương thức thanh toán
  const [cart, setCart] = useState<Product[]>([]); // Quản lý giỏ hàng

  // Lấy giỏ hàng từ localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Kiểm tra đăng nhập, điều hướng về trang đăng nhập nếu cần
  useEffect(() => {
    if (!user || !user.email) {
      notification.warning({
        message: "Cần đăng nhập",
        description: "Vui lòng đăng nhập hoặc đăng ký để tiếp tục.",
      });
      navigate("/login");
    }
  }, [user, navigate]);

  // Tính tổng giá trị giỏ hàng
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Xóa sản phẩm khỏi giỏ hàng
  const handleDelete = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    notification.success({ message: "Sản phẩm đã được xóa" });
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const handleQuantityChange = (value: number, id: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: value } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Xử lý khi hoàn thành form đặt hàng

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
        paymentMethod: paymentMethod,
        totalMoney: totalPrice,
        orderDetails: cart.map((item) => ({
          postID: item.id,
          numberOfProducts: item.quantity,
        })),
      };

      const response = await api.post("/api/orders", payload);

      if (response.status === 200) {
        // Cập nhật trạng thái sản phẩm sau khi thanh toán thành công
        const updateStatus = async () => {
          try {
            await Promise.all(
              cart.map(async (item) => {
                await api.patch(`/posts/${item.id}`, { status: "PENDING" });
              })
            );
          } catch (error) {
            console.error("Error updating status:", error); 
          }
        };

        // Nếu thanh toán qua VNPAY
        if (paymentMethod === "VNPAY") {
          const vnpayResult = response.data;
        
          if (vnpayResult) {
            await updateStatus(); // Cập nhật trạng thái trước khi chuyển hướng đến VNPay
            window.location.href = vnpayResult; // Điều hướng tới trang thanh toán qua VNPay
          } else {
            // Trường hợp thanh toán bị hủy hoặc thất bại từ phía VNPay
            const failureUrl = response.data.failureUrl;
            if (failureUrl) {
              window.location.href = failureUrl; // Điều hướng đến trang thất bại
            } else {
              notification.error({
                message: "Lỗi thanh toán",
                description: "Không nhận được URL thanh toán từ VNPay.",
              });
              navigate("/paymentFailure");
          }
        }
        // Thanh toán bằng COD
        } else {
          
          await updateStatus(); // Cập nhật trạng thái cho sản phẩm
          notification.success({
            message: "Đặt hàng thành công",
            description: "Đơn hàng của bạn đã được gửi đi.",
          });
          localStorage.removeItem("cart");
          setCart([]); // Clear the cart
          navigate(`/paymentSuccess`);
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
      navigate("/paymentFailure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <h2>Thông tin nhận hàng</h2>

          <Form.Item name="email" label="Email ">
            <span>{user.email}</span>
          </Form.Item>

          <Form.Item name="fullname" label="Họ và tên ">
            <span>{user.fullName}</span>
            <Button type="link" onClick={() => navigate("/updateProfile")}>
              Chỉnh sửa
            </Button>
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại ">
            <PhoneOutlined style={{ paddingRight: 10, fontSize: 15 }} />
            <span>{user.phone}</span>
            <Button type="link" onClick={() => navigate("/updateProfile")}>
              Chỉnh sửa
            </Button>
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ (tùy chọn)">
            <span>{user.address}</span>
            <Button type="link" onClick={() => navigate("/updateProfile")}>
              Chỉnh sửa
            </Button>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú (tùy chọn)">
            <Input.TextArea placeholder="Ghi chú cho đơn hàng" />
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
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
            >
              <Radio value="VNPAY">Thanh toán qua VNPAY-QR</Radio>
              <Radio value="COD">Thanh toán khi giao hàng (COD)</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Hiển thị thông báo khi chọn COD */}
          {paymentMethod === "COD" && (
            <div
              style={{
                marginTop: "10px",
                background: "#f0f0f0",
                padding: "10px",
              }}
            >
              <p style={{ margin: 0 }}>Bạn sẽ thanh toán khi nhận được hàng</p>
            </div>
          )}

          <Button type="primary" htmlType="submit" loading={loading}>
            Đặt hàng
          </Button>
        </Form>
      </div>

      <div className="checkout-cart">
        <h2>Đơn hàng ({cart.length} sản phẩm)</h2>
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.thumbnail} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <p>{item.price.toLocaleString()}₫</p>
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(value) => handleQuantityChange(value || 1, item.id)}
              />
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(item.id)}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
        <div className="checkout-summary">
          <p>Tổng cộng: {totalPrice.toLocaleString()}₫</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

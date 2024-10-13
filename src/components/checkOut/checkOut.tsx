import React, { useEffect, useState } from "react";
import { Button, Input, Radio, Form, notification, InputNumber } from "antd";
import { PhoneOutlined, DeleteOutlined } from "@ant-design/icons";
import "./Checkout.scss";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

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
    try {
      const payload = {
        userInfo: {
          fullname: values.fullname,
          phone: values.phone,
          email: values.email || user.email,
          address: values.address,
          note: values.note,
          id: user.id, // Lấy ID người dùng từ context
        },
        cartItems: cart, // Giỏ hàng hiện tại
        totalMoney: totalPrice, // Tổng giá trị giỏ hàng
        paymentMethod: paymentMethod, // Phương thức thanh toán
        status: "Pending", // Trạng thái đơn hàng ban đầu là 'Pending'
        order_date: new Date().toISOString(), // Thêm ngày đặt hàng
      };

      // Gọi API để lưu thông tin đơn hàng
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const orderData = await response.json();

        if (paymentMethod === "VNPAY") {
          // Giả sử bạn gọi API VNPAY ở đây và nó trả về kết quả thanh toán
          const vnpayResponse = await fetch("/api/vnpay/payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: orderData.orderId,
              totalMoney: totalPrice,
            }),
          });

          if (vnpayResponse.ok) {
            const vnpayResult = await vnpayResponse.json();

            if (vnpayResult.status === "success") {
              notification.success({
                message: "Thanh toán thành công",
                description: "Đơn hàng của bạn đã được xử lý.",
              });
              localStorage.removeItem("cart");
              setCart([]); //Xóa sản phẩm trong giỏ hàng
              navigate(`/payment-success/${orderData.orderId}`);
            } else {
              // Nếu thanh toán qua VNPAY thất bại
              localStorage.setItem('paymentFailure', 'true');
              notification.error({
                message: "Thanh toán không thành công",
                description: "Thanh toán qua VNPAY thất bại. Vui lòng thử lại.",
              });
              navigate("/paymentFailure");
            }
          } else {
            throw new Error("Lỗi khi xử lý thanh toán qua VNPAY");
          }
        } else {
          // Thanh toán qua COD
          notification.success({
            message: "Đặt hàng thành công",
            description: "Đơn hàng của bạn đã được gửi đi.",
          });
          localStorage.removeItem("cart");
          setCart([]);
          navigate(`/payment-success/${orderData.orderId}`);
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

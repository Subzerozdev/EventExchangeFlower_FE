import React, { useEffect, useState } from "react";
import { Button, Input, Radio, Form, notification, InputNumber } from "antd";
import { PhoneOutlined, DeleteOutlined } from "@ant-design/icons";
import "./Checkout.scss";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

// Định nghĩa interface cho sản phẩm trong giỏ hàng
interface Product {
  id: number; // Mã sản phẩm
  name: string; // Tên sản phẩm
  price: number; // Giá sản phẩm
  quantity: number; // Số lượng sản phẩm
  thumbnail: string; // Ảnh đại diện sản phẩm
}

// Định nghĩa interface cho các giá trị trong form
interface FormValues {
  email?: string; // Email người dùng (tùy chọn)
  fullname: string; // Họ và tên người dùng
  phone: string; // Số điện thoại người dùng
  address?: string; // Địa chỉ người dùng
  note?: string; // Ghi chú cho đơn hàng
  payment: string; // Phương thức thanh toán
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Lấy thông tin người dùng từ context
  const [loading, setLoading] = useState(false); // Trạng thái tải khi đặt hàng
  const [form] = Form.useForm(); // Quản lý form
  const [paymentMethod, setPaymentMethod] = useState<string>("COD"); // Phương thức thanh toán

  // Kiểm tra nếu không có thông tin người dùng thì điều hướng về trang đăng nhập
  useEffect(() => {
    if (!user || !user.email) {
      notification.warning({
        message: "Cần đăng nhập",
        description: "Vui lòng đăng nhập hoặc đăng ký để tiếp tục.",
      });
      navigate("/login"); // Chuyển đến trang đăng nhập
    }
  }, [user, navigate]);

  // Hàm xử lý khi người dùng hoàn thành form đặt hàng
  const onFinish = async (values: FormValues) => {
    setLoading(true); // Bắt đầu trạng thái tải

    try {
      // Giả lập logic kiểm tra phương thức thanh toán
      if (paymentMethod === "VNPAY") {
        // Nếu chọn thanh toán qua VNPAY, điều hướng đến trang VNPAY
        navigate("/payment/vnpay", { state: { cart, totalPrice, values } });
      } else if (paymentMethod === "COD") {
        // Nếu chọn thanh toán COD, điều hướng đến trang COD
        navigate("/payment/cod", { state: { cart, totalPrice, values } });
      }

      notification.success({
        message: "Tiến hành thanh toán",
        description: "Bạn sẽ được chuyển tới trang thanh toán.",
      });
    } catch (error) {
      // Nếu có lỗi xảy ra trong quá trình đặt hàng
      console.error("Error:", error);
      notification.error({
        message: "Đặt hàng thất bại",
        description: "Có lỗi xảy ra khi đặt hàng.",
      });
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    } 
  };

  const [cart, setCart] = useState<Product[]>([]); // Quản lý giỏ hàng

  // Lấy dữ liệu giỏ hàng từ localStorage khi trang được load
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart)); // Cập nhật giỏ hàng từ localStorage
    }
  }, []);

  // Hàm tính tổng giá trị của giỏ hàng
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleDelete = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id); // Lọc bỏ sản phẩm có ID tương ứng
    setCart(updatedCart); // Cập nhật lại giỏ hàng
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu giỏ hàng mới vào localStorage
    notification.success({
      message: "Sản phẩm đã được xóa", // Thông báo khi xóa thành công
    });
  };

  // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
  const handleQuantityChange = (value: number, id: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: value } : item
    ); // Cập nhật số lượng cho sản phẩm tương ứng
    setCart(updatedCart); // Cập nhật lại giỏ hàng
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu thay đổi vào localStorage
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        {/* Form thông tin đặt hàng */}
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <h2>Thông tin nhận hàng</h2>
          {/* Trường nhập Email */}
          <Form.Item name="email" label="Email ">
            {user.email ? (
              <>
                <span>{user.email}</span>
              </>
            ) : (
              <Input placeholder="Email " />
            )}
          </Form.Item>

          {/* Trường nhập Họ và Tên */}
          <Form.Item name="fullname" label="Họ và tên ">
            {user.fullName ? (
              <>
                <span>{user.fullName}</span>
                <Button type="link" onClick={() => navigate("/updateProfile")}>
                  Chỉnh sửa
                </Button>
              </>
            ) : (
              <Input placeholder="Họ và tên" />
            )}
          </Form.Item>

          {/* Trường nhập Số điện thoại */}
          <Form.Item name="phone" label="Số điện thoại ">
            <PhoneOutlined style={{ paddingRight: 10, fontSize: 15 }} />
            {user.phone ? (
              <>
                <span>{user.phone}</span>
                <Button type="link" onClick={() => navigate("/updateProfile")}>
                  Chỉnh sửa
                </Button>
              </>
            ) : (
              <Input
                addonBefore={<PhoneOutlined />}
                placeholder="Số điện thoại (tùy chọn)"
              />
            )}
          </Form.Item>

          {/* Trường nhập Địa chỉ */}
          <Form.Item name="address" label="Địa chỉ (tùy chọn)">
            {user.address ? (
              <>
                <span>{user.address}</span>
                <Button type="link" onClick={() => navigate("/updateProfile")}>
                  Chỉnh sửa
                </Button>
              </>
            ) : (
              <Input placeholder="Địa chỉ" />
            )}
          </Form.Item>

          {/* Trường nhập Ghi chú cho đơn hàng */}
          <Form.Item name="note" label="Ghi chú (tùy chọn)">
            <Input.TextArea placeholder="Ghi chú cho đơn hàng" />
          </Form.Item>

          <h2>Thanh toán</h2>
          {/* Lựa chọn phương thức thanh toán */}
          <Form.Item name="payment" label="Phương thức thanh toán">
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
            >
              <Radio value="VNPAY">Thanh toán qua VNPAY-QR</Radio>
              <Radio value="COD">Thanh toán khi giao hàng (COD)</Radio>
            </Radio.Group>
          </Form.Item>

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
              {/* Sửa số lượng sản phẩm */}
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(value) =>
                  handleQuantityChange(value || 1, item.id)
                }
              />
              {/* Nút xóa sản phẩm */}
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
        <div className="checkout-summary" >
        
          <p>Tổng cộng: {totalPrice.toLocaleString()}₫</p>

        </div>
      </div>
    </div>
  );
};

export default Checkout;

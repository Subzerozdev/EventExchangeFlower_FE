import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Rate } from "antd";
import api from "../../config/api"; // Đường dẫn tới tệp api.ts

const { TextArea } = Input;

interface FeedbackValues {
  id: number;
  content: string;
  rating: number;
  customer_id: number;
  shopID: string; // Để shop_id là kiểu string
}

interface User {
  id: number;
  fullName: string;
  email: string;
}

const FeedbackForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [shopId, setShopId] = useState<string | null>(null); // Để shopId là string
  const [orderId, setOrderId] = useState<number | null>(null); // Đảm bảo orderId là kiểu number

  // Lấy thông tin người dùng và orderId từ localStorage
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedOrderId = localStorage.getItem("orderId");
      if (storedOrderId) {
        setOrderId(parseInt(storedOrderId, 10)); // Chuyển đổi orderId từ string sang number
      }
    };

    fetchUser();
  }, []);

  // Hàm gọi API để lấy shopId từ orderId
  const fetchShopId = async (orderId: number) => {
    try {
      const response = await api.get(`/api/order/shop/${orderId}`);
      if (response.data) {
        setShopId(response.data); // Lưu shopId vào state
      } else {
        message.error("Không tìm thấy shopId!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy shopId:", error);
      message.error("Có lỗi xảy ra khi lấy shopId, vui lòng thử lại.");
    }
  };

  // Gọi fetchShopId khi có orderId
  useEffect(() => {
    if (orderId !== null) {
      fetchShopId(orderId);
    }
  }, [orderId]);

  const onFinish = async (
    values: Omit<FeedbackValues, "customer_id" | "rating" | "id" | "shopID">
  ) => {
    try {
      if (!user || !shopId) {
        message.error("Không có thông tin người dùng hoặc shopId!");
        return;
      }

      setLoading(true);

      const feedbackData: Omit<FeedbackValues, "id"> = {
        content: values.content,
        rating: rating,
        customer_id: user.id,
        shopID: shopId, // Sử dụng shopId đã lấy được (dạng string)
      };

      const response = await api.post("/api/feedback", feedbackData);

      if (response.data) {
        message.success("Bạn đã gửi đánh giá thành công!");
        // Chuyển hướng về trang productList sau khi gửi thành công
        setTimeout(() => {
          window.location.href = "/productList";
        }, 1000); // Đợi 1 giây để hiển thị thông báo trước khi chuyển hướng
      } else {
        message.error("Gửi phản hồi thất bại!");
      }
    } catch (err) {
      console.log("Lỗi khi gửi phản hồi:", err);
      message.error("Có lỗi xảy ra khi gửi phản hồi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Feedback Form</h2>

      {user ? (
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ name: user.fullName, email: user.email }}
        >
          <Form.Item label="Tên">
            <Input value={user.fullName} readOnly />
          </Form.Item>

          <Form.Item label="Email">
            <Input value={user.email} readOnly />
          </Form.Item>

          <Form.Item
            name="content"
            label="Ý kiến"
            rules={[{ required: true, message: "Please enter your content" }]}
          >
            <TextArea rows={4} placeholder="Enter content" />
          </Form.Item>

          <Form.Item label="Rating">
            <Rate onChange={setRating} value={rating} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default FeedbackForm;

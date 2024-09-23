import { Form, Input, Button, notification } from "antd"; // Import các component từ Ant Design
import { useUser } from "../../context/UserContext"; // Import context để lấy thông tin người dùng
import { useState } from "react";
import api from "../../config/api"; // Giả định rằng bạn có API để tương tác với backend
import "./UpdateProfile.scss";

interface UpdateProfileValues {
  email: string;
  name: string;
  password: string;
}

function UpdateProfile() {
  const { user, setUser } = useUser(); // Lấy thông tin người dùng từ context
  const [loading, setLoading] = useState(false); // State để điều khiển nút loading

  const onFinish = async (values: UpdateProfileValues) => {
    setLoading(true);
    try {
      // Gửi yêu cầu cập nhật thông tin người dùng
      const response = await api.put("/user/update", values);
      console.log("Success:", response.data);
      setUser(values.name); // Cập nhật lại tên người dùng trong context
      notification.success({
        message: "Cập nhật thành công!",
        description: "Thông tin tài khoản đã được cập nhật.",
      });
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật thông tin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile">
      <h1>Cập nhật hồ sơ cá nhân</h1>
      <Form
        name="updateProfile"
        initialValues={{ name: user, email: user }} // Lấy thông tin hiện tại của user
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UpdateProfile;

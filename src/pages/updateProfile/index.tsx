import { Form, Input, Button, notification } from "antd";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import api from "../../config/api";
import "./UpdateProfile.scss";
import { useNavigate, useLocation } from "react-router-dom";

interface UpdateProfileValues {
  email: string;
  fullName: string;
  phone: string;
  address: string;
}

interface LocationState {
  fromCheckout?: boolean;
}
function UpdateProfile() {
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState };
  const { user, setUser } = useUser(); // Lấy thông tin người dùng từ context
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: UpdateProfileValues) => {
    setLoading(true);

    try {
      const response = await api.put(`/api/user`, values, {});
      console.log("Success:", response.data);

      // Cập nhật lại thông tin người dùng trong context
      setUser((prevUser) => ({
        ...prevUser,
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
      }));

      notification.success({
        message: "Cập nhật thành công!",
        description: "Thông tin tài khoản đã được cập nhật.",
      });
      if (location.state?.fromCheckout) {
        navigate("/checkout"); // Quay lại trang Checkout
      } else {
        navigate("/profile");
      }
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
        initialValues={{
          fullName: user?.fullName,
          email: user?.email,
          phone: user?.phone,
          address: user?.address,
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại của bạn!" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ của bạn!" },
          ]}
        >
          <Input placeholder="Nhập địa chỉ nhà" />
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

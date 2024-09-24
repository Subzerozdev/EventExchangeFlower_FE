// Profile.tsx
import { Descriptions, Button } from "antd";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Profile.scss"; // Custom SCSS

function Profile() {
  const { user } = useUser(); // Lấy thông tin từ context
  const navigate = useNavigate();

  return (
    <div className="profile_container">
      <div className="profile_left">
        <h2>Trang tài khoản</h2>
        <p className="profile_greeting">
          <strong>Xin chào,</strong> {user.fullName || "Khách"} !
        </p>
        <div className="profile_menu">
          <ul>
            <li onClick={() => navigate("/profile")}>Thông tin tài khoản</li>
            <li onClick={() => navigate("/profile/orders")}>Đơn hàng của bạn</li>
            <li>Danh sách yêu thích(0)</li>
            <li onClick={() => navigate("/profile/password")}>Đổi mật khẩu</li>
            <li>Sổ địa chỉ(0)</li>
            <li onClick={() => navigate("/logout")}>Đăng xuất</li>
          </ul>
        </div>

      </div>

      <div className="profile_right">
        <h2>Thông tin tài khoản</h2>
        <Descriptions column={1}>
          <Descriptions.Item label="Họ tên">
            {user.fullName || "Chưa có thông tin"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user.email || "Chưa có thông tin"}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {user.phone || "Chưa có thông tin"}
          </Descriptions.Item>
        </Descriptions>
        <Button
          type="primary"
          onClick={() => navigate("/updateProfile")} // Điều hướng sang trang cập nhật hồ sơ
          style={{ marginTop: 20 }}
        >
          Chỉnh sửa hồ sơ
        </Button>
      </div>
    </div>
  );
}

export default Profile;

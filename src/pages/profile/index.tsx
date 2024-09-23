import { Descriptions, Button } from "antd"; // Import Ant Design components
import { useUser } from "../../context/UserContext"; // Import context to get user information
import { useNavigate } from "react-router-dom";
import "./Profile.scss"; // Custom SCSS

function Profile() {
  const { user } = useUser(); // Get user info from context
  const navigate = useNavigate();

  return (
    <div className="profile_container">
      <div className="profile_left">
        <h2>Trang tài khoản</h2>
        <p className="profile_greeting">
          <strong>Xin chào,</strong> {user} !
        </p>
        <div className="profile_menu">
          <ul>
            <a href="">
              <li>Thông tin tài khoản</li>
            </a>
            <a href="">
              <li>Đơn hàng của bạn</li>
            </a>
            <a href="">
              <li>Danh sách yêu thích(0)</li>
            </a>
            <a href="">
              <li>Đổi mật khẩu</li>
            </a>
            <a href="">
              <li>Sổ địa chỉ(0)</li>
            </a>
            <a href="">
              <li>Đăng xuất</li>
            </a>
          </ul>
        </div>
      </div>

      <div className="profile_right">
        <h2>Trang tài khoản</h2>
        <Descriptions column={1}>
          <Descriptions.Item label="Họ tên">
            {user || "Chưa có thông tin"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user || "Chưa có thông tin"}
          </Descriptions.Item>
        </Descriptions>
        <Button
          type="primary"
          onClick={() => navigate("/updateProfile")} // Navigate to update profile page
          style={{ marginTop: 20 }}
        >
          Chỉnh sửa hồ sơ
        </Button>
      </div>
    </div>
  );
}

export default Profile;

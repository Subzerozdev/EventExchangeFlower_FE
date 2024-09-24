import { Descriptions, Button } from "antd";
import { useUser } from "../../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Profile.scss";

function Profile() {
  const { user, logout } = useUser(); // Lấy hàm logout từ context
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context
    navigate("/login"); // Chuyển hướng về trang đăng nhập sau khi logout
  };

  return (
    <div className="profile_container">
      <div className="profile_left">
        <h2>Trang tài khoản</h2>
        <p className="profile_greeting">
          <strong>Xin chào,</strong> {user.fullName} !
        </p>
        <div className="profile_menu">
          <ul>
            <li
              className={location.pathname === "/profile" ? "active" : ""}
              onClick={() => navigate("/profile")}
            >
              Thông tin tài khoản
            </li>
            <li
              className={location.pathname === "/profile/orders" ? "active" : ""}
              onClick={() => navigate("/profile/orders")}
            >
              Đơn hàng của bạn
            </li>
            <li
              className={location.pathname === "/profile/wishlist" ? "active" : ""}
              onClick={() => navigate("/profile/wishlist")}
            >
              Danh sách yêu thích(0)
            </li>
            <li
              className={location.pathname === "/profile/password" ? "active" : ""}
              onClick={() => navigate("/profile/password")}
            >
              Đổi mật khẩu
            </li>
            <li
              className={location.pathname === "/profile/address" ? "active" : ""}
              onClick={() => navigate("/profile/address")}
            >
              Sổ địa chỉ(0)
            </li>
            <li onClick={handleLogout}>Đăng xuất</li>
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
          onClick={() => navigate("/updateProfile")}
          style={{ marginTop: 20 }}
        >
          Chỉnh sửa hồ sơ
        </Button>
      </div>
    </div>
  );
}

export default Profile;

import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { useUser } from "../../context/UserContext"; // Kiểm tra đường dẫn đã đúng
import { GiFlowerPot } from "react-icons/gi";
function Header() {
  const navigate = useNavigate();
  const { user } = useUser(); // Lấy thông tin người dùng từ context

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__left">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Icon%2FHeading%2FHoa%20(2).png?alt=media&token=c5cd5b8b-f5c2-4734-b917-7425bc3fb17b"
            alt="Logo"
            className="header__logo"
            width={280}
          />
        </div>

        <div className="header__center">
          <p>
            NỀN TẢNG MUA BÁN HOA CŨ UY TIN SỐ MỘT VIỆT NAM <GiFlowerPot />
          </p>
        </div>

        <div className="header__right">
          {user ? (
            <span>{user}</span> // Hiển thị tên người dùng khi đã đăng nhập
          ) : (
            <div className="header__buttons">
              <button
                className="header__login"
                onClick={() => navigate("/login")}
              >
                <UserOutlined /> Đăng nhập
              </button>
              <button
                className="header__register"
                onClick={() => navigate("/register")}
              >
                <UserAddOutlined /> Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="line-separator"></div>

      <nav className="navbar">
        <ul className="navbar__menu">
          <li onClick={() => navigate("/")}>Trang chủ</li>
          <li>Tất cả sản phẩm</li>
          <li>Hoa theo sự kiện</li>
          <li>Hoa theo lô</li>
          <li>Blog</li>
          <li>Liên hệ</li>
          <li>
            <div className="header__search">
              <input type="text" placeholder="Tìm hoa..." />
              <button className="header__search-btn">🔍</button>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

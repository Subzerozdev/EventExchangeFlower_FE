import { useNavigate } from "react-router-dom";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { useUser } from "../../context/UserContext";


import "./Header.scss";

function Header() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__left">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Icon%2FHeading%2FHoa%20(6).png?alt=media&token=4bd21806-4961-4e8e-ad07-82d98ecf3589"
            alt="Logo"
            className="header__logo"
            width={330}
          />
        </div>

        <div className="header__center">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Icon%2FHeading%2FN%E1%BB%80N%20T%C3%80NG%20GIAO%20D%E1%BB%8ACH%20HOA%20UY%20T%C3%8DN%20S%E1%BB%90%201%20VI%E1%BB%86T%20NAM%20(4).png?alt=media&token=74e908d2-b5bb-4728-90b4-1eb6c99f819a"
            alt="Heading Banner"
            width={530}
            className="header__banner"
          />
        </div>

        <div className="header__right">
          {user.fullName ? (
            <button onClick={() => navigate("/profile")} >
              <span>{user.fullName}</span>
            </button>
          ) : (
            <div className="header__buttons">
              <button onClick={() => navigate("/login")}>
                <UserOutlined /> Đăng nhập
              </button>
              <button onClick={() => navigate("/register")}>
                <UserAddOutlined /> Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>

      <nav className="navbar">
        <ul className="navbar__menu">
          <li onClick={() => navigate("/")}>Trang chủ</li>
          <li>Tất cả sản phẩm</li>
          <li>Hoa theo sự kiện</li>
          <li>Hoa theo lô</li>
          <li>Blog</li>
          <li>Liên hệ</li>
          <li>
            <input type="text" placeholder="Tìm hoa..." />
            <button>🔍</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

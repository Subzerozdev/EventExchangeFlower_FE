import { Descriptions, Button, Menu } from "antd";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import { AppstoreOutlined, UserOutlined, ShoppingCartOutlined, ShopOutlined } from "@ant-design/icons";
import type { MenuProps } from 'antd';
import "./Profile.scss";
import ManagePosts from "./Seller/ManagePosts/ManagePosts";
import ManageShop from "./Seller/ManageShop/ManageShop";
import SellerForm from "./Seller/SellerForm/SellerForm";
import TermsModal from "./Seller/TermsModal/TermsModal";

function Profile() {
  const { user, logout } = useUser(); // Lấy hàm logout từ context
  const [selectedMenu, setSelectedMenu] = useState("account-info");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSellerForm, setShowSellerForm] = useState(false); // Để kiểm soát hiển thị SellerForm

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Chuyển hướng ra ngoài
  };

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === "form") {
      setIsModalVisible(true); // Mở modal điều khoản khi chọn tạo tài khoản bán hàng
    } else {
      setSelectedMenu(e.key); // Cập nhật trạng thái khi click menu khác
    }
  };

  // Xây dựng các mục menu và ẩn mục "Tạo tài khoản bán hàng" nếu user đã là "seller"
  const items: MenuProps['items'] = [
    {
      label: "Thông tin tài khoản",
      key: "account-info",
      icon: <UserOutlined />,
    },
    {
      label: "Người bán hàng",
      key: "sub1",
      icon: <ShopOutlined />,
      children: [
        ...(user.role !== "ROLE_SELLER" ? [
          {
            label: "Tạo tài khoản bán hàng",
            key: "form",
          }
        ] : []),  // Chỉ hiển thị mục này nếu người dùng chưa là seller
        {
          label: "Quản lý sản phẩm cửa hàng của bạn",
          key: "manage-posts",
        },
        {
          label: "Xem và chỉnh sửa thông cửa hàng",
          key: "manage-shop",
        },
      ],
    },
    {
      label: "Đơn hàng của bạn",
      key: "orders",
      icon: <ShoppingCartOutlined />,
    },
    {
      label: "Danh sách yêu thích",
      key: "wishlist",
      icon: <AppstoreOutlined />,
    },
    {
      label: "Đổi mật khẩu",
      key: "password",
      icon: <UserOutlined />,
    },
    {
      label: "Sổ địa chỉ",
      key: "address",
      icon: <AppstoreOutlined />,
    },
    {
      label: "Đăng xuất",
      key: "logout",
      onClick: handleLogout, // Xử lý khi nhấn đăng xuất
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case "account-info":
        return (
          <div>
            <h2>Thông tin tài khoản</h2>
            <Descriptions column={1}>
              <Descriptions.Item label="Họ tên">{user.fullName || "Chưa có thông tin"}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email || "Chưa có thông tin"}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{user.phone || "Chưa có thông tin"}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{user.address || "Chưa có thông tin"}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" onClick={() => alert("Chỉnh sửa hồ sơ")} style={{ marginTop: 20 }}>
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        );
      case "manage-posts":
        return <ManagePosts />;
      case "manage-shop":
        return <ManageShop />;
      case "orders":
        return <div><h2>Đơn hàng của bạn</h2><p>Danh sách đơn hàng sẽ hiển thị ở đây.</p></div>;
      case "wishlist":
        return <div><h2>Danh sách yêu thích</h2><p>Danh sách sản phẩm yêu thích sẽ hiển thị ở đây.</p></div>;
      case "password":
        return <div><h2>Đổi mật khẩu</h2><p>Form đổi mật khẩu sẽ hiển thị ở đây.</p></div>;
      case "address":
        return <div><h2>Sổ địa chỉ</h2><p>Danh sách địa chỉ sẽ hiển thị ở đây.</p></div>;
      default:
        return <div>Vui lòng chọn một mục để hiển thị.</div>;
    }
  };

  return (
    <div className="profile_container">
      <div className="profile_left">
        <h2>Trang tài khoản</h2>
        <p className="profile_greeting">
          <strong>Xin chào,</strong> {user.fullName} !
        </p>
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["account-info"]}
          mode="inline"
          items={items}
        />
      </div>

      <div className="profile_right">
        {showSellerForm ? <SellerForm /> : renderContent()} {/* Hiển thị SellerForm khi đồng ý điều khoản */}
      </div>

      <TermsModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onAgree={() => setShowSellerForm(true)} // Khi đồng ý điều khoản, hiển thị SellerForm
      />
    </div>
  );
}

export default Profile;

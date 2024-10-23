import { Descriptions, Button, Menu } from "antd";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import { AppstoreOutlined, UserOutlined, ShoppingCartOutlined, ShopOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./Profile.scss";
import ManagePosts from "./Seller/ManagePosts/ManagePosts";
import ManageShop from "./Seller/ManageShop/ManageShop";
import SellerForm from "./Seller/SellerForm/SellerForm";
import TermsModal from "./Seller/TermsModal/TermsModal";
import { useNavigate } from "react-router-dom";
import Orders from "./orderHistory/Orders";
import SoldOrders from "./Seller/SoldOrders/SoldOders"; // Đảm bảo đường dẫn đúng

function Profile() {
  const { user, logout } = useUser(); // Lấy hàm logout từ context
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("account-info");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSellerForm, setShowSellerForm] = useState(false); // Để kiểm soát hiển thị SellerForm

  // Hàm xử lý logout
  const handleLogout = () => {
    logout(); // Gọi hàm logout từ UserContext
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  // Xử lý khi người dùng click vào các mục menu
  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "form") {
      setIsModalVisible(true); // Mở modal điều khoản
    } else if (e.key === "logout") {
      handleLogout(); // Gọi hàm logout khi chọn "Đăng xuất"
    } else {
      setSelectedMenu(e.key); // Cập nhật trạng thái khi click vào mục menu khác
    }
  };

  // Xây dựng các mục menu và ẩn "Tạo tài khoản bán hàng" nếu người dùng đã là seller
  const items: MenuProps["items"] = [
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
        ...(user.role !== "ROLE_SELLER"
          ? [
            {
              label: "Tạo tài khoản bán hàng",
              key: "form",
            },
          ]
          : []), // Chỉ hiển thị nếu chưa phải là seller
        {
          label: "Quản lý sản phẩm cửa hàng của bạn",
          key: "manage-posts",
        },
        {
          label: "Đơn hàng đã bán",
          key: "sold-orders",
        },
        {
          label: "Xem và chỉnh sửa thông tin cửa hàng",
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
      key: "logout", // Gọi hàm logout qua sự kiện onClick
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case "account-info":
        return (
          <div>
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
              <Descriptions.Item label="Địa chỉ">
                {user.address || "Chưa có thông tin"}
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
        );
      case "sold-orders":
        return <SoldOrders />;
      case "manage-posts":
        return <ManagePosts />;
      case "manage-shop":
        return <ManageShop />;
      case "orders":
        return <Orders />;
      case "wishlist":
        return (
          <div>
            <h2>Danh sách yêu thích</h2>
            <p>Danh sách sản phẩm yêu thích sẽ hiển thị ở đây.</p>
          </div>
        );
      case "password":
        return (
          <div>
            <h2>Đổi mật khẩu</h2>
            <p>Form đổi mật khẩu sẽ hiển thị ở đây.</p>
          </div>
        );
      case "address":
        return (
          <div>
            <h2>Sổ địa chỉ</h2>
            <p>Danh sách địa chỉ sẽ hiển thị ở đây.</p>
          </div>
        );
      default:
        return <div>Vui lòng chọn một mục để hiển thị.</div>;
    }
  };

  return (
    <div className="profile_container">
      <div className="profile_left">
        <h2>Trang tài khoản</h2>
        <p className="profile_greeting">
          <strong>Xin chào,</strong> {user.fullName}!
        </p>
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["account-info"]}
          mode="inline"
          items={items}
        />
      </div>

      <div className="profile_right">
        {showSellerForm ? <SellerForm /> : renderContent()}
      </div>

      <TermsModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onAgree={() => setShowSellerForm(true)}
      />
    </div>
  );
}

export default Profile;

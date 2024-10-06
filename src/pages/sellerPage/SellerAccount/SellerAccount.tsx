import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  LockOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";
import SellerForm from "../SellerForm/SellerForm";

import SellerTerms from "../SellerTerms/SellerTerms";
import SellerAddNewProduct from "../SellerAddNewProduct/SellerAddNewProduct";

const { Sider, Content } = Layout;

const SellerAccount: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("1");
  const renderContent = () => {
    switch (selectedMenuItem) {
      case "1":
        return <SellerForm />;
      case "2":
          return <SellerAddNewProduct />;  
      case "3":
        return <h1>Thông tin tài khoản</h1>;
      case "4":
        return <h1>Đơn hàng của bạn</h1>;
      case "5":
        return <h1>Đổi mật khẩu</h1>;
      case "6":
        return <SellerTerms />; // Display the Seller Terms component
      case "7":
        return <h1>Đăng xuất</h1>;
      default:
        return <SellerForm />;
    }
  };

  return (
    <Layout className="seller-account-layout">
      <Sider width={300}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0 }}
          onClick={(e) => setSelectedMenuItem(e.key)}
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            Tạo tài khoản bán hàng
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Thêm sản phẩm 
          </Menu.Item>
          <Menu.Item key="3" icon={<ShopOutlined />}>
            Thông tin tài khoản
          </Menu.Item>
          <Menu.Item key="4" icon={<FileTextOutlined />}>
            Đơn hàng của bạn
          </Menu.Item>
          <Menu.Item key="5" icon={<LockOutlined />}>
            Đổi mật khẩu
          </Menu.Item>
          <Menu.Item key="6" icon={<BookOutlined />}>
            Điều khoản
          </Menu.Item>
          <Menu.Item key="7" icon={<LogoutOutlined />}>
            Đăng xuất
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content
          className="site-layout-background"
          style={{ padding: 24, margin: 0 }}
        >
          {renderContent()} {/* Render content based on selected menu item */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SellerAccount;

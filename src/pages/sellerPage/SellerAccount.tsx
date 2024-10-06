import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import SellerForm from "./SellerForm";


const { Sider, Content } = Layout;

const SellerAccount: React.FC = () => {

  return (
    <Layout className="seller-account-layout">
      <Sider width={300}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            Tạo tài khoản bán hàng
          </Menu.Item>
          <Menu.Item key="2" icon={<ShopOutlined />}>
            Thông tin tài khoản
          </Menu.Item>
          <Menu.Item key="3" icon={<FileTextOutlined />}>
            Đơn hàng của bạn
          </Menu.Item>
          <Menu.Item key="4" icon={<LockOutlined />}>
            Đổi mật khẩu
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />}>
            Đăng xuất
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content
          className="site-layout-background"
          style={{ padding: 24, margin: 0 }}
        >
          <h1>Thông tin người bán hàng</h1>
          <SellerForm />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SellerAccount;

import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  FacebookOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "./Footer.scss";

const { Footer: AntFooter } = Layout;
const { Title, Link, Text } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter className="footer">
      <div className="footer-container">
        <Row justify="space-between" align="top">
          {/* Column 1: Customer Care */}
          <Col xs={24} sm={12} md={4} lg={4} className="footer-column">
            <Title level={4}>CHĂM SÓC KHÁCH HÀNG</Title>
            <ul>
              <li>
                <Link href="/TermsAndConditions">Trung Tâm Trợ Giúp</Link>
              </li>
              <li>
                <Link href="/TermsAndConditions">Hướng Dẫn Bán Hàng</Link>
              </li>
              <li>
                <Link href="/TermsAndConditions">
                  Điều Khoản Và Quy Định Của Nền Tảng
                </Link>
              </li>
            </ul>
          </Col>

          {/* Column 2: Payment Options */}
          <Col xs={24} sm={12} md={6} lg={6} className="footer-column">
            <Title level={4}>THANH TOÁN</Title>
            <h4>HỖ TRỢ CÁC LOẠI NGÂN HÀNG</h4>
            <div className="payment-icons">
              <ul>
                <li>
                  <img src="./img/img/VNPay.jpg" alt="VNPay" />
                  <img src="./img/img/Vietcombank.jpg" alt="Vietcombank" />
                  <img src="./img/img/BIDV.jpg" alt="BIDV" />
                </li>
                <li>
                  <img src="./img/img/Vietinbank.jpg" alt="Vietinbank" />
                  <img src="./img/img/MSB.jpg" alt="MSB" />
                  <img src="./img/img/ACB.jpg" alt="ACB" />
                </li>
                <li>
                  <img src="./img/img/Agribank.jpg" alt="Agribank" />
                  <img src="./img/img/HDBank.jpg" alt="HDBank" />
                  <img src="./img/img/VIB2.jpg" alt="VIB" />
                </li>
              </ul>
            </div>
          </Col>

          {/* Column 3: Follow Us */}
          <Col xs={24} sm={12} md={4} lg={4} className="footer-column">
            <Title level={4}>THEO DÕI CHÚNG TÔI TRÊN</Title>
            <ul>
              <li>
                <FacebookOutlined
                  style={{ fontSize: "20px", marginRight: 8 }}
                />
                <Link href="https://facebook.com">Facebook</Link>
              </li>
            </ul>
          </Col>

          {/* Column 4: Contact Information */}
          <Col xs={24} sm={12} md={5} lg={5} className="footer-column">
            <Title level={4}>LIÊN HỆ</Title>
            <Space direction="vertical">
              <Text>
                <PhoneOutlined style={{ marginRight: 8 }} /> +84 123 456 789
              </Text>
              <Text>
                <MailOutlined style={{ marginRight: 8 }} /> hoaloicu@gmail.com
              </Text>
              <Text>223 Lâm Văn Bền, Phường Bình Thuận, Quận 7</Text>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;

import React from "react";
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Chăm sóc khách hàng */}
        <div className="footer-column">
          <h4>CHĂM SÓC KHÁCH HÀNG</h4>
          <ul>
            <li>
              <a href="/help">Trung Tâm Trợ Giúp</a>
            </li>
            <li>
              <a href="/blog">Shopee Blog</a>
            </li>
            <li>
              <a href="/mall">Shopee Mall</a>
            </li>
            <li>
              <a href="/guide">Hướng Dẫn Mua Hàng</a>
            </li>
            <li>
              <a href="/sell-guide">Hướng Dẫn Bán Hàng</a>
            </li>
            <li>
              <a href="/payment">Thanh Toán</a>
            </li>
            <li>
              <a href="/shipping">Vận Chuyển</a>
            </li>
            <li>
              <a href="/refund">Trả Hàng & Hoàn Tiền</a>
            </li>
            <li>
              <a href="/policy">Chăm Sóc Khách Hàng</a>
            </li>
            <li>
              <a href="/warranty">Chính Sách Bảo Hành</a>
            </li>
          </ul>
        </div>

        {/* Cột 2: Về Shopee */}
        <div className="footer-column">
          <h4>VỀ SHOPEE</h4>
          <ul>
            <li>
              <a href="/about">Giới Thiệu Shopee Việt Nam</a>
            </li>
            <li>
              <a href="/careers">Tuyển Dụng</a>
            </li>
            <li>
              <a href="/terms">Điều Khoản Shopee</a>
            </li>
            <li>
              <a href="/privacy">Chính Sách Bảo Mật</a>
            </li>
            <li>
              <a href="/seller">Chính Hãng</a>
            </li>
            <li>
              <a href="/affiliate">Kênh Người Bán</a>
            </li>
            <li>
              <a href="/ads">Flash Sales</a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Thanh Toán */}
        <div className="footer-column">
          <h4>THANH TOÁN</h4>
          <div className="payment-icons">
            <ul>
              <li>
                <img src="./img/img/Visa.jpg" alt="Visa" />
                <img src="./img/img/MasterCard.jpg" alt="MasterCard" />
                <img src="./img/img/JCB.jpg" alt="JCB" />
              </li>
              <li>
                <img
                  src="./img/img/AmericanExpress.jpg"
                  alt="American Express"
                />
                <img src="./img/img/cod.jpg" alt="COD" />
                <img src="./img/img/TraGop.jpg" alt="Trả Góp" />
              </li>
              <li>
                <img src="./img/img/pay.jpg" alt="Pay" />
                <img src="./img/img/spaylater.jpg" alt="Spaylater" />
              </li>
            </ul>
          </div>
        </div>

        {/* Cột 4: Theo Dõi Chúng Tôi Trên */}
        <div className="footer-column">
          <h4>THEO DÕI CHÚNG TÔI TRÊN</h4>
          <ul>
            <li>
              <img src="./img/img/facebook.jpg" alt="Facebook" />
              <a href="https://facebook.com">Facebook</a>
            </li>
            <li>
              <img src="./img/img/instegram.jpg" alt="Instagram" />
              <a href="https://instagram.com">Instagram</a>
            </li>
            <li>
              <img src="./img/img/in.jpg" alt="LinkedIn" />
              <a href="https://linkedin.com">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

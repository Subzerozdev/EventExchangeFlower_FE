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
              <a href="/TermsAndConditions">Trung Tâm Trợ Giúp</a>
            </li>

            <li>
              <a href="/TermsAndConditions">Hướng Dẫn Bán Hàng</a>
            </li>
            <li>
              <a href="/TermsAndConditions">Điều Khoản Và Quy Định Của Nền Tảng</a>
            </li>



          </ul>
        </div>

        {/* Cột 2: Về Shopee */}
        {/* <div className="footer-column">
          <h4>MỘT SỐ THÔNG TIN VỀ SHOP</h4>
          <ul>
            <li>
              <a href="/careers">Thông Điệp Các Loại Hoa</a>
            </li>

            <li>
              <a href="/seller">Chính Hãng</a>
            </li>
            <li>
              <a href="/affiliate">Kênh Người Bán</a>
            </li>
          </ul>
        </div> */}

        {/* Cột 3: Thanh Toán */}
        <div className="footer-column">
          <h4>THANH TOÁN</h4>
          <div className="payment-icons">
            <ul>
              <li>

                {/* <img src="./img/img/MOMO.jpg" alt="MOMO" />
                <img src="./img/img/ZALOPay.jpg" alt="ZaloPay" /> */}
              </li>
              <h4>HỖ TRỢ CÁC LOẠI NGÂN HÀNG</h4>
              <li>
                <img src="./img/img/VNPay.jpg" alt="VnPay" />
                <img src="./img/img/Vietcombank.jpg" alt="VietcombankPay" />
                {/* <img src="./img/img/Tecombank.jpg" alt="MOMO" /> */}
                <img src="./img/img/BIDV.jpg" alt="ZaloPay" />
              </li>
              <li>
                <img src="./img/img/Vietinbank.jpg" alt="VietcombankPay" />
                <img src="./img/img/MSB.jpg" alt="MOMO" />
                <img src="./img/img/ACB.jpg" alt="ZaloPay" />
              </li>
              <li>
                <img src="./img/img/Agribank.jpg" alt="VietcombankPay" />
                <img src="./img/img/HDBank.jpg" alt="MOMO" />
                <img src="./img/img/VIB2.jpg" alt="ZaloPay" />
              </li>
            </ul>
          </div>
        </div>

        {/* Cột 4: Theo Dõi Chúng Tôi Trên */}
        <div className="footer-column">
          <h4>THEO DÕI CHÚNG TÔI TRÊN</h4>
          <ul>
            <li>
              <img src="./img/img/facebook4.jpg" alt="Facebook" />
              <a href="https://facebook.com">Facebook</a>
            </li>
            {/* <li>
              <img src="./img/img/instegram.jpg" alt="Instagram" />
              <a href="https://instagram.com">Instagram</a>
            </li>
            <li>
              <img src="./img/img/in4.jpg" alt="LinkedIn" />
              <a href="https://linkedin.com">LinkedIn</a>
            </li> */}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

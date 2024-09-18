import "./Footer.css";
function Footer() {
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
                <img src="./img/Visa.jpg" /> <img src="./img/MasterCard.jpg" />
                <img src="./img/JCB.jpg" />
              </li>
              <li>
                <img src="./img/AmericanExpress.jpg" />{" "}
                <img src="./img/cod.jpg" /> <img src="./img/TraGop.jpg" />
              </li>
              <li>
                <img src="./img/pay.jpg" /> <img src="./img/spaylater.jpg" />
              </li>
            </ul>
            {/* Thêm các biểu tượng thanh toán khác */}
          </div>
          <h4>ĐƠN VỊ VẬN CHUYỂN</h4>
          <div className="shipping-icons">
            <ul>
              <li>
                <img src="./img/spx.jpg" />
                <img src="./img/GHTK.jpg" />
                <img src="./img/GiaoHangNhanh.jpg" />
              </li>
              <li>
                <img src="./img/viettelpost.jpg" />
                <img src="./img/vietnampost.jpg" />
                <img src="./img/J&T.jpg" />
              </li>
              <li>
                <img src="./img/grap.jpg" />
                <img src="./img/ninjavan.jpg" />
                <img src="./img/best.jpg" />
              </li>
              <li>
                <img src="./img/be.jpg" />
                <img src="./img/ahamove.jpg" />
              </li>
            </ul>
            {/* Thêm các biểu tượng đơn vị vận chuyển khác */}
          </div>
        </div>

        {/* Cột 4: Theo Dõi Chúng Tôi Trên */}
        <div className="footer-column">
          <h4>THEO DÕI CHÚNG TÔI TRÊN</h4>
          <ul>
            <li
              style={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              <img src="./img/facebook.jpg" />
              <a href="https://facebook.com">Facebook</a>
            </li>
            <li
              style={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              <img
                src="./img/instegram.jpg"
                style={{ width: "40px", height: "30px" }}
              />
              <a href="https://instagram.com">Instagram</a>
            </li>
            <li
              style={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              <img src="./img/in.jpg" />
              <a href="https://linkedin.com">LinkedIn</a>
            </li>
          </ul>
        </div>

        {/* Cột 5: Tải Ứng Dụng */}
        <div className="footer-column">
          <h4>TẢI ỨNG DỤNG SHOPEE NGAY</h4>
          <div
            style={{
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <div>
              <img
                src="./img/QR.jpg"
                className="qr-code"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <div
              className="app-links"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <a href="https://appstore.com">
                <img src="./img/AppStore1.jpg" />
              </a>
              <a href="https://play.google.com">
                <img src="./img/googleplay1.jpg" />
              </a>
              <a href="https://play.google.com">
                <img src="./img/appgallery.jpg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

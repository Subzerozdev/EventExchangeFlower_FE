import React from "react";
// import  { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import "./PaymentSuccess.scss";

const PaymentSuccess: React.FC = () => {
  // const { orderId } = useParams(); // Lấy mã đơn hàng từ URL
  const navigate = useNavigate();
  // const [isAuthorized, setIsAuthorized] = useState(false);

  // useEffect(() => {
  //   const paymentSuccess = localStorage.getItem('paymentSuccess');

  //   if (!paymentSuccess || paymentSuccess !== 'true') {
  //     // Nếu không có trạng thái thanh toán thành công, điều hướng về trang sản phẩm
  //     navigate('/productList');
  //   } else {
  //     // Xác nhận là đã thanh toán thành công và cho phép hiển thị trang
  //     setIsAuthorized(true);
  //     // Xóa trạng thái để người dùng không thể quay lại trang này
  //     localStorage.removeItem('paymentSuccess');
  //   }
  // }, [navigate]);

  const handleContinuteShopping = () => {
    navigate("/productList");
  };

  // Chỉ hiển thị nội dung khi người dùng được ủy quyền (đã thanh toán)
  // if (!isAuthorized) {
  //   navigate('/productList'); // Hoặc có thể hiện loading hoặc thông báo chuyển hướng
  // }

  return (
    <div className="payment-success">
      <Result
        status="success"
        title="Thanh toán thành công"
        subTitle={`Đơn hàng của bạn đã được đăt. Cảm ơn bạn đã đặt hàng.`}
        extra={[
          <Button
            key="buy"
            type="primary"
            className="continue-button"
            onClick={handleContinuteShopping}
          >
            Tiếp tục mua hàng
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentSuccess;

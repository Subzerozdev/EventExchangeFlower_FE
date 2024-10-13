import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Quay lại trang Checkout khi người dùng muốn thử thanh toán lại
    navigate("/checkout");
  };

  return (
    <div className="payment-failure">
      <Result
        status="error"
        title="Thanh toán không thành công"
        subTitle="Có lỗi xảy ra khi xử lý thanh toán của bạn qua VNPAY Hoặc COD. Vui lòng thử lại."
        extra={[
          <Button type="primary" onClick={handleRetry}>
            Thử lại
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentFailure;

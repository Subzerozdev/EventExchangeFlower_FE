import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

const ErrorPayment: React.FC = () => {
  const navigate = useNavigate();

  const handleContinuteShopping = () => {
    navigate("/productList");
  };

  return (
    <div className="error-payment-container">
      <Result
        status="error"
        title="Thanh toán không thành công"
        subTitle="Xin lỗi, bạn không thể mua hàng của chính mình. Vui lòng chọn sản phẩm khác!"
        extra={[
          <Button
            key="buy"
            type="primary"
            className="continue-button"
            onClick={handleContinuteShopping}
          >
            Quay lại
          </Button>,
        ]}
      />
    </div>
  );
};

export default ErrorPayment;

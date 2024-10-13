import React from "react";
// import  { useEffect, useState } from "react";
import { Button, Result } from "antd";
// import { notification} from "antd";
import { useNavigate } from "react-router-dom";

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  //   const [isAuthorized, setIsAuthorized] = useState(false);

  //   useEffect(() => {
  //     const paymentFailure = localStorage.getItem('paymentFailure');

  //     if (!paymentFailure || paymentFailure !== 'true') {
  //       // Nếu không có trạng thái thất bại, điều hướng về trang Checkout
  //       navigate('/checkout');
  //     } else {
  //       // Nếu có trạng thái thất bại, cho phép hiển thị trang
  //       setIsAuthorized(true);
  //       // Xóa trạng thái sau khi đã hiển thị trang
  //       localStorage.removeItem('paymentFailure');
  //     }
  //   }, [navigate]);

  const handleRetry = () => {
    // Quay lại trang Checkout khi người dùng muốn thử thanh toán lại
    navigate("/checkout");
  };

  //   if (!isAuthorized) {
  //     navigate("/checkout");
  //     notification.error({
  //         message: "Lỗi",
  //         description: "Lỗi",
  //       });
  //  // Không hiển thị nội dung nếu không được ủy quyền
  //   }

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

import React, { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Spin } from "antd"; // Dùng để hiển thị loading
import api from "../../../../config/api";

const LoadingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy các query parameters từ URL
  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get("vnp_ResponseCode"); // Thay 'response_code' bằng tên thật của parameter trong URL
  const orderId = queryParams.get("orderID"); // Thay 'order_id' bằng tên thật của parameter trong URL
  const [searchParams] = useSearchParams();
  const orderIds = searchParams.getAll("orderID");

  useEffect(() => {
    // Gọi API với các parameter
    const fetchPaymentStatus = async () => {
      try {
        console.log(responseCode);
        let formattedOrderIds = "";
        for (const orderID of orderIds) {
          formattedOrderIds += "&orderID=" + orderID;
        }
        console.log(formattedOrderIds);
        const response = await api.get(
          `/payment/vnpay/callback?vnp_ResponseCode=${responseCode}${formattedOrderIds}`
        );

        if (response.status === 200) {
          await api.post(`/api/transactions?${formattedOrderIds}`);
          // Nếu thanh toán thành công, chuyển hướng đến trang thanh toán thành công
          navigate("/paymentSuccess");
        } else {
          // Nếu thanh toán thất bại, chuyển hướng đến trang thanh toán thất bại
          navigate("/paymentFailure");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        // Trong trường hợp có lỗi, có thể chuyển hướng đến trang lỗi chung
        navigate("/paymentFailure");
      }
    };

    fetchPaymentStatus();
  }, [responseCode, orderId, navigate, orderIds]);

  return (
    <div className="loading-page">
      <Spin tip="Đang xử lý thanh toán, vui lòng đợi..." />
    </div>
  );
};

export default LoadingPage;

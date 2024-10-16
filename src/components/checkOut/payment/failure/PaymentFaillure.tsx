
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  // const [isAuthorized, setIsAuthorized] = useState(false);

  // useEffect(() => {
  //   const paymentFailure = localStorage.getItem("paymentFailure");

  //   if (!paymentFailure || paymentFailure !== "true") {
  //     // Nếu không có trạng thái thất bại, điều hướng về trang Checkout và thông báo lỗi
  //     notification.error({
  //       message: "Lỗi thanh toán",
  //       description: "Không có thông tin về lỗi thanh toán.",
  //     });
  //     navigate("/checkout");
  //   } else {
  //     // Nếu có trạng thái thất bại, cho phép hiển thị trang
  //     setIsAuthorized(true);
  //     // Xóa trạng thái sau khi đã hiển thị trang
  //     localStorage.removeItem("paymentFailure");
  //   }
  // }, [navigate]);

  const handleRetry = () => {
    // Quay lại trang Checkout khi người dùng muốn thử thanh toán lại
    navigate("/checkout");
  };

  // // Nếu không được ủy quyền hiển thị, return null để không render trang
  // if (!isAuthorized) {
  //   return null;
  // }

  return (
    <div className="payment-failure">
      <Result
        status="error"
        title="Thanh toán không thành công"
        subTitle="Có lỗi xảy ra khi xử lý thanh toán của bạn qua VNPAY. Vui lòng thử lại."
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

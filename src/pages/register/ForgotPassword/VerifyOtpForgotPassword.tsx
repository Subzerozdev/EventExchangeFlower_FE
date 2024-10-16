
import { useLocation } from 'react-router-dom'; // Import useLocation từ react-router-dom
import OTPInputForgotPassword from './OTPInputForgotPassword';// Import OTPInput cho quên mật khẩu
import "./VerifyOtpForgotPassword.scss";

function VerifyOtpForgotPassword() {
    const location = useLocation(); // lấy dữ liệu từ navigate
    const { userID } = location.state || {}; // Lấy userID từ state khi quên mật khẩu

    // Kiểm tra nếu userID không tồn tại
    if (!userID) {
        return <div>Error: UserID not provided!</div>;
    }

    return (
        <div className="verify-otp">
            <div className="otp-overlay"></div> {/* Overlay làm mờ */}
            <div className="otp-container"> {/* Container để focus vào phần OTP */}
                <h2>Nhập vào mã OTP để đặt lại mật khẩu</h2>
                <OTPInputForgotPassword userID={userID} /> {/* Truyền userID vào OTPInput */}
            </div>

        </div>
    );
}

export default VerifyOtpForgotPassword;

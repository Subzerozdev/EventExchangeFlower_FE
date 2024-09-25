import Footer from '../../components/footer/footer'; // Import Footer
import { useLocation } from 'react-router-dom'; // Import useLocation từ react-router-dom
import OTPInput from './OTPInput'; // Import OTPInput
import "./VertifyOtp.scss";
//----------------------

function VerifyOtp() {
    const location = useLocation(); // lấy dữ liệu từ navigate
    const { email } = location.state || {}; // Lấy email từ state, nếu không có thì là undefined

    // Kiểm tra nếu email không tồn tại
    if (!email) {
        return <div>Error: Email not provided!</div>;
    }

    return (
        <div className="verify-otp">
            <div className="otp-overlay"></div> {/* Overlay làm mờ */}
            <div className="otp-container"> {/* Container để focus vào phần OTP */}
                <h2>Xác nhận OTP</h2>
                <OTPInput email={email} /> {/* Truyền email vào OTPInput */}
            </div>
            <Footer /> {/* Hiển thị footer */}
        </div>
    );
}

export default VerifyOtp;

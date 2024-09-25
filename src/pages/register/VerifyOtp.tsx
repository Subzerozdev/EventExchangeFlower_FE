import Footer from '../../components/footer/footer'; // Import Footer
import { useLocation } from 'react-router-dom'; // Import useLocation từ react-router-dom
import OTPInput from './OTPInput'; // Import OTPInput
import "./VertifyOtp.scss";
//----------------------


function VerifyOtp() {
    const location = useLocation(); // lay du lieu tu navigate
    const { email } = location.state || {}; // Lấy email từ state, nếu không có thì là undefined

    //check ton tai
    if (!email) {
        return <div>Error: Email not provided!</div>;
    }

    return (
        <div>
            <h2>Xác nhận OTP</h2>
            <OTPInput email={email} /> {/* Truyền email vào OTPInput */}
            <Footer /> {/* Hiển thị footer */}
        </div>
    );
}

export default VerifyOtp;

import { useState } from 'react';
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';
import './OTPInput.scss'; 

interface OTPInputProps {
    email: string;
}

function OTPInput({ email }: OTPInputProps) {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);
    const navigate = useNavigate();

    const handleVerifyOtp = async () => {
        try {
            const response = await api.post(`/vertification/${otp}/${email}`);
            if (response.data === "OTP Verify!!") {
                navigate("/");
            } else {
                throw new Error('Invalid OTP');
            }
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            const newAttempt = attempt + 1;
            setAttempt(newAttempt);
            if (newAttempt >= 3) {
                setError('Bạn nhập quá số lần thử. Đang chuyển về trang đăng ký.');
                setTimeout(() => window.location.href = "/register", 3000);
            }
        }
    };

    return (
        <div className="otp-wrapper">
            <div className="otp-container">
                <input
                    className="otp-input"
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Nhập mã OTP"
                />
                <button className="otp-button" onClick={handleVerifyOtp}>
                    Xác nhận OTP
                </button>
                {error && <p className="otp-error">{error}</p>}
            </div>
        </div>
    );
}

export default OTPInput;

import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { AxiosError } from "axios";

function ForgotPassword() {
    const navigate = useNavigate();

    const onFinish = async (values: { email: string }) => {
        try {
            const response = await api.post("/auth/password", { email: values.email });
            await api.post(`/verification/${response.data}`); // Gửi yêu cầu API để gửi OTP qua email
            message.success("OTP đã được gửi đến email của bạn!");
            navigate("/forgot-password/verify-otp", { state: { userID: response.data } });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                message.error("Email không hợp lệ, vui lòng kiểm tra lại.");
            } else {
                message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
            console.log("Forgot Password Error:", error);
        }
    };

    return (
        <div className="forgot-password">
            <h2>Quên mật khẩu</h2>
            <Form onFinish={onFinish}>
                <Form.Item
                    name="email"
                    rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}
                >
                    <Input placeholder="Nhập email của bạn" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Gửi OTP
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ForgotPassword;

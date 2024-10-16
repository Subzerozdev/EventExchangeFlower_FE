import { Button, Form, Input, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { AxiosError } from "axios";

function ResetPassword() {
    const location = useLocation();
    const { userID } = location.state || {};
    const navigate = useNavigate();

    const onFinish = async (values: { password: string; confirmPassword: string }) => {
        if (values.password !== values.confirmPassword) {
            message.error("Mật khẩu không khớp!");
            return;
        }

        try {

            await api.put("/api/user/password", { userID, password: values.password });
            message.success("Đặt lại mật khẩu thành công!");
            navigate("/login");
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                message.error("Yêu cầu không hợp lệ, vui lòng kiểm tra lại.");
            } else {
                message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
            console.log("Reset Password Error:", error);
        }
    };

    return (
        <div className="reset-password">
            <h2>Đặt lại mật khẩu</h2>
            <Form onFinish={onFinish}>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
                >
                    <Input.Password placeholder="Mật khẩu mới" />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
                >
                    <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Đặt lại mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ResetPassword;

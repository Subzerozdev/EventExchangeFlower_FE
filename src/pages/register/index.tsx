import { GoogleCircleFilled } from "@ant-design/icons";
import { Alert, Button, Form, Input, message } from "antd";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useUser } from "../../context/UserContext";
import Marquee from "react-fast-marquee";
import { useState } from "react";
import "./Register.scss";
import OTPInput from "./OTPInput"; // Import OTPInput

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  fullName: string;
  address: string;
}

function Register() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false); // Trạng thái để kiểm soát khi gửi OTP
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState(""); // State lưu trữ email để truyền vào OTPInput

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { data } = await api.get(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      setUser({
        fullName: data.name || "Google User",
        email: data.email || "",
        phone: null,
        address: null,
      });

      message.success("Đăng ký qua Google thành công!");
      navigate("/");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi đăng ký bằng Google. Vui lòng thử lại!");
    },
  });
  //-----------------------------------------------------------------------------------------------------
  const onFinish = async (values: RegisterFormValues) => {
    try {
      const response = await api.post("/user/register", values);

      if (response.status === 200) {
        setUser({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
        });
        setEmail(values.email); // Lưu email vào state để truyền cho OTPInput
        setIsOtpSent(true); // Kích hoạt OTP sau khi đăng ký thành công
        message.success("Đăng ký thành công! Vui lòng xác nhận OTP.");
        await api.post(`/vertification/${values.email}`); // ở đây Gửi yêu cầu API để gửi OTP qua email
        navigate("/register/verifyOtp", { state: { email: values.email } });


      } else {
        setAlertMessage(response?.data?.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.");
    }
  };

  // Hiển thị form OTP nếu đã gửi thành công
  if (isOtpSent) {
    return <OTPInput email={email} />;
  }

  return (
    <div className="register">
      {alertMessage && (
        <Alert
          banner
          message={
            <Marquee pauseOnHover gradient={false}>
              {alertMessage}
            </Marquee>
          }
          type="error"
          showIcon
          closable
          style={{ marginBottom: "20px" }}
        />
      )}
      <div className="register_form">
        <Form name="register" onFinish={onFinish} autoComplete="off">
          <Form.Item>
            <h1>Đăng ký tài khoản</h1>
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="Email address" />
          </Form.Item>
          <Form.Item name="fullName" rules={[{ required: true }]}>
            <Input placeholder="Tên người dùng" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, min: 8 }]}>
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(0|\+84)[3-9][0-9]{8}$/,
                message: "Số điện thoại không đúng định dạng!",
              },
            ]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item name="address" rules={[{ required: true }]}>
            <Input placeholder="Địa chỉ" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đăng ký
            </Button>
          </Form.Item>
          <div className="divider">
            <span>HOẶC</span>
          </div>
          <Form.Item>
            <Button onClick={() => loginWithGoogle()} className="google-button">
              <GoogleCircleFilled /> Tiếp tục với Google
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Register;

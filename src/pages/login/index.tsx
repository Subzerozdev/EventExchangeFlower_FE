import { GoogleCircleFilled } from "@ant-design/icons";
import "./Login.scss";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios"; // Import AxiosError
import api from "../../config/api";
import { useUser } from "../../context/UserContext"; // Import useUser
import { ValidateErrorEntity } from "rc-field-form/lib/interface"; // Import ValidateErrorEntity

interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Lấy setUser từ context

  // Đăng nhập qua Google
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setUser("Google User"); // Cập nhật tên người dùng (ví dụ từ Google)
      message.success("Đăng nhập qua Google thành công!");
      navigate("/Home");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi đăng nhập bằng Google. Vui lòng thử lại!");
    }
  });

  // Xử lý khi nhấn nút đăng nhập
  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await api.post("/user/login", values);
      console.log("Success:", values);

      if (response.data && response.data.success) {
        setUser(values.email); // Cập nhật tên người dùng sau khi đăng nhập thành công
        message.success("Đăng nhập thành công!");
        navigate("/Home");
      } else {
        message.error(response.data.message || "Đăng nhập thất bại!");
      }
    } catch (error: unknown) {
      // Xử lý lỗi chi tiết khi gặp lỗi từ phía server hoặc request
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 401) {
          message.error("Sai tài khoản hoặc mật khẩu!");
        } else {
          message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } else {
        message.error("Có lỗi xảy ra ngoài dự kiến.");
      }
    }
  };

  // Xử lý khi form không hợp lệ
  const onFinishFailed = (errorInfo: ValidateErrorEntity<LoginFormValues>) => {
    console.log("Failed:", errorInfo);

    // Catch exception ở đây
    if (errorInfo.errorFields && errorInfo.errorFields.length > 0) {
      message.error("Vui lòng điền đầy đủ thông tin và kiểm tra lại!");
    }
  };

  return (
    <div className="login">
      <div className="login_form">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item>
            <h1>Đăng nhập</h1>
            <p>Đăng nhập tại đây để có thể xem được các sản phẩm</p>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email của bạn!" }]}
          >
            <Input placeholder="Email address" className="login-input" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu của bạn!" }]}
          >
            <Input.Password placeholder="Password" className="login-input" />
          </Form.Item>

          <a href="#" className="forgot-password">Quên mật khẩu?</a>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="divider"><span>OR</span></div>

          <Form.Item>
            <Button onClick={() => login()} className="google-button">
              <GoogleCircleFilled /> Tiếp tục với Google
            </Button>
          </Form.Item>

          <div className="register">
            Bạn chưa có tài khoản? <a href="#">Đăng ký tại đây</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;

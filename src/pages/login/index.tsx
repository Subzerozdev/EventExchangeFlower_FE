import { GoogleCircleFilled } from "@ant-design/icons";
import "./Login.scss";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { AnyObject } from "antd/es/_util/type";
import api from "../../config/api";
import { useUser } from "../../context/UserContext"; // Import useUser

interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Lấy setUser từ context

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setUser("Google User"); // Cập nhật tên người dùng (ví dụ từ Google)
      navigate("/Home");
    },
  });

  const onFinish = async (values: LoginFormValues) => {
    try {
      await api.post("login", values);
      console.log("Success:", values);
      setUser(values.email); // Cập nhật tên người dùng sau khi đăng nhập thành công
      navigate("/home");
    } catch (error) {
      console.log("Error", error);
      navigate("/login");
    }
  };

  const onFinishFailed = (errorInfo: AnyObject) => {
    console.log("Failed:", errorInfo);
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
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email address" className="login-input" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
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

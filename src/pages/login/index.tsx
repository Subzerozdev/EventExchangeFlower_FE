import { GoogleCircleFilled } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useUser } from "../../context/UserContext";
import { AxiosError } from "axios"; // catch error

import "./Login.scss";

interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Đăng nhập bằng Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
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

        message.success("Đăng nhập bằng Google thành công!");
        navigate("/");
      } catch (error) {
        message.error(
          "Có lỗi xảy ra khi đăng nhập bằng Google. Vui lòng thử lại!"
        );
        console.log("Google Login Error:", error);
      }
    },
  });

  // Đăng nhập bằng email và mật khẩu
  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await api.post("/user/login", values);

      if (response.status === 200) {
        //    Khi xác thực thành công, cập nhật thông tin người dùng nè
        setUser({
          fullName: response.data.fullName,
          email: response.data.email,
          phone: response.data.phone || "Chưa có thông tin", // Cập nhật số điện thoại
          address: response.data.address,
        });

        message.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        message.error("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        message.error("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      } else {
        message.error(
          "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau."
        );
      }
      console.log("Login Error:", error);
    }
  };

  return (
    <div className="login">
      <div className="login_form">
        <Form name="basic" onFinish={onFinish} autoComplete="off">
          <Form.Item>
            <h1>Đăng nhập</h1>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input placeholder="Địa chỉ email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đăng nhập
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

export default Login;

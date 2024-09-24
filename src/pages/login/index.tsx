import { GoogleCircleFilled } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useUser } from "../../context/UserContext";

import "./Login.scss";

interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

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
        });
        message.success("Đăng ký qua Google thành công!");
        navigate("/");
      } catch (error) {
        console.log("Google Login Error:", error);
      }
    },
  });

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await api.post("/user/login", values);
      setUser({
        fullName: response.data.fullName,
        email: values.email,
        phone: null,
      });
      navigate("/");
    } catch (error) {
      console.log("Login Error", error);
    }
  };

  return (
    <div className="login">
      <div className="login_form">
        <Form name="basic" onFinish={onFinish} autoComplete="off">
          <Form.Item>
            <h1>Đăng nhập</h1>
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, message: "Please input your email!" }]}>
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="divider"><span>OR</span></div>

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

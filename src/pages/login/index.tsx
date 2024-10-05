import { GoogleCircleFilled } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useUser } from "../../context/UserContext";
import { AxiosError } from "axios";
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
          role: null,
          id: null,
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
      const response = await api.post("/auth/login", values);

      if (response.status === 200) {
        // Lưu token vào localStorage
        const token = response.data.token;
        const user = response.data.user;
        localStorage.setItem("token", token);

        // Cập nhật thông tin người dùng trong context
        setUser({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || "Chưa có thông tin",
          address: user.address,
          role: user.role,
          id: user.id,
        });

        message.success("Đăng nhập thành công!");
        // Phân quyền dựa trên vai trò của người dùng
        if (user.role === "ROLE_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        message.error("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      }
    } catch (error) {
      // Kiểm tra lỗi từ phía server
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        if (statusCode === 400) {
          message.error("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } else if (statusCode === 500) {
          message.error("Lỗi server. Vui lòng thử lại sau.");
        } else {
          message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } else {
        message.error("Có lỗi xảy ra trong quá trình đăng nhập.");
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
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              {
                type: "email",
                message: "Địa chỉ email không hợp lệ!",
              },
            ]}
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

import { GoogleCircleFilled } from "@ant-design/icons";
import "./Login.css";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useNavigate } from "react-router-dom";  // Import useNavigate

function Login() {
  const navigate = useNavigate();  // Sử dụng useNavigate để điều hướng

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      navigate("/home");  // Chuyển hướng tới trang chủ sau khi đăng nhập Google thành công
    },
  });

  const onFinish = (values) => {
    console.log("Success:", values);
    // Giả sử đăng nhập thành công
    navigate("/home");  // Chuyển hướng tới trang chủ sau khi đăng nhập bằng tài khoản thành công
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login">
      <div className="login_form">
        <Form
          name="basic"
          style={{
            maxWidth: 400,
            margin: "auto",
            padding: "40px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <FormItem style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Đăng nhập</h1>
            <p style={{ color: "#8c8c8c" }}>
              Đăng nhập tại đây để có thể xem được các sản phẩm
            </p>
          </FormItem>

          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              placeholder="Email address"
              style={{
                padding: "10px",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              style={{
                padding: "10px",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <a href="#" style={{ color: "#1890ff", fontSize: "14px" }}>
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#bfbfbf",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div
            style={{ textAlign: "center", margin: "20px 0", color: "#8c8c8c" }}
          >
            <span
              style={{
                position: "relative",
                top: "-10px",
                background: "#fff",
                padding: "0 10px",
              }}
            >
              OR
            </span>
            <div
              style={{ borderTop: "1px solid #d9d9d9", marginTop: "-10px" }}
            ></div>
          </div>

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              onClick={() => login()}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              <GoogleCircleFilled style={{ marginRight: "8px" }} />
              Tiếp tục với Google
            </Button>
          </Form.Item>

          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "14px",
            }}
          >
            Bạn chưa có tài khoản?{" "}
            <a href="#" style={{ color: "#1890ff" }}>
              Đăng ký tại đây
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;

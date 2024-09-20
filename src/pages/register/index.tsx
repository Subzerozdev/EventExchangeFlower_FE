import { GoogleCircleFilled } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ValidateErrorEntity } from "rc-field-form/lib/interface"; 
import { AnyObject } from "antd/es/_util/type";
import api from "../../config/api"; // API đã config sẵn

interface RegisterFormValues {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

function Register() {
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google login success:", tokenResponse);
      navigate("/home");
    },
  });

  const onFinish = async (values: RegisterFormValues) => {
    try {
      const response = await api.post("/user/register", values); // Đổi đường dẫn API phù hợp với backend
      console.log("Register Success:", response.data);
      navigate("/login"); // Điều hướng đến trang login sau khi đăng ký thành công
    } catch (error) {
      console.error("Register Error", error);
    }
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<AnyObject>) => {
    console.log("Form failed:", errorInfo);
  };

  return (
    <div className="register">
      <div className="register_form">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Đăng ký tài khoản
        </h1>
        <Form
          name="register"
          style={{
            maxWidth: 400,
            margin: "auto",
            padding: "40px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email của bạn!" }]}
          >
            <Input placeholder="Địa chỉ email" style={{ padding: "10px", borderRadius: "8px", fontSize: "16px" }} />
          </Form.Item>

          <Form.Item
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
          >
            <Input placeholder="Tên người dùng" style={{ padding: "10px", borderRadius: "8px", fontSize: "16px" }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" style={{ padding: "10px", borderRadius: "8px", fontSize: "16px" }} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" style={{ padding: "10px", borderRadius: "8px", fontSize: "16px" }} />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại của bạn!" }]}
          >
            <Input placeholder="Nhập vào số điện thoại" style={{ padding: "10px", borderRadius: "8px", fontSize: "16px" }} />
          </Form.Item>

          <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#1890ff", border: "none", borderRadius: "8px", fontSize: "16px" }}>
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", margin: "20px 0", color: "#8c8c8c" }}>
            <span style={{ position: "relative", top: "-10px", background: "#fff", padding: "0 10px" }}>
              HOẶC
            </span>
            <div style={{ borderTop: "1px solid #d9d9d9", marginTop: "-10px" }}></div>
          </div>

          <Form.Item style={{ textAlign: "center" }}>
            <Button onClick={() => loginWithGoogle()} style={{ width: "100%", padding: "10px", border: "1px solid #d9d9d9", borderRadius: "8px", fontSize: "16px" }}>
              <GoogleCircleFilled style={{ marginRight: "8px" }} /> Tiếp tục với Google
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Register;
 
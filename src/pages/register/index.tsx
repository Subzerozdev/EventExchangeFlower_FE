import { GoogleCircleFilled } from "@ant-design/icons";
import { Alert, Button, Form, Input, message } from "antd";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import  { AxiosError } from "axios";
import api from "../../config/api";
import { useUser } from "../../context/UserContext";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import Marquee from "react-fast-marquee";
import { useState } from "react";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  fullName: string;
}

function Register() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State để hiển thị thông báo lỗi
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Đăng ký qua Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setUser("Google User");
      message.success("Đăng ký qua Google thành công!");
      navigate("/Home");
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi đăng ký bằng Google. Vui lòng thử lại!");
    },
  });

  // Xử lý khi nhấn nút đăng ký
  const onFinish = async (values: RegisterFormValues) => {
    try {
      const response = await api.post("/user/register", values);
  
      console.log("API Response:", response); // In response từ API để kiểm tra
  
      // Kiểm tra xem response có phải là dạng object và có trường 'success'
      if (response.status==200) {
        setUser(values.email);
        message.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        // Thêm chi tiết về phản hồi nếu không có success
        setAlertMessage(response?.data?.message || "Đăng ký thất bại! Hãy kiểm tra lại thông tin.");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("API Error Response:", error.response?.data); // Thêm logging lỗi chi tiết
        if (error.response && error.response.status === 409) {
          setAlertMessage("Email đã tồn tại, vui lòng sử dụng email khác.");
        } else {
          setAlertMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } else {
        setAlertMessage("Có lỗi xảy ra ngoài dự kiến.");
      }
    }
  };



  // Hiển thị lỗi nhập liệu không hợp lệ
  const onFinishFailed = (errorInfo: ValidateErrorEntity<RegisterFormValues>) => {
    console.log("Failed:", errorInfo);
    setAlertMessage("Vui lòng điền đầy đủ thông tin và kiểm tra lại!");
  };

  return (
    <div className="register">
      {/* Hiển thị thông báo lỗi nếu có */}
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
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item>
            <h1>Đăng ký tài khoản</h1>
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            hasFeedback
          >
            <Input placeholder="Email address" className="register-input" />
          </Form.Item>

          {/* Tên người dùng */}
          <Form.Item
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
              {
                pattern: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/,
                message: "Tên không được chứa số hoặc ký tự đặc biệt!",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Tên người dùng" className="register-input" />
          </Form.Item>

          {/* Mật khẩu */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
              { min: 8, message: "Mật khẩu phải dài hơn 8 ký tự!" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Mật khẩu" className="register-input" />
          </Form.Item>

          {/* Xác nhận mật khẩu */}
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu của bạn!" },
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
            <Input.Password placeholder="Xác nhận mật khẩu" className="register-input" />
          </Form.Item>

          {/* Số điện thoại */}
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^(0|\+84)[3-9][0-9]{8}$/, message: "Số điện thoại không đúng định dạng!" },
            ]}
            hasFeedback
          >
            <Input placeholder="Số điện thoại" className="register-input" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-button">
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

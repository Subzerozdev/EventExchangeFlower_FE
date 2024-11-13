import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useUser } from "../../context/UserContext";
import { AxiosError } from "axios"; // catch error
// import jwt_decode from "jwt-decode"; // Import jwt-decode để giải mã token
import "./Login.scss";

// Interface cho thông tin người dùng trong token
// interface DecodedToken {
//   ID: string;
//   role: string;
// }
// interface User {

//   email: string;
//   fullName: string;
//   address: string;
//   phone: string;
//   role: string;

// }
interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  // // Đăng nhập bằng Google
  // const loginWithGoogle = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const { data } = await api.get(
  //         "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${tokenResponse.access_token}`,
  //           },
  //         }
  //       );
  //       setUser({
  //         fullName: data.name || "Google User",
  //         email: data.email || "",
  //         phone: null,
  //         address: null,
  //         role: null,
  //         id: null,
  //       });

  //       message.success("Đăng nhập bằng Google thành công!");
  //       navigate("/");
  //     } catch (error) {
  //       message.error(
  //         "Có lỗi xảy ra khi đăng nhập bằng Google. Vui lòng thử lại!"
  //       );
  //       console.log("Google Login Error:", error);
  //     }
  //   },
  // });

  // Đăng nhập bằng email và mật khẩu
  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await api.post("/auth/login", values);
      // console.log(response.data.token); test thoi
      if (response.status === 200) {
        // Lưu token vào localStorage
        const token = response.data.jwtToken;
        const user = response.data.user;
        localStorage.setItem("jwtToken", token);

        // Giải mã token để lấy thông tin người dùng
        // const decodedToken: DecodedToken = jwt_decode(token); // Giải mã JWT bị cấn

        // Cập nhật thông tin người dùng trong context
        setUser({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || "Chưa có thông tin", // Kiểm tra nếu không có số điện thoại
          address: user.address,
          role: user.role, // check ROLE CHỖ NÀY CHO TUI
          id: user.id,
        });

        message.success("Đăng nhập thành công!");
        // Phân quyền dựa trên vai trò của người dùng
        if (user.role === "ROLE_ADMIN") {
          navigate("/admin/review-posts"); // Chuyển hướng đến trang admin nếu là admin
        } else {
          navigate("/");
        }
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

          {/* Email */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Địa chỉ email không hợp lệ!" },
              { max: 50, message: "Email không được vượt quá 50 ký tự!" },
            ]}
          >
            <Input placeholder="Địa chỉ email" />
          </Form.Item>

          {/* Mật khẩu */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              { max: 40, message: "Mật khẩu không được vượt quá 40 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <div>
            <a onClick={() => navigate("/forgot-password")}>Quên mật khẩu?</a>
          </div>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            Chưa có tài khoản? <a onClick={() => navigate("/register")}>Đăng ký tại đây</a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
  );
}

export default Login;

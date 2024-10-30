import { Form, Input, Button, message } from "antd";
import api from "../../../../config/api";
import { AxiosError } from "axios";
import { useUser } from "../../../../context/UserContext"; // Sử dụng context để cập nhật vai trò người dùng

interface SellerFormValues {
  shopName: string;
  shopAddress: string;
  description: string;
  qrCode?: string; // Mã QR nếu có
  shopImage?: string; // URL hình ảnh của shop nếu có
}

function SellerForm() {
  const [form] = Form.useForm();
  const { setUser } = useUser(); // Sử dụng để cập nhật vai trò của người dùng

  const onFinish = async (values: SellerFormValues) => {
    try {
      await api.post("/api/shop", values); // Gọi API đăng ký shop
      message.success("Đăng ký người bán thành công!");
      const responseToken = await api.post("/api/user/token");
      localStorage.setItem("jwtToken", responseToken.data.jwtToken);
      // Cập nhật vai trò người dùng thành "seller" sau khi đăng ký thành công
      setUser((prevUser) => ({
        ...prevUser,
        role: "ROLE_SELLER",
      }));
      window.location.reload();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        message.error(
          `Lỗi API: ${axiosError.response.data || "Không xác định"}`
        );
      } else {
        message.error("Có lỗi khi đăng ký người bán.");
      }
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Tên Shop"
        name="shopName"
        rules={[{ required: true, message: "Vui lòng nhập tên shop!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Địa chỉ Shop"
        name="shopAddress"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ shop!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input.TextArea
          rows={4}
          placeholder="Mô tả shop của bạn (không bắt buộc)"
        />
      </Form.Item>

      {/* <Form.Item label="Mã QR (tùy chọn)" name="qrCode">
        <Input placeholder="Nhập mã QR của shop nếu có" />
      </Form.Item>

      <Form.Item label="Hình ảnh Shop (tùy chọn)" name="shopImage">
        <Input placeholder="URL hình ảnh của shop" />
      </Form.Item> */}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SellerForm;

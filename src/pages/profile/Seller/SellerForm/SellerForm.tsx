import { Form, Input, Button, message, Select } from "antd";
import api from "../../../../config/api";
import { AxiosError } from "axios";
import { useUser } from "../../../../context/UserContext"; // Sử dụng context để cập nhật vai trò người dùng
import "./SellerForm.scss";
interface SellerFormValues {
  shopName: string;
  shopAddress: string;
  description: string;
  bankNumber: string; // Số tài khoản thụ hưởng
  ownerBank: string;  // Tên chủ tài khoản
  bankName: string;   // Tên ngân hàng
}

const vietnameseBanks = [
  { value: 'NCB', label: 'NCB - Ngân Hàng TMCP Quốc Dân' },
  { value: 'Vietcombank', label: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)' },
  { value: 'VietinBank', label: 'Ngân hàng TMCP Công thương Việt Nam (VietinBank)' },
  { value: 'BIDV', label: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)' },
  { value: 'Agribank', label: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)' },
  { value: 'Sacombank', label: 'Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)' },
  { value: 'Techcombank', label: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)' },
  { value: 'ACB', label: 'Ngân hàng TMCP Á Châu (ACB)' },
  { value: 'MBBank', label: 'Ngân hàng TMCP Quân Đội (MBBank)' },
  { value: 'VPBank', label: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)' },
  { value: 'HDBank', label: 'Ngân hàng TMCP Phát triển Nhà TP.HCM (HDBank)' },
  { value: 'Eximbank', label: 'Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam (Eximbank)' },
  { value: 'SHB', label: 'Ngân hàng TMCP Sài Gòn – Hà Nội (SHB)' },
  { value: 'TPBank', label: 'Ngân hàng TMCP Tiên Phong (TPBank)' },
  { value: 'VIB', label: 'Ngân hàng TMCP Quốc tế Việt Nam (VIB)' },
  { value: 'MSB', label: 'Ngân hàng TMCP Hàng Hải Việt Nam (MSB)' },
  { value: 'SCB', label: 'Ngân hàng TMCP Sài Gòn (SCB)' },
  { value: 'SeABank', label: 'Ngân hàng TMCP Đông Nam Á (SeABank)' },
  { value: 'ABBank', label: 'Ngân hàng TMCP An Bình (ABBank)' },
  { value: 'BacABank', label: 'Ngân hàng TMCP Bắc Á (BacABank)' },
  { value: 'OCB', label: 'Ngân hàng TMCP Phương Đông (OCB)' },
  { value: 'Kienlongbank', label: 'Ngân hàng TMCP Kiên Long (Kienlongbank)' },
  { value: 'PVcomBank', label: 'Ngân hàng TMCP Đại Chúng Việt Nam (PVcomBank)' },
  { value: 'Saigonbank', label: 'Ngân hàng TMCP Sài Gòn Công Thương (Saigonbank)' },
];

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
      {/* Thông tin Shop */}
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

      {/* Thông tin Ngân hàng */}
      <Form.Item
        label="Tên ngân hàng"
        name="bankName"
        rules={[{ required: true, message: "Vui lòng chọn tên ngân hàng!" }]}
      >
        <Select
          placeholder="Chọn tên ngân hàng của bạn"
          options={vietnameseBanks}
        />
      </Form.Item>

      <Form.Item
        label="Số tài khoản thụ hưởng"
        name="bankNumber"
        rules={[{ required: true, message: "Vui lòng nhập số tài khoản thụ hưởng!" }]}
      >
        <Input placeholder="Nhập số tài khoản thụ hưởng" />
      </Form.Item>

      <Form.Item
        label="Tên chủ tài khoản"
        name="ownerBank"
        rules={[{ required: true, message: "Vui lòng nhập tên chủ tài khoản!" }]}
      >
        <Input placeholder="Nhập tên chủ tài khoản của bạn" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SellerForm;

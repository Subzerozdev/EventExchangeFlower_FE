import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// Định nghĩa kiểu dữ liệu cho giá trị form
interface SellerFormValues {
  name: string;
  email: string;
  phone: string;
  shopName: string;
  shopAddress: string;
  qrCode?: string; // Đây là trường tùy chọn
  description?: string; // Trường mô tả cũng là tùy chọn
}

const SellerForm: React.FC = () => {
  const [form] = Form.useForm();

  // Sử dụng kiểu dữ liệu đã định nghĩa
  const onFinish = (values: SellerFormValues) => {
    console.log('Received values:', values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="seller-form"
    >
      <Form.Item
        label="Họ tên"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
      >
        <Input placeholder="Võ Thành Danh" />
      </Form.Item>

      <Form.Item
        label="Email của bạn"
        name="email"
        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
      >
        <Input placeholder="...@gmail.com" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại của shop"
        name="phone"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
      >
        <Input placeholder="0xxx xxx xxxx" />
      </Form.Item>

      <Form.Item
        label="Tên Shop hoa của bạn"
        name="shopName"
        rules={[{ required: true, message: 'Vui lòng nhập tên shop!' }]}
      >
        <Input placeholder="Hoa gì đó..." />
      </Form.Item>

      <Form.Item
        label="Địa chỉ cụ thể của shop"
        name="shopAddress"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
      >
        <Input placeholder="Thành Phố Hồ Chí Minh, Thủ Đức, Phường Tăng Nhơn Phú A..." />
      </Form.Item>

      <Form.Item label="QR VNPAY" name="qrCode">
        <Input placeholder="Địa chỉ cụ thể của shop" />
      </Form.Item>

      <Form.Item label="Hình ảnh mô tả của shop">
        <Upload>
          <Button icon={<UploadOutlined />}>Tải hình ảnh lên tại đây</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Mô tả thông tin shop"
        name="description"
      >
        <Input.TextArea rows={4} placeholder="Nhập thông tin..." />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SellerForm;

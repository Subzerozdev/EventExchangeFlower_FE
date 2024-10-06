import React from 'react';
import { Form, Input, Button, Select, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadChangeParam } from 'antd/es/upload/interface'; // Import correct types from Ant Design
import './SellerAddNewProduct.scss';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Define the interface for the form values
interface ProductFormValues {
  productName: string;
  quantity: number;
  eventDate: [moment.Moment, moment.Moment]; // Date range using moment.js
  shopName: string;
  eventType: string;
  shopAddress: string;
  shopImage: UploadFile[]; // Correctly typing shopImage as an array of UploadFile objects
}

const SellerAddNewProduct: React.FC = () => {
  const [form] = Form.useForm();

  // Define the onFinish function with proper types
  const onFinish = (values: ProductFormValues) => {
    console.log('Form Values:', values);
  };

  // Custom function to handle file upload events
  const handleUpload = (e: UploadChangeParam): UploadFile[] => {
    return e.fileList; // Now `fileList` is correctly typed as `UploadFile[]`
  };

  return (
    <div className="add-product-container">
      <h1>Thêm sản phẩm</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="add-product-form"
      >
        <Form.Item
          label="Tên sản phẩm:"
          name="productName"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
        >
          <Input placeholder="...hoa hồng đám cưới" />
        </Form.Item>

        <Form.Item
          label="Số lượng:"
          name="quantity"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <Select>
            <Option value={0}>0</Option>
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
            <Option value={3}>3</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Thời gian sự kiện diễn ra từ ngày:"
          name="eventDate"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
        >
          <RangePicker />
        </Form.Item>

        <Form.Item
          label="Tên Shop hoa của bạn:"
          name="shopName"
          rules={[{ required: true, message: 'Vui lòng nhập tên shop!' }]}
        >
          <Input placeholder="Hoa lối cũ..." />
        </Form.Item>

        <Form.Item
          label="Sự kiện sử dụng:"
          name="eventType"
          rules={[{ required: true, message: 'Vui lòng chọn sự kiện!' }]}
        >
          <Select>
            <Option value="wedding">Đám cưới</Option>
            <Option value="birthday">Tiệc sinh nhật</Option>
            <Option value="anniversary">Lễ kỷ niệm</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Địa chỉ cụ thể của shop:"
          name="shopAddress"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Thành Phố Hồ Chí Minh, Thủ Đức,..." />
        </Form.Item>

        <Form.Item
          label="Hình ảnh mô tả của shop:"
          name="shopImage"
          valuePropName="fileList"
          getValueFromEvent={handleUpload} // Use the custom handler for file uploads
        >
          <Upload
            name="logo"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Disable automatic upload
          >
            <Button icon={<UploadOutlined />}>Tải hình ảnh lên tại đây (jpg/png)</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đăng kí
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SellerAddNewProduct;

import React from "react";
import { Form, Input, Button, message } from "antd";
import {
  BankOutlined,
  IdcardOutlined,
  ProfileOutlined,
  NumberOutlined,
} from "@ant-design/icons";

import "./backMoney.scss";
import api from "../../config/api";

interface RefundFormValues {
  problem: string;
  bankNumber: string;
  ownerBank: string;
  bankName: string;
  orderID: number;
}

const RefundForm: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: RefundFormValues) => {
    try {
      const response = await api.post("/api/user/refund/", {
        ...values,
        problem: "Hoàn tiền đơn hàng",
      });

      if (response?.status === 200) {
        message.success("Đã gửi yêu cầu hoàn tiền thành công!");
        form.resetFields();
      } else {
        message.error("Gửi yêu cầu thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };

  return (
    <div className="refund-form">
      <h2>Form Hoàn Tiền</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ problem: "Hoàn tiền đơn hàng" }}
      >
        <Form.Item label="Vấn đề" name="problem">
          <Input prefix={<ProfileOutlined />} disabled />
        </Form.Item>

        <Form.Item
          label="Số Tài Khoản Ngân Hàng"
          name="bankNumber"
          rules={[{ required: true, message: "Vui lòng nhập số tài khoản!" }]}
        >
          <Input prefix={<NumberOutlined />} placeholder="Nhập số tài khoản" />
        </Form.Item>

        <Form.Item
          label="Chủ Tài Khoản"
          name="ownerBank"
          rules={[
            { required: true, message: "Vui lòng nhập tên chủ tài khoản!" },
          ]}
        >
          <Input
            prefix={<IdcardOutlined />}
            placeholder="Nhập tên chủ tài khoản"
          />
        </Form.Item>

        <Form.Item
          label="Tên Ngân Hàng"
          name="bankName"
          rules={[{ required: true, message: "Vui lòng nhập tên ngân hàng!" }]}
        >
          <Input prefix={<BankOutlined />} placeholder="Nhập tên ngân hàng" />
        </Form.Item>

        <Form.Item
          label="Mã Đơn Hàng"
          name="orderID"
          rules={[{ required: true, message: "Vui lòng nhập mã đơn hàng!" }]}
        >
          <Input
            type="number"
            prefix={<NumberOutlined />}
            placeholder="Nhập mã đơn hàng"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi Yêu Cầu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RefundForm;

import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Button, Form, message } from 'antd';
import api from '../../../config/api';

const { Option } = Select;

interface NotificationFormValues {
    type: string;
    message: string;
    receiver: string;
}

interface NotificationData {
    message: string;
    createDate: string;
    notificationType: string;
    emailReceiver: string;
}

const AdminNotificationPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]); // Danh sách thông báo
    const [tableLoading, setTableLoading] = useState(false);

    // Lấy danh sách thông báo từ API
    const fetchNotifications = async () => {
        setTableLoading(true);
        try {
            const response = await api.get('/api/admin/notification');
            if (response.status === 200) {
                setNotifications(response.data); // Gán dữ liệu nhận được từ API vào state
            } else {
                message.error('Không thể tải danh sách thông báo');
            }
        } catch {
            message.error('Không thể tải danh sách thông báo');
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(); // Gọi API khi component được render
    }, []);

    // Xử lý gửi thông báo
    const handleSubmit = async (values: NotificationFormValues) => {
        setLoading(true);
        try {
            const response = await api.post('/api/admin/notification', values);
            if (response.status === 200) {
                message.success('Gửi thông báo thành công');
                form.resetFields();
                fetchNotifications(); // Làm mới danh sách thông báo
            } else {
                message.error('Gửi thông báo thất bại');
            }
        } catch {
            message.error('Gửi thông báo thất bại');
        } finally {
            setLoading(false);
        }
    };

    // Cấu hình cột cho bảng thông báo
    const columns = [
        {
            title: 'Nội dung',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: 'Loại thông báo',
            dataIndex: 'notificationType',
            key: 'notificationType',
        },
        {
            title: 'Email người nhận',
            dataIndex: 'emailReceiver',
            key: 'emailReceiver',
        },
    ];

    return (
        <div className="notification-page">
            <h2>Gửi Thông Báo</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="type"
                    label="Loại Thông Báo"
                    rules={[{ required: true, message: 'Vui lòng chọn loại thông báo' }]}
                >
                    <Select placeholder="Chọn loại thông báo">
                        <Option value="REMIND">Nhắc nhở</Option>
                        <Option value="INFORMATION">Thông tin</Option>
                        <Option value="WARNING">Cảnh báo</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="message"
                    label="Nội Dung"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo' }]}
                >
                    <Input.TextArea placeholder="Nhập nội dung thông báo" rows={4} />
                </Form.Item>

                <Form.Item
                    name="receiver"
                    label="Email Người Nhận"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email người nhận' },
                        { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
                    ]}
                >
                    <Input placeholder="Nhập email người nhận" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Gửi Thông Báo
                    </Button>
                </Form.Item>
            </Form>

            <h2>Danh Sách Thông Báo</h2>
            <Table
                columns={columns}
                dataSource={notifications}
                rowKey={(record) => `${record.message}-${record.createDate}`}
                loading={tableLoading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default AdminNotificationPage;

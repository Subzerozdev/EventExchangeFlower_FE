import { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../../../../config/api"; // Đường dẫn API
import { AxiosError } from "axios"; // Xử lý lỗi từ Axios

interface ShopFormValues {
    shopName: string;
    shopAddress: string;
}

function ManageShop() {
    const [form] = Form.useForm();

    useEffect(() => {
        fetchShopInfo();
    }, []);

    // Hàm lấy thông tin shop
    const fetchShopInfo = async () => {
        try {
            const response = await api.get<ShopFormValues>("/api/seller/shop");
            form.setFieldsValue(response.data); // Đổ dữ liệu vào form
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                message.error(`Lỗi API: ${axiosError.response.data || 'Không xác định'}`);
            } else {
                message.error("Có lỗi khi tải thông tin shop.");
            }
            console.error("Error:", axiosError); // Log lỗi nếu cần
        }
    };

    // Hàm cập nhật thông tin shop
    const onFinish = async (values: ShopFormValues) => {
        try {
            await api.put("/api/seller/shop", values);
            message.success("Cập nhật thông tin shop thành công!");
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                message.error(`Lỗi API: ${axiosError.response.data || 'Không xác định'}`);
            } else {
                message.error("Có lỗi khi cập nhật shop.");
            }
            console.error("Error:", axiosError); // Log lỗi nếu cần
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Tên Shop" name="shopName" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ Shop" name="shopAddress" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
                Cập nhật Shop
            </Button>
        </Form>
    );
}

export default ManageShop;

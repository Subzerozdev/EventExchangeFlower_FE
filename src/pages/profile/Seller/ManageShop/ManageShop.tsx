import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../../../../config/api";
import { AxiosError } from "axios";

interface ShopFormValues {
    shopName: string;
    shopAddress: string;
    description?: string;
    qrCode?: string;
    shopImage?: string;
}

function ManageShop() {
    const [form] = Form.useForm();
    const [shopInfo, setShopInfo] = useState<ShopFormValues | null>(null);

    useEffect(() => {
        fetchShopInfo();
    }, []);

    // Hàm lấy thông tin shop
    const fetchShopInfo = async () => {
        try {
            const response = await api.get<ShopFormValues>("/api/seller/shop"); // API lấy thông tin shop
            setShopInfo(response.data); // Lưu thông tin vào state shopInfo
            form.setFieldsValue(response.data); // Đổ dữ liệu vào form
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                message.error(`Lỗi API: ${axiosError.response.data || 'Không xác định'}`);
            } else {
                message.error("Có lỗi khi tải thông tin shop.");
            }
            console.error("Error:", axiosError);
        }
    };

    // Hàm cập nhật thông tin shop
    const onFinish = async (values: ShopFormValues) => {
        try {
            await api.put("/api/seller/shop", values); // API cập nhật thông tin shop
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
        <>
            {shopInfo && <div>Shop: {shopInfo.shopName}</div>} {/* Hiển thị thông tin shop nếu cần */}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Tên Shop"
                    name="shopName"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên shop" },
                        { max: 50, message: "Tên shop không được quá 50 ký tự" },
                        {
                            pattern: /^[^0-9!@#$%^&*()_+\-=[\]{};:'"\\|,.<>/?]*$/,
                            message: "Tên shop không được chứa số hoặc ký tự đặc biệt",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ Shop"
                    name="shopAddress"
                    rules={[
                        { required: true, message: "Vui lòng nhập địa chỉ shop" },
                        { max: 100, message: "Địa chỉ shop không được quá 100 ký tự" },

                    ]}
                >
                    <Input />
                </Form.Item>


                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        { max: 100, message: "Mô tả không được quá 100 ký tự" }
                    ]}
                >
                    <Input.TextArea rows={4} placeholder="Mô tả shop của bạn (không bắt buộc)" />
                </Form.Item>


                <Button type="primary" htmlType="submit">
                    Cập nhật Shop
                </Button>
            </Form>
        </>
    );
}

export default ManageShop;

import { useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import api from "../../../../config/api";
import { AxiosError } from "axios";

interface ShopFormValues {
    shopName: string;
    shopAddress: string;
    description?: string;
    bankName: string;   // Tên ngân hàng
    bankNumber: string; // Số tài khoản thụ hưởng
    ownerBank: string;  // Tên chủ tài khoản
}

const vietnameseBanks = [
    { value: "NCB", label: "NCB - Ngân Hàng TMCP Quốc Dân" },
    { value: "Vietcombank", label: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)" },
    { value: "VietinBank", label: "Ngân hàng TMCP Công thương Việt Nam (VietinBank)" },
    { value: "BIDV", label: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)" },
    { value: "Agribank", label: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)" },
    { value: "Sacombank", label: "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)" },
    { value: "Techcombank", label: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)" },
    { value: "ACB", label: "Ngân hàng TMCP Á Châu (ACB)" },
    { value: "MBBank", label: "Ngân hàng TMCP Quân Đội (MBBank)" },
    { value: "VPBank", label: "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)" },
    { value: "HDBank", label: "Ngân hàng TMCP Phát triển Nhà TP.HCM (HDBank)" },
    { value: "Eximbank", label: "Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam (Eximbank)" },
    { value: "SHB", label: "Ngân hàng TMCP Sài Gòn – Hà Nội (SHB)" },
    { value: "TPBank", label: "Ngân hàng TMCP Tiên Phong (TPBank)" },
    { value: "VIB", label: "Ngân hàng TMCP Quốc tế Việt Nam (VIB)" },
    { value: "MSB", label: "Ngân hàng TMCP Hàng Hải Việt Nam (MSB)" },
    { value: "SCB", label: "Ngân hàng TMCP Sài Gòn (SCB)" },
    { value: "SeABank", label: "Ngân hàng TMCP Đông Nam Á (SeABank)" },
    { value: "ABBank", label: "Ngân hàng TMCP An Bình (ABBank)" },
    { value: "BacABank", label: "Ngân hàng TMCP Bắc Á (BacABank)" },
    { value: "OCB", label: "Ngân hàng TMCP Phương Đông (OCB)" },
    { value: "Kienlongbank", label: "Ngân hàng TMCP Kiên Long (Kienlongbank)" },
    { value: "PVcomBank", label: "Ngân hàng TMCP Đại Chúng Việt Nam (PVcomBank)" },
    { value: "Saigonbank", label: "Ngân hàng TMCP Sài Gòn Công Thương (Saigonbank)" },
];

function ManageShop() {
    const [form] = Form.useForm();

    useEffect(() => {
        fetchShopInfo();
    }, []);

    const fetchShopInfo = async () => {
        try {
            const response = await api.get<ShopFormValues>("/api/seller/shop");
            form.setFieldsValue(response.data); // Đổ dữ liệu từ API vào form
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                message.error(`Lỗi API: ${axiosError.response.data || "Không xác định"}`);
            } else {
                message.error("Có lỗi khi tải thông tin shop.");
            }
        }
    };

    const onFinish = async (values: ShopFormValues) => {
        try {
            await api.put("/api/seller/shop", values); // API cập nhật thông tin shop
            message.success("Cập nhật thông tin shop thành công!");
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                message.error(`Lỗi API: ${axiosError.response.data || "Không xác định"}`);
            } else {
                message.error("Có lỗi khi cập nhật shop.");
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
                    Cập nhật Shop
                </Button>
            </Form.Item>
        </Form>
    );
}

export default ManageShop;

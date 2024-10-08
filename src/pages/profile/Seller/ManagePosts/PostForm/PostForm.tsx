import { Form, Input, Button, DatePicker, message } from "antd";
import { useEffect } from "react";
import api from "../../../../../config/api";
import { AxiosError } from "axios";
import moment, { Moment } from "moment"; // Import Moment

interface Post {
    id?: number;
    name: string;
    description: string;
    price: number;
    startDate: string;  // BE trả về kiểu date (chuỗi ISO string)
    endDate: string;    // BE trả về kiểu date (chuỗi ISO string)
    thumbnail?: string;
}

interface FormValues {
    name: string;
    description: string;
    price: number;
    startDate: Moment; // Sử dụng Moment để tương thích với DatePicker
    endDate: Moment;   // Sử dụng Moment để tương thích với DatePicker
}

interface PostFormProps {
    post: Post | null;
    onSuccess: () => void;
}

function PostForm({ post, onSuccess }: PostFormProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (post) {
            form.setFieldsValue({
                ...post,
                // Chuyển đổi từ chuỗi ISO string sang Moment khi đổ dữ liệu vào DatePicker
                startDate: moment(post.startDate),
                endDate: moment(post.endDate),
            });
        }
    }, [post, form]);

    const onFinish = async (values: FormValues) => {
        try {
            const postData = {
                ...values,
                // Chuyển đổi từ Moment sang chuỗi ISO string trước khi gửi lên BE
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
            };

            if (post) {
                // Cập nhật bài đăng
                await api.put(`/api/posts/${post.id}`, postData);
                message.success("Cập nhật bài đăng thành công!");
            } else {
                // Tạo mới bài đăng
                await api.post("/api/posts", postData);
                message.success("Tạo bài đăng mới thành công!");
            }
            onSuccess();
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.data) {
                message.error(`Lỗi xảy ra: ${axiosError.response.data}`);
            } else {
                message.error("Có lỗi xảy ra trong quá trình xử lý.");
            }
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Tiêu đề"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
                <Input type="number" />
            </Form.Item>

            <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {post ? "Cập nhật" : "Tạo mới"}
                </Button>
            </Form.Item>
        </Form>
    );
}

export default PostForm;

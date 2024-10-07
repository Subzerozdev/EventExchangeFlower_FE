import { Form, Input, Button, message } from "antd";
import { useEffect } from "react";
import api from "../../../../../config/api";
import { AxiosError } from "axios"; // Import AxiosError để xử lý lỗi

// Định nghĩa interface Post
interface Post {
    id?: number; // ID là optional, vì khi tạo mới sẽ chưa có id
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
}

// Định nghĩa props cho PostForm
interface PostFormProps {
    post: Post | null; // Nếu post không null thì đang trong chế độ chỉnh sửa
    onSuccess: () => void; // Hàm gọi sau khi thành công
}

function PostForm({ post, onSuccess }: PostFormProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (post) {
            form.setFieldsValue(post); // Đổ dữ liệu bài đăng vào form khi chỉnh sửa
        }
    }, [post, form]);

    const onFinish = async (values: Post) => {
        try {
            if (post) {
                // Chỉnh sửa bài đăng
                await api.put(`/api/seller/post/${post.id}`, values);
                message.success("Cập nhật bài đăng thành công!");
            } else {
                // Tạo bài đăng mới
                await api.post("/api/seller/post", values);
                message.success("Tạo bài đăng mới thành công!");
            }
            onSuccess(); // Gọi hàm onSuccess để đóng modal và cập nhật danh sách
        } catch (error: unknown) {
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
                name="title"
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

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {post ? "Cập nhật" : "Tạo mới"}
                </Button>
            </Form.Item>
        </Form>
    );
}

export default PostForm;

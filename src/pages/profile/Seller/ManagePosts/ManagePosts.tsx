import { Table, Button, Form, Input, message, Modal, DatePicker } from "antd";
import { useEffect, useState } from "react";
import api from "../../../../config/api";
import { AxiosError } from "axios";
import moment from "moment";

// Điều chỉnh kiểu startDate và endDate từ string sang Moment
interface Post {
    id: number;
    name: string;
    description: string;
    price: number;
    address: string;
    startDate: string;  // BE trả về kiểu date (chuỗi ISO string)
    endDate: string;    // BE trả về kiểu date (chuỗi ISO string)
}

function ManagePosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get<Post[]>("/api/seller/posts");
            setPosts(response.data);
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                message.error(`Lỗi API: ${axiosError.response.data || 'Không xác định'}`);
            } else {
                message.error("Có lỗi khi tải bài đăng.");
            }
        }
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        form.setFieldsValue({
            ...post,
            startDate: moment(post.startDate),
            endDate: moment(post.endDate),
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/seller/posts/${id}`);
            message.success("Xóa bài đăng thành công!");
            fetchPosts();
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                message.error(`Lỗi API: ${axiosError.response.data || 'Không xác định'}`);
            } else {
                message.error("Có lỗi khi xóa bài đăng.");
            }
        }
    };

    const handleAddNewPost = () => {
        setEditingPost(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const postData = {
                ...values,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
            };

            if (editingPost) {
                await api.put(`/api/seller/posts/${editingPost.id}`, postData);
                message.success("Cập nhật bài đăng thành công!");
            } else {
                await api.post("/api/seller/posts", postData);
                message.success("Tạo bài đăng mới thành công!");
            }

            setIsModalVisible(false);
            fetchPosts();
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                message.error(`Lỗi API: ${axiosError.response.data || 'Không xác định'}`);
            } else {
                message.error("Có lỗi xảy ra trong quá trình xử lý.");
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: "Tên bài đăng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: unknown, record: Post) => (
                <>
                    <Button onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button onClick={() => handleDelete(record.id)} danger>
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" onClick={handleAddNewPost} style={{ marginBottom: 20 }}>
                Thêm bài đăng mới
            </Button>
            <Table dataSource={posts} columns={columns} rowKey="id" />
            <Modal
                title={editingPost ? "Chỉnh sửa bài đăng" : "Thêm bài đăng mới"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingPost ? "Cập nhật" : "Tạo mới"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên bài đăng"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên bài đăng" }]}
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
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                    >
                        <Input />
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
                </Form>
            </Modal>
        </>
    );
}

export default ManagePosts;

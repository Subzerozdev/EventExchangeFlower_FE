import { Table, Button, Form, Input, message, Modal, DatePicker, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import api from "../../../../config/api";
import moment from "moment";
import { UploadFile } from "antd/lib/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/file"; // Hàm upload lên Firebase

interface Post {
    id: number;
    name: string;
    description: string;
    price: number;
    address: string;
    startDate: string;
    endDate: string;
    category: { id: number; name: string };
    types: { id: number; name: string }[];
    imageUrls: string[];
    thumbnail: string;
}

interface Category {
    id: number;
    name: string;
}

interface Type {
    id: number;
    name: string;
}

function ManagePosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [types, setTypes] = useState<Type[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]); // Khai báo fileList cho imageUrls
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]); // Khai báo fileList cho thumbnail
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchPosts();
        fetchCategories();
        fetchTypes();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get<Post[]>("/api/seller/posts");
            setPosts(response.data);
        } catch {
            message.error("Có lỗi khi tải bài đăng.");
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get<Category[]>("/categories");
            setCategories(response.data);
        } catch {
            message.error("Không thể tải danh sách category.");
        }
    };

    const fetchTypes = async () => {
        try {
            const response = await api.get<Type[]>("/types");
            setTypes(response.data);
        } catch {
            message.error("Không thể tải danh sách type.");
        }
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        form.setFieldsValue({
            ...post,
            startDate: moment(post.startDate),
            endDate: moment(post.endDate),
            category_id: post.category?.id,
            type_id: post.types ? post.types.map((type) => type.id) : [],
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/seller/posts/${id}`);
            message.success("Xóa bài đăng thành công!");
            fetchPosts();
        } catch {
            message.error("Có lỗi khi xóa bài đăng.");
        }
    };

    const handleAddNewPost = () => {
        setEditingPost(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            let thumbnailUrl = ""; // URL của ảnh thumbnail
            const imageUrls: string[] = []; // Mảng chứa URL của các ảnh

            // Nếu có file thumbnail được chọn
            if (thumbnailList.length > 0) {
                const thumbnailFile = thumbnailList[0].originFileObj as File;
                thumbnailUrl = await uploadFile(thumbnailFile); // Upload và lấy URL thumbnail
            }

            // Upload từng ảnh trong fileList cho imageUrls
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i].originFileObj as File;
                const imageUrl = await uploadFile(file);
                imageUrls.push(imageUrl); // Lưu URL ảnh vào mảng
            }

            const values = await form.validateFields();
            const postData = {
                ...values,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                category_id: values.category_id,
                type_id: values.type_id,
                thumbnail: thumbnailUrl, // Gắn URL thumbnail
                imageUrls, // Gắn mảng URL ảnh
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
        } catch {
            message.error("Có lỗi xảy ra trong quá trình xử lý.");
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    // Xử lý khi chọn file upload cho thumbnail
    const handleThumbnailChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setThumbnailList(fileList);
    };

    // Xử lý khi chọn file upload cho imageUrls
    const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
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
                        label="Danh mục"
                        name="category_id"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
                    >
                        <Select placeholder="Chọn danh mục">
                            {categories.map((category) => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Loại"
                        name="type_id"
                        rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                    >
                        <Select mode="multiple" placeholder="Chọn loại">
                            {types.map((type) => (
                                <Select.Option key={type.id} value={type.id}>
                                    {type.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Thêm mục upload thumbnail */}
                    <Form.Item label="Hình ảnh thumbnail" name="thumbnail">
                        <Upload
                            listType="picture"
                            fileList={thumbnailList}
                            onChange={handleThumbnailChange}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Chọn hình ảnh thumbnail</Button>
                        </Upload>
                    </Form.Item>

                    {/* Thêm mục upload các ảnh khác */}
                    <Form.Item label="Hình ảnh bài đăng (tùy chọn)" name="imageUrls">
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                        </Upload>
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

import { Table, Button, Form, Input, message, Modal, DatePicker, Select, Upload, Image, Tag } from "antd";
import { useEffect, useState } from "react";
import api from "../../../../config/api";
import moment from "moment";
import { UploadFile } from "antd/lib/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/file"; // Hàm upload lên Firebase
import "./ManagePost.scss";

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
    status: string; // Thêm trường trạng thái bài đăng
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
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
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
            // Lọc bài đăng không hiển thị status DELETED và SOLD_OUT
            const filteredPosts = response.data.filter(
                post => post.status !== "DELETED" && post.status !== "SOLD_OUT"
            );
            setPosts(filteredPosts);
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
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
            await api.delete(`/api/seller/posts/${id}`);
            message.success("Xóa bài đăng thành công!");
            fetchPosts();
        } catch (error) {
            console.error("Có lỗi khi xóa bài đăng:", error);
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
            let thumbnailUrl = "";
            const imageUrls: string[] = [];

            if (thumbnailList.length > 0) {
                const thumbnailFile = thumbnailList[0].originFileObj as File;
                thumbnailUrl = await uploadFile(thumbnailFile);
            }

            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i].originFileObj as File;
                const imageUrl = await uploadFile(file);
                imageUrls.push(imageUrl);
            }

            const values = await form.validateFields();
            const postData = {
                ...values,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                category_id: values.category_id,
                type_id: values.type_id,
                thumbnail: thumbnailUrl,
                imageUrls,
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

    const handleThumbnailChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setThumbnailList(fileList);
    };

    const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
    };

    const columns = [
        {
            title: "Hình ảnh",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (thumbnail: string) => <Image width={100} src={thumbnail} alt="thumbnail" />,
        },
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
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "";
                let label = "";

                switch (status) {
                    case "PENDING":
                        color = "orange";
                        label = "Chờ duyệt";
                        break;
                    case "APPROVE":
                        color = "green";
                        label = "Đã duyệt";
                        break;
                    case "DISAPPROVE":
                        color = "red";
                        label = "Bị từ chối";
                        break;
                    case "SOLD_OUT":
                        color = "blue";
                        label = "Đã bán hết";
                        break;
                    case "DELETED":
                        color = "grey";
                        label = "Đã xóa";
                        break;
                    default:
                        label = "Không xác định";
                }

                return <Tag color={color}>{label}</Tag>;
            },
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
        <div className="manage-posts-container">
            <Button type="primary" className="add-post-btn" onClick={handleAddNewPost}>
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
        </div>
    );
}

export default ManagePosts;

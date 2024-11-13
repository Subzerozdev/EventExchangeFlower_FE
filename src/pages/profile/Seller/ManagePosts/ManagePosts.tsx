import { Table, Button, Form, Input, message, Modal, DatePicker, Select, Upload, Image, Tag } from "antd";
import { useEffect, useState } from "react";
import api from "../../../../config/api";
import moment from "moment";
import { UploadFile } from "antd/lib/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/file"; // Hàm upload lên Firebase
import "./ManagePost.scss";
import type { ColumnsType } from 'antd/es/table'; // Import kiểu dữ liệu chính xác


interface Post {
    id: number;
    name: string;
    description: string;
    price: number;
    address: string;
    start_date: string;
    end_date: string;
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
            console.log(response);
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
        const [city, ...specificAddressParts] = post.address.split(', ');
        const specificAddress = specificAddressParts.join(', ');


        form.setFieldsValue({
            ...post,
            startDate: moment(post.start_date),
            endDate: moment(post.end_date),
            category_id: post.category?.id,
            type_id: post.types ? post.types.map((type) => type.id) : [],
            city,  // Thành phố
            specificAddress,  // Địa chỉ cụ thể

        });
        setIsModalVisible(true);

        setEditingPost(post);  // Lưu bài đăng đang chỉnh sửa vào state
        setIsModalVisible(true);  // Hiển thị modal chỉnh sửa
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

            for (const fileItem of fileList) {
                const file = fileItem.originFileObj as File;
                const imageUrl = await uploadFile(file);
                imageUrls.push(imageUrl);
            }

            const values = await form.validateFields();

            // Gộp thành một trường địa chỉ đầy đủ
            const fullAddress = `${values.city}, ${values.specificAddress}`;

            const postData = {
                ...values,
                address: fullAddress, // Gộp địa chỉ trước khi gửi lên API
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
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
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
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



    const columns: ColumnsType<Post> = [
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
            filters: [
                { text: "Chờ duyệt", value: "PENDING" },
                { text: "Đã duyệt", value: "APPROVE" },
                { text: "Bị từ chối", value: "DISAPPROVE" },
                { text: "Đã bán hết", value: "SOLD_OUT" },
                // { text: "Đã xóa", value: "DELETED" },
            ],
            onFilter: (value: unknown, record: Post) => {
                return record.status === value as string;
            },


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
                        rules={[{ required: true, message: "Vui lòng nhập tên bài đăng" },
                        { max: 60, message: "Tên bài đăng không được quá 60 ký tự" }

                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description" rules={[{ max: 300, message: "Mô tả không được quá 300 ký tự" }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>


                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            { required: true, message: "Vui lòng nhập giá" },
                            {
                                validator: (_, value) => {
                                    if (!/^\d+$/.test(value)) {
                                        return Promise.reject(new Error("Giá chỉ được chứa các ký tự số và không âm"));
                                    }
                                    if (value < 0) {
                                        return Promise.reject(new Error("Giá không được là số âm"));
                                    }
                                    if (value > 15000000) {
                                        return Promise.reject(new Error("Giá không được vượt quá 15,000,000"));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input />
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

                    <Form.Item label="Địa chỉ" required>
                        <Input.Group compact>
                            <Form.Item
                                name="city"
                                noStyle
                                rules={[{ required: true, message: "Vui lòng chọn thành phố/tỉnh" }]}
                            >
                                <Select placeholder="Chọn thành phố/tỉnh" style={{ width: "30%" }}>
                                    <Select.Option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</Select.Option>
                                    <Select.Option value="Bình Dương">Bình Dương</Select.Option>
                                    <Select.Option value="Long An">Long An</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="specificAddress"
                                noStyle
                                rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" },
                                { max: 100, message: "Địa chỉ cụ thể không được quá 100 ký tự" }
                                ]}
                            >
                                <Input
                                    placeholder="Nhập địa chỉ cụ thể (số nhà, đường, quận...)"
                                    style={{ width: "70%" }}
                                />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>


                    <Form.Item
                        label="Ngày bắt đầu"
                        name="startDate"
                        rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={(current) =>
                                // Chỉ cho phép chọn từ ngày mai trở đi (không bao gồm hôm nay và các ngày trước đó)
                                current && current < moment().startOf("day").add(1, "day")
                            }
                        />
                    </Form.Item>



                    <Form.Item
                        label="Ngày kết thúc"
                        name="endDate"
                        dependencies={['startDate']}
                        rules={[
                            { required: true, message: "Vui lòng chọn ngày kết thúc" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const startDate = getFieldValue('startDate');
                                    if (!value || !startDate) {
                                        return Promise.reject(new Error("Vui lòng chọn ngày bắt đầu trước"));
                                    }
                                    if (value.isSame(startDate, 'day')) {
                                        return Promise.reject(new Error("Ngày kết thúc không được trùng với ngày bắt đầu"));
                                    }
                                    if (value.isBefore(startDate)) {
                                        return Promise.reject(new Error("Ngày kết thúc không được trước ngày bắt đầu"));
                                    }
                                    if (value.isAfter(startDate.clone().add(25, 'days'))) {
                                        return Promise.reject(
                                            new Error("Ngày kết thúc phải trong vòng 25 ngày kể từ ngày bắt đầu")
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={(current) => {
                                const startDate = form.getFieldValue('startDate');
                                // Ngăn không cho chọn ngày trước ngày bắt đầu, trùng ngày bắt đầu, hoặc sau 20 ngày từ ngày bắt đầu
                                return (
                                    current &&
                                    (current <= startDate || current > startDate?.clone().add(20, 'days'))
                                );
                            }}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}

export default ManagePosts;

import { Table, Button, message, Image, Modal } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import "./ReviewPost.scss";

interface Post {
    id: number;
    name: string;
    price: number;
    address: string;
    status: string;
    thumbnail: string;
    imageUrls: { imageUrl: string }[];
    description: string;
    start_date: string;
    end_date: string;
}

function ReviewPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get<{ posts: Post[] }>("/posts");
            const filteredPosts = response.data.posts.filter(
                (post) => post.status !== "DELETED" && post.status !== "DISAPPROVE" && post.status !== "SOLD_OUT"
            );
            setPosts(filteredPosts);
        } catch (error) {
            console.error(error);
            message.error("Có lỗi khi tải bài đăng.");
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await api.put(`/api/admin/posts/${id}/true`);
            message.success("Bài đăng đã được duyệt!");
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === id ? { ...post, status: "APPROVE" } : post
                )
            );
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi duyệt bài đăng.");
        }
    };

    const showRejectConfirm = (id: number) => {
        setSelectedPostId(id);
        setIsModalVisible(true);
    };

    const handleReject = async () => {
        if (selectedPostId === null) return;
        try {
            await api.put(`/api/admin/posts/${selectedPostId}/false`);
            message.success("Bài đăng đã bị từ chối!");
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== selectedPostId)
            );
            setIsModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi từ chối bài đăng.");
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const renderStatus = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Đang xử lý";
            case "APPROVE":
                return "Đã duyệt";
            case "DISAPPROVE":
                return "Từ chối";
            default:
                return "Không xác định";
        }
    };

    const handleNextImage = (postId: number, imageUrls: { imageUrl: string }[]) => {
        setCurrentImageIndexes((prevIndexes) => ({
            ...prevIndexes,
            [postId]: prevIndexes[postId] === imageUrls.length - 1 ? 0 : (prevIndexes[postId] || 0) + 1,
        }));
    };

    const handlePrevImage = (postId: number, imageUrls: { imageUrl: string }[]) => {
        setCurrentImageIndexes((prevIndexes) => ({
            ...prevIndexes,
            [postId]: prevIndexes[postId] === 0 ? imageUrls.length - 1 : (prevIndexes[postId] || 0) - 1,
        }));
    };

    const columns = [
        {
            title: "Hình ảnh",
            key: "images",
            render: (record: Post) => (
                <div className="image-column">
                    <h4>Ảnh bìa</h4>
                    <Image
                        width={140}
                        height={140}
                        src={record.thumbnail}
                        alt="thumbnail"
                        style={{ marginBottom: "10px", borderRadius: "8px" }}
                    />
                    {record.imageUrls.length > 0 && (
                        <div className="manual-gallery">
                            <h4>Các ảnh khác</h4>
                            <Image
                                width={140}
                                height={140}
                                src={record.imageUrls[currentImageIndexes[record.id] || 0]?.imageUrl || record.thumbnail}
                                alt={`image-${currentImageIndexes[record.id] || 0}`}
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                            <div className="gallery-controls">
                                <Button
                                    size="small"
                                    onClick={() => handlePrevImage(record.id, record.imageUrls)}
                                >
                                    Trước
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => handleNextImage(record.id, record.imageUrls)}
                                >
                                    Tiếp
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ),
        },
        { title: "Tên bài đăng", dataIndex: "name", key: "name" },
        { title: "Mô tả", dataIndex: "description", key: "description" },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price: number) => (
                <div className="price-column">
                    {price.toLocaleString()} <span className="currency">đ</span>
                </div>
            ),
        },
        { title: "Địa chỉ", dataIndex: "address", key: "address" },
        { title: "Ngày bắt đầu", dataIndex: "start_date", key: "start_date" },
        { title: "Ngày kết thúc", dataIndex: "end_date", key: "end_date" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => renderStatus(status),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: unknown, record: Post) => (
                <div className="action-buttons">
                    <Button
                        type="primary"
                        onClick={() => handleApprove(record.id)}
                        disabled={record.status === "APPROVE"}
                    >
                        Duyệt
                    </Button>
                    <Button
                        danger
                        onClick={() => showRejectConfirm(record.id)}
                        disabled={record.status === "DISAPPROVE"}
                    >
                        Từ chối
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="review-posts-container">
            <h2>Quản lý duyệt bài đăng</h2>
            <Table
                dataSource={posts}
                columns={columns}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1000 }}
                rowKey="id"
                tableLayout="fixed"
            />
            <Modal
                title="Xác nhận từ chối"
                open={isModalVisible}
                onOk={handleReject}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn từ chối bài đăng này không?</p>
            </Modal>
        </div>
    );
}

export default ReviewPosts;

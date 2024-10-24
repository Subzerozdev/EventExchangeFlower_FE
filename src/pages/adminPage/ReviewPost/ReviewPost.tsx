import { Table, Button, message, Image, Carousel, Modal } from "antd";
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

    useEffect(() => {
        fetchPosts();
    }, []);

    // Fetch posts from API and filter out the rejected or deleted ones
    const fetchPosts = async () => {
        try {
            const response = await api.get<{ posts: Post[] }>("/posts");
            const filteredPosts = response.data.posts.filter(
                (post) => post.status !== "DELETED" && post.status !== "DISAPPROVE"
            );
            setPosts(filteredPosts);
        } catch (error) {
            console.error(error);
            message.error("Có lỗi khi tải bài đăng.");
        }
    };

    // Handle approving a post
    const handleApprove = async (id: number) => {
        try {
            await api.put(`/api/admin/posts/${id}/true`);
            message.success("Bài đăng đã được duyệt!");

            // Update the post status locally
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

    // Show confirmation modal for rejecting a post
    const showRejectConfirm = (id: number) => {
        setSelectedPostId(id);
        setIsModalVisible(true);
    };

    // Handle rejecting a post and remove it from the list
    const handleReject = async () => {
        if (selectedPostId === null) return;
        try {
            await api.put(`/api/admin/posts/${selectedPostId}/false`);
            message.success("Bài đăng đã bị từ chối!");

            // Remove the rejected post from the list
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== selectedPostId)
            );

            setIsModalVisible(false); // Close the modal after rejecting
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi từ chối bài đăng.");
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Close the modal when cancelled
    };

    // Render status text based on status value
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

    // Define table columns
    const columns = [
        {
            title: "Hình ảnh",
            key: "images",
            render: (record: Post) => (
                <div className="image-column">
                    <h4>Ảnh bìa</h4>
                    <Image
                        width={180}
                        height={180}
                        src={record.thumbnail}
                        alt="thumbnail"
                        style={{ marginBottom: "10px", borderRadius: "8px" }}
                    />
                    {record.imageUrls.length > 0 && (
                        <div className="carousel-container">
                            <h4>Các ảnh khác</h4>
                            <Carousel
                                autoplay
                                dots
                                style={{ maxWidth: "300px", margin: "0 auto" }}
                                adaptiveHeight
                            >
                                {record.imageUrls.map((img, index) => (
                                    <div key={index} className="carousel-image">
                                        <Image
                                            width={250}
                                            height={180}
                                            src={img.imageUrl}
                                            alt={`image-${index}`}
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                ))}
                            </Carousel>
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
            <Table dataSource={posts} columns={columns} rowKey="id" />

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

import { Table, Button, message, Image, Carousel } from "antd";
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

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get<{ posts: Post[] }>("/posts");
            const filteredPosts = response.data.posts.filter(
                (post) => post.status !== "DELETED"
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

    const handleReject = async (id: number) => {
        try {
            await api.put(`/api/admin/posts/${id}/false`);
            message.success("Bài đăng đã bị từ chối!");
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi từ chối bài đăng.");
        }
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
                                dots={true}
                                style={{ maxWidth: "250px", margin: "0 auto" }}
                            >
                                {record.imageUrls.map((img, index) => (
                                    <div key={index} className="carousel-image">
                                        <Image
                                            width={250}
                                            height={180}
                                            src={img.imageUrl}
                                            alt={`image-${index}`}
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
            render: (price: number) => `${price.toLocaleString()} đ`,
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
                <>
                    <Button
                        type="primary"
                        onClick={() => handleApprove(record.id)}
                        disabled={record.status === "APPROVE"}
                    >
                        Duyệt
                    </Button>
                    <Button
                        danger
                        onClick={() => handleReject(record.id)}
                        style={{ marginLeft: 10 }}
                        disabled={record.status === "DISAPPROVE"}
                    >
                        Từ chối
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className="review-posts-container">
            <h2>Quản lý duyệt bài đăng</h2>
            <Table dataSource={posts} columns={columns} rowKey="id" />
        </div>
    );
}

export default ReviewPosts;

import { Table, Button, message, Image } from "antd"; // Thêm Image từ Ant Design
import { useEffect, useState } from "react";
import api from "../../../config/api";
import './ReviewPost.scss';
interface Post {
    id: number;
    name: string;
    price: number;
    address: string;
    status: string; // Trạng thái là string
    thumbnail: string; // Thêm thuộc tính thumbnail để hiển thị hình ảnh
}

function ReviewPosts() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    // Hàm để lấy tất cả các bài đăng với API mới
    const fetchPosts = async () => {
        try {
            const response = await api.get<{ posts: Post[] }>(
                "/posts?categoryID=&sort=&pageNumber="
            );
            console.log(response.data.posts); // Kiểm tra dữ liệu nhận được từ API
            setPosts(response.data.posts); // Cập nhật danh sách bài đăng trong state
        } catch (error) {
            console.error(error);
            message.error("Có lỗi khi tải bài đăng.");
        }
    };

    // Duyệt bài đăng (status = APPROVE)
    const handleApprove = async (id: number) => {
        try {
            await api.put(`/api/admin/posts/${id}/true`);
            message.success("Bài đăng đã được duyệt!");
            fetchPosts(); // Cập nhật danh sách sau khi duyệt
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi duyệt bài đăng.");
        }
    };

    // Từ chối bài đăng (status = DISAPPROVE)
    const handleReject = async (id: number) => {
        try {
            await api.put(`/api/admin/posts/${id}/false`);
            message.success("Bài đăng đã bị từ chối!");
            fetchPosts(); // Cập nhật danh sách sau khi từ chối
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi từ chối bài đăng.");
        }
    };

    // Hàm render trạng thái dựa trên string status
    const renderStatus = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Đang xử lý";
            case "APPROVE":
                return "Đã duyệt";
            case "DISAPPROVE":
                return "Từ chối";
            case "SOLD_OUT":
                return "Đã bán";
            default:
                return "Không xác định";
        }
    };

    // Cấu trúc của bảng hiển thị bài đăng
    const columns = [
        {
            title: "Hình ảnh",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (thumbnail: string) => (
                <Image.PreviewGroup>
                    <Image width={120} height={120} src={thumbnail} alt="thumbnail" />
                </Image.PreviewGroup>
            ),
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
            render: (status: string) => renderStatus(status), // Hiển thị trạng thái với renderStatus
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: unknown, record: Post) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => handleApprove(record.id)}
                        disabled={record.status === "APPROVE"} // Disable button nếu đã duyệt
                    >
                        Duyệt
                    </Button>
                    <Button
                        danger
                        onClick={() => handleReject(record.id)}
                        style={{ marginLeft: 10 }}
                        disabled={record.status === "DISAPPROVE"} // Disable button nếu đã từ chối
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

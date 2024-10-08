import { Table, Button, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../../../config/api";
import { AxiosError } from "axios";
import PostForm from "./PostForm/PostForm";


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

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get<Post[]>("/api/posts");
            // Không cần chuyển đổi chuỗi date, vì DatePicker sẽ tự động nhận Moment khi đổ dữ liệu
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
            <Table dataSource={posts} columns={columns} rowKey="id" />
            {editingPost && (
                <PostForm
                    post={editingPost}
                    onSuccess={() => {
                        fetchPosts();
                        setEditingPost(null);
                    }}
                />
            )}
        </>
    );
}

export default ManagePosts;

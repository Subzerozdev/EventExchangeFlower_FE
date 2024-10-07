import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import api from "../../../../config/api"; // Đường dẫn API đúng
import { AxiosError } from "axios"; // Import để xử lý lỗi

interface Post {
    id: number;
    title: string;
}

function ManagePosts() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    // Hàm lấy danh sách bài đăng
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
            console.error("Error:", axiosError); 
        }
    };

 
    const handleEdit = (id: number) => {
        console.log(`Chỉnh sửa bài đăng với ID: ${id}`);
     
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
            console.error("Error:", axiosError);
        }
    };

    // Khai báo cột với kiểu cụ thể
    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Hành động",
            render: (_: unknown, record: Post) => ( // Thay thế `any` bằng `unknown` và `Post`
                <>
                    <Button onClick={() => handleEdit(record.id)}>Sửa</Button>
                    <Button onClick={() => handleDelete(record.id)} danger>
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return <Table dataSource={posts} columns={columns} rowKey="id" />;
}

export default ManagePosts;

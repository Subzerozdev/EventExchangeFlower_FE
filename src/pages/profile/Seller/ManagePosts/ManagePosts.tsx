import { useEffect, useState } from "react";
import { Table, Button, message, Modal } from "antd";
import api from "../../../../config/api"; // Đảm bảo đường dẫn đúng
import { AxiosError } from "axios";
import PostForm from "./PostForm/PostForm"; // Component Form dùng để tạo và chỉnh sửa bài đăng

interface Post {
  id: number;
  title: string;
  description: string;
  price: number;
}

function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null); // Chỉnh sửa bài đăng
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchPosts(); // Gọi hàm lấy dữ liệu bài đăng khi component được mount
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

  // Hàm chỉnh sửa bài đăng
  const handleEdit = (post: Post) => {
    setEditingPost(post); // Mở form chỉnh sửa với dữ liệu bài đăng
    setIsModalVisible(true);
  };

  // Hàm xóa bài đăng
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa bài đăng này?",
      onOk: async () => {
        try {
          await api.delete(`/api/seller/posts/${id}`);
          message.success("Xóa bài đăng thành công!");
          fetchPosts(); // Tải lại danh sách bài đăng sau khi xóa
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            message.error(`Lỗi API: ${axiosError.response.data || 'Không xác định'}`);
          } else {
            message.error("Có lỗi khi xóa bài đăng.");
          }
        }
      },
    });
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Hành động",
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
      <Button type="primary" onClick={() => setIsModalVisible(true)}>Tạo bài đăng mới</Button>
      <Table dataSource={posts} columns={columns} rowKey="id" />

      <Modal
        title={editingPost ? "Chỉnh sửa bài đăng" : "Tạo bài đăng mới"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPost(null); // Reset bài đăng khi đóng modal
        }}
        footer={null}
      >
        <PostForm
          post={editingPost} // Truyền bài đăng vào form để chỉnh sửa
          onSuccess={() => {
            setIsModalVisible(false);
            setEditingPost(null);
            fetchPosts(); // Cập nhật danh sách bài đăng sau khi thành công
          }}
        />
      </Modal>
    </>
  );
}

export default ManagePosts;

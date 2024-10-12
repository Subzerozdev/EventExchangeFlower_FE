import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api"; // Import api để xử lý HTTP requests
import { useUser } from "../../../context/UserContext"; // Để kiểm tra quyền admin
import { useEffect, useState } from "react";
import { AxiosError } from "axios"; // Import AxiosError để xử lý lỗi từ API
import './add-category.scss';

interface Category {
  id: number;
  name: string;
}

interface CategoryFormValues {
  name: string;
}

function AddCategory() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role !== "ROLE_ADMIN") {
      message.error("Bạn không có quyền truy cập!");
      navigate("/");
    } else {
      fetchCategories(); // Lấy danh sách categories khi vào trang
    }
  }, [user, navigate]);

  // Hàm lấy danh sách categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err) {
      message.error("Không thể tải danh sách categories.");
      console.error(err); // Ghi log lỗi (nếu cần)
    }
  };

  // Tạo mới category
  const onFinish = async (values: CategoryFormValues) => {
    try {
      const response = await api.post("/api/admin/categories", values);
      if (response.status === 200) {
        message.success("Tạo category thành công!");
        fetchCategories(); // Tải lại danh sách categories sau khi tạo
      } else {
        message.error("Tạo category thất bại.");
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        message.error(`API Error: ${'Unknown error'}`);
      } else {
        message.error("Có lỗi xảy ra khi tạo category.");
      }
      console.error("Error:", error);
    }
  };

  // Cập nhật category
  const updateCategory = async (id: number, values: CategoryFormValues) => {
    try {
      const response = await api.put(`/api/admin/categories/${id}`, values);
      if (response.status === 200) {
        message.success("Cập nhật category thành công!");
        setEditCategoryId(null); // Đặt lại trạng thái chỉnh sửa
        fetchCategories(); // Tải lại danh sách categories sau khi cập nhật
      } else {
        message.error("Cập nhật category thất bại.");
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        message.error(`API Error: ${'Unknown error'}`);
      } else {
        message.error("Có lỗi xảy ra khi cập nhật category.");
      }
      console.error("Error:", error);
    }
  };

  // Xóa category
  const deleteCategory = async (id: number) => {
    try {
      const response = await api.delete(`/api/admin/categories/${id}`);
      if (response.status === 200) {
        message.success("Xóa category thành công!");
        fetchCategories(); // Tải lại danh sách categories sau khi xóa
      } else {
        message.error("Xóa category thất bại.");
      }
    } catch (err) {
      message.error("Có lỗi khi xóa category.");
      console.error(err);
    }
  };

  return (
    <div className="add-category">
      <h1>Quản lý Categories</h1>

      <Form
        name="add-category"
        onFinish={editCategoryId === null ? onFinish : (values) => updateCategory(editCategoryId, values)}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên category!" }]}
        >
          <Input placeholder="Tên Category" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={editCategoryId === null ? 'add-category-btn' : 'edit-category-btn'}
          >
            {editCategoryId === null ? "Thêm Category" : "Cập nhật Category"}
          </Button>
        </Form.Item>
      </Form>

      <ul>
        {categories.map((category: Category) => (
          <li key={category.id}>
            {category.name}
            <Button
              type="link"
              onClick={() => setEditCategoryId(category.id)} // Thiết lập ID để chỉnh sửa
            >
              Sửa
            </Button>
            <Button type="link" onClick={() => deleteCategory(category.id)} danger>
              Xóa
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddCategory;

import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { useUser } from "../../../context/UserContext";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import "./add-category.scss";

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
      fetchCategories();
    }
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err) {
      message.error("Không thể tải danh sách categories.");
      console.error(err);
    }
  };

  const handleAddCategory = async (values: CategoryFormValues) => {
    try {
      const response = await api.post("/api/admin/categories", values);
      if (response.status === 200) {
        message.success("Tạo category thành công!");
        fetchCategories();
      }
    } catch (err) {
      const error = err as AxiosError;
      message.error("Có lỗi xảy ra khi tạo category.");
      console.error("Error:", error);
    }
  };

  const handleUpdateCategory = async (values: CategoryFormValues) => {
    if (editCategoryId === null) return;
    try {
      const response = await api.put(
        `/api/admin/categories/${editCategoryId}`,
        values
      );
      if (response.status === 200) {
        message.success("Cập nhật category thành công!");
        setEditCategoryId(null);
        fetchCategories();
      }
    } catch (err) {
      const error = err as AxiosError;
      message.error("Có lỗi xảy ra khi cập nhật category.");
      console.error("Error:", error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const response = await api.delete(`/api/admin/categories/${id}`);
      if (response.status === 200) {
        message.success("Xóa category thành công!");
        fetchCategories();
      }
    } catch (err) {
      message.error("Có lỗi khi xóa category.");
      console.error(err);
    }
  };

  return (
    <div className="add-category">
      <h1>Quản lý doanh mục</h1>

      <Form
        name="add-category"
        onFinish={handleAddCategory}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên category!" }]}
        >
          <Input placeholder="Tên Category" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="add-category-btn">
            Thêm danh mục
          </Button>
        </Form.Item>
      </Form>

      <ul>
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            {editCategoryId === category.id ? (
              <Form
                name="edit-category"
                onFinish={handleUpdateCategory}
                initialValues={{ name: category.name }}
                autoComplete="off"
                layout="inline" // Đảm bảo các phần tử trong cùng 1 hàng
                className="category-edit-form"
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
                    className="edit-category-btn"
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <div className="category-row">
                <span className="category-name">{category.name}</span>
                <div className="category-actions">
                  <Button
                    type="link"
                    onClick={() => setEditCategoryId(category.id)}
                  >
                    Sửa
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => deleteCategory(category.id)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>


    </div>
  );
}

export default AddCategory;

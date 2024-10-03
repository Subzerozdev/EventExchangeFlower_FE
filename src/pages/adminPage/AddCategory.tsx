import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/api"; // Import api để xử lý HTTP requests
import { useUser } from "../../context/UserContext"; // Để kiểm tra quyền admin
import { useEffect } from "react";

interface CategoryFormValues {
  name: string;
}

function AddCategory() {
  const navigate = useNavigate();
  const { user } = useUser();


  useEffect(() => {
    if (user?.role !== "ROLE_ADMIN") {
      message.error("Bạn không có quyền truy cập!");
      navigate("/");
    }
  }, [user, navigate]);

  const onFinish = async (values: CategoryFormValues) => {
    try {
      // Gọi API tạo category mới
      const response = await api.post("/api/categories", values);

      if (response.status === 200) {
        message.success("Category created successfully!");
        navigate("/admin"); // Điều hướng về trang admin sau khi thành công
      } else {
        message.error("Failed to create category.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo category.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="add-category">
      <h1>Thêm Category mới</h1>
      <Form name="add-category" onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên category!" }]}
        >
          <Input placeholder="Tên Category" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm Category
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddCategory;

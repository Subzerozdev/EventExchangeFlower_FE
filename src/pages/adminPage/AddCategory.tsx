import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/api"; // Import api để xử lý HTTP requests
import { useUser } from "../../context/UserContext"; // Để kiểm tra quyền admin
import { useEffect } from "react";
import { AxiosError } from "axios"; // Import AxiosError để xử lý lỗi từ API

interface CategoryFormValues {
  name: string;
}

function AddCategory() {
  const navigate = useNavigate();
  const { user } = useUser();

  // Kiểm tra quyền admin khi trang được tải
  useEffect(() => {
    if (user?.role !== "ROLE_ADMIN") {
      message.error("Bạn không có quyền truy cập!"); // Hiển thị thông báo lỗi nếu không phải admin
      navigate("/"); // Điều hướng về trang chủ nếu không phải admin
    }
  }, [user, navigate]);

  // Xử lý logic khi form được gửi
  const onFinish = async (values: CategoryFormValues) => {
    try {
      // Gửi yêu cầu tạo category mới đến API
      const response = await api.post("/api/admin/categories", values);

      if (response.status === 200) {
        message.success("Category created successfully!");
        navigate("/admin");
      } else {
        message.error("Failed to create category.");
      }
    } catch (err) {
      const error = err as AxiosError; // Ép kiểu lỗi thành AxiosError

      // Xử lý lỗi
      if (error.response) {
        // Nếu có phản hồi từ API
        message.error(`API Error: ${'Unknown error'}`);
        // message.error(`API Error: ${error.response.data.message || 'Unknown error'}`);
      } else {
        // Nếu lỗi không phải từ API
        message.error("Có lỗi xảy ra khi tạo category.");
      }
      console.error("Error:", error); // Ghi lại lỗi để debug
    }
  };

  // Nếu không phải admin, không render form
  if (user?.role !== "ROLE_ADMIN") {
    return null;
  }

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

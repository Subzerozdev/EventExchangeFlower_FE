import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api"; // Import api để xử lý HTTP requests
import { useUser } from "../../../context/UserContext"; // Để kiểm tra quyền admin
import { useEffect, useState } from "react";
import { AxiosError } from "axios"; // Import AxiosError để xử lý lỗi từ API
import './add-type.scss'; // Tạo file style riêng

// Interface cho Type
interface Type {
  id: number;
  name: string;
}

// Interface cho giá trị của form
interface TypeFormValues {
  name: string;
}

function AddType() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [types, setTypes] = useState<Type[]>([]); // State lưu danh sách types
  const [editTypeId, setEditTypeId] = useState<number | null>(null); // State lưu trạng thái chỉnh sửa

  // Kiểm tra quyền truy cập admin
  useEffect(() => {
    if (user?.role !== "ROLE_ADMIN") {
      message.error("Bạn không có quyền truy cập!");
      navigate("/");
    } else {
      fetchTypes(); // Lấy danh sách types khi vào trang
    }
  }, [user, navigate]);

  // Hàm lấy danh sách types
  const fetchTypes = async () => {
    try {
      const response = await api.get("/api/admin/types?page=0&limit=10"); // API call để lấy danh sách types
      setTypes(response.data); // Cập nhật state với dữ liệu từ API
    } catch (err) {
      message.error("Không thể tải danh sách types.");
      console.error("Lỗi khi lấy types: ", err);
    }
  };

  // Tạo mới type
  const onFinish = async (values: TypeFormValues) => {
    try {
      const response = await api.post("/api/admin/types", values); // API call để tạo mới type
      if (response.status === 200) {
        message.success("Tạo type thành công!");
        fetchTypes(); // Tải lại danh sách types sau khi tạo
      } else {
        message.error("Tạo type thất bại.");
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        message.error(`Lỗi API: ${'Unknown error'}`);
      } else {
        message.error("Có lỗi xảy ra khi tạo type.");
      }
      console.error("Lỗi khi tạo type: ", error);
    }
  };

  // Cập nhật type
  const updateType = async (id: number, values: TypeFormValues) => {
    try {
      const response = await api.put(`/api/admin/types/${id}`, values); // API call để cập nhật type
      if (response.status === 200) {
        message.success("Cập nhật type thành công!");
        setEditTypeId(null); // Đặt lại trạng thái chỉnh sửa
        fetchTypes(); // Tải lại danh sách types sau khi cập nhật
      } else {
        message.error("Cập nhật type thất bại.");
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        message.error(`Lỗi API: ${'Unknown error'}`);
      } else {
        message.error("Có lỗi xảy ra khi cập nhật type.");
      }
      console.error("Lỗi khi cập nhật type: ", error);
    }
  };

  // Xóa type
  const deleteType = async (id: number) => {
    try {
      const response = await api.delete(`/api/admin/types/${id}`); // API call để xóa type
      if (response.status === 200) {
        message.success("Xóa type thành công!");
        fetchTypes(); // Tải lại danh sách types sau khi xóa
      } else {
        message.error("Xóa type thất bại.");
      }
    } catch (err) {
      message.error("Có lỗi khi xóa type.");
      console.error("Lỗi khi xóa type: ", err);
    }
  };

  return (
    <div className="add-type">
      <h1>Quản lý Types</h1>

      {/* Form để thêm hoặc chỉnh sửa type */}
      <Form
        name="add-type"
        onFinish={editTypeId === null ? onFinish : (values) => updateType(editTypeId, values)}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên type!" }]}
        >
          <Input placeholder="Tên Type" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editTypeId === null ? "Thêm Type" : "Cập nhật Type"}
          </Button>
        </Form.Item>
      </Form>

      {/* Hiển thị danh sách types */}
      <ul>
        {types.length > 0 ? (
          types.map((type: Type) => (
            <li key={type.id}>
              {type.name}
              <Button
                type="link"
                onClick={() => setEditTypeId(type.id)} // Thiết lập ID để chỉnh sửa
              >
                Sửa
              </Button>
              <Button type="link" onClick={() => deleteType(type.id)} danger>
                Xóa
              </Button>
            </li>
          ))
        ) : (
          <p>Không có type nào được tìm thấy.</p>
        )}
      </ul>
    </div>
  );
}

export default AddType;

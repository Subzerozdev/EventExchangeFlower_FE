import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api"; // Import api để xử lý HTTP requests
import { useUser } from "../../../context/UserContext"; // Để kiểm tra quyền admin
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import "./add-type.scss"; // SCSS riêng cho Type

interface Type {
  id: number;
  name: string;
}

interface TypeFormValues {
  name: string;
}

function AddType() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [types, setTypes] = useState<Type[]>([]);
  const [editTypeId, setEditTypeId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role !== "ROLE_ADMIN") {
      message.error("Bạn không có quyền truy cập!");
      navigate("/");
    } else {
      fetchTypes();
    }
  }, [user, navigate]);

  const fetchTypes = async () => {
    try {
      const response = await api.get("/types");
      setTypes(response.data);
    } catch (err) {
      message.error("Không thể tải danh sách types.");
      console.error("Lỗi khi lấy types: ", err);
    }
  };

  const handleAddType = async (values: TypeFormValues) => {
    try {
      const response = await api.post("/api/admin/types", values);
      if (response.status === 200) {
        message.success("Tạo type thành công!");
        fetchTypes();
      }
    } catch (err) {
      const error = err as AxiosError;
      message.error("Có lỗi xảy ra khi tạo type.");
      console.error("Lỗi khi tạo type: ", error);
    }
  };

  const handleUpdateType = async (values: TypeFormValues) => {
    if (editTypeId === null) return;
    try {
      const response = await api.put(`/api/admin/types/${editTypeId}`, values);
      if (response.status === 200) {
        message.success("Cập nhật type thành công!");
        setEditTypeId(null);
        fetchTypes();
      }
    } catch (err) {
      const error = err as AxiosError;
      message.error("Có lỗi xảy ra khi cập nhật type.");
      console.error("Lỗi khi cập nhật type: ", error);
    }
  };

  const deleteType = async (id: number) => {
    try {
      const response = await api.delete(`/api/admin/types/${id}`);
      if (response.status === 200) {
        message.success("Xóa type thành công!");
        fetchTypes();
      }
    } catch (err) {
      message.error("Có lỗi khi xóa type.");
      console.error("Lỗi khi xóa type: ", err);
    }
  };

  return (
    <div className="add-type">
      <h1>Quản lý Phân Loại</h1>

      <Form
        name="add-type"
        onFinish={handleAddType}
        autoComplete="off"
        layout="inline"
        className="add-type-form"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên type!" },
          { max: 50, message: "Tên type không được quá 50 ký tự" },
          {
            pattern: /^[\p{L}\s]+$/u,
            message: "Tên type chỉ được chứa chữ cái và khoảng trắng",
          },

          ]}
        >
          <Input placeholder="Tên Type" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm Type
          </Button>
        </Form.Item>
      </Form>

      <ul>
        {types.map((type) => (
          <li key={type.id} className="type-item">
            {editTypeId === type.id ? (
              <Form
                name="edit-type"
                onFinish={handleUpdateType}
                initialValues={{ name: type.name }}
                autoComplete="off"
                layout="inline"
                className="edit-type-form"
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên type!" },
                  { max: 50, message: "Tên type không được quá 50 ký tự" },
                  {
                    pattern: /^[\p{L}\s]+$/u,
                    message: "Tên type chỉ được chứa chữ cái và khoảng trắng",
                  },]}
                >
                  <Input placeholder="Tên Type" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="edit-type-btn">
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <>
                <span className="type-name">{type.name}</span>
                <div className="type-actions">
                  <Button type="link" onClick={() => setEditTypeId(type.id)}>
                    Sửa
                  </Button>
                  <Button type="link" danger onClick={() => deleteType(type.id)}>
                    Xóa
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddType;

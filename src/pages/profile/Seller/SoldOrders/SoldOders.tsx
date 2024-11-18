import { useEffect, useState } from "react";
import { Table, Tag, Button, message, Modal, Upload, UploadFile, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import "./SoldOrders.scss"; // Import SCSS
import api from "../../../../config/api";
import uploadFile from "../../../../utils/file"; // Hàm upload file lên Firebase

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface OrderRecord {
    id: number;
    fullName: string;
    status: string;
    totalMoney: number;
    phoneNumber?: string;
    email?: string;
    address?: string;
    note?: string;
    orderDate?: string;
    validationImage: string;
}



const SoldOrders = () => {
    const [orders, setOrders] = useState<OrderRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const navigate = useNavigate();

    // Lấy danh sách đơn hàng đã bán từ API
    const fetchSoldOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get<OrderRecord[]>("/api/seller/orders", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setOrders(response.data);
            message.success("Tải danh sách đơn hàng thành công!");
        } catch (error) {
            console.error("Lỗi:", error);
            message.error("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSoldOrders();
    }, []);

    const handleViewOrderDetails = (orderId: number) => {
        navigate(`/seller/sold-orders/${orderId}`);
    };

    const handleCompleteOrder = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsModalVisible(true);
    };

    const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
    };

    const handleModalOk = async () => {
        if (!fileList.length) {
            message.error("Vui lòng upload ảnh xác nhận trước khi tiếp tục.");
            return;
        }

        try {
            const uploadedFile = fileList[0].originFileObj as File;
            const imageUrl = await uploadFile(uploadedFile); // Nhận URL ảnh từ Firebase

            // Gửi URL ảnh qua API để lưu trong cơ sở dữ liệu
            await api.put(
                `/api/seller/orders/${selectedOrderId}`,
                { image: imageUrl },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            message.success("Cập nhật trạng thái thành công!");
            setIsModalVisible(false);
            setFileList([]);
            fetchSoldOrders();
        } catch (error) {
            console.error("Lỗi khi upload ảnh hoặc cập nhật trạng thái:", error);
            message.error("Không thể cập nhật trạng thái đơn hàng.");
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setFileList([]);
    };

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Khách hàng",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalMoney",
            key: "totalMoney",
            render: (total: number) => (
                <span className="currency">
                    {total.toLocaleString("vi-VN")} <span className="currency-symbol">đ</span>
                </span>
            ),
        },
        {
            title: "Ảnh xác minh",
            dataIndex: "validationImage",
            key: "validationImage",
            render: (image: string | undefined) => (
                image ? (
                    <Image
                        src={image}
                        alt="Ảnh xác minh"
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: "8px",
                            objectFit: "cover",
                        }}
                        preview={{ mask: <span>Xem ảnh</span> }}
                    />
                ) : (
                    <span>Không có ảnh</span>
                )
            ),
        },

        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const color =
                    status === "COMPLETED" ? "green" : status === "CANCELLED" ? "red" : "blue";
                const label =
                    status === "COMPLETED"
                        ? "Hoàn thành"
                        : status === "CANCELLED"
                            ? "Đã hủy"
                            : "Đang xử lý";
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: "Hành động",
            key: "action",
            render: (record: OrderRecord) => (
                <div className="action-buttons">
                    <Button
                        type="primary"
                        onClick={() => handleCompleteOrder(record.id)}
                        disabled={record.status === "COMPLETED"}
                    >
                        Đã giao thành công
                    </Button>
                    <Button type="link" onClick={() => handleViewOrderDetails(record.id)}>
                        Xem chi tiết
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="sold-orders-container">
            <h2>Quản lý đơn hàng đã bán</h2>
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title="Xác nhận giao hàng thành công"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                {selectedOrderId && (
                    <>
                        <p>Ảnh xác minh hiện tại:</p>
                        {orders.find((order) => order.id === selectedOrderId)?.validationImage ? (
                            <Image
                                src={
                                    orders.find((order) => order.id === selectedOrderId)?.validationImage
                                }
                                alt="Ảnh xác minh hiện tại"
                                style={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: "8px",
                                    objectFit: "cover",
                                }}
                                preview // Kích hoạt chế độ xem trước
                            />
                        ) : (
                            <p>Không có ảnh xác minh hiện tại.</p>
                        )}
                    </>
                )}
                <p>Vui lòng upload ảnh mới làm bằng chứng giao hàng thành công.</p>
                <Upload
                    listType="picture"
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false} // Không tự động upload
                >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
            </Modal>
        </div>
    );
};

export default SoldOrders;

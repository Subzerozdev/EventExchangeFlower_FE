import { useEffect, useState } from "react";
import { Table, Tag, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import './SoldOrders.scss'; // Import SCSS

import api from "../../../../config/api";

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface OrderRecord {
    id: number;
    fullName: string;
    status: string;
    totalAmount?: number;
}

// Định nghĩa kiểu dữ liệu cho chi tiết đơn hàng
interface OrderDetail {
    id: number;
    numberOfProducts: number;
    totalMoney: number;
    post: {
        id: number;
        name: string;
        price: number;
    };
}

// Map trạng thái đơn hàng
const statusMapping: { [key: string]: boolean } = {
    COMPLETED: true,
    CANCELLED: false,
};

const SoldOrders = () => {
    const [orders, setOrders] = useState<OrderRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate(); // Điều hướng

    // Lấy chi tiết đơn hàng và tính tổng tiền
    const fetchOrderDetails = async (orderId: number): Promise<number> => {
        try {
            const response = await api.get<OrderDetail[]>(`/api/orders/${orderId}`);
            return response.data.reduce((total, detail) => total + detail.totalMoney, 0);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            return 0;
        }
    };

    // Lấy danh sách đơn hàng đã bán và tính tổng tiền
    const fetchSoldOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get<OrderRecord[]>("/api/seller/orders", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            const ordersWithTotal = await Promise.all(
                response.data.map(async (order) => {
                    const totalAmount = await fetchOrderDetails(order.id);
                    return { ...order, totalAmount };
                })
            );

            setOrders(ordersWithTotal);
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

    const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            await api.put(
                `/api/seller/orders/${orderId}/${statusMapping[newStatus]}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            message.success("Cập nhật trạng thái thành công!");
            fetchSoldOrders();
        } catch (error) {
            console.error("Lỗi:", error);
            message.error("Cập nhật trạng thái thất bại.");
        }
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
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (total?: number) =>
                total !== undefined ? (
                    <span className="currency">
                        {total.toLocaleString("vi-VN")} <span className="currency-symbol">đ</span>
                    </span>
                ) : (
                    "Chưa có tổng tiền"
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
                        onClick={() => handleUpdateOrderStatus(record.id, "COMPLETED")}
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
        </div>
    );
};

export default SoldOrders;

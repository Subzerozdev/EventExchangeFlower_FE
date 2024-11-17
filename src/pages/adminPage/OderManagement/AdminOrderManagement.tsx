import React, { useEffect, useState } from "react";
import { Table, message, Select, DatePicker, Slider, InputNumber, Row, Col, Button, Modal } from "antd";
import api from "../../../config/api";
import "./AdminOrderManagement.scss";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Order {
    id: number;
    phoneNumber: string;
    email: string;
    fullName: string;
    address: string;
    note: string;
    totalMoney: number;
    orderDate: string;
    status: string;
    validationImage: string;
}

interface Shop {
    shopName: string | null;
    bankName: string | null;
    bankNumber: string | null;
}

interface Transaction {
    id: number;
    status: string;
    amount: number;
    create_at: string;
}

interface AdminOrder {
    order: Order;
    shop: Shop;
    transaction: Transaction;
    totalFee: number;
}


const translateStatus = (status: string) => {
    switch (status) {
        case "AWAITING_PAYMENT":
            return "Chờ thanh toán";
        case "AWAITING_PICKUP":
            return "Chờ lấy hàng";
        case "COMPLETED":
            return "Hoàn thành";
        default:
            return status;
    }
};
const formatTransactionStatus = (status: string) => {
    switch (status) {
        case "PENDING":
            return "Đang chờ xử lý";
        case "SUCCESS":
            return "Thành công";
        case "FAIL":
            return "Thất bại";
        default:
            return status;
    }
};
const AdminOrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000000]);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get<AdminOrder[]>("/api/admin/orders");
            setOrders(response.data);
            setFilteredOrders(response.data);
            message.success("Tải danh sách đơn hàng thành công!");
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
            message.error("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleFilter = () => {
        let filteredData = orders;

        // Lọc theo tình trạng
        if (statusFilter) {
            filteredData = filteredData.filter(order => order.order.status === statusFilter);
        }

        // Lọc theo khoảng ngày
        if (dateRange[0] && dateRange[1]) {
            const [start, end] = dateRange;
            filteredData = filteredData.filter(order => {
                const orderDate = new Date(order.order.orderDate);
                return orderDate >= start! && orderDate <= end!;
            });
        }

        // Lọc theo khoảng giá
        filteredData = filteredData.filter(order =>
            order.order.totalMoney >= priceRange[0] && order.order.totalMoney <= priceRange[1]
        );

        setFilteredOrders(filteredData);
    };

    const handleViewDetails = (order: AdminOrder) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };
    const handleConfirmDelivery = async (transactionId: number) => {
        try {
            await api.put(`/api/admin/transaction/${transactionId}`, {
                status: "SUCCESS",
            });
            message.success("Xác nhận đã giao hàng thành công!");

            // Cập nhật trạng thái trong danh sách
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.transaction.id === transactionId
                        ? { ...order, transaction: { ...order.transaction, status: "SUCCESS" } }
                        : order
                )
            );

            setFilteredOrders(prevOrders =>
                prevOrders.map(order =>
                    order.transaction.id === transactionId
                        ? { ...order, transaction: { ...order.transaction, status: "SUCCESS" } }
                        : order
                )
            );

            setIsModalVisible(false);
        } catch (error) {
            console.error("Lỗi khi xác nhận giao dịch:", error);
            message.error("Không thể xác nhận giao dịch. Vui lòng thử lại.");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: ["order", "id"],
            key: "id",
        },
        {
            title: "Số điện thoại",
            dataIndex: ["order", "phoneNumber"],
            key: "phoneNumber",
        },
        {
            title: "Email",
            dataIndex: ["order", "email"],
            key: "email",
        },
        {
            title: "Tên người mua hoa",
            dataIndex: ["order", "fullName"],
            key: "fullName",
        },
        {
            title: "Địa chỉ",
            dataIndex: ["order", "address"],
            key: "address",
        },
        {
            title: "Ghi chú",
            dataIndex: ["order", "note"],
            key: "note",
        },
        {
            title: "Tổng tiền",
            dataIndex: ["order", "totalMoney"],
            key: "totalMoney",
            render: (totalMoney: number) => `${totalMoney.toLocaleString()} đ`,
        },
        {
            title: "Phí nền tảng",
            dataIndex: "totalFee",
            key: "totalFee",
            render: (totalFee: number) => `${totalFee.toLocaleString()} đ`,
        },
        {
            title: "Ngày đặt hàng",
            dataIndex: ["order", "orderDate"],
            key: "orderDate",
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: "Trạng thái",
            dataIndex: ["order", "status"],
            key: "status",
            render: (status: string) => translateStatus(status), // Sử dụng hàm chuyển đổi trạng thái
        },
        {
            title: "Xem chi tiết",
            key: "action",
            render: (record: AdminOrder) => (
                <Button type="link" onClick={() => handleViewDetails(record)}>
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div className="admin-order-management">
            <h2>Quản lý đơn hàng</h2>
            <div className="filter-container">
                <Row gutter={16}>
                    <Col span={6}>
                        <Select
                            placeholder="Chọn tình trạng"
                            allowClear
                            style={{ width: "100%" }}
                            onChange={(value) => setStatusFilter(value || null)}
                        >
                            <Option value="AWAITING_PAYMENT">Chờ thanh toán</Option>
                            <Option value="AWAITING_PICKUP">Chờ lấy hàng</Option>
                            <Option value="COMPLETED">Hoàn thành</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <RangePicker
                            style={{ width: "100%" }}
                            onChange={(dates) => setDateRange(dates ? [dates[0]?.toDate() || null, dates[1]?.toDate() || null] : [null, null])}
                        />
                    </Col>
                    <Col span={8}>
                        <Slider
                            range
                            value={priceRange}
                            min={0}
                            max={15000000}
                            step={100000}
                            tooltip={{ open: true }}
                            onChange={(values) => setPriceRange(values as [number, number])}
                        />
                        <Row gutter={8} style={{ marginTop: 8 }}>
                            <Col span={12}>
                                <InputNumber
                                    min={0}
                                    max={15000000}
                                    value={priceRange[0]}
                                    onChange={(value) => setPriceRange([value ?? 0, priceRange[1]])}
                                    style={{ width: "100%" }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={value => parseInt(value!.replace(/,*/g, ""))}
                                />
                            </Col>
                            <Col span={12}>
                                <InputNumber
                                    min={0}
                                    max={15000000}
                                    value={priceRange[1]}
                                    onChange={(value) => setPriceRange([priceRange[0], value ?? 15000000])}
                                    style={{ width: "100%" }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={value => parseInt(value!.replace(/,*/g, ""))}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={handleFilter}>Tìm kiếm</Button>
                    </Col>
                </Row>
            </div>
            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey={(record) => record.order.id}
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
            />
            <Modal
                title="Chi tiết đơn hàng"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null} // Không cần dùng footer
            >
                {selectedOrder && (
                    <div>
                        <p><b>Ảnh xác minh đã giao hàng:</b> <a href={selectedOrder.order.validationImage} target="_blank" rel="noopener noreferrer">Xem hình ảnh</a></p>
                        <p><b>Tên của shop:</b> {selectedOrder.shop.shopName || "Không có"}</p>
                        <p><b>Tên ngân hàng:</b> {selectedOrder.shop.bankName || "Không có"}</p>
                        <p><b>Số tài khoản:</b> {selectedOrder.shop.bankNumber || "Không có"}</p>
                        <p><b>Số tiền cần chuyển khoản cho người bán là:</b> {selectedOrder.transaction.amount.toLocaleString()} đ</p>
                        <p><b>Trạng thái giao dịch:</b> {formatTransactionStatus(selectedOrder.transaction.status)}</p>

                        {/* Hiển thị nút tại vị trí được chỉ định */}
                        {selectedOrder.transaction.status === "PENDING" && (
                            <Button
                                type="primary"
                                style={{ marginTop: "10px" }}
                                onClick={() => handleConfirmDelivery(selectedOrder.transaction.id)}
                            >
                                Xác nhận đã giao hàng
                            </Button>
                        )}
                    </div>
                )}
            </Modal>


        </div>
    );
};

export default AdminOrderManagement;

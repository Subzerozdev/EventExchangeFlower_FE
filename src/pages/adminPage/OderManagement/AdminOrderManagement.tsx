import React, { useEffect, useState, useCallback } from "react";
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

// Utility functions for status translation
const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
        AWAITING_PAYMENT: "Chờ thanh toán",
        AWAITING_PICKUP: "Chờ lấy hàng",
        COMPLETED: "Hoàn thành",
        STOPPED: "Đơn hàng đã hủy",
    };
    return statusMap[status] || status;
};

const formatTransactionStatus = (status: string) => {
    const transactionStatusMap: Record<string, string> = {
        PENDING: "Đang chờ xử lý",
        SUCCESS: "Thành công",
        FAIL: "Thất bại",
    };
    return transactionStatusMap[status] || status;
};

const AdminOrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000000]);

    // Modal states
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Fetch orders from API
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<AdminOrder[]>("/api/admin/orders");
            setOrders(response.data);
            setFilteredOrders(response.data);
            message.success("Tải danh sách đơn hàng thành công!");
            console.log(response);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
            message.error("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filter orders
    const handleFilter = () => {
        const [startDate, endDate] = dateRange;

        const filtered = orders.filter(({ order }) => {
            const matchesStatus = !statusFilter || order.status === statusFilter;
            const matchesDateRange =
                (!startDate || !endDate || (new Date(order.orderDate) >= startDate && new Date(order.orderDate) <= endDate));
            const matchesPriceRange = order.totalMoney >= priceRange[0] && order.totalMoney <= priceRange[1];
            return matchesStatus && matchesDateRange && matchesPriceRange;
        });

        setFilteredOrders(filtered);
    };

    // Handle viewing order details
    const handleViewDetails = (order: AdminOrder) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    // Confirm delivery
    const handleConfirmDelivery = async (transactionId: number) => {
        try {
            await api.put(`/api/admin/transaction/${transactionId}`, { status: "SUCCESS" });
            message.success("Xác nhận đã giao hàng thành công!");

            // Update orders and filteredOrders
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
        { title: "ID", dataIndex: ["order", "id"], key: "id" },
        { title: "Số điện thoại", dataIndex: ["order", "phoneNumber"], key: "phoneNumber" },
        { title: "Email", dataIndex: ["order", "email"], key: "email" },
        { title: "Tên người mua hoa", dataIndex: ["order", "fullName"], key: "fullName" },
        { title: "Địa chỉ", dataIndex: ["order", "address"], key: "address" },
        { title: "Ghi chú", dataIndex: ["order", "note"], key: "note" },
        {
            title: "Tổng tiền",
            dataIndex: ["order", "totalMoney"],
            key: "totalMoney",
            render: (totalMoney: number) => `${totalMoney.toLocaleString()}đ`,
        },
        {
            title: "Phí nền tảng",
            dataIndex: "totalFee",
            key: "totalFee",
            render: (totalFee: number) => `${totalFee.toLocaleString()}đ`,
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
            render: translateStatus,
        },
        {
            title: "Xem chi tiết",
            key: "action",
            render: (record: AdminOrder) => (
                record.transaction ? (
                    <Button type="link" onClick={() => handleViewDetails(record)}>
                        Xem chi tiết
                    </Button>
                ) : null
            ),
        },

    ];

    return (
        <div className="admin-order-management">
            <h2>Quản lý đơn hàng</h2>

            {/* Filter Section */}
            <div className="filter-container">
                <Row gutter={16}>
                    <Col span={6}>
                        <Select
                            placeholder="Chọn tình trạng"
                            allowClear
                            style={{ width: "100%" }}
                            onChange={value => setStatusFilter(value || null)}
                        >
                            <Option value="AWAITING_PAYMENT">Chờ thanh toán</Option>
                            <Option value="AWAITING_PICKUP">Chờ lấy hàng</Option>
                            <Option value="COMPLETED">Hoàn thành</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <RangePicker
                            style={{ width: "100%" }}
                            onChange={dates => setDateRange(dates ? [dates[0]?.toDate() || null, dates[1]?.toDate() || null] : [null, null])}
                        />
                    </Col>
                    <Col span={8}>
                        <Slider
                            range
                            value={priceRange}
                            min={0}
                            max={15000000}
                            step={100000}
                            onChange={values => setPriceRange(values as [number, number])}
                        />
                        <Row gutter={8} style={{ marginTop: 8 }}>
                            <Col span={12}>
                                <InputNumber
                                    min={0}
                                    max={15000000}
                                    value={priceRange[0]}
                                    onChange={value => setPriceRange([value ?? 0, priceRange[1]])}
                                    style={{ width: "100%" }}
                                />
                            </Col>
                            <Col span={12}>
                                <InputNumber
                                    min={0}
                                    max={15000000}
                                    value={priceRange[1]}
                                    onChange={value => setPriceRange([priceRange[0], value ?? 15000000])}
                                    style={{ width: "100%" }}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={handleFilter}>
                            Tìm kiếm
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Order Table */}
            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey={record => record.order.id}
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
            />

            {/* Modal for Order Details */}
            <Modal
                title="Chi tiết đơn hàng"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedOrder && (
                    <div>
                        <p>
                            <b>Ảnh xác minh đã giao hàng:</b>{" "}
                            <a href={selectedOrder.order.validationImage} target="_blank" rel="noopener noreferrer">
                                Xem hình ảnh
                            </a>
                        </p>
                        <p><b>Tên của shop:</b> {selectedOrder.shop.shopName || "Không có"}</p>
                        <p><b>Tên ngân hàng:</b> {selectedOrder.shop.bankName || "Không có"}</p>
                        <p><b>Số tài khoản:</b> {selectedOrder.shop.bankNumber || "Không có"}</p>
                        <p><b>Số tiền cần chuyển khoản cho người bán là:</b> {selectedOrder.transaction.amount.toLocaleString()} đ</p>
                        <p><b>Trạng thái giao dịch:</b> {formatTransactionStatus(selectedOrder.transaction.status)}</p>

                        {selectedOrder.transaction.status === "PENDING" && (
                            <Button type="primary" style={{ marginTop: "10px" }} onClick={() => handleConfirmDelivery(selectedOrder.transaction.id)}>
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

import React, { useEffect, useState } from "react";
import { Table, message, Select, DatePicker, Slider, InputNumber, Row, Col, Button } from "antd";
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
}

interface AdminOrder {
    order: Order;
    totalFee: number;
}

// Hàm chuyển đổi trạng thái đơn hàng từ tiếng Anh sang tiếng Việt
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

const AdminOrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000000]);

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
            title: "Tên khách hàng",
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
                        <Button type="primary" onClick={handleFilter}>Tìm kiếm theo giá</Button>
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
        </div>
    );
};

export default AdminOrderManagement;

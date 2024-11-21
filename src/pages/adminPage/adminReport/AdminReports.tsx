import { useEffect, useState } from 'react';
import { Button, Table, message } from 'antd';

import api from '../../../config/api';

interface Order {
    id: number;
    phoneNumber: string;
    email: string;
    fullName: string;
    address: string;
    totalMoney: number;

}
interface Report {
    id: number;
    problem: string;
    content: string;
    status: 'PROCESSING' | 'COMPLETED' | 'REJECTED';
    order: Order;
    userEmail: string;
}

const AdminReports = () => {
    const [reports, setReports] = useState<Report[]>([]);

    // Lấy danh sách các đơn khiếu nại
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get('/api/admin/report');
                setReports(response.data);
                console.log(response);
            } catch {
                message.error('Lỗi khi lấy danh sách đơn khiếu nại');
            }
        };

        fetchReports();
    }, []);

    // Cập nhật trạng thái đơn khiếu nại
    const handleUpdateStatus = async (id: number, isConfirmed: boolean) => {
        try {
            const status = isConfirmed ? 'COMPLETED' : 'REJECTED';
            const response = await api.put(`/api/admin/report/${id}/${isConfirmed}`);

            if (response.status === 200) {
                message.success(
                    `Đơn khiếu nại đã được ${isConfirmed ? 'xác nhận ' : 'từ chối '}`
                );
                // Cập nhật lại danh sách sau khi cập nhật trạng thái
                setReports(prevReports =>
                    prevReports.map(report =>
                        report.id === id ? { ...report, status } : report
                    )
                );
            }
        } catch {
            message.error('Lỗi khi cập nhật trạng thái');
        }
    };

    // Cấu hình cột bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Order ID',
            dataIndex: ['order', 'id'],
            key: 'orderId',
        },
        {
            title: 'Email người dùng',
            dataIndex: 'userEmail',
            key: 'userEmail',
        },
        {
            title: 'Tổng tiền đặt hàng',
            dataIndex: ['order', 'totalMoney'], // Truy cập order.totalMoney
            key: 'totalMoney',
            render: (totalMoney: number) => (
                <span>{totalMoney.toLocaleString()}đ</span>
            ),
        },
        {
            title: 'Vấn đề',
            dataIndex: 'problem',
            key: 'problem',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Loại đơn',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => {
                switch (type) {
                    case 'REPORT':
                        return <span>Báo cáo</span>;
                    case 'REFUND':
                        return <span>Hoàn tiền</span>;
                    case 'DELETE_ORDER':
                        return <span>Hủy đơn hàng</span>;

                }
            }
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                switch (status) {
                    case 'PROCESSING':
                        return <span>Đang xử lý</span>;
                    case 'COMPLETED':
                        return <span>Đã hoàn thành</span>;
                    case 'REJECTED':
                        return <span>Đã từ chối</span>;
                    default:
                        return <span>Không xác định</span>;
                }
            },
        },


        { // vô hiệu hóa ở đây
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, record: Report) => (
                <div>
                    <Button
                        type="primary"
                        disabled={record.status !== 'PROCESSING'}
                        onClick={() => handleUpdateStatus(record.id, true)}
                        style={{ marginRight: 8 }}
                    >
                        Xác nhận
                    </Button>
                    <Button
                        type="default"
                        danger
                        disabled={record.status !== 'PROCESSING'}
                        onClick={() => handleUpdateStatus(record.id, false)}
                    >
                        Từ chối
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h1>Quản lý đơn </h1>
            <Table
                dataSource={reports}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
        </div>
    );
};

export default AdminReports;

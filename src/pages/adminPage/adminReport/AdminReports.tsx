import { useEffect, useState } from 'react';
import { Button, Table, message } from 'antd';

import api from '../../../config/api';

interface Report {
    id: number;
    problem: string;
    content: string;
    status: 'PROCESSING' | 'COMPLETED';
    orderId: number;
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
            } catch {
                message.error('Lỗi khi lấy danh sách đơn khiếu nại');
            }
        };

        fetchReports();
    }, []);

    // Cập nhật trạng thái đơn khiếu nại
    const handleUpdateStatus = async (id: number) => {
        try {
            const response = await api.put(`/api/admin/report/${id}`, {
                status: 'COMPLETED',
            });

            if (response.status === 200) {
                message.success('Đơn khiếu nại đã được cập nhật');
                // Cập nhật lại danh sách sau khi cập nhật trạng thái
                setReports(prevReports =>
                    prevReports.map(report =>
                        report.id === id ? { ...report, status: 'COMPLETED' } : report
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
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <span>{status === 'PROCESSING' ? 'Đang xử lý' : 'Đã hoàn thành'}</span>
            ),
        },
        {
            title: 'Email người dùng',
            dataIndex: 'userEmail',
            key: 'userEmail',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, record: Report) => (
                <Button
                    type="primary"
                    disabled={record.status === 'COMPLETED'}
                    onClick={() => handleUpdateStatus(record.id)}
                >
                    Cập nhật trạng thái
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1>Quản lý đơn khiếu nại</h1>
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

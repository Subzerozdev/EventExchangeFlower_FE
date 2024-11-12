import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
// import axios from 'axios';
import api from '../../../config/api';

// Định nghĩa kiểu dữ liệu cho doanh thu hàng tháng
interface MonthlyRevenue {
    revenue: number;
    month: string | null;
    year: number | null;
}

const DashBoard = () => {
    const [overviewData, setOverviewData] = useState({
        totalPosts: 0,
        totalSeller: 0,
        totalCustomers: 0,
    });

    const [revenueData, setRevenueData] = useState<MonthlyRevenue[]>([]);

    // Gọi API lấy dữ liệu tổng quan
    useEffect(() => {
        api.get('/api/admin/status', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

            .then((response) => setOverviewData(response.data))
            .catch((error) => console.error('Error fetching overview data:', error));

    }, []);

    // Gọi API lấy dữ liệu doanh thu hàng tháng
    useEffect(() => {

        api.get('/api/status', {

            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

            .then((response) => setRevenueData(response.data.monthlyRevenue || []))

            .catch((error) => console.error('Error fetching revenue data:', error));
    }, []
    );


    // Cấu hình Pie Chart (Thống kê tổng quan)
    const pieOption = {
        title: { text: 'Thống kê Tổng quan', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [
            {
                name: 'Thống kê',
                type: 'pie',
                radius: ['40%', '70%'],
                data: [
                    { value: overviewData.totalPosts, name: 'Bài đăng' },
                    { value: overviewData.totalSeller, name: 'Người bán' },
                    { value: overviewData.totalCustomers, name: 'Khách hàng' },
                ],
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold',
                    },
                },
            },
        ],
    };

    // Cấu hình Line Chart (Doanh thu hàng tháng)
    const lineOption = {
        title: { text: 'Doanh thu Hàng Tháng', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: revenueData.map((item) => item.month || 'N/A'),
        },
        yAxis: { type: 'value' },
        series: [
            {
                data: revenueData.map((item) => item.revenue || 0),
                type: 'line',
                areaStyle: {},
            },
        ],
    };
    console.log(Response);
    return (
        <div>
            <h1>Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {/* Pie Chart */}
                <ReactECharts option={pieOption} style={{ width: '45%', height: 400 }} />

                {/* Line Chart */}
                <ReactECharts option={lineOption} style={{ width: '45%', height: 400 }} />
            </div>
        </div>
    );
};

export default DashBoard;

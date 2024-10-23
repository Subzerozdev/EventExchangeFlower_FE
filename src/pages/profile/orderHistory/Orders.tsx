import React, { useEffect, useState } from 'react';
import { notification, Table } from 'antd';
import moment from 'moment'; // Sử dụng moment.js để định dạng ngày

import './Orders.scss';
import api from '../../../config/api'; // Đường dẫn tới file config API

// Interface cho dữ liệu đơn hàng trả về từ API
interface ApiOrder {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  note: string;
  orderDate: string | null; // Kiểu dữ liệu cho orderDate có thể là null
  totalMoney: string; // Tổng tiền luôn là số
  status: string;
  paymentMethod: string | null; // Phương thức thanh toán có thể là null
}

// Interface cho đối tượng hiển thị trong bảng
interface Order {
  key: string; // Để khớp với key cho bảng Ant Design
  orderNumber: string;
  orderDate: string;
  address: string;
  totalMoney: string;
  paymentMethod: string;
  note: string;
  status: string;
}

const columns = [
  {
    title: 'Đơn hàng',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
  },
  {
    title: 'Ngày Đặt',
    dataIndex: 'orderDate',
    key: 'orderDate', // Khớp với dữ liệu được định dạng
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tổng tiền đơn hàng',
    dataIndex: 'totalMoney',
    key: 'totalMoney', // Khớp với dữ liệu được định dạng
  },
  {
    title: 'Phương thức thanh toán',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
  },
  {
    title: 'Trạng Thái ',
    dataIndex: 'status',
    key: 'status', // Khớp với dữ liệu được định dạng
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note', // Khớp với dữ liệu được định dạng
  },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
  const pageSize = 4; // Số sản phẩm trên mỗi trang

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get<ApiOrder[]>('/api/orders'); // Gọi API để lấy thông tin đơn hàng

        console.log('Orders fetched from API:', response.data); // Kiểm tra dữ liệu API

        // Kiểm tra từng phần tử trong dữ liệu trả về và định dạng ngày
        const fetchedOrders = response.data.map((order) => ({
          key: order.id, // key cho bảng Ant Design
          orderNumber: order.id,
          // Kiểm tra và chuyển đổi kiểu dữ liệu ngày
          orderDate: order.orderDate
            ? moment(order.orderDate).format('DD/MM/YYYY')  // Định dạng ngày với moment nếu tồn tại
            : 'Không xác định', // Xử lý khi orderDate là null hoặc không hợp lệ
          address: order.address || 'Không xác định', // Đảm bảo có giá trị cho địa chỉ
          totalMoney: order.totalMoney
            ? parseInt(order.totalMoney).toLocaleString('vi-VN') + '₫' // Định dạng tổng tiền
            : 'Không xác định', // Xử lý khi totalMoney là null
          paymentMethod: order.paymentMethod || 'Không xác định', // Xử lý khi paymentMethod là null
          note: order.note,
          status:order.status
        }));

        setOrders(fetchedOrders); // Cập nhật danh sách đơn hàng hiển thị
      } catch (error) {
        console.log(error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể lấy thông tin đơn hàng.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(); // Lấy thông tin đơn hàng khi component được render
  }, []); // Cập nhật mỗi khi component này được render sau điều hướng

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Cập nhật trang hiện tại khi người dùng điều hướng giữa các trang
  };

  return (
    <div className="order_container">
      <h2>ĐƠN HÀNG CỦA BẠN</h2>
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: orders.length, // Tổng số đơn hàng
          onChange: handlePageChange, // Hàm để chuyển trang
          showSizeChanger: false, // Ẩn nút thay đổi số lượng sản phẩm trên mỗi trang
        }}
        locale={{ emptyText: 'Không có đơn hàng nào đã thanh toán.' }}
        bordered
      />
    </div>
  );
};

export default Orders;

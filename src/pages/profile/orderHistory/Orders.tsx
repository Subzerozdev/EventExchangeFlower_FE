import React, { useEffect, useState } from 'react';
import { notification, Table, Button, Modal } from 'antd'; // Import Modal
import moment from 'moment';
import api from '../../../config/api';  // Đường dẫn API

const { confirm } = Modal; // Sử dụng Modal.confirm cho hộp thoại xác nhận

interface ApiOrder {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  note: string;
  orderDate: string | null;
  totalMoney: string;
  status: string;
  check: string;
}

interface Order {
  key: string;
  orderNumber: string;
  orderDate: string;
  address: string;
  totalMoney: string;
  note: string;
  status: string;
  check: string;
  showCancel: boolean;
  cancelDisabled: boolean; // Trạng thái của nút Hủy (vô hiệu hóa hay không)
  cancelTime?: moment.Moment; // Thêm thời gian hủy để quản lý trạng thái hiển thị trong 3 phút
}

const translateStatus = (status: string): string => {
  switch (status) {
    case 'AWAITING_PAYMENT':
      return 'Đang chờ thanh toán';
    case 'AWAITING_PICKUP':
      return 'Đang chờ lấy hàng';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get<ApiOrder[]>('/api/orders'); // API gọi danh sách đơn hàng
        const fetchedOrders = response.data.map((order) => {
          const orderTime = moment(order.orderDate);
          const currentTime = moment();
          const timeDifference = currentTime.diff(orderTime, 'minutes');
          const showCancel = timeDifference < 30 && order.status !== 'CANCELLED'; // Nút Hủy chỉ hiển thị nếu trong 30 phút và trạng thái không phải đã hủy
          const cancelDisabled = timeDifference >= 30; // Vô hiệu hóa nếu quá 30 phút

          return {
            key: order.id,
            orderNumber: order.id,
            orderDate: order.orderDate
              ? moment(order.orderDate).format('DD/MM/YYYY')
              : 'Không xác định',
            address: order.address || 'Không xác định',
            totalMoney: order.totalMoney
              ? parseInt(order.totalMoney).toLocaleString('vi-VN') + '₫'
              : 'Không xác định',
            note: order.note,
            status: order.status, // Lưu trạng thái ban đầu
            check: order.check,
            showCancel: showCancel, // Hiển thị nút Hủy nếu đủ điều kiện
            cancelDisabled: cancelDisabled, // Trạng thái để vô hiệu hóa nút Hủy nếu quá 30 phút
          };
        });

        setOrders(fetchedOrders);
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

    fetchOrders();
  }, []);

  useEffect(() => {
    // Cập nhật danh sách đơn hàng mỗi 1 giây để kiểm tra thời gian hủy
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.filter((order) => {
          // Kiểm tra nếu trạng thái là "CANCELLED" và thời gian hủy đã vượt quá 3 phút thì xóa đơn hàng khỏi danh sách
          if (order.status === 'CANCELLED' && order.cancelTime) {
            const timeSinceCancel = moment().diff(order.cancelTime, 'minutes');
            return timeSinceCancel < 3;
          }
          return true; // Giữ lại những đơn hàng không bị hủy
        })
      );
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(interval); // Dọn dẹp khi component bị hủy
  }, []);

  const showConfirmCancel = (key: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      content: 'Đơn hàng sẽ không thể phục hồi sau khi hủy.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        handleCancelOrder(key); // Gọi hàm hủy đơn hàng khi người dùng xác nhận
      },
      onCancel() {
        console.log('Hủy hành động');
      },
    });
  };

  const handleCancelOrder = async (key: string) => {
    try {
      // Gửi yêu cầu cập nhật trạng thái về server
      await api.put(`/api/orders/${key}`, { status: 'CANCELLED' });

      // Cập nhật lại trạng thái trên frontend sau khi yêu cầu thành công
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.key === key
            ? { ...order, status: 'CANCELLED', showCancel: false, cancelTime: moment() } // Ghi lại thời gian hủy
            : order
        )
      );

      notification.success({
        message: 'Đã hủy đơn hàng',
        description: 'Đơn hàng đã được hủy thành công.',
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể hủy đơn hàng. Vui lòng thử lại.',
      });
    }
  };

  const columns = [
    {
      title: 'Đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tổng tiền đơn hàng',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => translateStatus(status), // Dịch trạng thái
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Xác Nhận',
      dataIndex: 'check',
      key: 'check',
      render: (_: string, record: Order) => (
        record.showCancel ? (
          <Button 
            danger 
            onClick={() => showConfirmCancel(record.key)}  // Gọi hộp thoại xác nhận khi nhấn nút hủy
            disabled={record.cancelDisabled} // Vô hiệu hóa nếu quá 30 phút
          >
            Hủy
          </Button>
        ) : (
          <span>{record.status === 'CANCELLED' ? 'Đã hủy' : 'Hết hạn hủy'}</span>
        )
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="order_container">
      <h2>ĐƠN HÀNG CỦA BẠN</h2>
      <Table
        columns={columns}
        dataSource={orders}  // Hiển thị tất cả các đơn hàng (đã hủy và chưa hủy)
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: orders.length, // Cập nhật số lượng đơn hàng hiển thị
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        locale={{ emptyText: 'Không có đơn hàng nào đã thanh toán.' }}
        bordered
      />
    </div>
  );
};

export default Orders;

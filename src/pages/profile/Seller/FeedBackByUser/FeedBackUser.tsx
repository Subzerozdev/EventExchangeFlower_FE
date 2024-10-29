import React, { useEffect, useState } from 'react';
import { Table, message, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import api from '../../../../config/api';
 // Đảm bảo rằng bạn đã cấu hình API chính xác

// Interface cho phản hồi
interface Feedback {
  id: number;
  content: string;
  rating: number;
  customer_id: number;
  shop_id: number;
}

const FeedBackUser: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { shopid } = useParams<{ shopid: string }>(); // Lấy shopId từ URL

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Kiểm tra nếu có shopid, gọi API để lấy phản hồi của shop
        if (shopid) {
          const response = await api.get<{ feedbacks: Feedback[] }>(`/api/feedback/${shopid}`);
          setFeedbackList(response.data.feedbacks);
        } else {
          message.error('Không tìm thấy ID của cửa hàng');
        }
        setLoading(false);
      } catch (error) {
        console.log(error)
        message.error('Không thể tải danh sách phản hồi từ người dùng');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [shopid]);

  // Định nghĩa các cột của bảng phản hồi
  const columns = [
    {
      title: 'ID Phản Hồi',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nội Dung Phản Hồi',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Đánh Giá',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'ID Khách Hàng',
      dataIndex: 'customer_id',
      key: 'customer_id',
    },
  ];

  return (
    <div>
      <h2>Danh Sách Phản Hồi Từ Người Dùng</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={feedbackList}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default FeedBackUser;

import React, { useEffect, useState } from "react";
import { Table, message, Spin } from "antd";
import api from "../../../../config/api";
import "./FeedBackUser.scss"; // Import file SCSS

// Interface cho phản hồi, thêm `email` vào interface
interface Feedback {
  id: number;
  content: string;
  rating: number;
  email: string; // Thêm email vào cấu trúc dữ liệu
}

const FeedBackUser: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Gọi API để lấy toàn bộ phản hồi
        const response = await api.get<Feedback[]>("/api/feedback");
        setFeedbackList(response.data); // Lưu toàn bộ phản hồi vào state
        setLoading(false);
      } catch (error) {
        console.log(error);
        message.error("Không thể tải danh sách phản hồi từ người dùng");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Định nghĩa các cột của bảng phản hồi, thêm cột Email
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      className: "feedback-table-column-id",
    },
    {
      title: "Nội Dung Phản Hồi",
      dataIndex: "content",
      key: "content",
      className: "feedback-table-column-content",
    },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      key: "rating",
      className: "feedback-table-column-rating",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "feedback-table-column-email",
    },
  ];

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Danh Sách Phản Hồi Từ Người Dùng</h2>
      {loading ? (
        <div className="feedback-loading">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          className="feedback-table"
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

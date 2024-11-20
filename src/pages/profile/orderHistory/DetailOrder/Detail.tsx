import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Descriptions, Image, List, Divider, Button } from "antd";
import api from "../../../../config/api";
import "./Detail.scss";

interface OrderDetail {
  id: number;
  numberOfProducts: number;
  totalMoney: number;
  post: {
    id: number;
    name: string;
    address: string;
    thumbnail: string;
    price: number;
    end_date: string;
  };
}

interface Order {
  id: number;
  address: string;
  note: string;
  totalMoney: number;
}

interface Seller {
  email: string;
  phone: string;
}

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [order, setOrder] = useState<Order | null>(null); // Thêm trạng thái cho Order
  const [seller, setSeller] = useState<Seller | null>(null); // Thêm trạng thái cho người bán
  const [loading, setLoading] = useState(false);

  const handleBackToProfile = () => {
    navigate("/profile");
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get<{
        order: Order;
        orderDetail: OrderDetail[];
        sellerInformation: Seller;
      }>(`/api/orders/${id}`);
      console.log(response);
      setOrder(response.data.order); // Lưu thông tin Order vào state
      setOrderDetails(response.data.orderDetail);
      setSeller(response.data.sellerInformation); // Lưu thông tin người bán vào state
      message.success("Tải chi tiết đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      message.error("Không thể tải chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const renderProductDetails = (detail: OrderDetail) => (
    <List.Item key={detail.id}>
      <List.Item.Meta
        avatar={
          <Image
            width={100}
            src={detail.post?.thumbnail || "default-image-url"}
            alt={detail.post?.name || "Không có tên sản phẩm"}
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "2px solid #0050b3",
            }}
          />
        }
        title={
          <span
            style={{ fontSize: "18px", fontWeight: "bold", color: "#0050b3" }}
          >
            {detail.post?.name || "Không có tên sản phẩm"}
          </span>
        }
        description={
          <>
            <div
              style={{ fontSize: "16px", fontWeight: "600", color: "#52c41a" }}
            >
              Giá:{" "}
              {detail.post?.price
                ? detail.post.price.toLocaleString()
                : "Không xác định"}{" "}
              đ | Số lượng: {detail.numberOfProducts || 1}
            </div>
            <div
              className="product-end-date"
              style={{
                fontSize: "14px",
                color: "#595959",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <i
                className="anticon anticon-calendar"
                style={{ color: "#ff4d4f" }}
              />{" "}
              Ngày kết thúc sự kiện:{" "}
              <span style={{ fontWeight: "500", color: "#ff4d4f" }}>
                {detail.post?.end_date
                  ? new Date(detail.post.end_date).toLocaleDateString("vi-VN")
                  : "Không xác định"}
              </span>
            </div>
          </>
        }
      />

      <div className="product-total">
        Tổng tiền:{" "}
        {`${detail.totalMoney ? detail.totalMoney.toLocaleString() : "0"} đ`}
      </div>
    </List.Item>
  );

  return (
    <div className="order-details-container">
      <h2>Chi tiết đơn hàng</h2>

      <div className="button-group">
        <Button type="default" onClick={handleBackToProfile}>
          Quay lại Profile
        </Button>
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã đơn hàng">{id}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {order ? order.address : "Không có địa chỉ"}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          {order ? order.note : "Không có ghi chú"}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {order ? `${order.totalMoney.toLocaleString()} đ` : "0 đ"}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {seller && (
        <>
          <h3>Thông tin người bán</h3>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Email người bán">
              {seller.email || "Không có email"}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại người bán">
              {seller.phone || "Không có số điện thoại"}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
        </>
      )}

      <h3>Danh sách sản phẩm</h3>
      <List
        itemLayout="horizontal"
        dataSource={orderDetails}
        renderItem={renderProductDetails}
        loading={loading}
        className="product-list"
      />
    </div>
  );
};

export default Details;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Descriptions, Image, List, Divider, Button } from "antd";
import api from "../../../../config/api";
import './OrderDetails.scss'; // Import SCSS

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
    };
}

const OrderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [loading, setLoading] = useState(false);

    const handleBackToProfile = () => {
        navigate("/profile");
    };

    const handleBack = () => {
        navigate("/seller/sold-orders");
    };

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get<OrderDetail[]>(`/api/orders/${id}`);
            setOrderDetails(response.data);
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

    const calculateTotalMoney = () => {
        return orderDetails.reduce((total, detail) => total + detail.totalMoney, 0);
    };

    const renderProductDetails = (detail: OrderDetail) => (
        <List.Item key={detail.id}>
            <List.Item.Meta
                avatar={
                    <Image
                        width={100}
                        src={detail.post.thumbnail}
                        alt={detail.post.name}
                        style={{ borderRadius: '8px' }}
                    />
                }
                title={detail.post.name}
                description={`Giá: ${detail.post.price.toLocaleString()} đ | Số lượng: ${detail.numberOfProducts}`}
            />
            <div className="product-total">
                Tổng tiền: {`${detail.totalMoney.toLocaleString()} đ`}
            </div>
        </List.Item>
    );

    return (
        <div className="order-details-container">
            <h2>Chi tiết đơn hàng</h2>

            <div className="button-group">
                <Button type="primary" onClick={handleBack}>
                    Quay Đơn hàng đã bán
                </Button>
                <Button type="default" onClick={handleBackToProfile}>
                    Quay lại Profile
                </Button>
            </div>

            <Descriptions bordered column={1}>
                <Descriptions.Item label="Địa chỉ">
                    {orderDetails.length > 0 ? orderDetails[0].post.address : "Không có địa chỉ"}
                </Descriptions.Item>
                <Descriptions.Item label="Mã đơn hàng">{id}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                    {`${calculateTotalMoney().toLocaleString()} đ`}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

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

export default OrderDetails;

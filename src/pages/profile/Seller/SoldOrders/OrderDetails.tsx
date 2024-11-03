import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Descriptions, Image, List, Divider, Button } from "antd";
import api from "../../../../config/api";
import "./OrderDetails.scss";

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

interface Seller {
    email: string;
    phone: string;
}

interface Order {
    id: number;
    email: string;
    phoneNumber: string;
    address: string;
    note: string;
    totalMoney: number;
    totalFee: number;
    finalAmountReceived: number; // Calculated as totalMoney - totalFee
}

const OrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [order, setOrder] = useState<Order | null>(null);
    // const [seller, setSeller] = useState<Seller | null>(null);
    const [loading, setLoading] = useState(false);

    const handleBackToProfile = () => {
        navigate("/profile");
    };
    const handleBackToOrders = () => {
        navigate("/seller/sold-orders");
    };

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get<{
                order: Omit<Order, 'finalAmountReceived'> & { totalMoney?: number };
                orderDetail: OrderDetail[];
                sellerInformation: Seller;
                totalFee?: number; // Assuming totalFee is a direct property of response.data
            }>(`/api/orders/${id}`);

            const totalMoney = response.data.order.totalMoney ?? 0; // Default to 0 if undefined
            const totalFee = response.data.totalFee ?? 0; // Accessing totalFee directly from response.data
            const finalAmountReceived = totalMoney - totalFee;

            setOrder({ ...response.data.order, totalMoney, totalFee, finalAmountReceived });
            setOrderDetails(response.data.orderDetail);
            // setSeller(response.data.sellerInformation);
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
                        style={{ borderRadius: "8px" }}
                    />
                }
                title={detail.post?.name || "Không có tên sản phẩm"}
                description={`Giá: ${detail.post?.price || "Không xác định"} đ | Số lượng: ${detail.numberOfProducts || 1}`}
            />
            <div className="product-total">
                Tổng tiền: {`${detail.totalMoney || 0} đ`}
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
                <Button type="primary" onClick={handleBackToOrders}>
                    Quay Đơn hàng đã bán
                </Button>
            </div>

            <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã đơn hàng">{id}</Descriptions.Item>
                <Descriptions.Item label="Email">
                    {order ? order.email : "Không có email"}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {order ? order.phoneNumber : "Không có số điện thoại"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                    {order ? order.address : "Không có địa chỉ"}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">
                    {order ? order.note : "Không có ghi chú"}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                    {order ? `${order.totalMoney.toLocaleString()} đ` : "0 đ"}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng phí nền tảng">
                    {order ? `${order.totalFee.toLocaleString()} đ` : "0 đ"}
                </Descriptions.Item>
                <Descriptions.Item label="Tiền nhận được sau cùng">
                    {order ? `${order.finalAmountReceived.toLocaleString()} đ` : "0 đ"}
                </Descriptions.Item>


            </Descriptions>

            <Divider />

            {/* {seller && (
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
            )} */}

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

export default OrderDetail;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Sử dụng useNavigate
import { message, Descriptions, Image, List, Divider, Button } from "antd";
import api from "../../../../config/api";

// Định nghĩa kiểu dữ liệu cho chi tiết đơn hàng
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
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const navigate = useNavigate(); // Khai báo useNavigate để điều hướng
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [loading, setLoading] = useState(false);

    // Gọi API để lấy chi tiết đơn hàng
    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get<OrderDetail[]>(`/api/orders/${id}`);
            setOrderDetails(response.data);
            console.log("Chi tiết đơn hàng:", response.data);
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

    // Tính tổng tiền tất cả sản phẩm
    const calculateTotalMoney = () => {
        return orderDetails.reduce((total, detail) => total + detail.totalMoney, 0);
    };

    // Render chi tiết từng sản phẩm trong đơn hàng
    const renderProductDetails = (detail: OrderDetail) => (
        <List.Item key={detail.id}>
            <List.Item.Meta
                avatar={
                    <Image
                        width={100}
                        src={detail.post.thumbnail}
                        alt={detail.post.name}
                    />
                }
                title={detail.post.name}
                description={`Giá: ${detail.post.price.toLocaleString()} đ | Số lượng: ${detail.numberOfProducts}`}
            />
            <div>Tổng tiền: {`${detail.totalMoney.toLocaleString()} đ`}</div>
        </List.Item>
    );

    // Hàm quay lại trang "Đơn hàng đã bán"
    const handleBack = () => {
        navigate("/seller/sold-orders"); // Điều hướng về danh sách đơn hàng đã bán
    };

    return (
        <div>
            <h2>Chi tiết đơn hàng</h2>
            <Button type="primary" onClick={handleBack} style={{ marginBottom: 16 }}>
                Quay lại Đơn hàng đã bán
            </Button>

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
            />
        </div>
    );
};

export default OrderDetails;

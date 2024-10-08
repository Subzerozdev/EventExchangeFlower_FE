import React from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, InputNumber } from "antd";
import { products } from "../ProductList/ProductList";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "./ProductDetail.scss";

const { Title, Text } = Typography;

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  date: string;
}

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  const product = products.find((p: Product) => p.id === parseInt(productId || "", 10));

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* Cột hình ảnh sản phẩm */}
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Cột thông tin sản phẩm */}
        <div className="product-info">
          <Title level={2}>{product.name}</Title>
          <Text>Mã sản phẩm: {product.id}</Text>
          <p>Thương hiệu: Đang cập nhật | Tình trạng: Còn hàng</p>
          <Title level={3} style={{ color: "#ff4d4f" }}>
            {product.price}
          </Title>

          {/* Bộ điều khiển số lượng */}
          <div className="quantity-control">
            <Text>Số lượng:</Text>
            <InputNumber min={1} max={10} defaultValue={1} />
          </div>

          {/* Các nút hành động */}
          <div className="product-actions">
            <Button type="primary" size="large">
              MUA NGAY
            </Button>
            <Button
              type="default"
              size="large"
              icon={<ShoppingCartOutlined />}
              className="add-to-cart-btn"
            >
              Thêm vào giỏ
            </Button>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="product-description">
            <Title level={4}>THÔNG TIN SẢN PHẨM</Title>
            <ul>
              <li>1.Giá cả có thể thay đổi: Giá hoa tươi có thể biến động tăng/giảm tùy theo thị trường. Chúng tôi cam kết sẽ cập nhật giá một cách minh bạch và hợp lý nhất sau khi xác nhận đặt hàng với quý khách.</li>
              <li>2.Màu sắc hoa có thể khác biệt: Do điều kiện ánh sáng và góc chụp, màu sắc hoa trên hình ảnh có thể khác với thực tế. Chúng tôi luôn cố gắng cung cấp hình ảnh chân thực nhất cho sản phẩm.</li>
              <li>3.Hoa theo mùa: Một số loại hoa có thể thay đổi theo mùa. Tuy nhiên, chúng tôi sẽ nỗ lực giữ loại hoa chủ đạo và đảm bảo số lượng cũng như giá trị tương đương hoặc cao hơn.</li>
              <li>4.Sản phẩm có thể khác ảnh mẫu: Mẫu hoa thực tế có thể khác so với hình ảnh mẫu, nhưng chúng tôi đảm bảo sẽ giống ít nhất 80% trở lên. Chúng tôi chân thành cảm ơn sự tin tưởng và ủng hộ của quý khách. Hy vọng quý khách sẽ hài lòng với những sản phẩm hoa tươi của chúng tôi.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { CartContext } from "../../../context/CartContext"; // Giả sử bạn có một CartContext để xử lý giỏ hàng
import axios from "axios"; // Sử dụng axios để lấy sản phẩm từ API
import "./ProductDetail.scss";

const { Title, Text } = Typography;

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
  startdate: string;
  enddate: string;
  address: string;
}

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useContext(CartContext) || {}; // Sử dụng context của giỏ hàng

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`); // Gọi API để lấy chi tiết sản phẩm
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setError("Không thể lấy thông tin sản phẩm.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Đang tải thông tin sản phẩm...</div>;
  }

  if (error || !product) {
    return <div>{error || "Không tìm thấy sản phẩm"}</div>;
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
            <Text>Số lượng: {product.quantity}</Text>
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
              onClick={() => {
                if (addToCart) {
                  addToCart(product); // Thêm sản phẩm vào giỏ hàng
                  message.success("Sản phẩm đã được thêm vào giỏ hàng.");
                }
              }}
            >
              Thêm vào giỏ
            </Button>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="product-description">
            <Title level={4}>THÔNG TIN SẢN PHẨM</Title>
            <ul>
              <li>1. Giá cả có thể thay đổi: Giá hoa tươi có thể biến động...</li>
              <li>2. Màu sắc hoa có thể khác biệt do điều kiện ánh sáng...</li>
              <li>3. Hoa theo mùa: Một số loại hoa có thể thay đổi theo mùa...</li>
              <li>4. Sản phẩm có thể khác ảnh mẫu nhưng sẽ giống ít nhất 80%...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

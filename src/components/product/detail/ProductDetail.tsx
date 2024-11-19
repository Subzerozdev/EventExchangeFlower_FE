import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Spin,
  Button,
  Row,
  Col,
  message,
  Badge,
  Drawer,
  Image,
} from "antd";
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import api from "../../../config/api";
import "./ProductDetail.scss";

interface ImageData {
  id: number;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  address: string;
  start_date: string;
  end_date: string;
  category: { id: number; name: string };
  imageUrls: ImageData[];
  shop_name: string;
  types: Type[]; // Thêm mảng types vào Product
}
interface Type {
  id: number;
  name: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get<Product>(`/posts/${id}`);
        const productData = response.data;

        const formattedProduct = {
          ...productData,
          start_date: formatDateTime(productData.start_date),
          end_date: formatDateTime(productData.end_date),
        };

        setProduct(formattedProduct);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartAndNavigate = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      message.info(
        `${product.name} đã có trong giỏ hàng, chuyển đến trang thanh toán`
      );
      navigateToCheckout(); // Điều hướng đến trang thanh toán nếu sản phẩm đã có trong giỏ hàng
    } else {
      setCart((prevCart) => {
        const updatedCart = [...prevCart, { ...product }];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });
      message.success(
        `${product.name} đã được thêm vào giỏ hàng, chuyển đến trang thanh toán`
      );
      navigateToCheckout();
    }
  };

  const navigateToCheckout = () => {
    navigate("/checkout");
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        message.warning(`${product.name} đã có trong giỏ hàng`);
        return prevCart;
      } else {
        return [...prevCart, { ...product }];
      }
    });
    message.success(`${product.name} đã được thêm vào giỏ hàng`);
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price;
    }, 0);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="product-detail">
      {product && (
        <>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.thumbnail}
                    className="product-thumbnail"
                  />
                }
              />
              <div className="additional-images">
                <Image.PreviewGroup>
                  {product.imageUrls &&
                    product.imageUrls.map((image, index) => (
                      <Image
                        key={index}
                        src={image.imageUrl}
                        alt={`Image ${index}`}
                        width={100}
                        height={100}
                        className="additional-image"
                      />
                    ))}
                </Image.PreviewGroup>
              </div>
            </Col>
            <Col span={12}>
              <h1>{product.name}</h1>
              <p>Mã: {product.id}</p>
              <p
                style={{
                  color: "#FF6F61",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Giá: {product.price.toLocaleString("vi-VN")}₫
              </p>
              <div className="buttons">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingOutlined />}
                  style={{
                    backgroundColor: "#6BA34E",
                    borderColor: "#6BA34E",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    addToCartAndNavigate(product);
                  }}
                  disabled={cart.length === 0}
                >
                  Mua ngay
                </Button>
                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{ marginLeft: "10px", borderRadius: "5px" }}
                  onClick={() => addToCart(product)}
                >
                  Thêm vào giỏ
                </Button>
              </div>
              <div className="product-description">
                <h3>Thông tin sản phẩm</h3>
                <p>Tên shop: {product.shop_name}</p>
                <p>Loại sự kiện: {product.category.name}</p>
                <p>
                  Loại hoa: {product.types.map((type) => type.name).join(", ")}
                </p>
                <p>Miêu tả: {product.description}</p>
                <p>Địa chỉ: {product.address}</p>
                <p>
                  Thời gian: {product.start_date} - {product.end_date}
                </p>
                <p
                  style={{
                    backgroundColor: "#fff5c2", // Màu nền vàng nhạt
                    border: "1px solid #ffd43b", 
                    padding: "10px",
                    borderRadius: "8px", 
                    fontWeight: "bold", 
                    color: "#856404", // Màu chữ nâu vàng
                    display: "flex",
                    alignItems: "center", 
                    gap: "8px", 
                    margin: "10px 0", 
                  }}
                >
                  <span style={{ fontSize: "20px", color: "#ff8800" }}>⚠️</span>
                  Lưu ý: Hàng sẽ được giao sau ngày kết thúc sự kiện trong 48 giờ
                </p>
              </div>
            </Col>
          </Row>

          <div style={{ position: "fixed", bottom: 20, right: 8 }}>
            <Badge count={cart.length}>
              <ShoppingCartOutlined
                style={{ fontSize: "32px", cursor: "pointer" }}
                onClick={toggleDrawer}
              />
            </Badge>
          </div>

          <Drawer
            title="Giỏ hàng"
            placement="right"
            onClose={toggleDrawer}
            visible={drawerVisible}
          >
            {cart.length === 0 ? (
              <p>Giỏ hàng của bạn đang trống</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <p>{item.name}</p>
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <p>{item.price.toLocaleString("vi-VN")}₫</p>
                    </div>
                    <Button
                      icon={<DeleteOutlined />}
                      type="link"
                      danger
                      onClick={() => removeFromCart(item.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
                <div style={{ marginTop: "10px" }}>
                  <h3>
                    Tổng số tiền: {calculateTotal().toLocaleString("vi-VN")}₫
                  </h3>
                  <Button
                    type="primary"
                    style={{ marginTop: "10px" }}
                    onClick={navigateToCheckout}
                  >
                    Thanh Toán
                  </Button>
                </div>
              </>
            )}
          </Drawer>
        </>
      )}
    </div>
  );
};

export default ProductDetail;

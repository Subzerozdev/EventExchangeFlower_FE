import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Spin,
  Button,
  InputNumber,
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
}

interface CartItem extends Product {
  quantity: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
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

  // Cập nhật lại hàm addToCart để sử dụng callback cho navigate
  const addToCartAndNavigate = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    message.success(`${product.name} đã được thêm vào giỏ hàng`, () => {
      navigateToCheckout();
    });
  };

  const navigateToCheckout = () => {
    navigate("/checkout");
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    message.success(`${product.name} đã được thêm vào giỏ hàng`);
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
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
                  {product.imageUrls && product.imageUrls.map((image, index) => (
                    <Image
                      key={index}
                      src={image.imageUrl}
                      alt={`Image ${index}`}
                      width={100}
                      height={100}
                      className="additional-image" // Sử dụng class SCSS cho ảnh nhỏ
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
              <p>Số lượng:</p>
              <InputNumber
                min={1}
                value={quantity}
                onChange={(value) => setQuantity(value!)}
                style={{ marginBottom: "20px" }}
              />
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
                <p>Loại sản phẩm: {product.category.name}</p>
                <p>Miêu tả: {product.description}</p>
                <p>Địa chỉ: {product.address}</p>
                <p>
                  Thời gian: {product.start_date} - {product.end_date}
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
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.id, value!)}
                      />
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <p>
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </p>
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

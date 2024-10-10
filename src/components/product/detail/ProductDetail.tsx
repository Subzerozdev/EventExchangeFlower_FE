import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Button, InputNumber, Row, Col, message, Badge, Drawer } from "antd";
import { ShoppingCartOutlined, ShoppingOutlined, DeleteOutlined } from '@ant-design/icons';  // Thêm icon Delete
import api from "../../../config/api";
import "./ProductDetail.scss";

interface Product {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  address: string;
  start_date: string;
  end_date: string;
}

interface CartItem extends Product {
  quantity: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1); // Thêm số lượng
  const [cart, setCart] = useState<CartItem[]>([]); // Giỏ hàng
  const [drawerVisible, setDrawerVisible] = useState(false); // Trạng thái hiển thị của giỏ hàng

  // Tải giỏ hàng từ localStorage khi trang được tải
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart)); // Lấy dữ liệu từ localStorage và cập nhật lại giỏ hàng
    }
  }, []);

  // Lưu giỏ hàng vào localStorage khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Gọi API để lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get<Product>(`/posts/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id); // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity } // Nếu có rồi thì tăng số lượng
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }]; // Nếu chưa có, thêm mới sản phẩm vào giỏ hàng
      }
    });
    message.success(`${product.name} đã được thêm vào giỏ hàng`); // Thông báo khi thêm vào giỏ
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id)); // Xóa sản phẩm khỏi giỏ hàng
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Tính tổng giá trị giỏ hàng
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  // Hiển thị/Ẩn Drawer giỏ hàng
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  // Nếu dữ liệu sản phẩm chưa tải xong thì hiển thị loading
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
                    style={{ width: "100%", height: "510px", objectFit: "cover", borderRadius: "10px" }} // Rounded image corners
                  />
                }
              />
            </Col>
            <Col span={12}>
              <h1>{product.name}</h1>
              <p>Mã: {product.id}</p>
              <p style={{ color: "#FF6F61", fontSize: "20px", fontWeight: "bold" }}>
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
                  style={{ backgroundColor: "#6BA34E", borderColor: "#6BA34E", borderRadius: "5px" }}
                >
                  Mua ngay
                </Button>
                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{ marginLeft: "10px", borderRadius: "5px" }}
                  onClick={() => addToCart(product)} // Thêm sản phẩm vào giỏ hàng
                >
                  Thêm vào giỏ
                </Button>
              </div>
              <div className="product-description">
                <h3>Thông tin sản phẩm</h3>
                <p>{product.description}</p>
                <p>Địa chỉ: {product.address}</p>
                <p>
                  Thời gian: {product.start_date} - {product.end_date}
                </p>
              </div>

              <div className="product-description2">
                <h4>THÔNG TIN CHUNG CÁC SẢN PHẨM</h4>
                <ul>
                  <li>1. Giá cả có thể thay đổi: Giá hoa tươi có thể biến động...</li>
                  <li>2. Màu sắc hoa có thể khác biệt do điều kiện ánh sáng...</li>
                  <li>3. Hoa theo mùa: Một số loại hoa có thể thay đổi theo mùa...</li>
                  <li>4. Sản phẩm có thể khác ảnh mẫu nhưng sẽ giống ít nhất 80%...</li>
                </ul>
              </div>
            </Col>
          </Row>

          {/* Icon giỏ hàng ở góc dưới bên phải */}
          <div style={{ position: "fixed", bottom: 20, right: 8 }}>
            <Badge count={cart.length}> {/* Hiển thị số lượng sản phẩm trong giỏ */}
              <ShoppingCartOutlined
                style={{ fontSize: "32px", cursor: "pointer" }}
                onClick={toggleDrawer} // Khi click vào biểu tượng giỏ hàng sẽ mở Drawer
              />
            </Badge>
          </div>

          {/* Drawer giỏ hàng */}
          <Drawer
            title="Giỏ hàng của bạn"
            placement="right"
            onClose={toggleDrawer} // Đóng Drawer giỏ hàng
            visible={drawerVisible} // Trạng thái hiển thị của Drawer
          >
            {cart.length === 0 ? (
              <p>Giỏ hàng của bạn đang trống</p> // Nếu giỏ hàng trống, hiển thị thông báo
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
                        onChange={(value) => updateQuantity(item.id, value!)} // Cập nhật số lượng sản phẩm trong giỏ
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
                      onClick={() => removeFromCart(item.id)} // Xóa sản phẩm khỏi giỏ hàng
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
                <div style={{ marginTop: "10px" }}>
                  <h3>
                    Tổng số tiền: {calculateTotal().toLocaleString("vi-VN")}₫
                  </h3>
                  <Button type="primary" style={{ marginTop: "10px" }}>
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

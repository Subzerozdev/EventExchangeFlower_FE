import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Pagination,
  message,
  Drawer,
  Badge,
  InputNumber,
  Spin,
} from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons"; // Thêm icon Delete
import "./ProductList.scss";
import api from "../../../config/api";

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

const ProductList: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [cart, setCart] = useState<CartItem[]>([]); // Giỏ hàng
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

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

  // Gọi API để lấy danh sách sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<{ posts: Product[] }>(
          "/posts?categoryID=&sort=&pageNumber="
        );
        const products = response.data.posts.map((product) => ({
          ...product,
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
        }));
        setProductList(products); // Cập nhật danh sách sản phẩm
        setLoading(false); // Tắt trạng thái loading
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id); // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 } // Nếu có rồi thì tăng số lượng
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }]; // Nếu chưa có, thêm mới sản phẩm vào giỏ hàng
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

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="product-list">
      <div style={{ position: "fixed", bottom: 20, right: 8 }}>
        <Badge count={cart.length}>
          {" "}
          {/* Hiển thị số lượng sản phẩm trong giỏ */}
          <ShoppingCartOutlined
            style={{ fontSize: "32px", cursor: "pointer" }}
            onClick={toggleDrawer} // Khi click vào biểu tượng giỏ hàng sẽ mở Drawer
          />
        </Badge>
      </div>

      <Row gutter={[16, 16]}>
        {productList
          .slice((currentPage - 1) * pageSize, currentPage * pageSize)
          .map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.thumbnail}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />
                }
                onClick={() => navigate(`/productDetail/${product.id}`)} // Điều hướng đến trang chi tiết sản phẩm
              >
                <Card.Meta
                  title={product.name}
                  description={
                    <div>
                      <p>{product.description}</p>
                      <p>Giá: {product.price.toLocaleString("vi-VN")}₫</p>
                      <p>Địa chỉ: {product.address}</p>
                    </div>
                  }
                />
              </Card>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => addToCart(product)} // Thêm sản phẩm vào giỏ hàng
                style={{ marginTop: "10px" }}
              >
                Thêm vào giỏ
              </Button>
            </Col>
          ))}
      </Row>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={productList.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ textAlign: "center", marginTop: "20px" }}
      />

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
                  <p>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</p>
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
              <h3>Tổng số tiền: {calculateTotal().toLocaleString("vi-VN")}₫</h3>
              <Button type="primary" style={{ marginTop: "10px" }}>
                Thanh Toán
              </Button>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default ProductList;

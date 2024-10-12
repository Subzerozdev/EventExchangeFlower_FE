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
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import "./ProductList.scss";
import ProductFilter from "../FilterPanel/FilterPanel";
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
  category: { id: number; name: string }; // Category
}

interface CartItem extends Product {
  quantity: number;
}

const ProductList: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [categories, setCategories] = useState<string[]>([]); // Thêm state để lưu danh sách loại sản phẩm

  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage on cart update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Đổi dạng formteDate time thành string
  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime); // Convert LocalDateTime to Date object
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Fetch product list from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<{ posts: Product[] }>(
          "/posts?categoryID=&sort=&pageNumber="
        );
        console.log(response.data.posts);
        const products = response.data.posts.map((product) => ({
          ...product,
          start_date: formatDateTime(product.start_date), // Format start_date to string
          end_date: formatDateTime(product.end_date), // Format end_date to string
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
        }));

        // Lấy danh sách loại sản phẩm duy nhất từ sản phẩm
        const uniqueCategories = Array.from(
          new Set(products.map((product) => product.category.name))
        );
        setCategories(uniqueCategories); // Lưu danh sách loại sản phẩm vào state
        setProductList(products);
        setFilteredProducts(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    message.success(`${product.name} has been added to the cart`);
  };

  // Remove product from cart
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    message.success("Product has been removed from the cart");
  };

  // Update product quantity in cart
  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Ẩn hiện giỏ hàng
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

 // Lọc sản phẩm theo loại
const filterByCategory = (selectedCategories: string[]) => {
  setCurrentPage(1); // Đặt lại trang hiện tại về trang 1 khi thay đổi bộ lọc
  if (selectedCategories.length === 0) {
    setFilteredProducts(productList); // Nếu không chọn gì thì hiển thị tất cả sản phẩm
  } else {
    const filtered = productList.filter((product) =>
      selectedCategories.includes(product.category.name)
    );
    setFilteredProducts(filtered);
  }
};

// Lọc sản phẩm theo giá
const filterByPrice = (minPrice: number | null, maxPrice: number | null) => {
  setCurrentPage(1); // Đặt lại trang hiện tại về trang 1 khi thay đổi bộ lọc
  let filtered = productList;
  if (minPrice !== null && maxPrice !== null) {
    filtered = filtered.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
  }
  setFilteredProducts(filtered);
};

// Sắp xếp sản phẩm
const sortProducts = (type: string) => {
  setCurrentPage(1); // Đặt lại trang hiện tại về trang 1 khi thay đổi sắp xếp
  const sortedProducts = [...filteredProducts];
  if (type === "az") {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (type === "za") {
    sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (type === "newest") {
    sortedProducts.sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  } else if (type === "priceAsc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (type === "priceDesc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }
  setFilteredProducts(sortedProducts);
};

  return (
    <div className="product-list">
      <ProductFilter
        onFilterChange={filterByPrice}
        onSortChange={sortProducts}
        onCategoryChange={filterByCategory} // Thêm hàm lọc loại sản phẩm
        categories={categories} // Truyền danh sách loại sản phẩm vào ProductFilter
      />

      <div style={{ position: "fixed", bottom: 20, right: 8 }}>
        <Badge count={cart.length}>
          <ShoppingCartOutlined
            style={{ fontSize: "32px", cursor: "pointer" }}
            onClick={toggleDrawer}
          />
        </Badge>
      </div>

      {loading ? (
  <Spin size="large" style={{ textAlign: 'center', display: 'block', margin: '20px auto' }} />
) : (
  <Row gutter={[16, 16]}>
    {filteredProducts
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
            onClick={() => navigate(`/productDetail/${product.id}`)}
          >
            <Card.Meta
              title={product.name}
              description={
                <div>
                  <h3>Giá: {product.price.toLocaleString("vi-VN")}₫</h3>
                  <p>Loại hoa: {product.category.name}</p>
                  <p>Ngày bắt đầu: {product.start_date}</p>{" "}
                  <p>Ngày kết thúc: {product.end_date}</p>{" "}
                  <p>Địa chỉ: {product.address}</p>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    style={{ marginTop: "10px", marginRight: "20px" }}
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn onClick của Card khi bấm vào nút
                      addToCart(product);
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              }
            />
          </Card>
        </Col>
      ))}
  </Row>
)}

      <Pagination
  current={currentPage} // Trang hiện tại
  pageSize={pageSize} // Số sản phẩm mỗi trang
  total={filteredProducts.length} // Tổng số sản phẩm sau khi lọc
  onChange={(page) => setCurrentPage(page)} // Cập nhật trang khi người dùng thay đổi
  style={{ textAlign: "center", marginTop: "20px", marginLeft: "644px" }}
/>

      <Drawer
        title="Giỏ hàng"
        placement="right"
        onClose={toggleDrawer}
        visible={drawerVisible}
      >
        {cart.length === 0 ? (
          <p>Giỏ hàng của bạn trống</p>
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
                  <p>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</p>
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

            {/*Thanh toán trong giỏ hàng*/}
            <div style={{ marginTop: "10px" }}>
              <h3>Total: {calculateTotal().toLocaleString("vi-VN")}₫</h3>
              <Button
                type="primary"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  if (cart.length > 0) {
                    navigate("/checkout"); // Điều hướng đến trang thanh toán khi có sản phẩm trong giỏ hàng
                  } else {
                    message.warning("Giỏ hàng của bạn trống");
                  }
                }}
              >
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

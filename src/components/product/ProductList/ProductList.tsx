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
  Spin,
  Input,
} from "antd";
import {
  ShoppingCartOutlined,
  FileSearchOutlined,
  DeleteOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import "./ProductList.scss";
import ProductFilter from "../FilterPanel/FilterPanel";
import api from "../../../config/api";

// Interface định nghĩa cấu trúc của Product
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
  status: string;
}

// Interface định nghĩa cấu trúc của CartItem (thêm quantity cho mỗi sản phẩm trong giỏ)
interface CartItem extends Product {
  quantity: number;
}

const ProductList: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]); // Danh sách sản phẩm ban đầu
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Danh sách sản phẩm đã lọc
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize] = useState(8); // Số lượng sản phẩm trên mỗi trang
  const [cart, setCart] = useState<CartItem[]>([]); // Danh sách sản phẩm trong giỏ hàng
  const [drawerVisible, setDrawerVisible] = useState(false); // Trạng thái mở/đóng của giỏ hàng
  const [categories, setCategories] = useState<string[]>([]); // Danh sách loại sản phẩm
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Loại sản phẩm đã chọn
  const [minPrice, setMinPrice] = useState<number>(0); // Giá tối thiểu lọc
  const [maxPrice, setMaxPrice] = useState<number>(Infinity); // Giá tối đa lọc

  const navigate = useNavigate();

  // Load giỏ hàng từ localStorage khi component được mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Lưu giỏ hàng vào localStorage mỗi khi giỏ hàng được cập nhật
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Đổi định dạng thời gian từ chuỗi sang dạng ngày
  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Fetch danh sách sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<{ posts: Product[] }>("/posts");

        const products = response.data.posts
          .map((product) => ({
            ...product,
            start_date: formatDateTime(product.start_date), // Format start_date thành chuỗi
            end_date: formatDateTime(product.end_date), // Format end_date thành chuỗi
            price:
              typeof product.price === "string"
                ? parseFloat(product.price)
                : product.price, // Chuyển đổi giá thành số
          }))
          .filter((product) => product.status === "APPROVE"); // Chỉ lấy sản phẩm có trạng thái "APPROVE"

        const uniqueCategories = Array.from(
          new Set(products.map((product) => product.category.name))
        );

        setCategories(uniqueCategories); // Lưu danh sách loại sản phẩm vào state
        setProductList(products); // Lưu sản phẩm vào state
        setFilteredProducts(products); // Ban đầu hiển thị tất cả sản phẩm
        setLoading(false); // Kết thúc trạng thái loading
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        message.warning(`${product.name} đã có trong giỏ hàng`);
        return prevCart; // Nếu sản phẩm đã tồn tại, không thêm lại nữa
      } else {
        return [...prevCart, { ...product, quantity: 1 }]; // Thêm sản phẩm mới với số lượng mặc định là 1
      }
    });
    message.success(`${product.name} đã được thêm vào giỏ hàng`);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
  };

  // Tính tổng tiền trong giỏ hàng
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Đổi trạng thái mở/đóng của giỏ hàng
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  // Lọc sản phẩm theo loại và giá
  const filterProducts = (
    selectedCategories: string[],
    minPrice: number,
    maxPrice: number
  ) => {
    setCurrentPage(1); // Đặt lại trang về trang 1 khi thay đổi bộ lọc
    let filtered = productList;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category.name)
      );
    }

    filtered = filtered.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    setFilteredProducts(filtered); // Cập nhật danh sách sản phẩm sau khi lọc
  };

  // Sắp xếp sản phẩm theo tiêu chí
  const sortProducts = (type: string) => {
    setCurrentPage(1); // Đặt lại trang về trang 1 khi thay đổi sắp xếp
    const sortedProducts = [...filteredProducts];

    switch (type) {
      case "az":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        sortedProducts.sort(
          (a, b) =>
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
        break;
      case "priceAsc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  // Tìm kiếm sản phẩm theo tên và mô tả
  const handleSearch = (value: string) => {
    const filtered = productList.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.category.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="product-list">
      <div className="filter-container">
        <ProductFilter
          onFilterChange={(minPrice, maxPrice) => {
            setMinPrice(minPrice);
            setMaxPrice(maxPrice);
            filterProducts(selectedCategories, minPrice, maxPrice);
          }}
          onSortChange={sortProducts}
          onCategoryChange={(categories) => {
            setSelectedCategories(categories);
            filterProducts(categories, minPrice, maxPrice);
          }}
          categories={categories}
        />
        <div className="flower-icon">
          <ShopOutlined style={{ fontSize: "40px", color: "#b388ff" }} />
        </div>
        <Input.Search
          className="search-bar"
          placeholder="Tìm kiếm sản phẩm"
          onSearch={handleSearch}
          allowClear
          enterButton="Tìm kiếm"
      
        />
      </div>

      <div style={{ position: "fixed", bottom: 20, right: 8 }}>
        <Badge count={cart.length}>
          <ShoppingCartOutlined
            style={{ fontSize: "32px", cursor: "pointer" }}
            onClick={toggleDrawer}
          />
        </Badge>
      </div>

      {loading ? (
        <Spin
          size="large"
          style={{ textAlign: "center", display: "block", margin: "20px auto" }}
        />
      ) : filteredProducts.length === 0 ? (
        <div className="no-product">
          <FileSearchOutlined className="icon" /> {/* Icon lớn */}
          <p className="main-text">Không thể tìm thấy sản phẩm cần tìm</p>
          <p className="sub-text">
            Hãy thử sử dụng các từ khóa khác hoặc tìm kiếm chung chung hơn
          </p>
        </div>
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
                        <p>Ngày bắt đầu: {product.start_date}</p>
                        <p>Ngày kết thúc: {product.end_date}</p>
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
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
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
                  <p>Số lượng: {item.quantity}</p>{" "}
                  {/* Hiển thị số lượng thay vì InputNumber */}
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

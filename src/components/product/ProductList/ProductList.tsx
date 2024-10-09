import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Row,
  Pagination,
  Drawer,
  List,
  message,
} from "antd";
import { CartContext } from "../../../context/CartContext";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate từ React Router
import axios from "axios"; // Import axios for API calls
import "./ProductList.scss";
import FilterPanel from "../FilterPanel/FilterPanel";

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

interface Filters {
  priceRange?: string[];
  productType?: string[];
  brand?: string[];
  color?: string[];
}

const ProductList: React.FC = () => {
  // Lấy thông tin từ giỏ hàng
  const cartContext = useContext(CartContext);
  const navigate = useNavigate(); // Hook điều hướng

  // Trạng thái để giữ danh sách sản phẩm từ API
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
  const [currentPage, setCurrentPage] = useState(1); // Set trang page mặc định mới vô là trang đầu tiên
  const [filters, setFilters] = useState<Filters>({}); // Lấy thông tin từ bên filter
  const [drawerVisible, setDrawerVisible] = useState(false); // Trạng thái giỏ hàng nổi

  /////////////////////////////////////////////////////////////////////////////////////////////
  // lấy dữ liệu từ phía back end
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("a");
        const response = await axios.get(
          "/api/posts?categoryID=&sort=&pageNumber="
        ); // Đảm bảo endpoint của bạn đúng
        if (response.status === 200) {
          console.log(response.data);
          setProducts(response.data); // Đảm bảo rằng response data khớp với dữ liệu mong đợi
          setLoading(false);
        } else {
          throw new Error("API trả về lỗi");
        }
      } catch (error) {
        console.error(error);
        setError("Không thể tải sản phẩm.");
        setLoading(false);
        message.error("Lỗi khi lấy sản phẩm từ API");
      }
    };

    fetchProducts(); // Gọi API không điều kiện
  }, []); // Chỉ chạy một lần khi component mount

  if (loading) {
    return <div>Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////

  //xử lý sản phẩm vào giỏ hàng
  if (!cartContext) return null;
  const { addToCart, cart, removeFromCart } = cartContext;

  // Tính tổng số sản phẩm trong giỏ hàng
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const totalAmount = cart.reduce(
    (total, item) =>
      total +
      parseInt(item.price.replace("đ", "").replace(/\./g, "")) * item.quantity,
    0
  );

  // áp dụng lọc các sản phẩm theo giá
  const applyFilters = (product: Product) => {
    const price = parseInt(
      product.price.replace("đ", "").replace(".", "").replace(".", "")
    );

    if (filters.priceRange && filters.priceRange.length > 0) {
      if (
        !filters.priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return price >= min * 1000 && price <= max * 1000;
        })
      ) {
        return false;
      }
    }

    return true;
  };

  // Lọc danh sách sản phẩm dựa trên bộ lọc hiện tại
  const filteredProducts = products.filter(applyFilters);

  // Tính toán các sản phẩm hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * 6;
  const indexOfFirstProduct = indexOfLastProduct - 6;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Hàm thay đổi trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Hàm xử lý khi click vào sản phẩm
  const handleProductClick = (productId: number) => {
    navigate(`/productDetail/${productId}`); // Điều hướng đến trang chi tiết sản phẩm
  };

  return (
    <div className="product_list_container">
      {/* Hiển thị bảng điều khiển bên filter */}
      <FilterPanel onFilter={(filters: Filters) => setFilters(filters)} />

      {/* Hiển thị danh sách sản phẩm */}
      <div className="products_panel">
        <div className="products_content">
          <Row gutter={[16, 16]}>
            {currentProducts.map((product) => (
              <Col key={product.id}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image} />}
                  onClick={() => handleProductClick(product.id)} // Di chuyển sự kiện onClick lên thẻ Card
                  actions={[
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn onClick của Card khi bấm vào nút
                        addToCart(product);
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <div>
                        <p>Price: {product.price}</p>
                        <p>Số lượng: {product.quantity}</p>
                        <h4>Ngày sự kiện bắt đầu: {product.startdate}</h4>
                        <h4>Ngày sự kiện kết thúc: {product.enddate}</h4>
                        <p>Thông tin: {product.description}</p>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Div chứa phân trang */}
        <div className="pagination_container">
          <Pagination
            current={currentPage}
            pageSize={6}
            total={filteredProducts.length}
            onChange={paginate}
          />
        </div>
      </div>

      {/* Giỏ hàng  */}
      <div className="cart_icon">
        <Badge count={cartItemCount} showZero>
          <ShoppingCartOutlined
            style={{ fontSize: "32px", color: "#08c" }}
            onClick={() => setDrawerVisible(true)}
          />
        </Badge>
      </div>

      {/* Drawer là giỏ hàng hiện ngay trong trang này luôn */}
      <Drawer
        title="Giỏ Hàng"
        placement="right"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        {cart.length === 0 ? (
          <p>Giỏ hàng trống</p>
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "80px" }}
                      />
                    }
                    title={item.name}
                    description={`Số lượng: ${item.quantity} - Giá: ${item.price}`}
                  />
                </List.Item>
              )}
            />
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <p>Tổng tiền: {totalAmount.toLocaleString()}đ</p>
              <Button type="primary" onClick={() => navigate("/checkout")}>
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

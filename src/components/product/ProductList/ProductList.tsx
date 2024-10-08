import React, { useContext, useState } from "react";
import FilterPanel from "../FilterPanel/FilterPanel";
import { Button, Card, Col, Row, Pagination} from "antd";
import { CartContext } from "../../../context/CartContext";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";  // Import useNavigate từ React Router
import "./ProductList.scss";

interface Product {
  id: number;
  name: string;
  description:string;
  price: string;
  image: string;
  quantity: number;
  startdate: string;
  enddate:string;
  address:string;
}

interface Filters {
  priceRange?: string[];
  productType?: string[];
  brand?: string[];
  color?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Bó hoa Hồng pink floyd",
    price: "500.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
    startdate: "8/10/2024",
    enddate:"8/11/2024",
    address:"86D3",
    description:"Hoa dep"
  },
  {
    id: 2,
    name: "Tú cầu mix hoa hồng",
    price: "700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
      quantity: 1,
      startdate: "8/10/2024",
      enddate:"8/11/2024",
      address:"86D3",
      description:"Hoa dep"
  },
  {
    id: 3,
    name: "Tú cầu mix hoa hồng",
    price: "900.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
      quantity: 1,
      startdate: "8/10/2024",
      enddate:"8/11/2024",
      address:"86D3",
      description:"Hoa dep"
  },
  {
    id: 4,
    name: "Tú cầu mix hoa hồng",
    price: "1.000.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
      quantity: 1,
      startdate: "8/10/2024",
      enddate:"8/11/2024",
      address:"86D3",
      description:"Hoa dep"
  },
  {
    id: 5,
    name: "Tú cầu mix hoa hồng",
    price: "1.700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
      quantity: 1,
      startdate: "8/10/2024",
      enddate:"8/11/2024",
      address:"86D3",
      description:"Hoa dep"
  },
  {
    id: 6,
    name: "Tú cầu mix hoa hồng",
    price: "3.000.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
      quantity: 1,
      startdate: "8/10/2024",
      enddate:"8/11/2024",
      address:"86D3",
      description:"Hoa dep"
  },
  {
    id: 7,
    name: "Tú cầu mix hoa hồng",
    price: "4.000.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
      quantity: 1,
      startdate: "8/10/2024",
      enddate:"8/11/2024",
      address:"86D3",
      description:"Hoa dep"
  },
  {
    id: 8,
    name: "Tú cầu mix hoa hồng",
    price: "6.000.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
      quantity: 1,
      startdate: "8/10/2024",
      enddate:"8/11/2024",
      address:"86D3",
      description:"Hoa dep"
  },

  {
    id: 9,
    name: "Tú cầu mix hoa hồng",
    price: "10.000.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
      quantity: 1,
      startdate: "8/10/2024",
      enddate:"8/11/2024",
      address:"86D3",
      description:"Hoa dep"
  },
];

const ProductList: React.FC = () => {
  // Lấy thông tin từ giỏ hàng
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();  // Hook điều hướng

  // Set trang page mặc định mới vô là trang đầu tiên
  const [currentPage, setCurrentPage] = useState(1);

  // Lấy thông tin từ bên filter
  const [filters, setFilers] = useState<Filters>({});

  // Số lượng sản phẩm hiện ở trang
  const productsPerPage = 6;

  // Giỏ hàng
  if (!cartContext) return null;
  const { addToCart } = cartContext;


  // áp dụng lọc các sản phẩm theo giá
  const applyFilters = (product: Product) => {
    // Kiểm tra loại bỏ những chữ thừa của giá
    const price = parseInt(
      product.price.replace("đ", "").replace(".", "").replace(".", "")
    );

    // Xử lý chức năng Lọc theo giá
    if (filters.priceRange && filters.priceRange.length > 0) {
      if (
        !filters.priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          // trả về giá trị nếu giá từ đâu đên đâu
          return price >= min * 1000 && price <= max * 1000;
        })
      ) {
        // Nếu không nằm trong khoảng giá đó loại bỏ sản phẩm
        return false;
      }
    }

    // Thêm các bộ lọc khác ví dụ brand kiểu hoa hay màu sắc
    // sử dụng if giống trên
    return true;
  };

  // Lọc danh sách sản phẩm dựa trên bộ lọc hiện tại
  const filteredProducts = products.filter(applyFilters);

  // Tính toán các sản phẩm hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Hàm thay đổi trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Hàm xử lý khi click vào sản phẩm
  const handleProductClick = (productId: number) => {
    navigate(`/productDetail/${productId}`);  // Điều hướng đến trang chi tiết sản phẩm
  };

 

  return (
    <div className="product_list_container">
      {/* Hiển thị bảng điều khiển bên filter */}
      <FilterPanel onFilter={(filters: Filters) => setFilers(filters)} />

      {/* Hiển thị danh sách sản phẩm */}
      <div className="products_panel">
        <div className="products_content">
          <Row gutter={[16, 16]}>
            {/* Lấy sản phẩm từ product */}
            {currentProducts.map((product) => (
              <Col key={product.id}>
                {/* Hoverable là hiệu ứng khi di chuột lại thẻ */}
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image} />}
                  onClick={() => handleProductClick(product.id)}  // Thêm onClick để xử lý khi click vào sản phẩm
                  actions={[
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => addToCart(product)}>
                    
                      {/* Nút bấm giỏ hàng */}
                      Thêm vào giỏ hàng
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <div>
                        <p>Price: {product.price} </p> {/* Hiển thị giá */}
                        <p>Số lượng: {product.quantity}</p>
                        <h4>Ngày sự kiện bắt đầu: {product.startdate}</h4>{" "}
                        <h4>Ngày sự kiện kết thúc : {product.enddate}</h4>{" "}
                        <p>Thông tin: {product.description}</p>
                        {/* Hiển thị ngày */}
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
            pageSize={productsPerPage}
            total={filteredProducts.length}
            onChange={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;

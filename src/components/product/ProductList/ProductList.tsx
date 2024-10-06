import React, { useContext, useState } from "react";
import "./ProductList.scss";
import { CartContext } from "../../../context/CartContext";
import Pagination from "../Pagination/Pagination";
import { FaShoppingCart } from "react-icons/fa";
import FilterPanel from "../FilterPanel/FilterPanel";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface Filters {
  priceRange?: string[];
  productType?: string[];
  brand?: string[];
  color?: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: "Bó hoa Hồng pink floyd",
    price: "500.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
  },
  {
    id: 2,
    name: "Tú cầu mix hoa hồng",
    price: "700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
  },
  {
    id: 3,
    name: "Tú cầu mix hoa hồng",
    price: "700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
  },
  {
    id: 4,
    name: "Tú cầu mix hoa hồng",
    price: "700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
  },
  {
    id: 5,
    name: "Tú cầu mix hoa hồng",
    price: "700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
  },
  {
    id: 6,
    name: "Tú cầu mix hoa hồng",
    price: "700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
  },
  {
    id: 7,
    name: "Tú cầu mix hoa hồng",
    price: "700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
  },
  {
    id: 8,
    name: "Tú cầu mix hoa hồng",
    price: "700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
  },

  {
    id: 9,
    name: "Tú cầu mix hoa hồng",
    price: "700.000đ",
    image:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
    quantity: 1,
  },
];

const ProductList: React.FC = () => {
  const cartContext = useContext(CartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const productsPerPage = 6;

  if (!cartContext) return null;

  const { addToCart } = cartContext;

  const applyFilters = (product: Product) => {
    const price = parseInt(product.price.replace("đ", "").replace(".", ""));

    if (filters.priceRange) {
      if (
        !filters.priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return price >= min * 1000 && price <= max * 1000;
        })
      ) {
        return false;
      }
    }

    // Thêm các bộ lọc khác như `productType`, `brand`, `color`
    return true;
  };

  const filteredProducts = products.filter(applyFilters);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="product-list-container">
      <FilterPanel onFilter={(filters: Filters) => setFilters(filters)} />
      <div className="product-list-wrapper">
        <div className="product-list">
          {currentProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>{product.price}</p>
              <button
                className="add-to-cart"
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart style={{ margin: "10px", fontSize: "50px" }} />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default ProductList;

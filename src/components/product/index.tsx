import React from "react";
import "./allProduct.scss";

import ProductList from "./ProductList/ProductList";

import { CartProvider } from "../../context/CartContext";

const AllProduct: React.FC = () => {
  return (
    <CartProvider>
      <div className="app">
        <header>
          <h2>Tất cả sản phẩm</h2>
        </header>
        <div className="content">
          <div className="main-content">
            <ProductList />
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

export default AllProduct;

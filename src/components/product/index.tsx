import React from "react";
import "./allProduct.scss";
import ProductList from "./ProductList/ProductList";

const AllProduct: React.FC = () => {
  return (

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

  );
};

export default AllProduct;

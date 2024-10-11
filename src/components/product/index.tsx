import React from "react";

import ProductList from "./ProductList/ProductList";
import "./allProduct.scss";

const AllProduct: React.FC = () => {
  return (
    <div className="all-product-page">
      <h1>Tất cả sản phẩm</h1>

      <ProductList />
    </div>
  );
};

export default AllProduct;

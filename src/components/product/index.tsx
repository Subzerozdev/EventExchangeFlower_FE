import React from "react";
import ProductFilter from "./FilterPanel/FilterPanel";
import ProductList from "./ProductList/ProductList";
import './allProduct.scss';

const AllProduct: React.FC = () => {
  return (
    <div className="all-product-page">
      <h1>Tất cả sản phẩm</h1>
      <ProductFilter />
      <ProductList />
    </div>
  );
};

export default AllProduct;

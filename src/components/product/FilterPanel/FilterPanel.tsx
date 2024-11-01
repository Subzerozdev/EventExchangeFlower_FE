import React, { useState } from "react";
import { Button, Drawer, Checkbox, Divider } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "./FilterPanel.scss";

interface ProductFilterProps {
  onFilterChange: (minPrice: number, maxPrice: number) => void; // Hàm callback để truyền giá trị lọc ra ngoài
  onSortChange: (sortType: string) => void; // Hàm callback để truyền giá trị sắp xếp ra ngoài
  onCategoryChange: (selectedCategories: string[]) => void; // Callback để lọc loại sản phẩm
  categories: string[]; // Danh sách loại sản phẩm từ ProductList
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilterChange,
  onSortChange,
  onCategoryChange,
  categories,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false); // Trạng thái của Drawer
  const [priceRange, setPriceRange] = useState<string[]>([]); // Lưu trữ giá trị chọn trong checkbox
  const [sortType, setSortType] = useState<string>("default"); // Trạng thái để lưu kiểu sắp xếp
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Lưu trữ loại sản phẩm được chọn

  // Hàm mở Drawer
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  // Hàm đóng Drawer
  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  // Hàm xử lý khi nhấn "Áp dụng"
  const applyFilter = () => {
    // Xử lý lọc giá
    const minPrices: number[] = [];
    const maxPrices: number[] = [];

    // Kiểm tra các khoảng giá đã chọn và thêm chúng vào danh sách minPrices và maxPrices
    if (priceRange.includes("duoi2trieu")) {
      minPrices.push(0);
      maxPrices.push(2000000);
    }
    if (priceRange.includes("tu2den6trieu")) {
      minPrices.push(2000000);
      maxPrices.push(6000000);
    }
    if (priceRange.includes("tu6den15trieu")) {
      minPrices.push(6000000);
      maxPrices.push(15000000);
    }
    if (priceRange.includes("tu15den20trieu")) {
      minPrices.push(15000000);
      maxPrices.push(20000000);
    }
    if (priceRange.includes("tren20trieu")) {
      minPrices.push(20000000);
      maxPrices.push(Infinity); // Giá trị vô cùng để lọc sản phẩm trên 20 triệu
    }

    // Nếu không có khoảng giá nào được chọn, hiển thị tất cả sản phẩm
    if (minPrices.length === 0) {
      onFilterChange(0, Infinity); // Không giới hạn mức giá
    } else {
      // Truyền mảng minPrices và maxPrices cho hàm lọc
      onFilterChange(Math.min(...minPrices), Math.max(...maxPrices)); // Tìm giá trị min nhỏ nhất và max lớn nhất
    }

    // Gọi bộ lọc loại sản phẩm
    if (selectedCategories.length > 0) {
      onCategoryChange(selectedCategories);
    }

    closeDrawer(); // Đóng Drawer sau khi áp dụng bộ lọc
  };

  // Hàm xử lý khi chọn mức giá
  const handlePriceChange = (checkedValues: string[]) => {
    setPriceRange(checkedValues);
  };

  // Hàm xử lý khi thay đổi loại sản phẩm
  const handleCategoryChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
  };

  // Hàm xử lý khi thay đổi kiểu sắp xếp
  const handleSortChange = (type: string) => {
    setSortType(type);
    onSortChange(type); // Gọi hàm callback và truyền kiểu sắp xếp ra ngoài
  };

  return (
    <div className="product-filter">
      <Button icon={<FilterOutlined />} onClick={showDrawer}>
        Bộ lọc
      </Button>{" "}
      {/* Khi click sẽ mở Drawer */}
      <Drawer
        title="Bộ lọc sản phẩm"
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={350}
      >
        <Divider>Chọn mức giá</Divider>
        <Checkbox.Group
          style={{ display: "block" }}
          onChange={handlePriceChange}
        >
          <Checkbox value="duoi2trieu" style={{ display: "-webkit-flex" }}>
            Dưới 2 triệu
          </Checkbox>
          <Checkbox value="tu2den6trieu" style={{ display: "-webkit-flex" }}>
            Từ 2 triệu - 6 triệu
          </Checkbox>
          <Checkbox value="tu6den15trieu" style={{ display: "-webkit-flex" }}>
            Từ 6 triệu - 15 triệu
          </Checkbox>
          <Checkbox value="tu15den20trieu" style={{ display: "-webkit-flex" }}>
            Từ 15 triệu - 20 triệu
          </Checkbox>
          <Checkbox value="tren20trieu" style={{ display: "-webkit-flex" }}>
            Trên 20 triệu
          </Checkbox>
        </Checkbox.Group>

        <Divider>Loại sự kiện</Divider>
        <Checkbox.Group
          style={{ display: "block" }}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <Checkbox
              key={category}
              value={category}
              style={{ display: "-webkit-flex" }}
            >
              {category}
            </Checkbox>
          ))}
        </Checkbox.Group>

        <Button
          type="primary"
          onClick={applyFilter}
          style={{ marginTop: "20px" }}
        >
          Tìm kiếm
        </Button>
      </Drawer>
      {/* Thêm nút sắp xếp */}
      <div className="sort-options">
        <Button
          className={sortType === "az" ? "active" : ""}
          onClick={() => handleSortChange("az")}
        >
          Tên A-Z
        </Button>
        <Button
          className={sortType === "za" ? "active" : ""}
          onClick={() => handleSortChange("za")}
        >
          Tên Z-A
        </Button>

        <Button
          className={sortType === "priceAsc" ? "active" : ""}
          onClick={() => handleSortChange("priceAsc")}
        >
          Giá thấp đến cao
        </Button>
        <Button
          className={sortType === "priceDesc" ? "active" : ""}
          onClick={() => handleSortChange("priceDesc")}
        >
          Giá cao xuống thấp
        </Button>
      </div>
    </div>
  );
};

export default ProductFilter;

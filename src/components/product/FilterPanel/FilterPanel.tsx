import React, { useState } from "react";
import { Button, Drawer, Checkbox, Divider } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "./FilterPanel.scss";

interface ProductFilterProps {
  onFilterChange: (minPrice: number, maxPrice: number) => void;
  onSortChange: (sortType: string) => void;
  onCategoryChange: (selectedCategories: string[]) => void;
  categories: string[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilterChange,
  onSortChange,
  onCategoryChange,
  categories,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [sortType, setSortType] = useState<string>("default");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const applyFilter = () => {
    const minPrices: number[] = [];
    const maxPrices: number[] = [];

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
      maxPrices.push(Infinity);
    }

    if (minPrices.length === 0) {
      onFilterChange(0, Infinity);
    } else {
      onFilterChange(Math.min(...minPrices), Math.max(...maxPrices));
    }

    if (selectedCategories.length > 0) {
      onCategoryChange(selectedCategories);
    }

    closeDrawer();
  };

  const handlePriceChange = (checkedValues: string[]) => {
    setPriceRange(checkedValues);
  };

  const handleCategoryChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
  };

  const handleSortChange = (type: string) => {
    setSortType(type);
    onSortChange(type);
  };

  return (
    <div className="product-filter">
      <Button
        icon={<FilterOutlined />}
        onClick={showDrawer}
        className="drawer-button"
      >
        Bộ lọc
      </Button>

      <Drawer
        title="Bộ lọc sản phẩm"
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={350}
      >
        <Divider
          orientation="left"
          style={{ fontSize: "18px", color: "#6a1b9a" }}
        >
          Chọn mức giá
        </Divider>
        <Checkbox.Group
          style={{ display: "block", marginBottom: "16px" }}
          onChange={handlePriceChange}
        >
          <Checkbox value="duoi2trieu" style={{ padding: "8px 0" }}>
            Dưới 2 triệu
          </Checkbox>{" "}
          <br />
          <Checkbox value="tu2den6trieu" style={{ padding: "8px 0" }}>
            Từ 2 triệu - 6 triệu
          </Checkbox>
          <br />
          <Checkbox value="tu6den15trieu" style={{ padding: "8px 0" }}>
            Từ 6 triệu - 15 triệu
          </Checkbox>
          <br />
          <Checkbox value="tu15den20trieu" style={{ padding: "8px 0" }}>
            Từ 15 triệu - 20 triệu
          </Checkbox>
          <br />
          <Checkbox value="tren20trieu" style={{ padding: "8px 0" }}>
            Trên 20 triệu
          </Checkbox>
        </Checkbox.Group>

        <Divider
          orientation="left"
          style={{ fontSize: "18px", color: "#6a1b9a" }}
        >
          Loại sản phẩm
        </Divider>
        <Checkbox.Group
          style={{ display: "block", marginBottom: "20px" }}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <Checkbox
              key={category}
              value={category}
              style={{ padding: "8px 0" }}
            >
              {category}
            </Checkbox>
          ))}
        </Checkbox.Group>

        <Button
          type="primary"
          onClick={applyFilter}
          style={{
            width: "100%",
            backgroundColor: "#6a1b9a",
            borderColor: "#6a1b9a",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          Tìm kiếm
        </Button>
      </Drawer>

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

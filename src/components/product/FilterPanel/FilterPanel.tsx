import React, { useState } from 'react';
import './FilterPanel.scss';

// Định nghĩa interface cho filters
interface Filters {
  priceRange: string[];
  productType: string[];
  brand: string[];
  color: string[];
}

interface FilterPanelProps {
  onFilter: (filters: Filters) => void; // callback to pass filters to the parent component
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilter }) => {
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [productType, setProductType] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);

  const handlePriceChange = (range: string) => {
    setPriceRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleProductTypeChange = (type: string) => {
    setProductType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleBrandChange = (brandName: string) => {
    setBrand((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  const handleColorChange = (colorName: string) => {
    setColor((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const handleSearch = () => {
    const filters: Filters = {
      priceRange,
      productType,
      brand,
      color,
    };
    onFilter(filters); // Gọi hàm onFilter và truyền filters với kiểu đã xác định
  };

  return (
    <div className="filter-panel">
      <h3>Chọn mức giá</h3>
      <ul>
        <li><input type="checkbox" onChange={() => handlePriceChange('500-1000')} /> Từ 5 trăm - 1 triệu</li>
        <li><input type="checkbox" onChange={() => handlePriceChange('1000-3000')} /> Từ 1 triệu - 3 triệu</li>
        <li><input type="checkbox" onChange={() => handlePriceChange('3000-5000')} /> Từ 3 triệu - 5 triệu</li>
        <li><input type="checkbox" onChange={() => handlePriceChange('5000-7000')} /> Từ 5 triệu - 7 triệu</li>
        <li><input type="checkbox" onChange={() => handlePriceChange('7000-10000')} /> Từ 7 triệu - 10 triệu</li>
      </ul>

      <h3>Loại sản phẩm</h3>
      <ul>
        <li><input type="checkbox" onChange={() => handleProductTypeChange('type1')} /> Loại 1</li>
        <li><input type="checkbox" onChange={() => handleProductTypeChange('type2')} /> Loại 2</li>
      </ul>

      <h3>Thương hiệu</h3>
      <ul>
        <li><input type="checkbox" onChange={() => handleBrandChange('brand1')} /> Thương hiệu 1</li>
        <li><input type="checkbox" onChange={() => handleBrandChange('brand2')} /> Thương hiệu 2</li>
      </ul>

      <h3>Màu sắc</h3>
      <ul>
        <li><input type="checkbox" onChange={() => handleColorChange('yellow')} /> Vàng</li>
        <li><input type="checkbox" onChange={() => handleColorChange('purple')} /> Tím</li>
        <li><input type="checkbox" onChange={() => handleColorChange('red')} /> Đỏ</li>
        <li><input type="checkbox" onChange={() => handleColorChange('blue')} /> Xanh</li>
        <li><input type="checkbox" onChange={() => handleColorChange('pink')} /> Hồng</li>
      </ul>
      <h3>Tìm kiếm</h3>
      <button onClick={handleSearch}>Tìm</button>
    </div>
  );
};

export default FilterPanel;

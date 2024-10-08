import React, { useState } from 'react';
import { Checkbox, Button } from 'antd';  // Sử dụng các thành phần từ Ant Design
import './FilterPanel.scss';

interface Filters {
  priceRange: string[];
  productType: string[];
  brand: string[];
  color: string[];
}

interface FilterPanelProps {
  onFilter: (filters: Filters) => void; 
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilter }) => {
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [productType, setProductType] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);

  const handlePriceChange = (checkedValues: string[]) => {
    setPriceRange(checkedValues);
  };

  const handleProductTypeChange = (checkedValues: string[]) => {
    setProductType(checkedValues);
  };

  const handleBrandChange = (checkedValues: string[]) => {
    setBrand(checkedValues);
  };

  const handleColorChange = (checkedValues: string[]) => {
    setColor(checkedValues);
  };

  const handleSearch = () => {
    const filters: Filters = {
      priceRange,
      productType,
      brand,
      color,
    };
    onFilter(filters);
  };

  return (
    <div className="filter-panel">
      <h3>Chọn mức giá</h3>
      <Checkbox.Group
        options={[
          { label: 'Từ 5 trăm - 1 triệu', value: '500-1000' },
          { label: 'Từ 1 triệu - 3 triệu', value: '1000-3000' },
          { label: 'Từ 3 triệu - 5 triệu', value: '3000-5000' },
          { label: 'Từ 5 triệu - 7 triệu', value: '5000-7000' },
          { label: 'Từ 7 triệu - 10 triệu', value: '7000-10000' },
        ]}
        onChange={handlePriceChange}
      />

      <h3>Loại sản phẩm</h3>
      <Checkbox.Group
        options={[
          { label: 'Loại 1', value: 'type1' },
          { label: 'Loại 2', value: 'type2' },
        ]}
        onChange={handleProductTypeChange}
      />

      <h3>Thương hiệu</h3>
      <Checkbox.Group
        options={[
          { label: 'Thương hiệu 1', value: 'brand1' },
          { label: 'Thương hiệu 2', value: 'brand2' },
        ]}
        onChange={handleBrandChange}
      />

      <h3>Màu sắc</h3>
      <Checkbox.Group
        options={[
          { label: 'Vàng', value: 'yellow' },
          { label: 'Tím', value: 'purple' },
          { label: 'Đỏ', value: 'red' },
          { label: 'Xanh', value: 'blue' },
          { label: 'Hồng', value: 'pink' },
        ]}
        onChange={handleColorChange}
      />

      <Button type="primary" onClick={handleSearch} style={{ marginTop: '20px' }}>
        Tìm kiếm
      </Button>
    </div>
  );
};

export default FilterPanel;

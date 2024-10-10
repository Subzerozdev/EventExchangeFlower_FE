import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const ProductFilter: React.FC = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">Giá thấp đến cao</Menu.Item>
      <Menu.Item key="2">Giá cao xuống thấp</Menu.Item>
      <Menu.Item key="3">Tên A-Z</Menu.Item>
      <Menu.Item key="4">Tên Z-A</Menu.Item>
    </Menu>
  );

  return (
    <div className="product-filter">
      <Button icon={<FilterOutlined />}>Bộ lọc</Button>
      <Dropdown overlay={menu} placement="bottomLeft" arrow>
        <Button>Xếp theo</Button>
      </Dropdown>
    </div>
  );
};

export default ProductFilter;

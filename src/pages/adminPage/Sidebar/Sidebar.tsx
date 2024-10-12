import React, { memo } from 'react'; // Thêm memo từ React
import { useNavigate } from 'react-router-dom';
import {

  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  TagsOutlined
} from '@ant-design/icons';
import './sideBar.scss';

interface SidebarProps {
  openSidebarToggle: boolean;
  OpenSidebar: () => void;
}

const Sidebar = ({ openSidebarToggle, OpenSidebar }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <SettingOutlined className="icon_header" />
          ADMIN- HoaThanhLy
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>X</span>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/admin/categories")} className="btn-link">
            <AppstoreOutlined className="icon" /> Categories
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/admin/review-posts")} className="btn-link">
            <FileTextOutlined className="icon" /> Review Posts
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/admin/types")} className="btn-link">
            <TagsOutlined className="icon" /> Types
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/admin/categories")} className="btn-link">
            <SettingOutlined className="icon" /> Settings
          </button>
        </li>
      </ul>
    </aside>
  );
};

// Sử dụng React.memo để tránh render lại không cần thiết
export default memo(Sidebar);

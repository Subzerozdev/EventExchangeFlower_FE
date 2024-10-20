import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  TagsOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useUser } from '../../../context/UserContext'; // Sử dụng UserContext để lấy hàm logout
import './sideBar.scss';

interface SidebarProps {
  openSidebarToggle: boolean;
  OpenSidebar: () => void;
}

const Sidebar = ({ openSidebarToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useUser(); // Lấy hàm logout từ context

  const handleLogout = () => {
    logout(); // Gọi hàm logout
    navigate('/login'); // Điều hướng đến trang đăng nhập
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? 'sidebar-responsive' : ''}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <SettingOutlined className="icon_header" />
          ADMIN- HoaThanhLy
        </div>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <button onClick={() => navigate('/admin/categories')} className="btn-link">
            <AppstoreOutlined className="icon" /> Categories
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate('/admin/review-posts')} className="btn-link">
            <FileTextOutlined className="icon" /> Review Posts
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate('/admin/types')} className="btn-link">
            <TagsOutlined className="icon" /> Types
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate('/admin/settings')} className="btn-link">
            <SettingOutlined className="icon" /> Settings
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={handleLogout} className="btn-link">
            <LogoutOutlined className="icon" /> Đăng xuất
          </button>
        </li>
      </ul>
    </aside>
  );
};

// Sử dụng React.memo để tránh render lại không cần thiết
export default memo(Sidebar);

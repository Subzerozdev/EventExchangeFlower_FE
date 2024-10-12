import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./sideBar.scss"
interface SidebarProps {
  openSidebarToggle: boolean;
  OpenSidebar: () => void; // Add OpenSidebar to SidebarProps
}

function Sidebar({ openSidebarToggle, OpenSidebar }: SidebarProps) {
  const navigate = useNavigate(); // Khai báo hook useNavigate để điều hướng

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" />
          Hoa Lối Cũ
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/dashboard")} className="btn-link">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/admin/review-posts")} className="btn-link">
            <BsListCheck className="icon" /> Duyệt bài đăng
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/categories")} className="btn-link">
            <BsFillArchiveFill className="icon" /> Product
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/admin/categories")} className="btn-link">
            <BsFillGrid3X3GapFill className="icon" /> Category
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/customers")} className="btn-link">
            <BsPeopleFill className="icon" /> Customers
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/sellers")} className="btn-link">
            <BsPeopleFill className="icon" /> Sellers
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/admin/types")} className="btn-link">
            <BsListCheck className="icon" /> Add Types
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/reports")} className="btn-link">
            <BsMenuButtonWideFill className="icon" /> Reports
          </button>
        </li>
        <li className="sidebar-list-item">
          <button onClick={() => navigate("/settings")} className="btn-link">
            <BsFillGearFill className="icon" /> Setting
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;

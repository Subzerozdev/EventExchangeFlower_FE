import React, { useState, useCallback } from "react";
import "./adminPage.scss";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AdminPage: React.FC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = useCallback(() => {
    setOpenSidebarToggle((prevState) => !prevState); // Sử dụng useCallback để tránh tạo lại hàm
  }, []);

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;

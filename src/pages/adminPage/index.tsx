import React from "react";
import "./adminPage.scss";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Home from "./Home";
const AdminPage: React.FC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <Home />
    </div>
  );
};

export default AdminPage;

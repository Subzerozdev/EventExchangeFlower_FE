
import Footer from "../footer/footer";
import Header from "../header/Header"; // Import Header
import { Outlet } from "react-router-dom"; // Để render nội dung con

const Layout = () => {
  return (
    <div>
      <Header /> {/* Header của trang */}
      <main>
        <Outlet /> {/* Đây là nơi các children (nội dung của các trang con như Home, Login) sẽ được render */}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;

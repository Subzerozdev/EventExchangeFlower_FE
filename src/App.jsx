import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/login/Login"; // Đường dẫn tới component Login
import Home from "./Components/home/Home"; // Trang chủ (component giả định)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Trang đăng nhập */}
        <Route path="/home" element={<Home />} /> {/* Trang chủ */}
      </Routes>
    </Router>
  );
}

export default App;

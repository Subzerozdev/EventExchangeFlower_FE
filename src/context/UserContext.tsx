import React, { createContext, useContext, useState } from "react";
// import React, { createContext, useContext, useState, useEffect } from "react";
// import jwt_decode from "jwt-decode"; // Import jwt-decode để giải mã JWT //    
// //npm uninstall jwt-decode
// npm install jwt-decode@3 su dung ver 3.
interface User {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  role: string | null;
  id: string | null;
}

// Tạo UserContext
const UserContext = createContext<
  | {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    logout: () => void; // Thêm hàm logout vào context
  }
  | undefined
>(undefined);

// Custom hook để sử dụng context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider để quản lý user
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    fullName: null,
    email: null,
    phone: null,
    address: null,
    role: null,
    id: null,
  });

  // Kiểm tra nếu có token trong localStorage khi ứng dụng tải
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     try {
  //       // Giải mã token để lấy thông tin người dùng
  //       const decodedToken = jwt_decode<User>(token);

  //       setUser({
  //         fullName: null,
  //         email: null,
  //         phone: null,
  //         address: null,
  //         role: decodedToken.role,
  //         id: decodedToken.id,
  //       });
  //     } catch (error) {
  //       console.error("Invalid token:", error);
  //       // Xóa token nếu không hợp lệ
  //       localStorage.removeItem('token');
  //     }
  //   }
  // }, []);

  const logout = () => {
    setUser({ fullName: null, email: null, phone: null, address: null, id: null, role: null }); // Xóa thông tin người dùng
    localStorage.removeItem("token"); // Nếu bạn sử dụng token, xóa nó
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

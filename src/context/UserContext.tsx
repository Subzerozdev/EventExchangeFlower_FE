import React, { createContext, useContext, useState } from "react";

interface User {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
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
  });

  const logout = () => {
    setUser({ fullName: null, email: null, phone: null, address: null }); // Xóa thông tin người dùng
    localStorage.removeItem("token"); // Nếu bạn sử dụng token, xóa nó
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

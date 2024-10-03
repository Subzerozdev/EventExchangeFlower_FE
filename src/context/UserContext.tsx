import React, { createContext, useContext, useState, useEffect } from "react";

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
    logout: () => void;
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
  const [user, setUser] = useState<User>(() => {
    // Kiểm tra nếu có token trong localStorage khi ứng dụng tải lại
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : {
        fullName: null,
        email: null,
        phone: null,
        address: null,
        role: null,
        id: null,
      };
  });

  useEffect(() => {
    // Lưu trạng thái người dùng vào localStorage mỗi khi user thay đổi
    if (user.role) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    setUser({ fullName: null, email: null, phone: null, address: null, id: null, role: null });
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

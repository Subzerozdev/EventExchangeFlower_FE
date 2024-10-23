import React, { createContext, useContext, useState, useEffect } from "react";
import eventBus from "../utils/eventBus"; // Import Event Bus

interface User {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  role: string | null;
  id: string | null;
}

// Tạo UserContext
const UserContext = createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
} | undefined>(undefined);

// Custom hook để sử dụng UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider để quản lý user và trạng thái đăng nhập
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("jwtToken");
    return savedUser && token
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
    if (user.role) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => {
    setUser({
      fullName: null,
      email: null,
      phone: null,
      address: null,
      role: null,
      id: null,
    });
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
  };

  // Đăng ký sự kiện logout qua Event Bus
  useEffect(() => {
    const handleLogout = () => logout();
    eventBus.on("logout", handleLogout);
    return () => {
      eventBus.off("logout", handleLogout); // Hủy đăng ký khi unmount
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

import React, { createContext, useContext, useState } from 'react';

// Tạo UserContext
const UserContext = createContext<{ user: string | null; setUser: React.Dispatch<React.SetStateAction<string | null>> } | undefined>(undefined);

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
  const [user, setUser] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

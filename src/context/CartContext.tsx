import React, { createContext, useState, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
  startdate: string;
  enddate: string;
  address: string;
}
interface CartContextProps {
  cart: Product[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        // Tăng số lượng của sản phẩm nếu đã có trong giỏ hàng
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Nếu sản phẩm chưa có, thêm sản phẩm vào giỏ hàng
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

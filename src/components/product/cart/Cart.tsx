import React, { useContext, useState } from "react";
import "./Cart.scss";
import { CartContext } from "../context/CartContext";
import { FaCartShopping } from "react-icons/fa6";

const Cart: React.FC = () => {
  const cartContext = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false); // Để kiểm soát việc mở/đóng giỏ hàng

  if (!cartContext) return null;

  const { cart, removeFromCart, updateCartQuantity, clearCart } = cartContext;

  const calculateTotal = () => {
    return (
      cart
        .reduce((total, item) => {
          const itemPrice = parseFloat(
            item.price.replace("đ", "").replace(".", "")
          );
          return total + itemPrice * item.quantity;
        }, 0)
        .toLocaleString("vi-VN") + "đ"
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen); // Đảo trạng thái giỏ hàng mở/đóng
  };

  return (
    <div className="cart-container">
      <button className="cart-button" onClick={toggleCart}>
        <FaCartShopping /> Giỏ Hàng
      </button>
      {isCartOpen && (
        <div className="cart-dropdown">
          <h3>Giỏ Hàng</h3>
          {cart.length === 0 ? (
            <p>Giỏ hàng của bạn trống.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-details">
                    <h4>{item.name}</h4>
                    <div className="cart-controls">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <p>{item.price}</p>
                    <button
                      className="remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                <span>Tổng tiền:</span>
                <strong>{calculateTotal()}</strong>
              </div>
              <button className="checkout">Thanh toán</button>
              <button className="clear-cart" onClick={clearCart}>
                Xóa giỏ hàng
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;

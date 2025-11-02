import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { userAPI, orderAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
    else setCart([]); 
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await userAPI.getCart();
      setCart(data.cart || []);
    } catch (err) {
      console.error('Failed to fetch cart', err);
      toast.error('Could not load cart.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
  if (!user) {
    toast.error('Please login first!');
    return;
  }

  setLoading(true);
  try {
    await userAPI.addToCart({ productId, quantity });
    toast.success('Item added to cart!');
    await fetchCart();
  } catch (err) {
    
    if (err.response && err.response.status === 401) {
      toast.error('Please login first!');
    } else {
      toast.error('Failed to add item.');
    }
    console.error('Add to Cart Error:', err);
  } finally {
    setLoading(false);
  }
};

  const updateCartItem = async (productId, quantity) => {
    setLoading(true);
    try {
      await userAPI.updateCartItem({ productId, quantity });
      toast.success('Cart updated!');
      await fetchCart();
    } catch (err) {
      toast.error('Failed to update cart.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      await userAPI.removeFromCart(productId);
      toast.success('Item removed from cart!');
      await fetchCart();
    } catch (err) {
      toast.error('Failed to remove item.');
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (orderDetails) => {
    setLoading(true);
    try {
      const { data } = await orderAPI.create(orderDetails);
      if (data.success) {
        await clearCart();
        return { success: true, order: data.order };
      }
      return { success: false };
    } catch (err) {
      toast.error('Failed to place order.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await userAPI.clearCart?.(); 
      }
      setCart([]);
      toast.success('Cart cleared!');
    } catch (err) {
      console.error('Failed to clear cart', err);
      setCart([]); 
    }
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      (item.productId?.price *
        item.quantity *
        (1 - (item.productId?.discountPercentage || 0) / 100)),
    0
  );

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const value = {
    cart,
    total,
    loading,
    cartItemCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    placeOrder,
    fetchCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

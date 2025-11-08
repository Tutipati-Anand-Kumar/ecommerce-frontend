import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { useCreateOrderMutation } from '../features/orders/ordersApiSlice';
import { useTheme } from '../context/ThemeContext';

const Cart = () => {
  const { cart, loading, total, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();
  const {darkMode} = useTheme();

  useEffect(() => {
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) setAddress(savedAddress);
  }, []);

  const handleQuantityChange = (itemId, currentQuantity, action) => {
    const newQuantity = action === 'increment' ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);
    if (newQuantity !== currentQuantity) updateCartItem(itemId, newQuantity);
  };
  
  const handleRemoveItem = (itemId) => {
    toast.custom((t) => (
      <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200 w-80">
        <p className="font-semibold text-gray-800 text-center mb-2">
          Are you sure you want to remove this item from your cart?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              removeFromCart(itemId);
              toast.dismiss(t.id);
            }}
            className="px-2 py-0 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-100"
          >
            OK
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2 py-0 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-100"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error('API Error');
          const data = await response.json();
          const formattedAddress = [
            data.locality,
            data.city,
            data.principalSubdivision,
            data.postcode,
            data.countryName,
          ]
            .filter(Boolean)
            .join(', ');
          setAddress(formattedAddress || 'Address not found');
          localStorage.setItem('deliveryAddress', formattedAddress);
          toast.success('Location fetched successfully');
        } catch (error) {
          toast.error('Could not fetch address. Please enter manually.');
        }
      }, () => toast.error('Geolocation denied. Enter address manually.'));
    } else {
      toast.error('Geolocation not supported.');
    }
  };

  const handleBookOrder = async () => {
    if (cart.length === 0) return toast.error('Your cart is empty!');
    if (!address.trim()) return toast.error('Please enter a delivery address.');

    const orderDetails = {
      cartItems: cart.map(item => ({
        product: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      shippingAddress: address,
      paymentMethod,
      totalPrice: total,
    };

    try {
      await createOrder(orderDetails).unwrap();
      toast.success('Order placed successfully!');
      localStorage.removeItem('cart');
      if (typeof clearCart === 'function') clearCart();
      else window.dispatchEvent(new Event('storage'));
      navigate('/orders');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to place order.');
    }
  };

  if (loading && cart.length === 0)
    return <div className="text-center mt-8">Loading cart...</div>;
if (cart.length === 0)
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      darkMode ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className={`px-8 py-6 rounded-2xl backdrop-blur-xl border text-center shadow-2xl max-w-md w-full ${
        darkMode
          ? 'bg-slate-800/40 border-slate-700/50 text-slate-200'
          : 'bg-white/40 border-white/50 text-gray-700'
      }`}>
        <p className="text-lg mb-6">Your cart is empty.</p>
        <Link
          to="/"
          className={`inline-block px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            darkMode
              ? 'bg-purple-600/80 hover:bg-purple-500/90 text-white border border-purple-500/50'
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
          } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );


  return (
   <div className={`max-w-6xl mx-auto pt-18 px-4 ${darkMode ? 'bg-black min-h-screen' : 'bg-white min-h-screen'}`}>
      <h2 className={`text-3xl font-bold mb-6 ${darkMode?"text-white":"text-black"}`}>Your Cart</h2>

      <div className={`space-y-4 mb-6`}>
        {cart.map((item) => {
          if (!item.productId) return null;
          const itemTotal =
            (item.productId.price * (1 - (item.productId.discountPercentage || 0) / 100)) *
            item.quantity;
          return (
            <div
              key={item.productId._id}
              className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_100px] gap-4 p-4 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-100 ${
  darkMode
    ? "bg-gray-800/60 border-gray-700/40 text-white"
    : "bg-white/70 border-gray-200/50 text-gray-800"
}`}
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-16 h-16 object-cover rounded-lg bg-gray-200 dark:bg-gray-700"
                />
                <div>
                  <h5 className={`font-semibold ${darkMode?"text-white":"text-gray-800"}`}>{item.productId.name}</h5>
                  <p className={`text-sm ${darkMode?"text-white":"text-gray-600"}`}>
                    ${(item.productId.price * (1 - (item.productId.discountPercentage || 0) / 100)).toFixed(2)} x {item.quantity}
                  </p>
                </div>
              </div>

              {/* Quantity Section */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(item.productId._id, item.quantity, 'decrement')}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 transition-all duration-200"
                >
                  −
                </button>
                <span className={`font-semibold ${darkMode?"text-white":"text-gray-700"}`}>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.productId._id, item.quantity, 'increment')}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 transition-all duration-200"
                >
                  +
                </button>
              </div>

              {/* Price + Remove */}
              <div className="flex flex-col items-center sm:items-end">
                <p className={`${darkMode?"text-white":"text-gray-900"} font-bold mb-1`}>${itemTotal.toFixed(2)}</p>
                <button
                  onClick={() => handleRemoveItem(item.productId._id)}
                  className="bg-red-500 text-white text-sm px-4 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-right mb-6">
        <h3 className={`text-xl font-bold ${darkMode?"text-white":"text-gray-900`"}`}>Total: ${total.toFixed(2)}</h3>
      </div>

      {/* Address + Payment */}
     <div className={`p-6 rounded-lg shadow-xl space-y-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
}`}>
        <div>
          <label className="block text-lg font-semibold mb-2">Delivery Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={getLocation}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            Use My Current Location
          </button>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Payment Method:</label>
          <div className="space-y-2">
            {['upi', 'netbanking', 'cod'].map((method) => (
              <label key={method} className="flex items-center">
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                {method.charAt(0).toUpperCase() + method.slice(1).replace('cod', 'Cash on Delivery')}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleBookOrder}
          disabled={isPlacingOrder}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all duration-200"
        >
          {isPlacingOrder ? 'Placing Order...' : 'Book Order'}
        </button>
      </div>
    </div>
  );
};

export default Cart;

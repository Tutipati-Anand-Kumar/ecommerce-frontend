import React from 'react';
import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../features/orders/ordersApiSlice';
import { useTheme } from '../context/ThemeContext';

const Order = () => {
  const { data: ordersData, isLoading, isError, refetch } = useGetMyOrdersQuery(undefined, {
  refetchOnMountOrArgChange: true,
  
});

  const orders = ordersData?.orders || [];
  const {darkMode} = useTheme();
  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className={`px-8 py-6 rounded-2xl backdrop-blur-xl border ${
          darkMode 
            ? 'bg-slate-800/40 border-slate-700/50 text-slate-100' 
            : 'bg-white/40 border-white/50 text-slate-800'
        } shadow-2xl`}>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Loading your orders...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className={`px-8 py-6 rounded-2xl backdrop-blur-xl border ${
          darkMode 
            ? 'bg-red-900/30 border-red-700/50 text-red-200' 
            : 'bg-red-50/60 border-red-300/50 text-red-700'
        } shadow-2xl`}>
          <p className="text-lg font-medium">Failed to load orders. Please try again.</p>
        </div>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className={`px-8 py-6 rounded-2xl backdrop-blur-xl border text-center mt-15 ${
          darkMode 
            ? 'bg-slate-800/40 border-slate-700/50' 
            : 'bg-white/40 border-white/50'
        } shadow-2xl max-w-md w-full`}>
          <p className={`text-lg mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            You have no past orders.
          </p>
          <Link 
            to="/" 
            className={`inline-block px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
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
  }

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 pt-18 ${
      darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50'
    }`}>
      <div className="max-w-8xl mx-auto">
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-5 text-center ${
          darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600'
        }`}>
          Your Orders
        </h2>
        
        <div className="flex flex-wrap gap-6 justify-center">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className={`w-full max-w-md rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:shadow-2xl ${
                darkMode 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/60' 
                  : 'bg-white/60 border-white/80 hover:bg-white/70'
              } shadow-xl p-4 sm:p-6 lg:p-8`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div className="flex-1">
                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${
                    darkMode ? 'text-slate-100' : 'text-slate-800'
                  }`}>
                    Order Placed: {new Date(order.createdAt).toLocaleDateString()}
                  </h3>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  } break-all`}>
                    Order ID: {order._id}
                  </p>
                </div>
                <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full backdrop-blur-sm self-start ${
                  darkMode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-amber-100/80 text-amber-800 border border-amber-300/50'
                } shadow-md`}>
                  {order.status}
                </span>
              </div>
              
              <div className={`mb-6 pb-6 border-b ${
                darkMode ? 'border-slate-700/50' : 'border-slate-200/50'
              }`}>
                <p className={`text-xl sm:text-2xl font-bold ${
                  darkMode 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600'
                }`}>
                  Total: ${order.totalPrice.toFixed(2)}
                </p>
              </div>
             
              <div>
                <h4 className={`text-lg sm:text-xl font-semibold mb-4 ${
                  darkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  Items:
                </h4>
                <div className="space-y-4">
                  {order.products.map((item) => (
                    <div 
                      key={item._id} 
                      className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl backdrop-blur-sm transition-all duration-200 ${
                        darkMode 
                          ? 'bg-slate-700/30 hover:bg-slate-700/40 border border-slate-600/30' 
                          : 'bg-white/50 hover:bg-white/70 border border-slate-200/50'
                      }`}
                    >
                      <img 
                        src={item.productId?.image || 'https://dummyimage.com/100x100/CCCCCC/000000&text=No+Image'} 
                        alt={item.productId?.name} 
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md flex-shrink-0 border border-slate-200/20" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm sm:text-base mb-1 truncate ${
                          darkMode ? 'text-slate-100' : 'text-slate-800'
                        }`}>
                          {item.productId?.name || 'Product not available'}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                          <p className={`text-xs sm:text-sm ${
                            darkMode ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            Quantity: <span className="font-medium">{item.quantity}</span>
                          </p>
                          <p className={`text-xs sm:text-sm font-semibold ${
                            darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`}>
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
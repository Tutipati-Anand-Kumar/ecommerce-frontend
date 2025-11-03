import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getOrders();
      setOrders(data.orders);
    } catch (err) {
      console.error('Fetch orders failed');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className={`px-8 py-6 rounded-2xl backdrop-blur-xl border ${
          darkMode 
            ? 'bg-slate-800/40 border-slate-700/50 text-slate-100' 
            : 'bg-white/40 border-white/50 text-slate-800'
        } shadow-2xl`}>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
      darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50'
    }`}>
      <div className="max-w-7xl mx-auto mt-15">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/admin')}
            className={`mb-4 inline-flex items-center px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
              darkMode
                ? 'bg-slate-700/50 hover:bg-slate-600/60 text-slate-200 border border-slate-600/50'
                : 'bg-white/60 hover:bg-white/80 text-slate-700 border border-slate-300/50'
            } shadow-lg hover:shadow-xl transform hover:-translate-x-1`}
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${
            darkMode 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600'
          }`}>
            Orders Management
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Total Orders: <span className="font-semibold">{orders.length}</span>
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className={`rounded-2xl backdrop-blur-xl border overflow-hidden ${
            darkMode 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white/60 border-white/80'
          } shadow-2xl`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${
                    darkMode 
                      ? 'bg-gradient-to-r from-slate-700/50 to-slate-600/50' 
                      : 'bg-gradient-to-r from-purple-100/80 to-indigo-100/80'
                  }`}>
                    <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider w-[20%] ${
                      darkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      Order ID
                    </th>
                    <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider w-[25%] ${
                      darkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      User Details
                    </th>
                    <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider w-[15%] ${
                      darkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      Total
                    </th>
                    <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider w-[15%] ${
                      darkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      Status
                    </th>
                    <th className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider w-[15%] ${
                      darkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/20">
                  {orders.map((order, index) => (
                    <tr 
                      key={order._id} 
                      className={`transition-all duration-200 ${
                        darkMode 
                          ? 'hover:bg-slate-700/30' 
                          : 'hover:bg-white/50'
                      }`}
                    >
                      <td className={`px-4 py-4 text-sm font-mono ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <div className="break-all">{order._id}</div>
                      </td>
                      <td className={`px-4 py-4 text-sm ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <div className="font-semibold truncate">{order.userId?.name || 'N/A'}</div>
                        <div className="text-xs truncate opacity-75">{order.userId?.email || 'N/A'}</div>
                      </td>
                      <td className={`px-4 py-4 text-sm font-bold ${
                        darkMode 
                          ? 'text-emerald-400' 
                          : 'text-emerald-600'
                      }`}>
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                          order.status === 'pending'
                            ? darkMode
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-amber-100/80 text-amber-800 border border-amber-300/50'
                            : order.status === 'completed'
                            ? darkMode
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-emerald-100/80 text-emerald-800 border border-emerald-300/50'
                            : darkMode
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-blue-100/80 text-blue-800 border border-blue-300/50'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-sm ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {orders.map((order) => (
            <div 
              key={order._id}
              className={`rounded-2xl backdrop-blur-xl border p-5 ${
                darkMode 
                  ? 'bg-slate-800/50 border-slate-700/50' 
                  : 'bg-white/60 border-white/80'
              } shadow-xl`}
            >
              {/* Order ID */}
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-200/20">
                <div className="flex-1 mr-3">
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Order ID
                  </p>
                  <p className={`text-xs font-mono break-all ${
                    darkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    {order._id}
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  order.status === 'pending'
                    ? darkMode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-amber-100/80 text-amber-800 border border-amber-300/50'
                    : order.status === 'completed'
                    ? darkMode
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-emerald-100/80 text-emerald-800 border border-emerald-300/50'
                    : darkMode
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-blue-100/80 text-blue-800 border border-blue-300/50'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* User Details */}
              <div className="mb-3">
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Customer
                </p>
                <p className={`text-sm font-semibold ${
                  darkMode ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  {order.userId?.name || 'N/A'}
                </p>
                <p className={`text-xs ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {order.userId?.email || 'N/A'}
                </p>
              </div>

              {/* Total and Date */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Total
                  </p>
                  <p className={`text-xl font-bold ${
                    darkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Date
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && !loading && (
          <div className={`rounded-2xl backdrop-blur-xl border p-12 text-center ${
            darkMode 
              ? 'bg-slate-800/40 border-slate-700/50' 
              : 'bg-white/40 border-white/50'
          } shadow-2xl`}>
            <div className="text-6xl mb-4">📦</div>
            <h3 className={`text-xl font-semibold mb-2 ${
              darkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              No Orders Yet
            </h3>
            <p className={`${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Orders will appear here once customers make purchases.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
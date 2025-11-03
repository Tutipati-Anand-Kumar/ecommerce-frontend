import React from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useState, useEffect } from 'react';
import { useTheme } from "../context/ThemeContext";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [{ data: prodData }, { data: orderData }] = await Promise.all([
        adminAPI.getProducts(),
        adminAPI.getOrders()
      ]);
      setStats({ products: prodData.products.length, orders: orderData.orders.length });
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch stats failed');
      setIsLoading(false);
    }
  };

  const cards = [
    {
      title: 'Products',
      count: stats.products,
      link: '/admin/products',
      linkText: 'Manage',
      gradient: 'from-blue-500 to-cyan-500',
      icon: '📦',
      hoverGradient: 'from-blue-600 to-cyan-600',
      shadowColor: 'shadow-blue-500/50'
    },
    {
      title: 'Orders',
      count: stats.orders,
      link: '/admin/orders',
      linkText: 'View',
      gradient: 'from-emerald-500 to-teal-500',
      icon: '📋',
      hoverGradient: 'from-emerald-600 to-teal-600',
      shadowColor: 'shadow-emerald-500/50'
    },
    {
      title: 'Carts',
      count: 'View All',
      link: '/admin/carts',
      linkText: 'Check',
      gradient: 'from-purple-500 to-pink-500',
      icon: '🛒',
      hoverGradient: 'from-purple-600 to-pink-600',
      shadowColor: 'shadow-purple-500/50'
    }
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: darkMode 
          ? 'url(https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80)'
          : 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95' 
          : 'bg-gradient-to-br from-white/90 via-blue-50/85 to-purple-50/90'
      }`}></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto mt-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 ${
            darkMode 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
          }`}>
            Admin Dashboard
          </h1>
          <p className={`text-lg sm:text-xl ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Manage your e-commerce platform
          </p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`px-8 py-6 rounded-2xl backdrop-blur-xl border ${
              darkMode 
                ? 'bg-slate-800/40 border-slate-700/50 text-slate-100' 
                : 'bg-white/40 border-white/50 text-slate-800'
            } shadow-2xl`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium">Loading dashboard...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {cards.map((card, index) => (
              <div
                key={card.title}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`relative rounded-3xl backdrop-blur-xl border transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70' 
                    : 'bg-white/60 border-white/80 hover:bg-white/80'
                } shadow-xl hover:shadow-2xl ${card.shadowColor} p-8`}>
                  
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`text-5xl group-hover:scale-110 transition-transform duration-500`}>
                      {card.icon}
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className={`text-xl font-semibold mb-3 ${
                      darkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      {card.title}
                    </h3>
                    
                    <p className={`text-5xl font-bold mb-6 ${
                      darkMode 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r ' + card.gradient 
                        : 'text-transparent bg-clip-text bg-gradient-to-r ' + card.gradient
                    }`}>
                      {card.count}
                    </p>
                    
                    <Link 
                      to={card.link}
                      className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm group-hover:scale-105 ${
                        darkMode
                          ? `bg-gradient-to-r ${card.gradient} hover:${card.hoverGradient} text-white shadow-lg hover:shadow-xl`
                          : `bg-gradient-to-r ${card.gradient} hover:${card.hoverGradient} text-white shadow-lg hover:shadow-xl`
                      }`}
                    >
                      {card.linkText}
                      <svg 
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style >{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;